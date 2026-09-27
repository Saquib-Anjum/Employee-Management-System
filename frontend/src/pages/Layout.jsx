import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

function Layout() {
  return (
    <div className='h-screen bg-red'>
    <Sidebar/>
    <main>
      <div>
        <Outlet/>
      </div>
    </main>
    
    </div>
  )
}

export default Layout
