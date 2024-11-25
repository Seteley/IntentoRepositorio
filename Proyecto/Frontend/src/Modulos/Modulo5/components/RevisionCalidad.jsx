import React, { useState, useEffect } from "react";
import { fetchCalidades, fetchValoresCalidad, actualizarRevision, actualizarProceso, fetchActualizarRevisionCalidad } from "../Service"; // Importar la nueva función fetchActualizarRevisionCalidad
import { useOrden } from "../context/OrdenContext"; 
import { useNavigate } from 'react-router-dom'; 

function RevisionCalidad() {
  const { ordenSeleccionada, isLoading: loadingOrden } = useOrden();
  const [calidades, setCalidades] = useState([]);
  const [valoresCalidad, setValoresCalidad] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const getCalidades = async () => {
      if (!ordenSeleccionada) return;
      setLoading(true);
      try {
        const response = await fetchCalidades(ordenSeleccionada);
        setCalidades(response.calidades || []);
      } catch (err) {
        setError("Error al obtener las calidades.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getCalidades();
  }, [ordenSeleccionada]);

  useEffect(() => {
    const getValoresCalidad = async () => {
      try {
        const response = await fetchValoresCalidad();
        setValoresCalidad(response.valores_calidad || []);
      } catch (err) {
        console.error("Error al obtener los valores de calidad:", err);
      }
    };

    getValoresCalidad();
  }, []);

  const handleEditableChange = (index, value) => {
    const updatedCalidades = [...calidades];
    updatedCalidades[index].comentario = value;
    setCalidades(updatedCalidades);
  };

  const handleTerminarRevision = async () => {
    if (!ordenSeleccionada) {
      alert("No hay una orden seleccionada.");
      return;
    }

    setLoading(true);
    try {
      for (let i = 0; i < calidades.length; i++) {
        const calidad = calidades[i];
        const estadoCalidad = calidad.estado_calidad;
        const descripcion = calidad.comentario || "";

        const response = await actualizarRevision(
          ordenSeleccionada,
          calidad.cod_insumo,
          estadoCalidad,
          descripcion
        );

        if (!response || response.filas_afectadas === 0) {
          console.error(`No se pudo actualizar la revisión para el insumo ${calidad.cod_insumo}`);
        }
      }

      // Actualizar el proceso a 4
      await actualizarProceso(ordenSeleccionada, 4);

      // Aquí llamamos a la función que se encargará de actualizar la fecha y hora de calidad
      const resultado = await fetchActualizarRevisionCalidad(ordenSeleccionada);
      console.log(resultado); // Si quieres ver el mensaje en consola

      alert("Revisión terminada y proceso actualizado.");
    } catch (err) {
      console.error("Error al actualizar la revisión:", err);
      alert("Hubo un error al terminar la revisión.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingOrden) return <p>Cargando orden...</p>;
  if (!ordenSeleccionada) return <p>No hay una orden seleccionada.</p>;
  if (loading) return <p>Cargando datos de calidad...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Revisión de Calidad</h1>
      {calidades.length === 0 ? (
        <p>No se encontraron datos de calidad para esta orden de compra.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Código Insumo</th>
              <th>Nombre Insumo</th>
              <th>Acción</th>
              <th>Comentario</th>
            </tr>
          </thead>
          <tbody>
            {calidades.map((calidad, index) => (
              <tr key={index}>
                <td>{calidad.cod_insumo}</td>
                <td>{calidad.nombre_insumo}</td>
                <td>
                  <select
                    value={calidad.estado_calidad || ""}
                    onChange={(e) => {
                      const updatedCalidades = [...calidades];
                      updatedCalidades[index].estado_calidad = e.target.value;
                      setCalidades(updatedCalidades);
                    }}
                  >
                    <option value="">Seleccionar...</option>
                    {valoresCalidad.map((valor, idx) => (
                      <option key={idx} value={valor.estado}>
                        {valor.estado}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    value={calidad.comentario || ""}
                    onChange={(e) => handleEditableChange(index, e.target.value)}
                    placeholder="Añadir comentario"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button onClick={handleTerminarRevision} disabled={loading}>
        {loading ? "Cargando..." : "Terminar revisión"}
      </button>
      <button onClick={() => navigate("/modulo5/revisiones")}>Ver revisiones</button>
    </div>
  );
}

export default RevisionCalidad;
