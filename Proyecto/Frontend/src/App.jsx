import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import Default from "./Default"

import Modulo4 from "./Modulos/Modulo4/App";
import Modulo5 from "./Modulos/Modulo5/App";

import AuthenticationForm from "./Modulos/Modulo2/App";
import AsignacionMesa from "./Modulos/Modulo2/AsignacionMesa";
import Categories from "./Modulos/Modulo2/Categories";
import Products from "./Modulos/Modulo2/Products";
import Summary from "./Modulos/Modulo2/Summary";
import '../src/index.css'


const App = () => {
  return (
    <Router>
      <div>
        
        <Routes>
          {/* Definir rutas para cada módulo */}
          <Route path="/modulo4" element={<Modulo4 />} />
          {/* Ruta por defecto */}
          <Route path="/" element={<Default />} />


          {/* MODULO 2 */}
          <Route path="/autenticacion" element={<AuthenticationForm />} />
          <Route path="/asignacion-mesa" element={<AsignacionMesa />} />
          <Route path="/categorias" element={<Categories />} />
          <Route path="/items-pedido" element={<Products />} />
          <Route path="/summary" element={<Summary />} />

          {/* MODULO 5 */}
          <Route path="/modulo5/*" element={<Modulo5 />} />
          {/* Redirigir rutas desconocidas */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
