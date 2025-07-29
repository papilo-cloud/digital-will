import React from 'react'
import { Link } from 'react-router-dom'
import { Home, FilePlus, Trash2, RefreshCcw, Menu } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className='w-64 bg-[#151515] shadow-xl p-2'>
        <h1 className='text-3xl text-white tracking-wide p-4 font-bold mb-6'>Will DApp</h1>
        <nav className='flex w-full flex-col space-y-3 mt-2'>
            <Link to={'/'} className='w-full flex items-center space-x-2 text-[#666666] hover:text-white p-2 rounded hover:bg-[#34516e]'>
                <Home /> <span className=''>Dashboard</span>
            </Link>
            <Link to={'/create'} className='flex items-center space-x-2 text-[#666666] hover:text-white p-2 rounded hover:bg-[#34516e]'>
                <FilePlus /> <span className=''>Create Will</span>
            </Link>
            <Link to={'/execute'} className='flex items-center space-x-2 text-[#666666] hover:text-white p-2 rounded hover:bg-[#34516e]'>
                <RefreshCcw /> <span className=''>Execute Will</span>
            </Link>
            <Link to={'/mywill'} className='flex items-center space-x-2 text-[#666666] hover:text-white p-2 rounded hover:bg-[#34516e]'>
                <Menu /> <span className=''>My Will</span>
            </Link>
        </nav>
    </div>
  )
}

export default Sidebar