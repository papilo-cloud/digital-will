import React from 'react'
import TruncatedAddress from '../TruncatedAddress'
import CountdownTimer from '../../hooks/CountdownTimer'
import { ethers } from 'ethers'

const WillsCard = ({deathTimeout, status, address, balance, lastPing, timeLeft, cancelled}) => {
  return (
    <div className='grid grid-cols-7 p-4 mb-3 text-gray-300 rounded-lg bg-[#151515] shadow-lg'>
        <TruncatedAddress address={address} className='col-span-2' />
        <p>{parseFloat(ethers.utils.formatEther(balance.toString())).toFixed(5)} ETH</p>
        <p className='col-span-2'>{status}</p>
        {timeLeft > 0 ? 
          <CountdownTimer lastPing={lastPing} deathTimeout={deathTimeout} /> : 
          'Expired'
        }
        <p>{cancelled}</p>
    </div>
  )
}

export default WillsCard