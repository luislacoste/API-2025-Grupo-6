import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    getTotalPrice,
    checkout,
    validateCartStock
  } = useCart();
  const navigate = useNavigate();
  const [stockErrors, setStockErrors] = useState([]);
  const [isValidating, setIsValidating] = useState(false);

  // Validar stock al cargar el componente y cuando cambien los items
  useEffect(() => {
    if (cartItems.length > 0) {
      const errors = validateCartStock();
      setStockErrors(errors);
    } else {
      setStockErrors([]);
    }
  }, [cartItems, validateCartStock]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price / 100);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const handleCheckout = async () => {
    setIsValidating(true);
    
    // Validar stock una vez más antes del checkout
    const currentStockErrors = validateCartStock();
    
    if (currentStockErrors.length > 0) {
      setStockErrors(currentStockErrors);
      setIsValidating(false);
      alert('Hay problemas de stock que deben resolverse antes de continuar:\n\n' + currentStockErrors.join('\n'));
      return;
    }

    const result = await checkout();
    
    if (result.success) {
      alert(`¡Compra realizada con éxito! 🎉\n\nTotal: ${formatPrice(result.order.total)}\nStock actualizado automáticamente.`);
      navigate('/');
    } else {
      alert(`Error al procesar la compra:\n${result.error}`);
    }
    
    setIsValidating(false);
  };

  const handleClearCart = () => {
    if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      clearCart();
    }
  };

  const hasStockIssues = stockErrors.length > 0;

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-content">
          <div className="empty-cart">
            <div className="empty-icon">🛒</div>
            <h2>Tu carrito está vacío</h2>
            <p>¡Agrega algunos productos para comenzar a comprar!</p>
            <button 
              onClick={() => navigate('/')}
              className="continue-shopping-btn"
            >
              Continuar comprando
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-content">
        <div className="cart-header">
          <h1>🛒 Mi Carrito</h1>
          <p>{cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'}</p>
        </div>

        {/* Mostrar errores de stock si los hay */}
        {hasStockIssues && (
          <div className="stock-errors">
            <h3>⚠️ Problemas de stock detectados</h3>
            <ul>
              {stockErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
            <p>Por favor, ajusta las cantidades o elimina los productos con problemas antes de continuar.</p>
          </div>
        )}

        <div className="cart-layout">
          {/* Lista de productos */}
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    onClick={() => navigate(`/product/${item.id}`)}
                  />
                </div>

                <div className="item-details">
                  <h3 
                    className="item-name"
                    onClick={() => navigate(`/product/${item.id}`)}
                  >
                    {item.name}
                  </h3>
                  <p className="item-category">{item.category}</p>
                  <p className="item-price">{formatPrice(item.price)}</p>
                  
                  {item.stock === 0 && (
                    <p className="out-of-stock-warning">
                      ❌ Producto sin stock
                    </p>
                  )}
                  {item.stock > 0 && item.stock < 5 && (
                    <p className="low-stock-warning">
                      ⚠️ Quedan solo {item.stock} unidades
                    </p>
                  )}
                  {item.quantity > item.stock && item.stock > 0 && (
                    <p className="excess-quantity-warning">
                      ⚠️ Cantidad excede stock disponible ({item.stock})
                    </p>
                  )}
                </div>

                <div className="item-controls">
                  <div className="quantity-controls">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="quantity-btn"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className={`quantity-display ${item.quantity > item.stock ? 'error' : ''}`}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="quantity-btn"
                      disabled={item.quantity >= item.stock || item.stock === 0}
                    >
                      +
                    </button>
                  </div>

                  <div className="item-total">
                    {formatPrice(item.price * item.quantity)}
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="remove-btn"
                    title="Eliminar producto"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen del carrito */}
          <div className="cart-summary">
            <div className="summary-card">
              <h3>Resumen del pedido</h3>
              
              <div className="summary-details">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>
                <div className="summary-row">
                  <span>Envío:</span>
                  <span>Gratis</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>
              </div>

              <div className="summary-actions">
                <button
                  onClick={handleCheckout}
                  className={`checkout-btn ${hasStockIssues ? 'disabled' : ''}`}
                  disabled={hasStockIssues || isValidating}
                >
                  {isValidating ? '⏳ Procesando...' : '💳 Finalizar compra'}
                </button>
                
                <button
                  onClick={() => navigate('/')}
                  className="continue-btn"
                >
                  Continuar comprando
                </button>

                <button
                  onClick={handleClearCart}
                  className="clear-btn"
                >
                  Vaciar carrito
                </button>
              </div>

              {hasStockIssues && (
                <div className="checkout-warning">
                  <p>⚠️ Resuelve los problemas de stock para continuar</p>
                </div>
              )}
            </div>

            {/* Información adicional */}
            <div className="info-card">
              <h4>🚚 Información de envío</h4>
              <ul>
                <li>✅ Envío gratis en compras superiores a $50.000</li>
                <li>📦 Entrega en 24-48 horas</li>
                <li>🔒 Compra 100% segura</li>
                <li>↩️ Devoluciones sin costo</li>
                <li>📊 Stock actualizado automáticamente</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
