"use server";

import bcrypt  from 'bcryptjs';
import * as z from "zod";
import { getUserByEmail, getUserById } from "./user.actions";

import { db } from "../db";
import { currentUser } from "@/lib/actions/session.actions";
import { SettingsSchema } from "@/schemas";
import { generateVerificationToken, sendVerificationEmail } from "./verficationToken.actions";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();
  if (!user) return { error: "Unauthorized" };

  const dbUser = await getUserById(user.id!);
  if (!dbUser) return { error: "User not found" };

  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }


    if (values.email && values.email !== user.email){
      const existingUser = await getUserByEmail(values.email);

      if (existingUser && existingUser.id !== user.id){
        return  {error : "Email is already in use!"}
      }

      const verificationToken = await generateVerificationToken(values.email);
      await sendVerificationEmail({email : verificationToken.email , token : verificationToken.token});
      return {success : "Verification email sent!"}
    }



    if (values.password && values.newPassword && dbUser.password ) {
      const passwordMatch = await bcrypt.compare(values.password , dbUser.password);
      if (!passwordMatch) return {error : "Incorrect password!"};

      const hashedPassword = await bcrypt.hash(values.newPassword , 10);

      values.password = hashedPassword;
      values.newPassword = undefined
    }

 await db.user.update({
    where: {
      id: user.id!,
    },
    data: {
      ...values,
    },
  });

 
  return { success: "User Updated" };
};
