import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrden } from "../context/OrdenContext";
import { fetchContenidoOrden } from "../Service";
import styles from "../styles/ContenidoOrden.module.css";

const ContenidoOrden = () => {
  const { ordenSeleccionada, isLoading } = useOrden();
  const [contenido, setContenido] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContenido = async () => {
      try {
        if (ordenSeleccionada) {
          const data = await fetchContenidoOrden(ordenSeleccionada);
          setContenido(data);
        }
      } catch (err) {
        setError("No se pudo cargar el contenido de la orden.");
        console.error(err);
      }
    };

    if (ordenSeleccionada) {
      fetchContenido();
    }
  }, [ordenSeleccionada]);

  if (isLoading) {
    return <p className={styles.noContentMessage}>Cargando...</p>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Contenido de la Orden de Compra</h2>
      {error && <p className={styles.errorMessage}>{error}</p>}
      {!error && contenido.length === 0 && <p className={styles.noContentMessage}>No hay contenido en esta orden.</p>}
      {!error && contenido.length > 0 && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead className={styles.tableHead}>
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
        </div>
      )}
      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={() => navigate("/modulo5/inicio")}>Volver al módulo</button>
        <button className={`${styles.button} ${styles.assignButton}`} onClick={() => navigate("/modulo5/asignarsupervisores")}>Asignar supervisores</button>
      </div>
    </div>
  );
};

export default ContenidoOrden;

