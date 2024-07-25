'use client'

import { useCurrentRole } from '@/hooks/use-current-role';
import { UserRole } from '@prisma/client';
import React from 'react'
import FormError from './FormError';

type RoleGateProps = {
    children : React.ReactNode;
    allowedRole : UserRole
}

const RoleGate = (  {allowedRole, children} : RoleGateProps) => {
    const role = useCurrentRole()

        if (role !== allowedRole) {
            return (
                <FormError  message="You don't have the permission to view this content " />
            )
        }

  return (
    <>
        {children}
    </>
  )
}

export default RoleGate