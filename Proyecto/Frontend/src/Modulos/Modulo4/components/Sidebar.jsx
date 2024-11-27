import React from 'react';
import { User, Users, Calendar, ClipboardCheck, Eye, BarChart2, FileText, Mail } from 'lucide-react';

export default function Sidebar() {
  return (
    <div className="w-64 bg-zinc-900 min-h-screen p-4 text-white">
      <nav className="space-y-4">
        <h2 className="text-xl mb-6">Navegación</h2>
        
        <a href="#" className="flex items-center gap-3 p-2 hover:bg-zinc-800 rounded-lg">
          <User size={20} />
          <span>Usuario</span>
        </a>

        <a href="#" className="flex items-center gap-3 p-2 hover:bg-zinc-800 rounded-lg">
          <Users size={20} />
          <span>Perfiles de empleados</span>
        </a>

        <a href="#" className="flex items-center gap-3 p-2 hover:bg-zinc-800 rounded-lg">
          <Calendar size={20} />
          <span>Programación de turnos</span>
        </a>

        <a href="#" className="flex items-center gap-3 p-2 hover:bg-zinc-800 rounded-lg">
          <ClipboardCheck size={20} />
          <span>Control de asistencia</span>
        </a>

        <a href="#" className="flex items-center gap-3 p-2 hover:bg-zinc-800 rounded-lg">
          <Eye size={20} />
          <span>Ausencias y permisos</span>
        </a>

        <a href="#" className="flex items-center gap-3 p-2 hover:bg-zinc-800 rounded-lg">
          <BarChart2 size={20} />
          <span>Evaluación de desempeño</span>
        </a>

        <a href="#" className="flex items-center gap-3 p-2 hover:bg-zinc-800 rounded-lg">
          <FileText size={20} />
          <span>Nómina</span>
        </a>

        <a href="#" className="flex items-center gap-3 p-2 hover:bg-zinc-800 rounded-lg">
          <Mail size={20} />
          <span>Reportes</span>
        </a>
      </nav>
    </div>
  );
}

