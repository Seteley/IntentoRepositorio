import React from "react";
import "../../styles/ProductCard.css";

const ProductCard = ({ product, onQuantityChange }) => {
  const handleChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10) || 0; // Asegura que la cantidad sea un número
    onQuantityChange(product.cod_prodfriday, newQuantity); // Notifica al componente padre sobre el cambio
  };

  return (
    <div className="product-card">
      <h3>{product.nombre_producto}</h3>
      <p>CANTIDAD</p>
      <input
        type="number"
        min="0"
        defaultValue="0"
        onChange={handleChange}
        className="quantity-input"
      />
    </div>
  );
};

export default ProductCard;
