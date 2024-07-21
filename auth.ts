import NextAuth, { type DefaultSession } from "next-auth"
import authConfig from "./auth.config"
import { db } from "./lib/db"
 import { PrismaAdapter } from "@auth/prisma-adapter"
import { getUserById } from "./lib/actions/user.actions"
import { UserRole } from "@prisma/client"



export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks : {
    
    async session({session, token}) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }


      if (token.role && session.user) {
        session.user.role = token.role  as UserRole
      }


      
    return session
  },
    async jwt({ token,  }) {
      if (!token.sub) return token
      const user = await getUserById(token.sub!)
      if (!user) return token
      token.role = user?.role
      return token;
    },

  },
  adapter :  PrismaAdapter(db) ,
  session : {strategy : "jwt"},
  ...authConfig
  
})