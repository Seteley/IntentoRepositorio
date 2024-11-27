import React from 'react';
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Book, DollarSign, Users, ClipboardCheck } from 'lucide-react';
import './styles/Default.css';

function Default() {
  const navigate = useNavigate();

  const handleNavigation = (ruta) => {
    navigate(ruta);
  };

  const modules = [
    { icon: <ShoppingCart className="icon" />, route: "/", name: "Pedido de compra" },
    { icon: <Book className="icon" />, route: "/autenticacion", name: "Sistema de registro de pedidos y coordinación en la cocina" },
    { icon: <DollarSign className="icon" />, route: "/", name: "Reporte de costos" },
    { icon: <Users className="icon" />, route: "/modulo4", name: "Gestión de personal y turnos" },
    { icon: <ClipboardCheck className="icon" />, route: "/modulo5", name: "Gestión de inventario" }
  ];

  return (
    <div className="container">
      <h1>Por favor, seleccione un módulo</h1>
      <div className="module-grid">
        {modules.map((module, index) => (
          <div key={index} className="module-item">
            <div className="module-card">
              <div className="icon-container">
                {module.icon}
              </div>
              <button 
                className="module-button"
                onClick={() => handleNavigation(module.route)}
              >
                {module.name}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Default;

