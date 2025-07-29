import {Link} from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'

const NotFound = () => {
  return (
    <DashboardLayout>
        <div className='p-6 text-center py-6'>
            <h1 className='text-3xl font-bold mb-3 text-[#ccc]'>404 - Page Not Found</h1>
            <Link className='text-blue-500 underline' to='/' >Go to Dashboard</Link>
        </div>
    </DashboardLayout>
  )
}

export default NotFound