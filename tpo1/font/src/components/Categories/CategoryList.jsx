import React from 'react';
import './CategoryList.css';

const CategoryList = ({ categories, loading, onCategoryClick }) => {
  if (loading) {
    return (
      <div className="categories-section">
        <h2>🏷️ Categorías</h2>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando categorías...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="categories-section">
      <h2>🏷️ Categorías</h2>
      <p className="section-subtitle">Explora nuestras categorías de productos</p>
      
      <div className="categories-grid">
        {categories.map(category => (
          <div 
            key={category.id} 
            className="category-card"
            onClick={() => onCategoryClick && onCategoryClick(category)}
          >
            <div className="category-icon">
              {category.icon}
            </div>
            
            <div className="category-info">
              <h3 className="category-name">{category.name}</h3>
              <p className="category-description">{category.description}</p>
              
              <div className="category-stats">
                <span className="product-count">
                  {category.productCount} {category.productCount === 1 ? 'producto' : 'productos'}
                </span>
              </div>
            </div>
            
            <div className="category-arrow">
              →
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🏷️</div>
          <h3>No hay categorías disponibles</h3>
          <p>Pronto agregaremos nuevas categorías de productos</p>
        </div>
      )}
    </div>
  );
};

export default CategoryList;
