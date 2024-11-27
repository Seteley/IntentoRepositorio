const API_URL = import.meta.env.VITE_APP_API_URL;

export const fetchProductsByCategory = async (cod_categoria) => {
  try {
    const response = await fetch(`${API_URL}/modulo2/registrando_pedido/categorias/${cod_categoria}/`);
    
    if (!response.ok) {
      throw new Error("Error al obtener los productos de la categoría.");
    }
    
    return await response.json(); // Devuelve el cuerpo de la respuesta en formato JSON
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error; // Propaga el error al componente
  }
};
