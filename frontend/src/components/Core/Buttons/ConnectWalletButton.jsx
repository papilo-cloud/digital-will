import { useEffect } from 'react'
import { useContract } from '../../../context/ContractContext'
import truncate from '../../../utils/truncate'
import Button from './Button'
import ButtonText from './ButtonText'
import { toast } from 'react-toastify'

const ConnectWalletButton = () => {

    const { connectWallet, walletAddress, isConnected, networkError } = useContract()

    useEffect(() => {
        toast.error(networkError)
    }, [networkError])

  return (
    <>
        {!isConnected ? (
            <Button
                onClick={connectWallet}
                className='bg-[#1c7351] hover:bg-[#1c73] ring-[#1c73]'
            >
                <ButtonText>Connect Wallet</ButtonText>
            </Button>
        ): (
            <p className='text-[#ccc] text-lg rounded-full items-center text-center justify-center w-full h-full bg-[#0a0a0a] m-auto py-[0.625em] px-[1.625em]'>{truncate(walletAddress)}</p>
        )}
    </>
  )
}

export default ConnectWalletButton