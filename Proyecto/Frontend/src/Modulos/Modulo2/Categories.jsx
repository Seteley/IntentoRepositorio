import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { fetchCategories } from './Service_CategoryService';  // Asegúrate de que esta función esté funcionando
import CategoryCard from './CategoryCard';
import '../../styles/Categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate(); // Hook para redirigir

  // Función que maneja el clic en la categoría
  const handleCategoryClick = (cod_categoria) => {
    console.log("CLICKK: La categoría clickeada es:", cod_categoria);
    setTimeout(() => {
      navigate("/items-pedido", { state: { cod_categoria } });
    }, 350);
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error loading categories', error);
      }
    };
    loadCategories();
  }, []);

  return (
    <div className="categories-container">
      {categories.map((category) => (
        <CategoryCard
          key={category.cod_categoria}
          category={category}
          onClick={handleCategoryClick}  // Pasamos la función que maneja el clic
        />
      ))}
    </div>
  );
};

export default Categories;
