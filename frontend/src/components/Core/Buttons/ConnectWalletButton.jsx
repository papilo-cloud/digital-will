import { useContract } from '../../../context/ContractContext'
import truncate from '../../../utils/truncate'
import Button from './Button'
import ButtonText from './ButtonText'

const ConnectWalletButton = () => {

    const { connectWallet, walletAddress, isConnected } = useContract()

  return (
    <div className=' text-[#ccc] text-lg w-50 text-center'>
        {!isConnected ? (
            <Button
                onClick={connectWallet}
                className='bg-[#1c7351] hover:bg-[#1c73] ring-[#1c73]'
            >
                <ButtonText>Connect Wallet</ButtonText>
            </Button>
        ): (
            <p className='rounded-full py-2 items-center text-center justify-center w-full h-full bg-[#0a0a0a] m-auto'>{truncate(walletAddress)}</p>
        )}
    </div>
  )
}

export default ConnectWalletButton