const API_URL = import.meta.env.VITE_APP_API_URL;

export const saveOrderItems = async (cod_categoria, products) => {
  try {
    const response = await fetch(`${API_URL}/modulo2/registrando_pedido/categorias/${cod_categoria}/items_pedido`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productos: products }) // Convertimos `products` en un JSON
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al guardar los elementos del pedido.");
    }

    return await response.json(); // Devuelve el cuerpo de la respuesta
  } catch (error) {
    console.error('Error saving order items:', error);
    throw error; // Propaga el error al componente
  }
};
