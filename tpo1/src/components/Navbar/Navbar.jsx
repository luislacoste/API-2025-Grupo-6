import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const { products } = useProducts();
  const navigate = useNavigate();
  
  // Estados para el buscador
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Función para buscar productos
  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    // Filtrar productos que contengan el término de búsqueda
    const results = products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5); // Limitar a 5 resultados

    setSearchResults(results);
    setShowSearchResults(true);
  };

  // Manejar clic en resultado de búsqueda
  const handleSearchResultClick = (productId) => {
    setSearchQuery('');
    setShowSearchResults(false);
    navigate(`/product/${productId}`);
  };

  // Manejar envío del formulario de búsqueda
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSearchResults(false);
    }
  };

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price / 100);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          🛒 E-Commerce
        </Link>
        
        {/* Buscador */}
        <div className="search-container">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                className="search-input"
              />
              <button type="submit" className="search-button">
                🔍
              </button>
            </div>
            
            {/* Resultados de búsqueda */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map(product => (
                  <div
                    key={product.id}
                    className="search-result-item"
                    onClick={() => handleSearchResultClick(product.id)}
                  >
                    <img 
                      src={(product.images && product.images[0]) || product.image} 
                      alt={product.name}
                      className="search-result-image"
                    />
                    <div className="search-result-info">
                      <div className="search-result-name">{product.name}</div>
                      <div className="search-result-price">{formatPrice(product.price)}</div>
                      <div className="search-result-category">{product.category}</div>
                    </div>
                  </div>
                ))}
                {searchQuery && (
                  <div className="search-see-all" onClick={handleSearchSubmit}>
                    Ver todos los resultados para "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </form>
        </div>
        
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
