import { ethers } from 'ethers'
import truncate from '../utils/truncate'
import CountdownTimer from '../hooks/CountdownTimer'
import formatTime from '../utils/formatTime'


const UserWill = ({beneficiaries, amounts, willInfo}) => {

  return (

      <div className='bg-[#151515] p-4 w-full flex-1 rounded-xl shadow text-[#666]'>
          <h2 className='text-lg font-bold mb-2 text-[#ccc] text-center'>Will Details</h2>
          <p className='text-[#bbb]'><strong>Beneficiaries:</strong></p>
          <ul className='list-disc list-inside text-[#666]'>
              {beneficiaries?.map((addr, index) => (
                  <li key={index} className='border-b-1 p-3 flex justify-between items-center'>
                      <span>{ truncate(addr) }</span><span>{ethers.utils.formatEther(amounts[index].toString())} ETH</span>
                  </li>
              ))}
          </ul>
        <p className='border-b-1 p-3 flex justify-between items-center '>
          <strong className='text-[#bbb]'>Balance:</strong> <span>{ethers.utils.formatEther(willInfo?.balance.toString())} ETH</span>
        </p>
        <p className='border-b-1 p-3 flex justify-between items-center'>
          <strong className='text-[#bbb]'>Unlock Time:</strong> <span>{formatTime(willInfo?.deathTimeout.toString())}</span>
        </p>
        <p className='border-b-1 p-3 flex justify-between items-center'>
          <strong className='text-[#bbb]'>Last Ping:</strong> <span>{ new Date(willInfo?.lastPing.toString() * 1000).toLocaleString()}</span>
        </p>
        <p className='border-b-1 p-3 flex justify-between items-center'>
          <strong className='text-[#bbb]'>Status:</strong> <span>{willInfo?.executed ? 'Executed' : 'Active'}</span>
        </p>
        <p className='border-b-1 p-3 flex justify-between items-center'>
          <strong className='text-[#bbb]'>Cancelled:</strong> <span>{willInfo?.cancelled ? 'Yes' : 'No'}</span>
        </p>
        <CountdownTimer 
          lastPing={willInfo.lastPing} 
          deathTimeout={willInfo.deathTimeout}
          className='text-white text-xl mt-2 text-center font-semibold'
        >
          Will executable in:
        </CountdownTimer>
    </div>
  )
}

export default UserWill