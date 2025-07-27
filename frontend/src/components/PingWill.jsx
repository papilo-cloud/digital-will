import React, { useState } from 'react'
import { useContract } from '../context/ContractContext'
import { toast } from 'react-toastify'

const PingWill = () => {
    const [loading, setLoading] = useState(false)

    const {contract} = useContract()

    const handlePing = async () => {
        if (!contract) {
            toast.warn('Contract not connected.')
            return;
        }
        setLoading(true)
        try {
            const tx = await contract.ping()
            await tx.wait()
            toast.success('Ping successful - last activity updated.')
        } catch (err) {
            console.error(err);
            toast.error('Ping failed')
        } finally {
            setLoading(false)
        }
    }

  return (
    <div className='max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-md'>
        <h2 className='text-lg font-semibold mb-4'>Ping Will</h2>
        <button
            onClick={handlePing}
            disabled={loading}
            className='bg-blue-600 cursor-pointer text-white py-2 w-full rounded hover:bg-blue-700'
        >
            {loading ? 'Pinging...' : 'Ping Now'}
        </button>
    </div>
  )
}

export default PingWill