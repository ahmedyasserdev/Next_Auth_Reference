import { Poppins } from "next/font/google"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"


const font = Poppins({
  subsets: ["latin"],
  weight: ["600"]
})


type HeaderProps = {
    label : string ;
}

const Header = ( {label} : HeaderProps) => {
  return (
    <div className="w-full flex items-center flex-col justify-center gap-y-4">
        <h1 className = {
            cn("text-3xl font-semibold" , font.className)
        } >
          🔐 Auth
        </h1>
            <p className="text-sm text-muted-foreground" > {label}</p>
    </div>
)
}

export default Header