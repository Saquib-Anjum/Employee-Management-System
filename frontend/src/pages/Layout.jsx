import React from 'react'
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div className='h-screen bg-red'>
    <p>Sidebar</p>
    <main>
      <div>
        <Outlet/>
      </div>
    </main>
    
    </div>
  )
}

export default Layout
