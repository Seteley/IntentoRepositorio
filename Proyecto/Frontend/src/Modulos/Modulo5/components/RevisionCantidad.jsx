import React, { useEffect, useState } from 'react';
import { useOrden } from '../context/OrdenContext'; // Importa el contexto
import { fetchCantidades, actualizarCantidadRecibida, actualizarProceso, fetchActualizarRevisionCantidad  } from '../Service'; // Importa funciones de servicio
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

const RevisionCantidad = () => {
  const { ordenSeleccionada } = useOrden(); // Obtiene la orden seleccionada del contexto
  const [cantidades, setCantidades] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Usamos useNavigate

  useEffect(() => {
    // Espera a que ordenSeleccionada se defina antes de continuar
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
      // Actualiza las cantidades recibidas
      for (const item of cantidades) {
        await actualizarCantidadRecibida(
          ordenSeleccionada,
          item.cod_insumo,
          item.cantidad_recibida
        );
      }
  
      // Actualiza el proceso a 3
      await actualizarProceso(ordenSeleccionada, 3);
  
      // Actualiza la fecha y hora de cantidad
      await fetchActualizarRevisionCantidad(ordenSeleccionada);
  
      alert("Revisión finalizada correctamente y proceso actualizado.");
    } catch (error) {
      alert("Error al finalizar la revisión. Por favor, inténtalo de nuevo.");
      console.error(error);
    }
  };
  

  // Manejamos diferentes estados de carga
  if (loading) return <p>Cargando datos...</p>;
  if (!ordenSeleccionada) return <p>No se ha seleccionado ninguna orden de compra.</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Revisión de Cantidades</h1>
      {cantidades.length === 0 ? (
        <p>No se encontraron insumos para la orden de compra.</p>
      ) : (
        <div>
          <table>
            <thead>
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
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleTerminarRevision}>Terminar Revisión</button>
          <button onClick={() => navigate("/modulo5/revisioncalidad")}>Iniciar revisión calidad</button>
        </div>
      )}
    </div>
  );
};

export default RevisionCantidad;
