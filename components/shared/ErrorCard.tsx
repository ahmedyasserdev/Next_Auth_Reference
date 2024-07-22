import { BsExclamationTriangle } from "react-icons/bs"
import CardWrapper from "./CardWrapper"

const ErrorCard = () => {
  return (
    <CardWrapper
    headerLabel="Ops! Something went wrong!"
    backButtonHref="/auth/login"
    backButtonLabel="Back to login"
>
    <div className="w-full flex justify-center items-center">
        <BsExclamationTriangle className="text-destructive w-6 h-6"/>
    </div>
</CardWrapper>
  )
}

export default ErrorCard