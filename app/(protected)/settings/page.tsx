'use client'
import { auth } from '@/auth'
import React from 'react'
import { useSession } from 'next-auth/react'
import { logout } from '@/lib/actions/logout.actions'
import { useCurrentUser } from '@/hooks/user-current-user'
const SettingsPage = () => {
  const user = useCurrentUser()
  return (
    <div className  = "bg-white rounded-xl p-10" >

            <button type = "submit"
              onClick = {() => logout()}
            >Sign out</button>

    </div>
  )
}

export default SettingsPage