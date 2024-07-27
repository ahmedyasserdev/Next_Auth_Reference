"use server";
import { getTwoFactorConfirmationByUserId } from "./twoFactorConfirmation.actions";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";

import { z } from "zod";
import { getUserByEmail } from "./user.actions";
import {
  generateVerificationToken,
  sendVerificationEmail,
} from "./verficationToken.actions";
import {
  generateTwoFactorToken,
  getTwoFactorTokenByEmail,
  sendTwoFactorEmail,
} from "./twoFactorToken.actions";
import { db } from "../db";

export const login = async ({values , callbackUrl} : {values :  z.infer<typeof LoginSchema> ; callbackUrl? :string }) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) return { error: "Invalid fields" };

  const { email, password, code } = validatedFields.data;
  const exisitingUser = await getUserByEmail(email);

  if (!exisitingUser || !exisitingUser.email || !exisitingUser.password) {
    return { error: "Email does not exist!" };
  }

  if (!exisitingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      exisitingUser.email
    );

    await sendVerificationEmail({
      email: verificationToken.email,
      token: verificationToken.token,
    });

    return { success: "Confirmation email sent!" };
  }

  if (exisitingUser.isTwoFactorEnabled && exisitingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(
        exisitingUser.email
      );

      if (!twoFactorToken) {
        return { error: "Invalid code!" };
      }

      if (twoFactorToken.token !== code) {
        return { error: "Invalid code!" };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return { error: "Code Expired!" };
      }

      await db.twoFactorToken.delete({
        where: {
          id: twoFactorToken.id,
        },
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        exisitingUser.id
      );

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: {
            id: existingConfirmation.id,
          },
        });
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: exisitingUser.id,
        },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(exisitingUser.email);
      await sendTwoFactorEmail({
        email: twoFactorToken?.email!,
        token: twoFactorToken?.token!,
      });

      return { twoFactor: true };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo:  callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid Credentials!" };

        default:
          return { error: "Something went wrong!" };
      }
    }

    throw error;
  }
};
