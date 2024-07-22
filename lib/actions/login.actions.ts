'use server'
import { signIn } from '@/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { LoginSchema, RegisterSchema } from '@/schemas';
import { AuthError } from 'next-auth';

import { z } from "zod"
import { getUserByEmail } from './user.actions';
import { generateVerificationToken, sendVerificationEmail } from './verficationToken.actions';


export const login = async (values : z.infer<typeof LoginSchema> ) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success)  return {error : "Invalid fields"} 

    const {email , password}  = validatedFields.data;
    const exisitingUser = await getUserByEmail(email);

        if (!exisitingUser || !exisitingUser.email || !exisitingUser.password ) {
            return  {error : "Email does not exist!"}

        }


            if (!exisitingUser.emailVerified) {
                    const verificationToken = await generateVerificationToken(exisitingUser.email);

                    await sendVerificationEmail({email : verificationToken?.email! , token : verificationToken?.token!})

                    return {success : "Email Verification sent!"}
            }


    try {
        await signIn('credentials' , {
            email,
            password,
            redirectTo : DEFAULT_LOGIN_REDIRECT
        })
    }catch (error) {

            if (error instanceof AuthError) {
                switch(error.type) {
                    case 'CredentialsSignin' : 
                    return {error : "Invalid Credentials!"}

                    default : 
                    return  {error : "Something went wrong!"}
                }
            }

                throw error

    }
}
