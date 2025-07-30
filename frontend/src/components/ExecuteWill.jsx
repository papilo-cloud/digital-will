import { useState } from 'react'
import { useContract } from '../context/ContractContext'
import { ethers } from 'ethers'
import { toast } from 'react-toastify'
import DashboardLayout from './DashboardLayout'
import Button from './Core/Buttons/Button'
import ButtonText from './Core/Buttons/ButtonText'
import TextInput from './Core/Form/TextInput'
import Card from './Card/Card'
import CardHeader from './Card/CardHeader'

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
        <Card className='mt-10'>
            <CardHeader>Execute a Wil</CardHeader>
            <TextInput
                type="text"
                placeholder='Enter testator address'
                className='w-full mb-4'
                value={testatorAddress}
                onChange={e => setTestatorAddress(e.target.value)}
            />
            <Button 
                className='bg-[#1c7351] hover:bg-[#1c73] ring-bg-[#1c73]'
                disabled={loading}
                loading={loading}
                onClick={handleExecute}
            >
                <ButtonText>Execute Will</ButtonText>
            </Button>
        </Card>
    </DashboardLayout>
  )
}

export default ExecuteWill