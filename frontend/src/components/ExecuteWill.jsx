import React from 'react'
import { useState } from 'react'
import { useContract } from '../context/ContractContext'
import { ethers } from 'ethers'
import { toast } from 'react-toastify'
import DashboardLayout from './DashboardLayout'
import Button from './Core/Buttons/Button'
import ButtonText from './Core/Buttons/ButtonText'
import TextInput from './Core/Form/TextInput'

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
        } catch (error) {
            const message = error?.error?.message || error?.message || error;
            console.error(message);
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }
  return (
    <DashboardLayout>
        <div className='max-w-md mx-auto mt-10 bg-[#151515] p-6 rounded-xl shadow-md'>
            <h2 className='text-lg font-semibold mb-4 text-[#ccc]'>Execute a Will</h2>
            <TextInput
                type="text"
                placeholder='Enter testator address'
                value={testatorAddress}
                onChange={e => setTestatorAddress(e.target.value)}
            />
            <Button 
                className='border-0 bg-[#1c7351] hover:bg-[#1c73]'
                disabled={loading}
                loading={loading}
                onClick={handleExecute}
            >
                <ButtonText>Execute Will</ButtonText>
            </Button>
        </div>
    </DashboardLayout>
  )
}

export default ExecuteWill