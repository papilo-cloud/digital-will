import React from 'react'
import { useState } from 'react'
import { useContract } from '../context/ContractContext'
import { ethers } from 'ethers'
import { toast } from 'react-toastify'

const ExecuteWill = () => {
    const [testatorAddress, setTestatorAddress] = useState('')
    const [loading, setLoading] = useState(false)

    const {contract} = useContract()

    const handleExecute = async () => {
        if (!contract) {
            toast.warn('Contract not connected.')
            return;
        }
        if (!ethers.utils.isAddress(testatorAddress)) {
            toast.warn('Invalid address')
            return;
        }
        setLoading(true)
        try {
            const tx = await contract.executeWill(testatorAddress)
            await tx.wait();
            toast.success('Will executed successfully!')
        } catch (err) {
            console.error(err);
            toast.error('Execution failed')
        } finally {
            setLoading(false)
        }
    }
  return (
    <div className='max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-md'>
        <h2 className='text-lg font-semibold mb-4'>Execute a Will</h2>
        <input
            type="text"
            placeholder='Enter testator address'
            className='w-full px-4 py-2 border rounded mb-4'
            value={testatorAddress}
            required
            onChange={e => setTestatorAddress(e.target.value)}
        />
        <button
            disabled={loading}
            onClick={handleExecute}
            className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full'
        >
            {loading ? 'Executing...': 'Execute Will'}
        </button>
    </div>
  )
}

export default ExecuteWill