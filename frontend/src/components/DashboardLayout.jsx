import Sidebar from './Sidebar'
import Header from './Header'

const DashboardLayout = ({children}) => {
  return (
    <div className='flex h-screen bg-[#0a0a0a]'>
        <Sidebar />
        <div className='flex flex-col flex-1'>
            <Header />
            <main className='p-6 overflow-y-auto'>{children}</main>
        </div>
    </div>
  )
}

export default DashboardLayout