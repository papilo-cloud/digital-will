import { useState } from 'react'
import { useContract } from '../context/ContractContext'
import { toast } from 'react-toastify'
import Button from './Core/Buttons/Button'
import ButtonText from './Core/Buttons/ButtonText'

const PingWill = ({onPingComplete}) => {
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

            if(onPingComplete) onPingComplete()
        } catch (error) {
            const message = error?.error?.message || error?.message || error;
            console.error(message);
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

  return (
    <div className='w-full bg-[#151515] p-6 rounded-xl shadow-md'>
        <h2 className='text-lg font-semibold mb-4 text-[#ccc]'>Ping Will</h2>
        <Button
            className='bg-[#34516e] hover:bg-[#2e4052] ring-[#2e4052]'
            onClick={handlePing}
            disabled={loading}
            loading={loading}
        >
            <ButtonText>Ping Now</ButtonText>
        </Button>
    </div>
  )
}

export default PingWill