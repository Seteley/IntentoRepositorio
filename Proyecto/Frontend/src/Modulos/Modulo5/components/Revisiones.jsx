import React, { useState, useEffect } from "react";
import { useOrden } from "../context/OrdenContext"; // Importamos el hook del contexto
import { fetchDetallesRevision } from "../Service"; // Importamos la nueva función de servicio
import { useNavigate } from 'react-router-dom'; // Importar useNavigate

function Revisiones() {
  const { ordenSeleccionada, isLoading: loadingOrden } = useOrden();
  const [detallesRevision, setDetallesRevision] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Usar useNavigate para redirigir
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerDetalles = async () => {
      if (!ordenSeleccionada) return; // Si no hay orden seleccionada, no hacemos nada
      setLoading(true);
      try {
        const response = await fetchDetallesRevision(ordenSeleccionada);
        setDetallesRevision(response.detalles || []); // Guardamos los detalles en el estado
      } catch (err) {
        setError("Error al obtener los detalles de la revisión.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    obtenerDetalles();
  }, [ordenSeleccionada]);

  if (loadingOrden) return <p>Cargando orden...</p>;
  if (!ordenSeleccionada) return <p>No hay una orden seleccionada.</p>;
  if (loading) return <p>Cargando detalles de la revisión...</p>;
  if (error) return <p>{error}</p>;

  const handleAceptarPedido = () => {
    // Lógica para aceptar el pedido
    alert("Pedido aceptado.");
    navigate("/modulo5/ingresoinicio"); // Redirigir a la página deseada
  };

  const handleRechazarPedido = () => {
    // Lógica para rechazar el pedido
    alert("Pedido rechazado.");
  };

  return (
    <div>
      <h1>Detalles de Revisión</h1>
      {detallesRevision.length === 0 ? (
        <p>No se encontraron detalles de revisión para esta orden de compra.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Código Insumo</th>
              <th>Nombre Insumo</th>
              <th>Cantidad Compra</th>
              <th>Cantidad Recibida</th>
              <th>Estado Calidad</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {detallesRevision.map((detalle, index) => (
              <tr key={index}>
                <td>{detalle.cod_insumo}</td>
                <td>{detalle.nombre_insumo}</td>
                <td>{detalle.cantidad_compra}</td>
                <td>{detalle.cantidad_recibida}</td>
                <td>{detalle.estado}</td>
                <td>{detalle.descripcion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Botones de aceptar y rechazar pedido */}
      <div>
        <button onClick={handleAceptarPedido}>Aceptar pedido</button>
        <button onClick={handleRechazarPedido}>Rechazar pedido</button>
      </div>
    </div>
  );
}

export default Revisiones;
