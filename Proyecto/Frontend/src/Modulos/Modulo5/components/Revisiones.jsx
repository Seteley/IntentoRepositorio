import React, { useState, useEffect } from "react";
import { useOrden } from "../context/OrdenContext";
import { fetchDetallesRevision, actualizarProceso } from "../Service";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Revisiones.module.css";

function Revisiones() {
  const { ordenSeleccionada, isLoading: loadingOrden } = useOrden();
  const [detallesRevision, setDetallesRevision] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const obtenerDetalles = async () => {
      if (!ordenSeleccionada) return;
      setLoading(true);
      try {
        const response = await fetchDetallesRevision(ordenSeleccionada);
        setDetallesRevision(response.detalles || []);
      } catch (err) {
        setError("Error al obtener los detalles de la revisión.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    obtenerDetalles();
  }, [ordenSeleccionada]);

  const actualizarCodProceso = async (codProceso) => {
    if (!ordenSeleccionada) return;

    setLoading(true);
    try {
      await actualizarProceso(ordenSeleccionada, codProceso);
      alert(
        codProceso === 5
          ? "Pedido aceptado."
          : "Pedido rechazado."
      );
      if (codProceso === 5) navigate("/modulo5/ingresoinicio");
    } catch (err) {
      console.error("Error al actualizar el proceso:", err);
      alert("Hubo un error al procesar la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingOrden) return <p className={styles.noContentMessage}>Cargando orden...</p>;
  if (!ordenSeleccionada) return <p className={styles.noContentMessage}>No hay una orden seleccionada.</p>;
  if (loading) return <p className={styles.noContentMessage}>Cargando detalles de la revisión...</p>;
  if (error) return <p className={styles.errorMessage}>{error}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Detalles de Revisión</h1>
      {detallesRevision.length === 0 ? (
        <p className={styles.noContentMessage}>No se encontraron detalles de revisión para esta orden de compra.</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead className={styles.tableHead}>
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
        </div>
      )}

      <div className={styles.buttonContainer}>
        <button
          className={`${styles.button} ${styles.acceptButton}`}
          onClick={() => actualizarCodProceso(5)}
          disabled={loading}
        >
          {loading ? "Procesando..." : "Aceptar pedido"}
        </button>
        <button
          className={`${styles.button} ${styles.rejectButton}`}
          onClick={() => actualizarCodProceso(6)}
          disabled={loading}
        >
          {loading ? "Procesando..." : "Rechazar pedido"}
        </button>
      </div>
    </div>
  );
}

export default Revisiones;

