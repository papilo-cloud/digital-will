import { BigNumber } from "ethers"
import { useEffect, useState } from "react"
import formatTime from "../utils/formatTime"
import clsx from "clsx"

const CountdownTimer = ({lastPing, deathTimeout, className, children}) => {
    const [timeleft, setTimeLeft] = useState(0)

    useEffect(() => {
        const lastPingTime = BigNumber.from(lastPing).toNumber()
        const timeOut = BigNumber.from(deathTimeout).toNumber()
        const deathTimeStamp = lastPingTime + timeOut

        const updateCountdown = () => {
            const now = Math.floor(Date.now() / 1000)
            const remaining = deathTimeStamp - now
            setTimeLeft(remaining > 0 ? remaining : 0)
        }

        updateCountdown()
        const interval = setInterval(updateCountdown, 1000)

        return () => clearInterval(interval)
    }, [lastPing, deathTimeout])

    return (
        <div className={clsx("font-normal", className)}>
            {children} {formatTime(timeleft)}
        </div>
    )
}

export default CountdownTimer