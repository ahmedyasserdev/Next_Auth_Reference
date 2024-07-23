"use server";

import { ResetSchema } from "@/schemas";
import { z } from "zod";
import { getUserByEmail } from "./user.actions";
import { generatePasswordResetToken, sendPasswordResetEmail } from "./passwordResetToken.action";

export const resetPassword = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success)   return {error: "Invalid email",};

        const  {email} = validatedFields.data;

        const existingUser = await getUserByEmail(email);

        if (!existingUser)  return {error: "Email not found!",};
            
        const passwordResetToken  = await generatePasswordResetToken(values.email)

        await sendPasswordResetEmail({token : passwordResetToken.token , email : passwordResetToken.email})

        return {success : "Reset Email Sent!"}


};

