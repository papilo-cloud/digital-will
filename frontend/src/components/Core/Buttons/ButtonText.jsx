import clsx from 'clsx'
import React from 'react'

const ButtonText = ({children, className}) => {
  return (
    <span className={clsx('font-primary text-lg font-normal text-white', className)}>
        {children}
    </span>
  )
}

export default ButtonText