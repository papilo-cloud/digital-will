import { ContractProvider } from './context/ContractContext'
import CreateWillForm from './components/WillForm'
import ExecuteWill from './components/ExecuteWill'
import { ToastContainer } from 'react-toastify'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/DashBoard'
import NotFound from './pages/NotFound'
import MyWill from './components/MyWill'

function App() {

  return (
    <ContractProvider>
        <ToastContainer position='top-right' autoClose={4000} />
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/create' element={<CreateWillForm />} />
            <Route path='/execute' element={<ExecuteWill />} />
            <Route path='/mywill' element={<MyWill /> } />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </BrowserRouter>
    </ContractProvider>
  )
}

export default App
