import React from 'react'

const CardHeader = ({children}) => {
  return (
    <h2 className='text-lg font-semibold mb-4 text-[#ccc]'>{children}</h2>
  )
}

export default CardHeader