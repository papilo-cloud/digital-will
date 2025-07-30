import { Contract, ethers } from 'ethers'
import contractAbi from '../abi/CreateWill.json'
import { createContext, useContext, useEffect, useState } from 'react';
import { contractAddress } from '../utils/contractAddress';
import { useMemo } from 'react';


const SEPOLIA_CHAIN_ID = '11155111';
const ContractContext = createContext();

const ABI = contractAbi.abi;

export const ContractProvider = ({children}) => {
  const [networkError, setNetworkError] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null)
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)



  const connectWallet = async () => {
    if(!window.ethereum) return alert('Metamask not installed');

    try {
      const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
      await ethProvider.send('eth_requestAccounts', []);
      const signer = ethProvider.getSigner()
      const address = await signer.getAddress();
      const network = await ethProvider.getNetwork()

      if(network.chainId.toString() !== SEPOLIA_CHAIN_ID){
        setNetworkError('Please switch to Sepolia network')
        return;
      }

      setWalletAddress(address)
      setProvider(ethProvider)
      setSigner(signer)
      setNetworkError(null)

    } catch (err) {
      console.error('Connection Failed:', err);
    }
  }

  const disconnectWallet = () => {
    setWalletAddress('');
    setProvider(null);
    setSigner(null)
    setNetworkError(null)
  }

  const contract = useMemo(() => {
    if(!signer) return null;
    return new Contract(contractAddress, ABI, signer);
  }, [signer])

  useEffect(() => {
    const autoConnect = async () => {
      if (window.ethereum) {
          // const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
          // const accounts = await ethProvider.listAccounts()

          // if (accounts.length > 0) {
          //   const signer = ethProvider.getSigner()
          //   const address = await signer.getAddress()
          //   const network = await ethProvider.getNetwork()

          //   if (network.chainId.toString() === SEPOLIA_CHAIN_ID) {
          //     setWalletAddress(address)
          //     setSigner(signer)
          //     setProvider(ethProvider)
          //     setNetworkError(null)
          //   } else {
          //     setNetworkError('Please switch to Sepolia network')
          //   }
          // }
        }
        window.ethereum.on('accountsChanged', () => window.location.reload())
        window.ethereum.on('chainChanged', () => window.location.reload())
      }
    autoConnect()
  }, [])
  
  return (
    <ContractContext.Provider 
      value={{
        walletAddress,
        contract,
        provider,
        signer,
        connectWallet,
        disconnectWallet,
        networkError,
        isConnected: !!walletAddress
      }}
    >
      {children}
    </ContractContext.Provider>
  )
}

export const useContract = () => useContext(ContractContext);