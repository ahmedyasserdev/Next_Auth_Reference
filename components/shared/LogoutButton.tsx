
"use client";

// import { signOut } from "next-auth/react";
import { logout } from "@/lib/actions/logout.actions";

interface LogoutButtonProps {
    children?: React.ReactNode
}

 const LogoutButton = ({
    children
} : LogoutButtonProps) => {
    const onClick = () => {
        logout()
    }
    
    return (
        <span onClick={onClick} className="cursor-pointer">
            {children}
        </span>
    )
}

export default LogoutButton
