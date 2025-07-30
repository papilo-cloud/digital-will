import React, { useEffect, useState } from 'react'
import { useContract } from '../context/ContractContext'
import { toast } from 'react-toastify'
import { Contract, ethers } from 'ethers'
import { contractAddress } from '../utils/contractAddress'
import contractAbi from '../abi/CreateWill.json'

const ABI = contractAbi.abi;

const useGetWills = () => {
    const [wills, setWills] = useState([])
    const [willInfo, setWillInfo] = useState(null)
    const [hasWill, setHasWill] = useState(false)
    const [totalBalance, setTotalBalance] = useState(0)
    const [willsCreated, setWillsCreated] = useState(0)

    const {contract, provider, walletAddress, isConnected} = useContract()

    const fetchAllWills = async () => {
        if (!contract || !walletAddress) {
            toast.warn("Connect Wallet")
            return;
        }

        try {
            const filterInstance = new Contract(contractAddress, ABI, provider)
            const filter = filterInstance.filters.WillCreated()
            const events = await filterInstance.queryFilter(filter, 0, 'latest');

            const parsed = events.map(event => ({
                testator: event.args.testator,
                beneficiaries: event.args.beneficiaries,
                amounts: event.args.amounts.map(a => ethers.utils.formatEther(a)),
                balance: ethers.utils.formatEther(event.args.balance),
                deathTimeout: event.args.deathTimeout.toString(),
                blockNUmber: event.blockNumber
            }))

            const totalEther = parsed.reduce((acc, cur) => parseFloat(acc) + parseFloat(cur.balance), ethers.BigNumber.from(0))

            const will = await contract.usersWill(walletAddress)
            const isCreated = will?.balance.gt(0)

            const testators = await contract.getAllTestators()
            const now = Math.floor(Date.now() / 1000)
            const willList = []

            // console.log('Testators:',testators)

            for (const addr of testators) {
                const wills = await contract.usersWill(addr)
                const timeLeft = parseInt(wills.lastPing) + parseInt(wills.deathTimeout) - now;

                willList.push({
                    address: addr,
                    ...wills,
                    timeLeft,
                    isDead: timeLeft <= 0 && !wills.executed && !wills.cancelled
                })
            }

            setWills(willList)
            setHasWill(isCreated)
            setWillInfo(will)
            setTotalBalance(totalEther)
            setWillsCreated(parsed?.length)

        } catch (error) {
            const message = error?.error?.message || error?.message || error;
            console.error(message);
            toast.error(message)
        }
    }

    useEffect(() => {
        fetchAllWills()
    }, [contract, isConnected])

  return {fetchAllWills, wills, willsCreated, totalBalance, hasWill, willInfo}
}

export default useGetWills