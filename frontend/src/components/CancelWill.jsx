import { useState } from 'react'
import { useContract } from '../context/ContractContext'
import { toast } from 'react-toastify'
import Button from './Core/Buttons/Button'
import ButtonText from './Core/Buttons/ButtonText'

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
    <div className='w-full mx-auto mt-10 bg-[#151515] p-6 rounded-xl shadow-md'>
        <h2 className='text-lg font-semibold mb-4 text-[#ccc]'>Cancel Will</h2>
        <Button
            disabled={loading}
            loading={loading}
            onClick={handleCancel}
            className='bg-red-600 hover:bg-red-700'
        >
            <ButtonText>Cancel Will</ButtonText>
        </Button>
    </div>
  )
}

export default CancelWill