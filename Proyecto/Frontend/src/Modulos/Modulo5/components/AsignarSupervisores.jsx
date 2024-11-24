import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { EmpleadoContext } from "../context/EmpleadoContext"; // Importamos el contexto
import { OrdenContext } from "../context/OrdenContext"; // Importamos el contexto de Orden
import { fetchSupervisores, crearRevision, actualizarProceso } from "../Service"; // Importamos la función actualizada
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate

const AsignarSupervisores = () => {
  const { empleado } = useContext(EmpleadoContext); // Usamos el contexto para obtener el código del empleado
  const { ordenSeleccionada } = useContext(OrdenContext); // Usamos el contexto para obtener el código de la orden
  const [supervisores, setSupervisores] = useState([]);
  const [error, setError] = useState(null);
  const [codSupCantidad, setCodSupCantidad] = useState(null);
  const [codSupCalidad, setCodSupCalidad] = useState(null);

  const navigate = useNavigate(); // Definimos la función navigate para redirigir

  // Usamos useEffect para hacer la solicitud al backend solo si empleado tiene valor
  useEffect(() => {
    if (empleado) {
      const fetchSupervisoresData = async () => {
        try {
          const data = await fetchSupervisores(empleado); // Usamos el código de empleado obtenido del contexto
          setSupervisores(data); // Guardamos los supervisores obtenidos
        } catch (err) {
          setError("No se pudo cargar los supervisores.");
          console.error(err);
        }
      };

      fetchSupervisoresData();
    }
  }, [empleado]); // Dependemos de empleado para hacer la llamada solo cuando cambia

  const handleRevisiónClick = async () => {
    if (!codSupCantidad || !codSupCalidad || !ordenSeleccionada) {
      setError("Por favor, seleccione supervisores para ambas revisiones y asegúrese de que la orden esté seleccionada.");
      return;
    }

    try {
      // Primero, actualizar el proceso de la orden a la etapa deseada (por ejemplo, 2)
      const codProceso = 2; // Etapa del proceso
      const responseProceso = await actualizarProceso(ordenSeleccionada, codProceso);

      if (responseProceso.message) {
        console.log("Proceso actualizado exitosamente:", responseProceso.message);

        // Luego, crear la revisión
        const responseRevision = await crearRevision(ordenSeleccionada, codSupCantidad, codSupCalidad);
        console.log("Revisión creada exitosamente:", responseRevision);

        // Redirigir a la página de RevisionCantidad
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
    <div>
      <h2>Asignar Supervisores</h2>
      {error && <p>{error}</p>}

      <div>
        <h3>Revisión de cantidad:</h3>
        <table>
          <thead>
            <tr>
              <th>Código empleado</th>
              <th>Nombre empleado</th>
              <th>Seleccionar</th>
            </tr>
          </thead>
          <tbody>
            {supervisores.length > 0 ? (
              supervisores.map((supervisor) => (
                <tr key={supervisor.codigo_empleado}>
                  <td>{supervisor.codigo_empleado}</td>
                  <td>{supervisor.Nombre}</td>
                  <td>
                    <input
                      type="radio"
                      name="revisiónCantidad"
                      value={supervisor.codigo_empleado}
                      onChange={() => setCodSupCantidad(supervisor.codigo_empleado)}
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

      <div>
        <h3>Revisión de calidad:</h3>
        <table>
          <thead>
            <tr>
              <th>Código empleado</th>
              <th>Nombre empleado</th>
              <th>Seleccionar</th>
            </tr>
          </thead>
          <tbody>
            {supervisores.length > 0 ? (
              supervisores.map((supervisor) => (
                <tr key={supervisor.codigo_empleado}>
                  <td>{supervisor.codigo_empleado}</td>
                  <td>{supervisor.Nombre}</td>
                  <td>
                    <input
                      type="radio"
                      name="revisiónCalidad"
                      value={supervisor.codigo_empleado}
                      onChange={() => setCodSupCalidad(supervisor.codigo_empleado)}
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

      {/* Botón Iniciar Revisión */}
      <div>
        <button onClick={handleRevisiónClick}>Iniciar Revisión</button>
      </div>
    </div>
  );
};

export default AsignarSupervisores;
