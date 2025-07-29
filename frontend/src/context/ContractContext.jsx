import { Contract, ethers } from 'ethers'
import contractAbi from '../abi/CreateWill.json'
import { createContext, useContext, useEffect, useState } from 'react';
import { contractAddress } from '../utils/contractAddress';


const ContractContext = createContext();

const ABI = contractAbi.abi;

export const ContractProvider = ({children}) => {
  const [contract, setContract] = useState(null);
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
      const instance = new Contract(contractAddress, ABI, signer)

      setWalletAddress(address)
      setProvider(ethProvider)
      setContract(instance)
      setSigner(signer)

    } catch (err) {
      console.error('Connection Failed:', err);
    }
  }

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => window.location.reload())
      window.ethereum.on('chainChanged', () => window.location.reload())
    }
  }, [])
  
  return (
    <ContractContext.Provider 
      value={{
        walletAddress,
        contract,
        provider,
        signer,
        connectWallet,
        isConnected: !!walletAddress
      }}
    >
      {children}
    </ContractContext.Provider>
  )
}

export const useContract = () => useContext(ContractContext);