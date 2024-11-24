import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Importa useNavigate para la navegación
import { fetchOrdenesMismoDia } from "../Service"; // Importar la función del archivo Service.js
import { useOrden } from "../context/OrdenContext"; // Importar el hook useOrden para acceder al contexto

const OrdenMismoDia = () => {
  const { codigoEmpleado } = useParams(); // Obtener el código del empleado desde la URL
  const [ordenes, setOrdenes] = useState([]); // Estado para guardar las órdenes
  const [error, setError] = useState(null); // Estado para manejar errores
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null); // Estado para guardar la orden seleccionada temporalmente
  const { selectOrden } = useOrden(); // Obtener la función selectOrden del contexto
  const navigate = useNavigate(); // Hook para la navegación

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchOrdenesMismoDia(codigoEmpleado); // Llamar a la función del servicio
        setOrdenes(data.ordenes); // Guardar las órdenes en el estado
      } catch (err) {
        setError("No se pudieron cargar las órdenes de compra.");
        console.error(err);
      }
    };

    fetchData();
  }, [codigoEmpleado]); // Ejecutar cuando cambia el parámetro

  // Función para manejar la selección de orden
  const handleSeleccionarOrden = () => {
    if (ordenSeleccionada) {
      selectOrden(ordenSeleccionada); // Usar selectOrden del contexto para guardar la orden seleccionada
      navigate(`/modulo5/contenidoorden/${ordenSeleccionada}`); // Redirige con el código de la orden
    } else {
      alert("Por favor, selecciona una orden.");
    }
  };

  return (
    <div>
      <h2>Órdenes de Compra del Mismo Día</h2>
      {error && <p>{error}</p>}
      {!error && ordenes.length === 0 && (
        <p>No se encontraron órdenes de compra.</p>
      )}
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
                      name="ordenSeleccionada" // Misma propiedad name para seleccionar solo uno
                      value={orden.cod_ordencompra}
                      onChange={() => setOrdenSeleccionada(orden.cod_ordencompra)} // Actualiza el estado con la orden seleccionada
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            {/* Botón para seleccionar la orden */}
            <button onClick={handleSeleccionarOrden}>Seleccionar orden</button>
            {/* Botón para volver al módulo */}
            <button onClick={() => navigate("/modulo5/inicio")}>Volver al módulo</button>
          </div>
        </>
      )}
    </div>
  );
};

export default OrdenMismoDia;
