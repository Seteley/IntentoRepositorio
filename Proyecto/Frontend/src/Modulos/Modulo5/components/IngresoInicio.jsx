import React, { useState, useEffect, useContext } from 'react';
import { useOrden } from '../context/OrdenContext';
import { fetchCondicionesIngreso } from '../Service';
import { InsumoContext } from '../context/InsumoContext';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/IngresoInicio.module.css';

function IngresoInicio() {
  const { ordenSeleccionada, isLoading: loadingOrden } = useOrden();
  const { insumoSeleccionado, setInsumoSeleccionado } = useContext(InsumoContext);
  const [condiciones, setCondiciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [insumosAgregados, setInsumosAgregados] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const insumosGuardados = JSON.parse(localStorage.getItem('insumosAgregados')) || [];
    setInsumosAgregados(insumosGuardados);
  }, []);

  const obtenerCondiciones = async () => {
    if (!ordenSeleccionada) {
      setError('Por favor seleccione una orden de compra');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const condicionesData = await fetchCondicionesIngreso(ordenSeleccionada);

      if (condicionesData.length === 0) {
        setError('No se encontraron detalles para esta orden de compra');
      } else {
        setCondiciones(condicionesData);
      }
    } catch (err) {
      setError('Error al obtener las condiciones.');
    } finally {
      setLoading(false);
    }
  };

  const manejarAgregarInsumo = (codInsumo) => {
    setInsumoSeleccionado(codInsumo);
    alert(`Insumo con código ${codInsumo} agregado.`);

    const nuevosInsumos = [...insumosAgregados, codInsumo];
    setInsumosAgregados(nuevosInsumos);
    localStorage.setItem('insumosAgregados', JSON.stringify(nuevosInsumos));

    navigate('/modulo5/ingresoalmacen');
  };

  useEffect(() => {
    if (ordenSeleccionada) {
      obtenerCondiciones();
    }
  }, [ordenSeleccionada]);

  if (loadingOrden) return <p className={styles.loadingMessage}>Cargando orden...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Condiciones de Ingreso</h1>

      {!ordenSeleccionada && <p className={styles.noOrdersMessage}>No hay una orden seleccionada.</p>}

      {error && <p className={styles.errorMessage}>{error}</p>}

      {loading && <p className={styles.loadingMessage}>Cargando condiciones...</p>}

      {condiciones.length > 0 && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr>
                <th>Código Insumo</th>
                <th>Nombre Insumo</th>
                <th>Cantidad Revisada</th>
                <th>Condiciones</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {condiciones.map((condicion, index) => (
                <tr key={index}>
                  <td>{condicion.cod_insumo}</td>
                  <td>{condicion.nombre_insumo}</td>
                  <td>{condicion.cantidad_recibida}</td>
                  <td>{condicion.nombre_condiciones}</td>
                  <td>
                    <button
                      className={styles.addButton}
                      onClick={() => manejarAgregarInsumo(condicion.cod_insumo)}
                      disabled={insumosAgregados.includes(condicion.cod_insumo)}
                    >
                      {insumosAgregados.includes(condicion.cod_insumo) ? 'Agregado' : 'Agregar Insumo'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default IngresoInicio;

