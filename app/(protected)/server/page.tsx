import { auth } from '@/auth'
import UserInfo from '@/components/shared/UserInfo'
import { currentUser } from '@/lib/actions/session.actions'
import React from 'react'

const ServerPage = async() => {
    const user = await currentUser()
  return (
        <UserInfo user={user} label={"Server Component "}  />
    )
}

export default ServerPage