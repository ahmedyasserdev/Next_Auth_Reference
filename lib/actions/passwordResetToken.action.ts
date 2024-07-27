"use server";
import bcrypt  from 'bcryptjs';

import { db } from "../db";
import { v4 as uuidv4 } from "uuid";
import { Resend } from "resend";
import { z } from "zod";
import { NewPasswordSchema } from "@/schemas";
import { getUserByEmail } from "./user.actions";

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await db.passwordResetToken.findUnique({
      where: { token },
    });

    return passwordResetToken;
  } catch {
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await db.passwordResetToken.findFirst({
      where: { email },
    });

    return passwordResetToken;
  } catch {
    return null;
  }
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await db.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const newPasswordResetToken = await db.passwordResetToken.create({
    data: {
      token,
      expires,
      email,
    },
  });

  return newPasswordResetToken;
};

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/new-password?token=${token}`;
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href = "${resetLink}" >to reset your password</a> </p>`,
  });
};

export const newPassword = async ({
  values,
  token,
}: {
  values: z.infer<typeof NewPasswordSchema>;
  token: string | null;
}) => {
  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) return { error: "Invalid Fields!" };
  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token!);

  if (!existingToken) return { error: "Invalid Token" };

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) return { error: "Token has expired" };

    const existingUser = await getUserByEmail(existingToken.email)

    if (!existingUser) return {error : "Email deos not exist"}


    const hashedPassword = await bcrypt.hash(password , 10)

    await db.user.update({
      where : {
        id : existingUser.id
      },
      data : {
        password : hashedPassword
      }
    })

    await db.passwordResetToken.delete({
      where : {id : existingToken.id}
    })


    return {success : "Password Updated!"}
};
