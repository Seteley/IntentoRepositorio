import React, { useState, useEffect, useContext } from "react";
import { EmpleadoContext } from "../context/EmpleadoContext";
import { OrdenContext } from "../context/OrdenContext";
import { fetchSupervisores, crearRevision, actualizarProceso } from "../Service";
import { useNavigate } from 'react-router-dom';
import styles from "../styles/AsignarSupervisores.module.css";

const AsignarSupervisores = () => {
  const { empleado } = useContext(EmpleadoContext);
  const { ordenSeleccionada } = useContext(OrdenContext);
  const [supervisores, setSupervisores] = useState([]);
  const [error, setError] = useState(null);
  const [codSupCantidad, setCodSupCantidad] = useState(null);
  const [codSupCalidad, setCodSupCalidad] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (empleado) {
      const fetchSupervisoresData = async () => {
        try {
          const data = await fetchSupervisores(empleado);
          setSupervisores(data);
        } catch (err) {
          setError("No se pudo cargar los supervisores.");
          console.error(err);
        }
      };

      fetchSupervisoresData();
    }
  }, [empleado]);

  const handleRevisiónClick = async () => {
    if (!codSupCantidad || !codSupCalidad || !ordenSeleccionada) {
      setError("Por favor, seleccione supervisores para ambas revisiones y asegúrese de que la orden esté seleccionada.");
      return;
    }

    try {
      const codProceso = 2;
      const responseProceso = await actualizarProceso(ordenSeleccionada, codProceso);

      if (responseProceso.message) {
        console.log("Proceso actualizado exitosamente:", responseProceso.message);

        const responseRevision = await crearRevision(ordenSeleccionada, codSupCantidad, codSupCalidad);
        console.log("Revisión creada exitosamente:", responseRevision);

        navigate('/modulo5/revisioncantidad');
      } else {
        setError("No se pudo actualizar el proceso de la orden.");
      }
    } catch (error) {
      console.error("Error al crear la revisión:", error);
      setError("Ocurrió un error al iniciar la revisión.");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Asignar Supervisores</h2>
      {error && <p className={styles.errorMessage}>{error}</p>}

      <div>
        <h3 className={styles.subtitle}>Revisión de cantidad:</h3>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr>
                <th>Código empleado</th>
                <th>Nombre empleado</th>
                <th>Seleccionar</th>
              </tr>
            </thead>
            <tbody>
              {supervisores.length > 0 ? (
                supervisores.map((supervisor) => (
                  <tr key={supervisor.codigo_empleado} className={codSupCantidad === supervisor.codigo_empleado ? styles.selectedRow : ''}>
                    <td>{supervisor.codigo_empleado}</td>
                    <td>{supervisor.Nombre}</td>
                    <td>
                      <input
                        type="radio"
                        name="revisiónCantidad"
                        value={supervisor.codigo_empleado}
                        onChange={() => setCodSupCantidad(supervisor.codigo_empleado)}
                        className={styles.radioInput}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No hay supervisores disponibles.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className={styles.subtitle}>Revisión de calidad:</h3>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr>
                <th>Código empleado</th>
                <th>Nombre empleado</th>
                <th>Seleccionar</th>
              </tr>
            </thead>
            <tbody>
              {supervisores.length > 0 ? (
                supervisores.map((supervisor) => (
                  <tr key={supervisor.codigo_empleado} className={codSupCalidad === supervisor.codigo_empleado ? styles.selectedRow : ''}>
                    <td>{supervisor.codigo_empleado}</td>
                    <td>{supervisor.Nombre}</td>
                    <td>
                      <input
                        type="radio"
                        name="revisiónCalidad"
                        value={supervisor.codigo_empleado}
                        onChange={() => setCodSupCalidad(supervisor.codigo_empleado)}
                        className={styles.radioInput}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No hay supervisores disponibles.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={handleRevisiónClick}>Iniciar Revisión</button>
      </div>
    </div>
  );
};

export default AsignarSupervisores;

