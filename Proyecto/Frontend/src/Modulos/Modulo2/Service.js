const API_URL = import.meta.env.VITE_APP_API_URL;

export const autenticarMesero = async (codigoEmpleado) => {
  try {
    const response = await fetch(`${API_URL}/modulo2/autenticacion_mesero`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ codigo_empleado: parseInt(codigoEmpleado) }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Error en la autenticación");
    }
    return data; // Retorna un mensaje de éxito, es decir, sí se registró correctamente
  } catch (error) {
    console.error("Error en autenticarMesero:", error);
    throw error; // Propaga el error al componente
  }
};
