import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import UserWill from './UserWill'
import PingWill from './PingWill'
import CancelWill from './CancelWill'
import CreateWillForm from './WillForm'
import { useContract } from '../context/ContractContext'
import DashboardLayout from './DashboardLayout'
import useGetWills from '../hooks/useGetWills'

const MyWill = () => {
    const [loading, setLoading] = useState(true)
    const [beneficiaries, setBeneficiaries] = useState(null)
    const [amounts, setAmounts] = useState(null)

    const { walletAddress, contract} = useContract()
    const {willInfo, hasWill, fetchAllWills} = useGetWills()

    const fetchWillInfo = async () => {
        if (!contract || !walletAddress) return

        try {
            const filter = await contract.filters.WillCreated(walletAddress)
            const logs = await contract.queryFilter(filter)

            if (logs?.length > 0) {
            const willEvent = logs[logs.length - 1]
            const { beneficiaries, amounts, } = willEvent.args
            
            setBeneficiaries(beneficiaries)
            setAmounts(amounts)

            if(fetchAllWills) fetchAllWills();

            }

        } catch (error) {
            const message = error?.error?.message || error?.message || error;
            console.error(message);
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchWillInfo();
    }, [contract, walletAddress])

  return (
    <>
        <div className='min-w-3xl mx-auto'>
            {hasWill ? (
                <DashboardLayout>
                    {loading ? (
                        <div className='text-center text-2xl text-white mt-20'> Loading Will data...</div>
                    ):(
                        <div className=' max-w-3xl flex gap-4 items-center mx-auto'>
                            <UserWill willInfo={willInfo} beneficiaries={beneficiaries} amounts={amounts} />
                            <div className='flex flex-col justify-center items-center gap-4 w-80'>
                                <PingWill onPingComplete={fetchWillInfo} />
                                <CancelWill onCancelComplete={fetchWillInfo} />
                            </div>
                        </div>
                    )
                    }
                </DashboardLayout>
            ) : (
                <CreateWillForm onCreateWill={fetchWillInfo} />
            )}
        </div>
    </>
         
  )
}

export default MyWill