import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { EmpleadoContext } from "../context/EmpleadoContext";
import { PlusCircle, PackagePlus, PackageMinus, FileSpreadsheet, ClipboardList, History, ArrowLeft } from 'lucide-react';
import '../styles/Inicio.css';

const Inicio = () => {
  const navigate = useNavigate();
  const { empleado } = useContext(EmpleadoContext);

  const handleNavigation = (ruta) => {
    navigate(ruta);
  };

  const handleIngresoInsumo = () => {
    if (empleado) {
      navigate(`/modulo5/ingresoinsumo/verordenes`);
    } else {
      alert("Por favor ingrese un código de empleado primero.");
      navigate("/modulo5");
    }
  };

  const modules = [
    { icon: <PlusCircle className="icon" />, route: "/modulo5/nuevoinsumo", name: "Nuevo Insumo" },
    { icon: <PackagePlus className="icon" />, route: "/modulo5/ingresoinsumo/verordenes", name: "Ingreso Insumo", action: handleIngresoInsumo },
    { icon: <PackageMinus className="icon" />, route: "/modulo5/retirarinsumo", name: "Retirar Insumo" },
    { icon: <FileSpreadsheet className="icon" />, route: "/modulo5/hojaproduccion", name: "Hoja de Producción" },
    { icon: <ClipboardList className="icon" />, route: "/modulo5/revisarinventario", name: "Revisar Inventario" },
    { icon: <History className="icon" />, route: "/modulo5/vermovimientos", name: "Ver Movimientos" },
  ];

  return (
    <div className="container">
      <h1>Seleccione una opción</h1>
      <div className="module-grid">
        {modules.map((module, index) => (
          <div key={index} className="module-item">
            <div className="module-card">
              <div className="icon-container">
                {module.icon}
              </div>
              <button 
                className="module-button"
                onClick={module.action || (() => handleNavigation(module.route))}
              >
                {module.name}
              </button>
            </div>
          </div>
        ))}
      </div>
      <button className="back-button" onClick={() => handleNavigation("/Default")}>
        <ArrowLeft className="icon" />
        Seleccionar otro módulo
      </button>
    </div>
  );
};

export default Inicio;
