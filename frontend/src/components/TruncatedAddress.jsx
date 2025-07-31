import React from 'react'
import { useState } from 'react'
import truncate from '../utils/truncate'
import {Copy, CheckCheck } from 'lucide-react'

const TruncatedAddress = ({address}) => {
    const [copied, setCopied] = useState(false)

    const copyToClipboard = () => {
        navigator.clipboard.writeText(address)
        setCopied(true)
        setTimeout(() => {
            return setCopied(false)
        }, 1500);
    }
  return (
    <div className='flex items-center gap-2 text-gray-300 font-mono'>
        <span>{truncate(address, 8, -8)}</span>
        <button 
            className='cursor-pointer hover:text-gray-100'
            onClick={copyToClipboard}
        >
            {!copied ?
                <Copy width={15} /> :
                <CheckCheck width={15} />
            }
        </button>
    </div>
  )
}

export default TruncatedAddress