// pages/api/auth/[...nextauth].js

import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { NextAuthConfig } from "next-auth";
import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "@/lib/actions/user.actions";
import bcrypt from "bcryptjs";

const authOptions = {
  providers: [
      Credentials({
        async authorize(credentials) {
          const validatedFields = LoginSchema.safeParse(credentials);
  
          if (validatedFields.success) {
            const { email, password} = validatedFields.data;
  
            const user = await getUserByEmail(email);
            if (!user || !user.password) return null;
  
            const passwordMatch = await bcrypt.compare(
              password,
              user.password,
            )
  
            if (passwordMatch) return user
          }
  
          return null
        }
      })
  ]
} satisfies NextAuthConfig;

export default authOptions;
