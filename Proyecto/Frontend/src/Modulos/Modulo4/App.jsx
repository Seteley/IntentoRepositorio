import React from 'react'
import Sidebar from '../Modulo4/components/Sidebar'
import Header from '../Modulo4/components/Header'
import StaffDemand from '../Modulo4/components/StaffDemand'
import AvailableStaff from '../Modulo4/components/AvailableStaff'
import AssignedShifts from '../Modulo4/components/AssignedShifts'

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
