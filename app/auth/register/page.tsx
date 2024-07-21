import RegisterForm from '@/components/shared/RegisterForm'
import { Metadata } from 'next'
import React from 'react'
export const metadata : Metadata = {
  title : "Register"
}
const RegisterPage = () => {
  return (
      <>
            <RegisterForm />

      </>
  )
}

export default RegisterPage