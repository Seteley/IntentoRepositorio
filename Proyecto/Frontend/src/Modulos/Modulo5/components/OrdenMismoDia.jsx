import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { fetchOrdenesMismoDia } from "../Service";
import { useOrden } from "../context/OrdenContext";
import { EmpleadoContext } from "../context/EmpleadoContext";
import { ArrowLeft } from 'lucide-react';
import "../styles/OrdenMismoDia.css";

const OrdenMismoDia = () => {
  const { empleado } = useContext(EmpleadoContext);
  const [ordenes, setOrdenes] = useState([]);
  const [error, setError] = useState(null);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const { selectOrden } = useOrden();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchOrdenesMismoDia(empleado);
        setOrdenes(data.ordenes);
      } catch (err) {
        setError("No se pudieron cargar las órdenes de compra.");
        console.error(err);
      }
    };

    if (empleado) {
      fetchData();
    }
  }, [empleado]);

  const handleSeleccionarOrden = () => {
    if (ordenSeleccionada) {
      selectOrden(ordenSeleccionada);
      navigate(`/modulo5/contenidoorden`);
    } else {
      alert("Por favor, selecciona una orden.");
    }
  };

  return (
    <div className="orden-mismo-dia-container">
      <h2>Seleccione la orden de compra</h2>
      {error && <p className="error-message">{error}</p>}
      {!error && ordenes.length === 0 && <p className="no-orders-message">No se encontraron órdenes de compra.</p>}
      {!error && ordenes.length > 0 && (
        <>
          <div className="table-container">
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
                  <tr 
                    key={orden.cod_ordencompra}
                    className={ordenSeleccionada === orden.cod_ordencompra ? 'selected-row' : ''}
                  >
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
          </div>
          <div className="button-container">
            <button className="select-button" onClick={handleSeleccionarOrden}>Seleccionar orden</button>
            <button className="back-button" onClick={() => navigate("/modulo5/inicio")}>
              <ArrowLeft className="icon" />
              Volver al módulo
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default OrdenMismoDia;

