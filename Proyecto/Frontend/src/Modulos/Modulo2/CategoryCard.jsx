import React from 'react';
import '../../styles/CategoryCard.css';


const CategoryCard = ({ category, onClick }) => {


  return (
    <div
      className="category-card"
      onClick={() => onClick(category.cod_categoria.trim())}
    >
      <img src={`/Images/${category.cod_categoria.trim()}.JPG`} alt={category.nombre_categoria} />
      <h3>{category.nombre_categoria}</h3>
      
    </div>
    
  );
};

export default CategoryCard;
