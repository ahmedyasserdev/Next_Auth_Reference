import { BsExclamationTriangle } from "react-icons/bs"
const FormError = ({message } : {message?: string}) => {
    if (!message) return null;
  return (
    <div className = "bg-destructive/15 p-3 flex rounded-md items-center gap-x-2 text-sm text-destructive" >
        <BsExclamationTriangle  className  = {'size-5'} />
            <p  >{message}</p>
    </div>
  )
}

export default FormError