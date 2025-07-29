import { useEffect, useState } from "react";
import DashboardCard from "../components/DashboardCard";
import DashboardLayout from "../components/DashboardLayout";
import { useContract } from "../context/ContractContext";
import contractAbi from '../abi/CreateWill.json'
import { Contract, ethers } from "ethers";
import { contractAddress } from "../utils/contractAddress";

const ABI = contractAbi.abi;

const Dashboard = () => {

    const [wills, setWills] = useState(0)
    const [totalBalance, setTotalBalance] = useState(0)
    const [loading, setLoading] = useState(false)
    const [willInfo, setWillInfo] = useState(null)
    const [hasWill, setHasWill] = useState(false)

    const {provider, contract, walletAddress} = useContract()

    const fetchWills = async () => {
      if (!provider || !walletAddress) return;
      try {
        setLoading(true)

        const contracts = new Contract(contractAddress, ABI, provider)

        const filter = contracts.filters.WillCreated()
        const events = await contracts.queryFilter(filter, 0, 'latest')

        const parsed = events.map(event => ({
          testator: event.args.testator,
          beneficiaries: event.args.beneficiaries,
          amounts: event.args.amounts.map(a => ethers.utils.formatEther(a)),
          balance: ethers.utils.formatEther(event.args.balance),
          deathTimeout: event.args.deathTimeout.toString(),
          blockNUmber: event.blockNumber
        }))

        const will = await contract.usersWill(walletAddress);
        const isCreated = will?.balance.gt(0)
        const totalEther = parsed.reduce((sum, will) => parseFloat(sum) + parseFloat(will.balance), ethers.BigNumber.from(0))

        setWills(parsed.length)
        setTotalBalance(totalEther)
        setHasWill(isCreated)
        setWillInfo(will)
        
      } catch (error) {
        const message = error?.error?.message || error?.message || error;
        console.error(message);
      } finally {
        setLoading(false)
      }
    }

    useEffect(() => {
      fetchWills();
    }, [provider, contract])
  return (
    <DashboardLayout>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <DashboardCard title={'Wills Created'} value={wills} />
            <DashboardCard title={'Total Value Locked'} value={`${totalBalance} ETH`} />
            <DashboardCard title={'My Will Status'} value={hasWill ? (willInfo.executed ? 'Executed' : 'Active'): "You don't have a Will"} />
        </div>
    </DashboardLayout>
  );
};

export default Dashboard;
