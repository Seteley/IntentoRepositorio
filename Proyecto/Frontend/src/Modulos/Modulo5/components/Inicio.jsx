import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { EmpleadoContext } from "../context/EmpleadoContext";

const Inicio = () => {
  const navigate = useNavigate();
  const { empleado } = useContext(EmpleadoContext);

  // Maneja la navegación de forma genérica
  const handleNavigation = (ruta) => {
    navigate(ruta);
  };

  // Verifica si el empleado está definido antes de navegar a "Ingreso Insumo"
  const handleIngresoInsumo = () => {
    if (empleado) {
      navigate(`/modulo5/ingresoinsumo/verordenes`);
    } else {
      // En lugar de un alert, puedes mostrar un mensaje en la UI
      alert("Por favor ingrese un código de empleado primero.");
      // Opcionalmente, puedes redirigir a la página de formulario para ingresar el código de empleado
      navigate("/modulo5");
    }
  };

  return (
    <div>
      <h2>Gestión de Inventario</h2>
      <div>
        <button onClick={() => handleNavigation("/modulo5/nuevoinsumo")}>Nuevo Insumo</button>
        <button onClick={handleIngresoInsumo}>Ingreso Insumo</button>
        <button onClick={() => handleNavigation("/modulo5/retirarinsumo")}>Retirar Insumo</button>
        <button onClick={() => handleNavigation("/modulo5/hojaproduccion")}>Hoja de Producción</button>
        <button onClick={() => handleNavigation("/modulo5/revisarinventario")}>Revisar Inventario</button>
        <button onClick={() => handleNavigation("/modulo5/vermovimientos")}>Ver Movimientos</button>
      </div>
      <button onClick={() => handleNavigation("/modulo5")}>Seleccionar otro módulo</button>
    </div>
  );
};

export default Inicio;
