'use client'
import { auth } from '@/auth'
import UserInfo from '@/components/shared/UserInfo'
import { useCurrentUser } from '@/hooks/user-current-user'
import React from 'react'

const ClientPage = () => {
    const user =  useCurrentUser()
  return (
        <UserInfo user={user} label={"Client Component "}  />
    )
}

export default ClientPage