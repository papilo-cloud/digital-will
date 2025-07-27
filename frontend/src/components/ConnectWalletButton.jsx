import React from 'react'
import { useState } from 'react'
import { useContract } from '../context/ContractContext'
import truncate from '../utils/truncate'

const ConnectWalletButton = () => {

    const { connectWallet, walletAddress, isConnected } = useContract()

  return (
    <div>
        {!isConnected ? (
            <button
                onClick={connectWallet}
                className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer'
            >
                Connect Wallet
            </button>
        ): (
            <p className='text-green-600 font-semibold'>Wallet: {truncate(walletAddress)}</p>
        )}
    </div>
  )
}

export default ConnectWalletButton