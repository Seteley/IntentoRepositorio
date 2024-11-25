import React, { useState, useEffect, useContext } from 'react';
import { useOrden } from '../context/OrdenContext'; // Importar el hook del contexto de la orden
import { fetchCondicionesIngreso } from '../Service'; // Importar la función del servicio
import { InsumoContext } from '../context/InsumoContext'; // Importar el contexto de Insumo
import { useNavigate } from 'react-router-dom'; // Importar useNavigate

function IngresoInicio() {
  const { ordenSeleccionada, isLoading: loadingOrden } = useOrden(); // Obtener la orden desde el contexto
  const { insumoSeleccionado, setInsumoSeleccionado } = useContext(InsumoContext); // Usamos el contexto para actualizar el insumo seleccionado
  const [condiciones, setCondiciones] = useState([]); // Aquí se guardan los datos de las condiciones
  const [loading, setLoading] = useState(false); // Estado de carga
  const [error, setError] = useState(null); // Estado de error

  const navigate = useNavigate(); // Usar useNavigate para redirigir

  // Función para manejar la solicitud de las condiciones
  const obtenerCondiciones = async () => {
    if (!ordenSeleccionada) {
      setError('Por favor seleccione una orden de compra');
      return;
    }

    setLoading(true);
    setError(null); // Limpiar el error previo

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

  // Función para manejar el clic en "Agregar Insumo"
  const manejarAgregarInsumo = (codInsumo) => {
    setInsumoSeleccionado(codInsumo); // Guardar el código del insumo en el contexto
    alert(`Insumo con código ${codInsumo} agregado.`); // Mostrar un mensaje de confirmación
    navigate('/modulo5/ingresoalmacen'); // Redirigir a la página de ingreso al almacén
  };

  useEffect(() => {
    // Si hay una orden seleccionada, se intentan obtener las condiciones automáticamente
    if (ordenSeleccionada) {
      obtenerCondiciones();
    }
  }, [ordenSeleccionada]); // Solo se ejecuta si 'ordenSeleccionada' cambia

  if (loadingOrden) return <p>Cargando orden...</p>; // Si está cargando la orden seleccionada

  return (
    <div>
      <h1>Condiciones de Ingreso</h1>

      {/* Mostrar error si no hay orden seleccionada */}
      {!ordenSeleccionada && <p>No hay una orden seleccionada.</p>}

      {/* Mostrar error si hay algún error en la obtención de las condiciones */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Mostrar tabla con los datos obtenidos si existen condiciones */}
      {condiciones.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Código Insumo</th> {/* Nueva columna para el código de insumo */}
              <th>Nombre Insumo</th>
              <th>Cantidad Revisada</th>
              <th>Condiciones</th>
              <th>Acción</th> {/* Columna para el botón */}
            </tr>
          </thead>
          <tbody>
            {condiciones.map((condicion, index) => (
              <tr key={index}>
                <td>{condicion.cod_insumo}</td> {/* Mostrar el código del insumo */}
                <td>{condicion.nombre_insumo}</td>
                <td>{condicion.cantidad_recibida}</td>
                <td>{condicion.nombre_condiciones}</td>
                <td>
                  <button onClick={() => manejarAgregarInsumo(condicion.cod_insumo)}>
                    Agregar Insumo
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default IngresoInicio;
