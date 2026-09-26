import React from 'react'
import { Toaster } from 'react-hot-toast';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginLanding from './pages/LoginLanding.jsx';
import Layout from './pages/Layout';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import Employees from './pages/Employees';
import Leave from './pages/Leave';
import PrintPaySlips from './pages/PrintPaySlips';
import Settings from './pages/Settings';
import LoginForm from './components/LoginForm';
function App() {
  return (
    <>
      <Toaster/>
        <Routes>
          <Route path='/login' element={<LoginLanding /> } />
          <Route path='/login/admin' element={<LoginForm role={"admin"} title={"Admin Portal"} subtitle={"sing in to manage the organization"}  /> } />
          <Route path='/login/employee' element={<LoginForm  role={"employee"} title={"Employee Portal"} subtitle={"sing in to access the account"} /> } />
          <Route  element={<Layout/> } >

          <Route path='/dashboard' element={<Dashboard/> } />
          <Route path='employees' element={ <Employees/>} />
          <Route path='/addtendance' addtendance={<Attendance/> } />
          <Route path='/leave' element={<Leave/> } />
          <Route path='/payslips' element={ <PrintPaySlips/>} />
          <Route path='/settengs' element={<Settings/>} />
          
          </Route>
          <Route path='/print/:id' element={<PrintPaySlips/>}/>
          <Route path='*' element={<Navigate to='/dashboard' replace/>}/>
        </Routes>
      
    </>
  )
}

export default App
