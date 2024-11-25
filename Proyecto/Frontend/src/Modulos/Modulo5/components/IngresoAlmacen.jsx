import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EmpleadoContext } from "../context/EmpleadoContext";
import { InsumoContext } from "../context/InsumoContext";
import { OrdenContext } from "../context/OrdenContext"; 
import { fetchAlmacenes, fetchIngresarStock } from "../Service";
import { fetchInsertarMovimiento } from "../Service"; 
import { fetchActualizarFinIngreso } from "../Service";


function IngresoAlmacen() {
  const { empleado } = useContext(EmpleadoContext); 
  const { insumoSeleccionado } = useContext(InsumoContext); 
  const { ordenSeleccionada } = useContext(OrdenContext); 
  const [almacenes, setAlmacenes] = useState([]); 
  const [error, setError] = useState(null); 
  const [almacenSeleccionado, setAlmacenSeleccionado] = useState(null); 
  const [fechaVencimiento, setFechaVencimiento] = useState(""); 
  const navigate = useNavigate();

  // Cargar los datos al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAlmacenes(empleado, insumoSeleccionado); 
        setAlmacenes(data); 
        setError(null); 
      } catch (err) {
        console.error(err);
        setError(err.message); 
      }
    };

    // Llamar a la función solo si ambos valores están disponibles
    if (empleado && insumoSeleccionado) {
      fetchData();
    }
  }, [empleado, insumoSeleccionado]); 

  // Obtener la fecha mínima permitida (hoy + 1 día)
  const fechaMinima = new Date();
  fechaMinima.setDate(fechaMinima.getDate() + 1);
  const fechaMinimaISO = fechaMinima.toISOString().split("T")[0]; // Formato YYYY-MM-DD

  // Función para manejar la selección del almacén
  const handleSeleccionar = (almacen) => {
    setAlmacenSeleccionado(almacen.cod_almacen); 
  };

  // Función para manejar el envío del formulario y realizar el ingreso a almacén
  const handleIngreso = async () => {
    if (!fechaVencimiento || !almacenSeleccionado || !insumoSeleccionado || !ordenSeleccionada) {
      setError("Todos los campos deben ser seleccionados.");
      return;
    }

    try {
      // Primero, realizar el ingreso de stock
      const mensajeStock = await fetchIngresarStock(
        fechaVencimiento, 
        insumoSeleccionado, 
        ordenSeleccionada, 
        almacenSeleccionado
      );
      alert(mensajeStock); 

      // Validar los parámetros antes de llamar a fetchInsertarMovimiento
      if (!ordenSeleccionada) {
        console.error("Error: ordenSeleccionada está vacío o indefinido");
        setError("Error: 'ordenSeleccionada' está vacío o indefinido");
        return;
      }

      if (!insumoSeleccionado) {
        console.error("Error: insumoSeleccionado está vacío o indefinido");
        setError("Error: 'insumoSeleccionado' está vacío o indefinido");
        return;
      }

      if (!empleado) {
        console.error("Error: empleado.cod_empleado está vacío o indefinido");
        setError("Error: 'empleado.cod_empleado' está vacío o indefinido");
        return;
      }

      console.log("Parametros para insertar movimiento:", {
        ordenSeleccionada,
        insumoSeleccionado,
        empleado
      });

      // Luego, insertar el movimiento (cod_tipomovimiento es constante, así que no se pasa)
      const mensajeMovimiento = await fetchInsertarMovimiento(
        ordenSeleccionada, 
        insumoSeleccionado, 
        empleado // Asegúrate de acceder correctamente al código del empleado
      );
      alert(mensajeMovimiento); 

    } catch (err) {
      setError(`Error en fetchInsertarMovimiento: ${err.message}`); 
    }
  };

  const handleTerminarIngreso = async () => {
    try {
      const mensaje = await fetchActualizarFinIngreso();
      alert(mensaje);
    } catch (err) {
      setError(`Error en fetchActualizarFinIngreso: ${err.message}`);
    }
  };
  

  return (
    <div>
      <h1>Ingreso de Insumos al Almacén</h1>

      {/* Formulario para la fecha de vencimiento */}
      <form style={{ marginBottom: "20px" }}>
        <label>
          Fecha de vencimiento:{" "}
          <input
            type="date"
            min={fechaMinimaISO} // Fecha mínima: mañana
            required
            value={fechaVencimiento}
            onChange={(e) => setFechaVencimiento(e.target.value)} // Actualizar fecha de vencimiento
          />
        </label>
      </form>

      {/* Mostrar mensaje si hay error */}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {/* Mostrar mensaje si no hay datos */}
      {!error && almacenes.length === 0 && (
        <p>No se encontraron almacenes compatibles.</p>
      )}

      {/* Mostrar tabla de resultados */}
      {almacenes.length > 0 && (
        <table border="1" style={{ width: "100%", marginTop: "20px" }}>
          <thead>
            <tr>
              <th>Tipo de Almacén</th>
              <th>Código de Almacén</th>
              <th>Nombre del Local</th>
              <th>Acciones</th> 
            </tr>
          </thead>
          <tbody>
            {almacenes.map((almacen, index) => (
              <tr key={index}>
                <td>{almacen.nombre_tipo_almacen}</td>
                <td>{almacen.cod_almacen}</td>
                <td>{almacen.nombre_local}</td>
                <td>
                  <input
                    type="radio"
                    name="almacen"
                    value={almacen.cod_almacen}
                    checked={almacenSeleccionado === almacen.cod_almacen}
                    onChange={() => handleSeleccionar(almacen)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Botones para iniciar y terminar ingreso */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button type="button" onClick={handleIngreso} style={{ marginRight: "10px" }}>
          Iniciar ingreso a almacén
        </button>
        <button type="button" onClick={handleTerminarIngreso}>
          Terminar ingreso a almacén
        </button>
        <button onClick={() => navigate("/modulo5/ingresoinicio")}>Ingresar otro insumo</button>



      </div>
    </div>
  );
}

export default IngresoAlmacen;
