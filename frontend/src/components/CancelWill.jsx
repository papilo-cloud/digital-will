import { useState } from 'react'
import { useContract } from '../context/ContractContext'
import { toast } from 'react-toastify'
import Button from './Core/Buttons/Button'
import ButtonText from './Core/Buttons/ButtonText'
import CardHeader from './Card/CardHeader'
import Card from './Card/Card'

const CancelWill = ({onCancelComplete}) => {
    const [loading, setLoading] = useState(false)

    const {contract} = useContract()

    const handleCancel = async () => {
        if (!contract) {
            toast.warn('Contract not connected.')
            return;
        }
        
        setLoading(true)
        try {
            const tx = await contract.cancelWill()
            await tx.wait()
            toast.success("Will cancelled and funds refunded!")

            if(onCancelComplete) onCancelComplete();
        } catch (error) {
            const message = error?.error?.message || error?.message || error;
            console.error(message);
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }
    
  return (
    <Card className='w-full'>
        <CardHeader>Cancel Will</CardHeader>
        <Button
            disabled={loading}
            loading={loading}
            onClick={handleCancel}
            className='bg-red-600 hover:bg-red-700'
        >
            <ButtonText>Cancel Will</ButtonText>
        </Button>
    </Card>
  )
}

export default CancelWill