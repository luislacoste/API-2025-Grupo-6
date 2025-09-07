import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { Link } from 'react-router-dom';
import ProductList from '../components/Products/ProductList';
import CategoryList from '../components/Categories/CategoryList';
import './Home.css';

const Home = () => {
  const { user } = useAuth();
  const { products, categories, loading } = useProducts();

  const handleCategoryClick = (category) => {
    // TODO: Implementar navegación a productos por categoría
    console.log('Categoría seleccionada:', category.name);
  };

  return (
    <div className="home-container">
      {user ? (
        // Vista para usuario autenticado
        <div className="authenticated-home">
          <div className="welcome-banner">
            <div className="container">
              <h1>¡Bienvenido {user.firstName}!</h1>
              <p>Descubre nuestros productos y encuentra lo que necesitas</p>
            </div>
          </div>

          {/* Sección de Categorías */}
          <CategoryList 
            categories={categories} 
            loading={loading}
            onCategoryClick={handleCategoryClick}
          />

          {/* Sección de Productos */}
          <ProductList 
            products={products} 
            loading={loading}
          />
        </div>
      ) : (
        // Vista para usuario no autenticado (landing page)
        <div className="guest-home">
          <div className="hero-section">
            <div className="hero-content">
              <h1>Bienvenido a Nuestro E-Commerce</h1>
              <p>La mejor plataforma para compras online con la más amplia variedad de productos</p>
              
              <div className="guest-actions">
                <h2>Únete a nuestra comunidad</h2>
                <p>Regístrate ahora y descubre ofertas exclusivas</p>
                <div className="action-buttons">
                  <Link to="/register" className="primary-button">Crear Cuenta</Link>
                  <Link to="/login" className="secondary-button">Iniciar Sesión</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="features-section">
            <div className="container">
              <h2>¿Por qué elegir nuestro E-Commerce?</h2>
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon">🚚</div>
                  <h3>Envío Rápido</h3>
                  <p>Entrega en 24-48 horas en todo el país</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🔒</div>
                  <h3>Compra Segura</h3>
                  <p>Tus datos y pagos están protegidos</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">💬</div>
                  <h3>Atención 24/7</h3>
                  <p>Soporte al cliente cuando lo necesites</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">💳</div>
                  <h3>Múltiples Pagos</h3>
                  <p>Acepta tarjetas, transferencias y más</p>
                </div>
              </div>
            </div>
          </div>

          <div className="cta-section">
            <div className="container">
              <h2>¿Listo para comenzar?</h2>
              <p>Únete a miles de usuarios que ya confían en nosotros</p>
              <Link to="/register" className="cta-button">Registrarse Gratis</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
