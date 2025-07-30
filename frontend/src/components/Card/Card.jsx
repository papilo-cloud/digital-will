import clsx from 'clsx'
import React from 'react'

const Card = ({children, className}) => {
  return (
    <div className={clsx('max-w-md mx-auto bg-[#151515] p-6 rounded-xl shadow-md', className)}>
        {children}
    </div>
  )
}

export default Card