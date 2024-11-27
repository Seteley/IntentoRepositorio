const API_URL = import.meta.env.VITE_APP_API_URL;

export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/modulo2/registrando_pedido/categorias`);
    if (!response.ok) {
      throw new Error("Error al obtener las categorías.");
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};
