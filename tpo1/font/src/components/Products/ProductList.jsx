import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { fetchProducts as fetchProductsFromAPI } from '../../services/api';
import './ProductList.css';

const ProductList = ({ products, loading }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Soporte para modo auto-fetch desde backend si no vienen props
  const [internalProducts, setInternalProducts] = useState(products || []);
  const [internalLoading, setInternalLoading] = useState(
    typeof loading === 'boolean' ? loading : !products
  );

  useEffect(() => {
    // Si nos pasan productos por props, usamos esos
    if (Array.isArray(products)) {
      setInternalProducts(products);
      setInternalLoading(!!loading);
      return;
    }

    // Si no hay productos por props, los traemos del backend
    let cancelled = false;
    const load = async () => {
      try {
        setInternalLoading(true);
        const data = await fetchProductsFromAPI();
        if (!cancelled) setInternalProducts(data || []);
      } catch (e) {
        console.error('Error cargando productos:', e);
      } finally {
        if (!cancelled) setInternalLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [products, loading]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price / 100);
  };

  const getProductImage = (product) => {
    // Check if product has images array (multiple images)
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0]; // Return first image as thumbnail
    }
    // Fallback to single image property
    if (product.image) {
      return product.image;
    }
    // Fallback to placeholder if no image is available
    return 'https://via.placeholder.com/300x200/f0f0f0/666?text=Sin+imagen';
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

  if (internalLoading) {
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
      <p className="section-subtitle">Ordenados alfabéticamente • {internalProducts.length} productos</p>
      
      <div className="products-grid">
        {internalProducts.map(product => (
          <div 
            key={product.id} 
            className="product-card"
            onClick={() => handleProductClick(product.id)}
          >
            <div className="product-image">
              <img src={getProductImage(product)} alt={product.name} />
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

      {internalProducts.length === 0 && (
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
