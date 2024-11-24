const API_URL = import.meta.env.VITE_APP_API_URL;
export const fetchEmpleados = async () => {
    try {
      const response = await fetch(`${API_URL}/empleados`);
      const responseText = await response.text();  // Leer la respuesta como texto
      console.log('Respuesta del servidor:', responseText);
      console.log('url:',API_URL)
      
      if (!response.ok) {
        throw new Error("Error al obtener empleados");
      }
      return JSON.parse(responseText);  // Convertir la respuesta a JSON manualmente
    } catch (error) {
      console.error("Error en fetchEmpleados:", error);
      throw error;
    }
  };