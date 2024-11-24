import React, { createContext, useState, useContext, useEffect } from "react";

// Crear el contexto
export const OrdenContext = createContext();

// Proveedor del contexto
export const OrdenProvider = ({ children }) => {
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Nuevo estado para manejar la carga

  useEffect(() => {
    // Intentamos cargar la orden desde el localStorage al cargar el componente
    const storedOrden = localStorage.getItem("ordenSeleccionada");
    if (storedOrden) {
      setOrdenSeleccionada(JSON.parse(storedOrden)); // Convertimos de JSON a objeto
    }
    setIsLoading(false); // Finalizamos la carga
  }, []);

  // Función para actualizar la orden seleccionada
  const selectOrden = (codigoOrden) => {
    setOrdenSeleccionada(codigoOrden);
    localStorage.setItem("ordenSeleccionada", JSON.stringify(codigoOrden)); // Guardamos como JSON
  };

  return (
    <OrdenContext.Provider value={{ ordenSeleccionada, selectOrden, isLoading }}>
      {children}
    </OrdenContext.Provider>
  );
};

// Hook para consumir el contexto
export const useOrden = () => useContext(OrdenContext);
