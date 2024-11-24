import React from 'react';
import { useNavigate } from "react-router-dom";


function Default() {
  const navigate = useNavigate();

  // Maneja la navegación de forma genérica
  const handleNavigation = (ruta) => {
    navigate(ruta);
  };
  return (
    <div>
      <h1>Seleccione el módulo</h1>
      <div>
        <button>Módulo 1</button>
        <button>Módulo 2</button>
        <button>Módulo 3</button>
        <button>Módulo 4</button>
        <button onClick={() => handleNavigation("/modulo5")}>Módulo 5</button>
      </div>
    </div>
  );
}

export default Default;
