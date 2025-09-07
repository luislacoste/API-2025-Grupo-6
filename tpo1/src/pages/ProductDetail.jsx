import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addToCart } = useCart();
  
  // Estado para la imagen seleccionada
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Buscar el producto por ID
  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="product-detail-container">
        <div className="error-state">
          <div className="error-icon">❌</div>
          <h2>Producto no encontrado</h2>
          <p>El producto que buscas no existe o ha sido eliminado.</p>
          <button onClick={() => navigate('/')} className="back-button">
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price / 100);
  };

  const handleAddToCart = () => {
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

  const handleBuyNow = () => {
    if (product.stock === 0) {
      alert('Este producto no tiene stock disponible');
      return;
    }
    
    const result = addToCart(product);
    if (result.success) {
      navigate('/cart');
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  return (
    <div className="product-detail-container">
      <div className="product-detail-content">
        {/* Botón de regreso */}
        <button onClick={() => navigate(-1)} className="back-link">
          ← Volver
        </button>

        <div className="product-detail-grid">
          {/* Imagen del producto */}
          <div className="product-image-section">
            <div className="main-image">
              <img 
                src={(product.images && product.images[selectedImageIndex]) || product.image} 
                alt={product.name} 
              />
            </div>
            
            {/* Galería de imágenes adicionales */}
            {product.images && product.images.length > 1 && (
              <div className="image-gallery">
                {product.images.map((image, index) => (
                  <div 
                    key={index}
                    className={`gallery-thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
            
            {/* Badge de stock */}
            <div className="stock-indicator">
              <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
              </span>
            </div>
          </div>

          {/* Información del producto */}
          <div className="product-info-section">
            <div className="product-category-badge">
              {product.category}
            </div>
            
            <h1 className="product-title">{product.name}</h1>
            
            <div className="price-section">
              <div className="current-price">{formatPrice(product.price)}</div>
            </div>

            <div className="product-description">
              <h3>Descripción</h3>
              <p>{product.description}</p>
            </div>

            {/* Información adicional */}
            <div className="product-details">
              <div className="detail-item">
                <span className="detail-label">Categoría:</span>
                <span className="detail-value">{product.category}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Stock disponible:</span>
                <span className="detail-value">{product.stock} unidades</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Fecha de ingreso:</span>
                <span className="detail-value">
                  {new Date(product.createdAt).toLocaleDateString('es-AR')}
                </span>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="action-buttons">
              <button 
                onClick={handleAddToCart}
                className="add-to-cart-button"
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? '❌ Sin stock' : '🛒 Agregar al carrito'}
              </button>
              
              <button 
                onClick={handleBuyNow}
                className="buy-now-button"
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? '❌ No disponible' : '💳 Comprar ahora'}
              </button>
            </div>

            {product.stock === 0 && (
              <div className="out-of-stock-message">
                <p>⚠️ Producto sin stock. Te notificaremos cuando esté disponible.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sección de productos relacionados */}
        <div className="related-products">
          <h3>Productos relacionados</h3>
          <div className="related-grid">
            {products
              .filter(p => p.category === product.category && p.id !== product.id)
              .slice(0, 4)
              .map(relatedProduct => (
                <div 
                  key={relatedProduct.id} 
                  className="related-product-card"
                  onClick={() => navigate(`/product/${relatedProduct.id}`)}
                >
                  <img src={relatedProduct.image} alt={relatedProduct.name} />
                  <div className="related-product-info">
                    <h4>{relatedProduct.name}</h4>
                    <p className="related-price">{formatPrice(relatedProduct.price)}</p>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
