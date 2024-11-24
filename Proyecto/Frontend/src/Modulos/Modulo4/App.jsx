import React, { useState, useEffect } from "react";
import { fetchEmpleados } from "./Service";
import EmployeeTable from "./EmployeeTable";
import "../../../src/App.css"

const App = () => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEmpleados = async () => {
      try {
        const data = await fetchEmpleados();
        console.log("Datos de empleados recibidos", data);
        setEmpleados(data);
      } catch (err) {
        console.error("Error al cargar empleados", err);
        setError("Error al cargar empleados.");
      } finally {
        setLoading(false);
      }
    };

    loadEmpleados();
  }, []);

  if (loading) return <div>Cargando empleados...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Lista de Empleados</h1>
      <EmployeeTable empleados={empleados} />
    </div>
  );
};

export default App;
