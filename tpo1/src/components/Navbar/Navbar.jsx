import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          🛒 E-Commerce
        </Link>
        
        <div className="navbar-menu">
          <Link to="/" className="navbar-link">Inicio</Link>
          
          {user ? (
            <div className="navbar-user">
              <Link to="/create-listing" className="sell-button">
                📝 Vender
              </Link>
              <Link to="/my-products" className="my-products-link">
                📦 Mis Productos
              </Link>
              <Link to="/cart" className="cart-link">
                🛒 Carrito
                {getTotalItems() > 0 && (
                  <span className="cart-badge">{getTotalItems()}</span>
                )}
              </Link>
              <span className="user-greeting">
                Hola, {user.firstName}!
              </span>
              <button onClick={handleLogout} className="logout-button">
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <div className="navbar-auth">
              <Link to="/login" className="navbar-link">Iniciar Sesión</Link>
              <Link to="/register" className="navbar-button">Registrarse</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
