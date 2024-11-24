import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; // Hook para la navegación
import { fetchOrdenesMismoDia } from "../Service"; // Función del servicio
import { useOrden } from "../context/OrdenContext"; // Contexto de orden
import { EmpleadoContext } from "../context/EmpleadoContext"; // Contexto del empleado

const OrdenMismoDia = () => {
  const { empleado } = useContext(EmpleadoContext); // Obtener el código de empleado del contexto
  const [ordenes, setOrdenes] = useState([]); // Estado para las órdenes
  const [error, setError] = useState(null); // Estado de error
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null); // Orden seleccionada
  const { selectOrden } = useOrden(); // Contexto para manejar la selección de órdenes
  const navigate = useNavigate(); // Hook de navegación

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchOrdenesMismoDia(empleado); // Llama al servicio con el empleado
        setOrdenes(data.ordenes); // Guarda las órdenes
      } catch (err) {
        setError("No se pudieron cargar las órdenes de compra.");
        console.error(err);
      }
    };

    if (empleado) {
      fetchData(); // Cargar datos solo si hay un empleado
    }
  }, [empleado]); // Ejecutar cuando el empleado cambie

  // Manejo de la selección de órdenes
  const handleSeleccionarOrden = () => {
    if (ordenSeleccionada) {
      selectOrden(ordenSeleccionada); // Guardar en el contexto
      navigate(`/modulo5/contenidoorden`); // Redirigir
    } else {
      alert("Por favor, selecciona una orden.");
    }
  };

  return (
    <div>
      <h2>Órdenes de Compra del Mismo Día</h2>
      {error && <p>{error}</p>}
      {!error && ordenes.length === 0 && <p>No se encontraron órdenes de compra.</p>}
      {!error && ordenes.length > 0 && (
        <>
          <table>
            <thead>
              <tr>
                <th>Código Orden</th>
                <th>Proveedor</th>
                <th>Etapa</th>
                <th>Seleccionar</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map((orden) => (
                <tr key={orden.cod_ordencompra}>
                  <td>{orden.cod_ordencompra}</td>
                  <td>{orden.nombre_empresa}</td>
                  <td>{orden.nombre_proceso}</td>
                  <td>
                    <input
                      type="radio"
                      name="ordenSeleccionada"
                      value={orden.cod_ordencompra}
                      onChange={() => setOrdenSeleccionada(orden.cod_ordencompra)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <button onClick={handleSeleccionarOrden}>Seleccionar orden</button>
            <button onClick={() => navigate("/modulo5/inicio")}>Volver al módulo</button>
          </div>
        </>
      )}
    </div>
  );
};

export default OrdenMismoDia;
