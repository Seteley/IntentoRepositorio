import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EmpleadoContext } from "../context/EmpleadoContext";
import { InsumoContext } from "../context/InsumoContext";
import { OrdenContext } from "../context/OrdenContext"; 
import { fetchAlmacenes, fetchIngresarStock, fetchInsertarMovimiento, fetchActualizarFinIngreso } from "../Service";
import styles from "../styles/IngresoAlmacen.module.css";

function IngresoAlmacen() {
  const { empleado } = useContext(EmpleadoContext);
  const { insumoSeleccionado } = useContext(InsumoContext);
  const { ordenSeleccionada } = useContext(OrdenContext);
  const [almacenes, setAlmacenes] = useState([]);
  const [error, setError] = useState(null);
  const [almacenSeleccionado, setAlmacenSeleccionado] = useState(null);
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [ingresoIniciado, setIngresoIniciado] = useState(false);
  const navigate = useNavigate();

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

    if (empleado && insumoSeleccionado) {
      fetchData();
    }
  }, [empleado, insumoSeleccionado]);

  const fechaMinima = new Date();
  fechaMinima.setDate(fechaMinima.getDate() + 1);
  const fechaMinimaISO = fechaMinima.toISOString().split("T")[0];

  const handleSeleccionar = (almacen) => {
    setAlmacenSeleccionado(almacen.cod_almacen);
  };

  const handleIngreso = async () => {
    if (!fechaVencimiento || !almacenSeleccionado || !insumoSeleccionado || !ordenSeleccionada) {
      setError("Todos los campos deben ser seleccionados.");
      return;
    }

    try {
      const mensajeStock = await fetchIngresarStock(
        fechaVencimiento, 
        insumoSeleccionado, 
        ordenSeleccionada, 
        almacenSeleccionado
      );
      alert(mensajeStock);

      setIngresoIniciado(true);

      if (!ordenSeleccionada || !insumoSeleccionado || !empleado) {
        setError("Error: Faltan datos necesarios para el ingreso.");
        return;
      }

      const mensajeMovimiento = await fetchInsertarMovimiento(
        ordenSeleccionada, 
        insumoSeleccionado, 
        empleado
      );
      alert(mensajeMovimiento);

    } catch (err) {
      setError(`Error en el proceso de ingreso: ${err.message}`);
    }
  };

  const handleTerminarIngreso = async () => {
    if (!ingresoIniciado) {
      alert("Por favor, inicia el ingreso al almacén antes de terminarlo.");
      return;
    }
  
    try {
      const mensaje = await fetchActualizarFinIngreso();
      alert(mensaje);
      setIngresoIniciado(false);
    } catch (err) {
      setError(`Error al finalizar el ingreso: ${err.message}`);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Ingreso de Insumos al Almacén</h1>

      <form className={styles.form}>
        <label>
          Fecha de vencimiento:{" "}
          <input
            type="date"
            min={fechaMinimaISO}
            required
            value={fechaVencimiento}
            onChange={(e) => setFechaVencimiento(e.target.value)}
            className={styles.dateInput}
          />
        </label>
      </form>

      {error && <p className={styles.errorMessage}>Error: {error}</p>}

      {!error && almacenes.length === 0 && (
        <p className={styles.noDataMessage}>No se encontraron almacenes compatibles.</p>
      )}

      {almacenes.length > 0 && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead className={styles.tableHead}>
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
                      className={styles.radioInput}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className={styles.buttonContainer}>
        <button 
          type="button" 
          onClick={handleIngreso}
          className={`${styles.button} ${styles.startButton}`}
          disabled={ingresoIniciado}
        >
          Iniciar ingreso a almacén
        </button>

        <button 
          type="button" 
          onClick={handleTerminarIngreso}
          className={`${styles.button} ${styles.endButton}`}
          disabled={!ingresoIniciado}
        >
          Terminar ingreso a almacén
        </button>

        <button 
          onClick={() => navigate("/modulo5/ingresoinicio")}
          className={styles.button}
        >
          Ingresar otro insumo
        </button>
      </div>
    </div>
  );
}

export default IngresoAlmacen;

