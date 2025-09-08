import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './ProductList.css';

const ProductList = ({ products, loading }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price / 100);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleCategoryClick = (e, categoryName) => {
    e.stopPropagation(); // Evitar que se ejecute el click del producto
    navigate(`/category/${encodeURIComponent(categoryName)}`);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation(); // Evitar que se ejecute el click del producto
    
    if (product.stock === 0) {
      alert('Este producto no tiene stock disponible');
      return;
    }
    
    const result = addToCart(product);
    if (result.success) {
      alert(result.message);
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  if (loading) {
    return (
      <div className="products-section">
        <h2>📦 Productos Disponibles</h2>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-section">
      <h2>📦 Productos Disponibles</h2>
      <p className="section-subtitle">Ordenados alfabéticamente • {products.length} productos</p>
      
      <div className="products-grid">
        {products.map(product => (
          <div 
            key={product.id} 
            className="product-card"
            onClick={() => handleProductClick(product.id)}
          >
            <div className="product-image">
              <img src={product.image} alt={product.name} />
              <div className="product-badge">
                <span className={`stock-badge ${product.stock === 0 ? 'out-of-stock' : ''}`}>
                  {product.stock === 0 ? 'Sin stock' : `Stock: ${product.stock}`}
                </span>
              </div>
              <div className="product-overlay">
                <span className="view-details">Ver detalles</span>
              </div>
            </div>
            
            <div className="product-info">
              <div 
                className="product-category clickable-category"
                onClick={(e) => handleCategoryClick(e, product.category)}
                title={`Ver todos los productos en ${product.category}`}
              >
                {product.category}
              </div>
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              
              <div className="product-footer">
                <div className="product-price">{formatPrice(product.price)}</div>
                <button 
                  className={`add-to-cart-btn ${product.stock === 0 ? 'disabled' : ''}`}
                  onClick={(e) => handleAddToCart(e, product)}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? '❌ Sin stock' : '🛒 Agregar'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No hay productos disponibles</h3>
          <p>Pronto agregaremos nuevos productos a nuestro catálogo</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
