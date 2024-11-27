import React, { useState, useEffect } from "react";
import "../../styles/Asignacion_Mesa.css";
import { useNavigate } from "react-router-dom";
import { obtenerMesasApi, asignarMesaApi } from "./Service_AsignacionMesa";

const AsignacionMesa = () => {
  const [mesas, setMesas] = useState([]); // Todas las mesas
  const [mesasOcupadas, setMesasOcupadas] = useState([]); // Mesas no disponibles
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const navigate = useNavigate(); // Hook para redirigir

  // Cargar las mesas al montar el componente
  useEffect(() => {
    const fetchMesas = async () => {
      try {
        // Supongamos que tenemos una función para obtener todas las mesas
        const todasLasMesas = [
          { cod_mesa: "10" },
          { cod_mesa: "20" },
          { cod_mesa: "30" },
          { cod_mesa: "40" },
          { cod_mesa: "50" },
          { cod_mesa: "60" },
          { cod_mesa: "70" },
          { cod_mesa: "80" },
          { cod_mesa: "90" },
          { cod_mesa: "100" },
          { cod_mesa: "101" },
          { cod_mesa: "102" },
          { cod_mesa: "103" },
          { cod_mesa: "104" },
        ];

        const mesasNoDisponibles = await obtenerMesasApi();
        setMesas(todasLasMesas);
        setMesasOcupadas(mesasNoDisponibles.map((mesa) => mesa.cod_mesa));
      } catch (error) {
        console.error("Error al cargar las mesas:", error);
      }
    };

    fetchMesas();
  }, []);

  // Manejar la selección de una mesa
  const handleMesaClick = async (numeroMesa, disponible) => {
    if (!disponible) return;

    setMesaSeleccionada(numeroMesa);
  };

  // Registrar el pedido de la mesa seleccionada
  const registrarMesa = async () => {
    if (!mesaSeleccionada) {
      alert("Por favor, selecciona una mesa.");
      return;
    }

    try {
      console.log("ENTRO1")
      const resultado = await asignarMesaApi(mesaSeleccionada);
      
      if (resultado) {
        console.log("ENTRO2")
        alert(`Mesa ${mesaSeleccionada} registrada correctamente.`);

        setTimeout(() => {
          navigate("/categorias"); // Ruta que apunta a AsignacionMesa
        }, 1000);


      } else {
        alert("No se pudo registrar la mesa. Intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error al registrar la mesa:", error);
    }
  };

  return (
    <div className="container">
      <h1>Asignación de Mesa</h1>
      <div className="mesa-container">
        {mesas.map((mesa) => {
          const mesaOcupada = mesasOcupadas.includes(mesa.cod_mesa);
          const seleccionada = mesaSeleccionada === mesa.cod_mesa;

          return (
            <div
              key={mesa.cod_mesa}
              className={`mesa ${mesaOcupada ? "ocupada" : ""} ${
                seleccionada ? "seleccionada" : ""
              }`}
              onClick={() =>
                handleMesaClick(mesa.cod_mesa, !mesaOcupada)
              }
            >
              {mesa.cod_mesa}
              {mesaOcupada && (
                <span className="icono-ocupada">👤</span>
              )}
              {seleccionada && !mesaOcupada && (
                <span className="icono-seleccionada">✅</span>
              )}
            </div>
          );
        })}
      </div>
      <button
        className="btn nueva-mesa"
        onClick={registrarMesa}
      >
        Nueva Mesa
      </button>
      <button className="btn salir" onClick={() => window.history.back()}>
        Salir
      </button>
    </div>
  );
};

export default AsignacionMesa;
