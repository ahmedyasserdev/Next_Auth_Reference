'use server'

import { db } from "../db"
import {v4 as uuidv4} from "uuid"
import { getUserByEmail } from "./user.actions"
import { Resend } from "resend"
export const getVerificationTokenByToken = async (token  : string) => {

    try {
        const verificationToken = await db.verificationToken.findUnique({
            where : {token}
        })

        return verificationToken
    }catch {
        return null
    }
  
}

export const getVerificationTokenByEmail = async (email  : string) => {

    try {
        const verificationToken = await db.verificationToken.findFirst({
            where : {email}
        })

        return verificationToken
    }catch {
        return null
    }
  
}


export const generateVerificationToken = async (email : string ) => {
    const token = uuidv4()
    const expires  = new Date(new Date().getTime() + 3600 *100)
    const existingToken = await getVerificationTokenByEmail(email);

    if (existingToken) {
        await db.verificationToken.delete({
            where : {
                id : existingToken.id
            }
        })
    }


    const verificationToken = await db.verificationToken.create({
        data : {
            email,
            token ,
            expires
        }
    })

    return verificationToken
}



const resend = new Resend(process.env.RESEND_API_KEY)


export const sendVerificationEmail = async ({email , token} : {email : string , token : string}) => {
    const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/new-verification?token=${token}`;

    await resend.emails.send({
        from : "onboarding@resend.dev",
        to : email ,
        subject : "Confirm your email",
        html : `<p>Click <a href = "${confirmLink}" >to confirm your email.</a> </p>`
    })
}


export const newVerification = async (token : string) => {
    const existingToken = await getVerificationTokenByToken(token)
            if (!existingToken) return {error : "token does not exist"};
            const hasExpired  = new Date(existingToken?.expires) < new Date();

            if (hasExpired) return {error : "Token has expired"};

            const existingUser = await getUserByEmail(existingToken?.email);

            if (!existingUser) return {error : "Email does not exist"};
            
        await db.user.update({
            where : {
                id : existingUser.id,
            },
            data  : {
                emailVerified : new Date(),
                email : existingToken.email
            }
        })

        await db.verificationToken.delete({
            where : {
                id : existingToken.id,
            }
        })


        return {success : "Email Verified!"}

}