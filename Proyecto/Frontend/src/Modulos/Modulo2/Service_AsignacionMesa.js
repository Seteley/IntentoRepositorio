const API_URL = import.meta.env.VITE_APP_API_URL;

// API para obtener las mesas disponibles
export const obtenerMesasApi = async () => {
  try {
    const response = await fetch(`${API_URL}/modulo2/registrando_pedido`);
    if (!response.ok) {
      throw new Error("Error al obtener las mesas.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en obtenerMesasApi:", error);
    throw error;
  }
};

// API para asignar una mesa
export const asignarMesaApi = async (numeroMesa) => {
  try {
    const response = await fetch(`${API_URL}/modulo2/registrando_pedido/mesa`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cod_mesa: String(numeroMesa) }),  // Esto ya es correcto
    });
    
    return response.json();
  } catch (error) {
    console.error("Error en asignarMesaApi:", error);
    throw error;
  }
};
