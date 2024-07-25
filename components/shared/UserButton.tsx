'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { FaUser } from "react-icons/fa"
import { useCurrentUser } from "@/hooks/user-current-user"
import LogoutButton from "./LogoutButton"
import { LogOutIcon } from "lucide-react"

const UserButton = () => {
    const user = useCurrentUser()
  return (
    <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage src  = {user?.image || ''}  />
                    <AvatarFallback className = "bg-sky-500 text-white" ><FaUser/> </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent className = "w-40 " align = "end" >
                <LogoutButton  >
                        <DropdownMenuItem>
                            <LogOutIcon className = "size-4 mr-2" />
                    Logout

                        </DropdownMenuItem>
                </LogoutButton>
            </DropdownMenuContent>

    </DropdownMenu>
  )
}

export default UserButton