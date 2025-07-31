import React from 'react'

const WillCardHeader = ({children}) => {
  return (
    <div>
        <div className='text-white text-lg font-semibold grid px-4 grid-cols-7 mt-10 mb-4'>
            <h3 className='col-span-2'>Testator</h3>
            <h3>Balance</h3>
            <h3 className='col-span-2'>Status</h3>
            <h3>Time Left</h3>
            <h3>Cancelled</h3>
        </div>
        {children}
    </div>
  )
}

export default WillCardHeader