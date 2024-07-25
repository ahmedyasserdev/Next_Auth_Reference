'use client'

import UserButton from "@/components/shared/UserButton";
import { Button } from "@/components/ui/button";
import { navbarLinks } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation"

const Navbar = () => {
  const pathname = usePathname();
  return (
    <nav className = "bg-secondary flex items-center p-4 rounded-xl justify-between w-[600px] shadow-sm" >
      <div className="flex gap-x-2">
        {
          navbarLinks.map((link) => (
            <Button key = {link.href} asChild className = "capitalize"  variant={pathname === link.href ? "default" : "outline"} >
            <Link href={link.href}  >{link.label}</Link>
          </Button>
          ))
        }
      </div>
     < UserButton />
    </nav>
  )
}

export default Navbar