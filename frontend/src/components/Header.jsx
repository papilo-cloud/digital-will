import React from 'react'
import ConnectWalletButton from './ConnectWalletButton'

const Header = () => {
  return (
    <header className='bg-[#151515] shadow p-3 flex justify-between items-center'>
        <h2 className='text-2xl font-semibold text-[#ccc]'>Dashboard</h2>
        <div className='text-sm text-gray-500'>
          <ConnectWalletButton />
        </div>
    </header>
  )
}

export default Header