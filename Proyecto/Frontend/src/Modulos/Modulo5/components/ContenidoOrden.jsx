import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrden } from "../context/OrdenContext"; // Importamos el hook del contexto
import { fetchContenidoOrden } from "../Service"; // Importamos la función desde service.js

const ContenidoOrden = () => {
  const { ordenSeleccionada, isLoading } = useOrden(); // Obtener el código de la orden desde el contexto
  const [contenido, setContenido] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContenido = async () => {
      try {
        if (ordenSeleccionada) {
          const data = await fetchContenidoOrden(ordenSeleccionada); // Llama a la función pasando el código de la orden desde el contexto
          setContenido(data); // Guarda el contenido en el estado
        }
      } catch (err) {
        setError("No se pudo cargar el contenido de la orden.");
        console.error(err);
      }
    };

    if (ordenSeleccionada) {
      fetchContenido();
    }
  }, [ordenSeleccionada]); // Vuelve a ejecutarse si cambia la orden seleccionada

  if (isLoading) {
    return <p>Cargando...</p>; // Mientras se está cargando el estado
  }

  return (
    <div>
      <h2>Contenido de la Orden de Compra</h2>
      {error && <p>{error}</p>}
      {!error && contenido.length === 0 && <p>No hay contenido en esta orden.</p>}
      {!error && contenido.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Insumo</th>
              <th>Unidad</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {contenido.map((item, index) => (
              <tr key={index}>
                <td>{item.nombre_insumo}</td>
                <td>{item.nombre_unidad}</td>
                <td>{item.cantidad_compra}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div>
        <button onClick={() => navigate("/modulo5/inicio")}>Volver al módulo</button>
        <button onClick={() => navigate("/modulo5/asignarsupervisores")}>Asignar supervisores</button>
      </div>
    </div>
  );
};

export default ContenidoOrden;
