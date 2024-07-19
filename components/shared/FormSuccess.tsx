import { CheckCircle } from 'lucide-react';
import React from 'react'

const FormSuccess = ({message } : {message?: string}) => {
    if (!message) return null;
    return (
      <div className = "bg-emerald-500/15 p-3 flex rounded-md items-center gap-x-2 text-sm text-emerald-500" >
                <CheckCircle className  = {'size-5'} />
              <p >{message}</p>
      </div>
    )
}

export default FormSuccess