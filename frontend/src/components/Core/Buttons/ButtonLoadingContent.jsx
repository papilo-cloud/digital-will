import React from 'react'
import {RefreshCw} from 'lucide-react'

const ButtonLoadingContent = ({children, className}) => {
  return (
    <>
        {children}
        <RefreshCw className='animate-spin text-white w-4 h-4' />
    </>
  )
}

export default ButtonLoadingContent