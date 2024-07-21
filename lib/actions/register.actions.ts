"use server"

import bcrypt from "bcryptjs";
import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import { db } from "@/lib/db";
import { getUserByEmail } from "./user.actions";
// import { generateVerificationToken } from "@/lib/tokens";
// import { sedVerificationEmail } from "@/lib/email";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validateFields = RegisterSchema.safeParse(values);

    if (!validateFields.success) {
        return { error: "Dados inválidos"}
    }

    const {
        email,
        name,
        password
    } = validateFields.data;

    const hashedPassword = await bcrypt.hash(password, 10)

    const existingUser = await getUserByEmail(email)

    if (existingUser) {
        return { error: "Email is in use"}
    }

    await  db.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    })

   

    return { success: "Confirmation email sent!"}
}