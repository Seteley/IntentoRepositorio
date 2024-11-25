import React, { createContext, useState, useEffect } from "react";

// Crear el contexto
export const EmpleadoContext = createContext();

// Crear el proveedor del contexto
export const EmpleadoProvider = ({ children }) => {
  const [empleado, setEmpleado] = useState("");

  // Leer el valor del empleado desde localStorage al cargar la página
  useEffect(() => {
    const storedEmpleado = localStorage.getItem("empleado");
    if (storedEmpleado) {
      setEmpleado(storedEmpleado); // Asigna el valor almacenado
    }
  }, []);

  // Guardar el valor del empleado en localStorage cuando se actualiza
  useEffect(() => {
    if (empleado) {
      localStorage.setItem("empleado", empleado); // Guarda el valor en localStorage
    }
  }, [empleado]);

  return (
    <EmpleadoContext.Provider value={{ empleado, setEmpleado }}>
      {children}
    </EmpleadoContext.Provider>
  );
};
