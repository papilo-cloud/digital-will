import React, { useEffect } from 'react'
import { useState } from 'react'
import { useContract } from '../context/ContractContext'
import { ethers } from 'ethers'
import { toast } from 'react-toastify'
import Button from './Core/Buttons/Button'
import ButtonText from './Core/Buttons/ButtonText'

const CancelWill = () => {
    const [testatorAddress, setTestatorAddress] = useState('')
    const [loading, setLoading] = useState(false)
    const [isTestator, setIsTestator] = useState(false)

    const {contract, walletAddress} = useContract()

    useEffect(() => {
      const checkIfTestator = async () => {
        if(!contract || !walletAddress) return;
        try {
          const will = await contract.usersWill(walletAddress)
          setIsTestator(will?.beneficiaries?.length > 0);
        } catch (err) {
          console.error(err);
          setIsTestator(false)
        }
      }
      checkIfTestator()
    }, [contract, walletAddress])

    const handleCancel = async () => {
        if (!contract) {
            toast.warn('Contract not connected.')
            return;
        }
        if (!isTestator) {
            toast.warn('You are not the owner of any will')
            return;
        }
        try {
          setLoading(true)
            const tx = await contract.cancelWill()
            await tx.wait()
            toast.success("Will cancelled and funds refunded!")
        } catch (err) {
          console.error(err);
          toast.error('Failed to cancel Will.')
        } finally {
          setLoading(false)
        }
    }
    
  return (
    <div className='w-full mx-auto mt-10 bg-[#151515] p-6 rounded-xl shadow-md'>
        <h2 className='text-lg font-semibold mb-4 text-[#ccc]'>Cancel Will</h2>
        <Button
            disabled={loading}
            onClick={handleCancel}
            className='bg-red-600 hover:bg-red-700'
        >
            <ButtonText>Cancel Will</ButtonText>
        </Button>
    </div>
  )
}

export default CancelWill