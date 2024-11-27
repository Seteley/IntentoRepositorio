import React from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import StaffDemand from './StaffDemand'
import AvailableStaff from './AvailableStaff'
import AssignedShifts from './AssignedShifts'

export default function ShiftManagement() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8">Programación de Turnos</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <StaffDemand />
            <AvailableStaff />
          </div>
          
          <AssignedShifts />
        </main>
      </div>
    </div>
  )
}
