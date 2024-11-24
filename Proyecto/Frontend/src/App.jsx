import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Modulo4 from "./Modulos/Modulo4/App";
import Modulo5 from "./Modulos/Modulo5/App";

const App = () => {
  return (
    <Router>
      <div>
        <h1>Mi Aplicación Modular</h1>
        <Routes>
          {/* Definir rutas para cada módulo */}
          <Route path="/modulo5/*" element={<Modulo5 />} />
          <Route path="/empleados" element={<Modulo4 />} />
          
          {/* Redirigir rutas desconocidas */}
          <Route path="*" element={<Navigate to="/" />} />

          {/* Ruta por defecto */}
          <Route path="/" element={<Modulo4 />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
