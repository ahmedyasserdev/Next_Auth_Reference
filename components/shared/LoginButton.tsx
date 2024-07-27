"use client";

type LoginButtonProps = {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
};

import {Dialog , DialogTrigger , DialogContent} from "@/components/ui/dialog"


import { useRouter } from 'next/navigation';
import React from 'react'
import LoginForm from "./LoginForm";

const LoginButton = ({
  children,
  mode = "redirect" ,
  asChild
}: LoginButtonProps) => {
    const router = useRouter()
    const onClick = () => {
            router.push("/auth/login")
    }


    if (mode === "modal") {
        return (
            <Dialog>
              <DialogTrigger asChild >
                {children}
              </DialogTrigger>
              <DialogContent className = "p-0 w-auto bg-transparent border-none" >
                <LoginForm/>
              </DialogContent>
            </Dialog>
        )
    }

  return (
    <span  onClick={onClick}  className = "cursor-pointer" >
        {children}
    </span>
  )
}

export default LoginButton