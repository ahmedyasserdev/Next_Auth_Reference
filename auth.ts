import { getTwoFactorConfirmationByUserId } from './lib/actions/twoFactorConfirmation.actions';
import NextAuth, { type DefaultSession } from "next-auth"
import authConfig from "./auth.config"
import { db } from "./lib/db"
 import { PrismaAdapter } from "@auth/prisma-adapter"
import { getUserById } from "./lib/actions/user.actions"
import { UserRole } from "@prisma/client"



export const { auth, handlers , signIn, signOut } = NextAuth({
  
  pages: {
    signIn: "/auth/login",
    error : "/auth/error"
  },
  events : {
      async   linkAccount({user}) {
          await db.user.update({
            where : {
              id :  user.id 
            },
            data : {
              emailVerified : new Date()
            }
          })
      },
 
  },  
  callbacks : {
    async signIn ({user , account}) {
        if (account?.provider !== 'credentials')  return true
        
        const existingUser = await getUserById(user?.id!)

        if (!existingUser?.emailVerified) return false

        if (existingUser?.isTwoFactorEnabled) {
          const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser?.id)
            if (!twoFactorConfirmation) return false

            await db.twoFactorConfirmation.delete({
              where : {
                id  : twoFactorConfirmation.id
              }
            })
   
        }


      return true;
    },
    async session({session, token}) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }


      if (token.role && session.user) {
        session.user.role = token.role  as UserRole
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled   as boolean
      }




    

      
    return session
  },
    async jwt({ token,  }) {
      if (!token.sub) return token
      const user = await getUserById(token.sub!)
      if (!user) return token
      token.role = user?.role

        token.isTwoFactorEnabled = user?.isTwoFactorEnabled
      return token;
    },

  },
  adapter :  PrismaAdapter(db) ,
  session : {strategy : "jwt"},
  ...authConfig
  
})