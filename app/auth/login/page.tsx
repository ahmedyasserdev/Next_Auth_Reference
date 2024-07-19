import LoginForm from '@/components/shared/LoginForm'
import { Metadata } from 'next'
import React from 'react'
export const metadata : Metadata = {
    title : "Login"
}
const LoginPage = () => {
  return (
    <LoginForm />
  )
}

export default LoginPage