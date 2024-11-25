import React from "react";
import { Routes, Route } from "react-router-dom";
import { EmpleadoProvider } from "./context/EmpleadoContext"; // Proveedor de contexto
import { OrdenProvider } from "./context/OrdenContext"; 
import { InsumoProvider } from "./context/InsumoContext";
import FormularioEmpleado from "./components/FormularioEmpleado"; // Componente que usa el contexto
import Inicio from "./components/Inicio"; // Componente que contiene los botones
import OrdenMismoDia from "./components/OrdenMismoDia"; // Componente que muestra las órdenes de compra
import ContenidoOrden from "./components/ContenidoOrden";
import AsignarSupervisores from "./components/AsignarSupervisores";
import RevisionCantidad from './components/RevisionCantidad';
import RevisionCalidad from './components/RevisionCalidad'; // Importar el nuevo componente para revisión de calidad
import Revisiones from './components/Revisiones'; // Importar el nuevo componente para revisión de calidad
import IngresoInicio from './components/IngresoInicio';
import IngresoAlmacen from './components/IngresoAlmacen';




const App = () => {
  return (
    <EmpleadoProvider>
      <OrdenProvider>
      <InsumoProvider>
      <div>
        <h1>Módulo 5</h1>
        <Routes>
          {/* Ruta para el formulario de código de empleado */}
          <Route path="/" element={<FormularioEmpleado />} />

          {/* Ruta para la página de inicio con los botones */}
          <Route path="/inicio" element={<Inicio />} />

          {/* Ruta para las órdenes de compra del mismo día */}
          <Route path="/ingresoinsumo/verordenes" element={<OrdenMismoDia />} />
          <Route path="/contenidoorden" element={<ContenidoOrden />} />
          <Route path="/asignarsupervisores" element={<AsignarSupervisores />} />
          <Route path="/revisioncantidad" element={<RevisionCantidad />} />
          <Route path="/revisioncalidad" element={<RevisionCalidad />} />
          <Route path="/revisiones" element={<Revisiones />} /> // Nueva ruta
          <Route path="/ingresoinicio" element={<IngresoInicio />} />
          <Route path="/ingresoalmacen" element={<IngresoAlmacen />} />


        </Routes>
      </div>
      </InsumoProvider>
      </OrdenProvider>
    </EmpleadoProvider>
  );
};

export default App;
