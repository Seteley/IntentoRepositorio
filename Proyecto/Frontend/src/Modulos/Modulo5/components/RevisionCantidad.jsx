import React, { useEffect, useState } from 'react';
import { useOrden } from '../context/OrdenContext';
import { fetchCantidades, actualizarCantidadRecibida, actualizarProceso, fetchActualizarRevisionCantidad } from '../Service';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/RevisionCantidad.module.css';

const RevisionCantidad = () => {
  const { ordenSeleccionada } = useOrden();
  const [cantidades, setCantidades] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (ordenSeleccionada === null) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const data = await fetchCantidades(ordenSeleccionada);
        setCantidades(data.cantidades || []);
      } catch (err) {
        setError('Error al obtener las cantidades.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ordenSeleccionada]);

  const handleCantidadChange = (index, event) => {
    const updatedCantidades = [...cantidades];
    updatedCantidades[index].cantidad_recibida = event.target.value;
    setCantidades(updatedCantidades);
  };

  const handleTerminarRevision = async () => {
    try {
      for (const item of cantidades) {
        await actualizarCantidadRecibida(
          ordenSeleccionada,
          item.cod_insumo,
          item.cantidad_recibida
        );
      }
  
      await actualizarProceso(ordenSeleccionada, 3);
      await fetchActualizarRevisionCantidad(ordenSeleccionada);
  
      alert("Revisión finalizada correctamente y proceso actualizado.");
    } catch (error) {
      alert("Error al finalizar la revisión. Por favor, inténtalo de nuevo.");
      console.error(error);
    }
  };

  if (loading) return <p className={styles.noOrdersMessage}>Cargando datos...</p>;
  if (!ordenSeleccionada) return <p className={styles.noOrdersMessage}>No se ha seleccionado ninguna orden de compra.</p>;
  if (error) return <p className={styles.errorMessage}>{error}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Revisión de Cantidades</h1>
      {cantidades.length === 0 ? (
        <p className={styles.noOrdersMessage}>No se encontraron insumos para la orden de compra.</p>
      ) : (
        <div>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead className={styles.tableHead}>
                <tr>
                  <th>Código Insumo</th>
                  <th>Nombre Insumo</th>
                  <th>Unidad de Medida</th>
                  <th>Cantidad</th>
                  <th>Cantidad Recibida</th>
                </tr>
              </thead>
              <tbody>
                {cantidades.map((item, index) => (
                  <tr key={index}>
                    <td>{item.cod_insumo}</td>
                    <td>{item.nombre_insumo}</td>
                    <td>{item.nombre_unidad}</td>
                    <td>{item.cantidad_compra}</td>
                    <td>
                      <input
                        type="number"
                        value={item.cantidad_recibida || ''}
                        onChange={(e) => handleCantidadChange(index, e)}
                        min="0"
                        className={styles.inputNumber}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.buttonContainer}>
            <button className={styles.button} onClick={handleTerminarRevision}>Terminar Revisión</button>
            <button className={`${styles.button} ${styles.nextButton}`} onClick={() => navigate("/modulo5/revisioncalidad")}>Iniciar revisión calidad</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RevisionCantidad;

