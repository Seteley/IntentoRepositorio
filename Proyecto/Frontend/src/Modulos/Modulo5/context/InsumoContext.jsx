import React, { createContext, useState, useEffect } from "react";

// Crear el contexto
export const InsumoContext = createContext();

// Crear el proveedor del contexto
export const InsumoProvider = ({ children }) => {
  const [insumoSeleccionado, setInsumoSeleccionado] = useState("");

  // Leer el valor del insumo desde localStorage al cargar la página
  useEffect(() => {
    const storedInsumo = localStorage.getItem("insumoSeleccionado");
    if (storedInsumo) {
      setInsumoSeleccionado(storedInsumo); // Asigna el valor almacenado
    }
  }, []);

  // Guardar el insumo seleccionado en localStorage cuando se actualiza
  useEffect(() => {
    if (insumoSeleccionado) {
      localStorage.setItem("insumoSeleccionado", insumoSeleccionado); // Guarda el valor en localStorage
    }
  }, [insumoSeleccionado]);

  return (
    <InsumoContext.Provider value={{ insumoSeleccionado, setInsumoSeleccionado }}>
      {children}
    </InsumoContext.Provider>
  );
};
