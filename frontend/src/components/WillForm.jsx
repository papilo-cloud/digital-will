import { useState } from 'react'
import { useContract } from '../context/ContractContext';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import DashboardLayout from './DashboardLayout';
import { Trash2, Plus } from 'lucide-react';
import Button from './Core/Buttons/Button';
import ButtonText from './Core/Buttons/ButtonText';
import TextInput from './Core/Form/TextInput';


const CreateWillForm = ({onCreateWill}) => {
  const [beneficiaries, setBeneficiaries] = useState(['']);
  const [amounts, setAmounts] = useState([''])
  const [deathTimeout, setDeathTimeout] = useState('');
  const [etherValue, setEtherValue] = useState('')
  const [loading, setLoading] = useState(false)

  const { contract, walletAddress } = useContract();

  const handleChange = (setter, index, value) => {
    setter(prev => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    })
  }

  const removeField = (index) => {
    const updated = beneficiaries.filter((_, i) => i !== index)
    setBeneficiaries(updated)
  }
  const addField = () => {
      if (beneficiaries.length < 10) {
        setBeneficiaries([...beneficiaries, ''])
        setAmounts([...amounts, ''])
      }
  }

  const handleSubmit = async (e) => {
      e.preventDefault();
      if (!contract || !walletAddress) {
        toast.warn('Wallet not connected')
        return;
      }
      setLoading(true)
      try {
          const tx = await contract.createWill(
            beneficiaries,
            amounts.map(a => ethers.utils.parseEther(a)),
            parseInt(deathTimeout),
            {value: ethers.utils.parseEther(etherValue)}
          )
          await tx.wait()

          if(onCreateWill) onCreateWill()

          toast.success('Will created successfully.')
      } catch (error) {
          const message = error?.error?.message || error?.message || error;
          console.error('Revert reason:', message);
          toast.error(message)
      }
      setLoading(false)
  }

  return (
    <DashboardLayout>
        <div className='max-w-xl mx-auto bg-[#151515] p-6 rounded-2xl shadow-2xl space-y-6'>
          <h2 className='text-xl font-semibold mb-4 text-[#ccc]'>Create your will</h2>
          <form onSubmit={handleSubmit} className='space-y-4'>
            {beneficiaries.map((b, i) => (
              <div key={i} className='flex gap-3'>
                <TextInput
                  type={'text'}
                  placeholder='Beneficiary address'
                  className='w-2/3'
                  value={b}
                  onChange={e => handleChange(setBeneficiaries, i, e.target.value)}
                />
                <TextInput
                  type={'number'}
                  className='w-1/3'
                  placeholder='Amount in ETH'
                  value={amounts[i]}
                  onChange={e => handleChange(setAmounts, i, e.target.value)}
                  min={'0.01'}
                  max={'99.99'}
                  step={'0.01'}
                />
                {beneficiaries.length > 1 && (
                  <button
                    type='button'
                    onClick={() => removeField(i)}
                    className='text-red-500 text-bold hover:text-red-700 cursor-pointer'
                  >
                    <Trash2 />
                  </button>
                )}
              </div>
            ))}
            {beneficiaries.length < 10 && (
              <button
                type='button' 
                onClick={addField}
                className='flex text-[#34516e] text-md cursor-pointer hover:underline'
              >
                <Plus /> Add Beneficiary
              </button>
            )}

            <TextInput 
              type="number"
              placeholder='Death Timeout (in seconds)' 
              value={deathTimeout}
              className='w-full'
              onChange={e => setDeathTimeout(e.target.value)}
            />
            <TextInput 
              type="number"
              placeholder='Total ETH to send'
              className='w-full'
              value={etherValue}
              onChange={e => setEtherValue(e.target.value)}
            />
            <Button className='bg-[#34516e] hover:bg-[#2e4052]' disabled={loading} loading={loading}>
              <ButtonText>
                Create Will
              </ButtonText>
            </Button>
          </form>
        </div>
    </DashboardLayout>
  )
}

export default CreateWillForm