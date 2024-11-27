import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchProductsByCategory } from "./Service_ProductService";
import { saveOrderItems } from "./Service_OrderService";
import ProductCard from "./ProductCard";
import "../../styles/Products.css";

const Products = ({ onBack }) => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({}); // Estado para almacenar cantidades por producto
  const location = useLocation();
  const navigate = useNavigate();
  const codCategoria = location.state?.cod_categoria;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProductsByCategory(codCategoria);
        setProducts(data);
      } catch (error) {
        console.error("Error loading products", error);
      }
    };
    loadProducts();
  }, [codCategoria]);

  const handleQuantityChange = (codProdFriday, quantity) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [codProdFriday]: quantity,
    }));
  };

  const handleAdd = async () => {
    const productsToSave = Object.entries(quantities)
      .filter(([_, quantity]) => quantity > 0) // Filtra solo las cantidades mayores a 0
      .map(([codProdFriday, quantity]) => ({
        Cod_prodFriday: codProdFriday,
        cantidad: quantity,
      }));

    if (productsToSave.length === 0) {
      alert("No se han seleccionado productos para agregar.");
      navigate("/categorias");
    }

    try {
      await saveOrderItems(codCategoria, productsToSave);
      alert("Productos añadidos exitosamente.");
      navigate("/categorias");
    } catch (error) {
      console.error("Error saving order items:", error);
      alert("Hubo un error al añadir los productos.");
    }
  };

  const handleReady = async () => {
    console.log('BOTÓN LISTO');
    const productsToSave = Object.entries(quantities)
      .filter(([_, quantity]) => quantity > 0) // Filtra solo las cantidades mayores a 0
      .map(([codProdFriday, quantity]) => ({
        Cod_prodFriday: codProdFriday,
        cantidad: quantity,
      }));

    try {
      await saveOrderItems(codCategoria, productsToSave);
      setTimeout(() => {

        navigate("/summary"); // Ruta que apunta a AsignacionMesa
      }, 350);

    } catch (error) {
      console.error("Error saving order items:", error);
      alert("Hubo un error al añadir los productos.");
    }

  };

  return (
    <div className="products-container">
      
      <div className="product-list">
        {products.map((product) => (
          <ProductCard
            key={product.cod_prodfriday}
            product={product}
            onQuantityChange={handleQuantityChange} // Pasa la función de cambio de cantidad
          />
        ))}
      </div>
      <div className="action-buttons">
        <button className="add-all-button" onClick={handleAdd}>
          AGREGAR
        </button>
        <button className="ready-button" onClick={handleReady}>
          LISTO
        </button>
      </div>
    </div>
  );
};

export default Products;
