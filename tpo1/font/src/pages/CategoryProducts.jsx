import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import './CategoryProducts.css';

const CategoryProducts = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const { products, categories } = useProducts();
  const { addToCart } = useCart();
  
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState('all');

  // Decodificar el nombre de la categoría de la URL
  const decodedCategoryName = decodeURIComponent(categoryName);

  // Encontrar la categoría actual
  const currentCategory = categories.find(cat => cat.name === decodedCategoryName);

  useEffect(() => {
    // Filtrar productos por categoría
    const filtered = products.filter(product => 
      product.category === decodedCategoryName
    );
    setCategoryProducts(filtered);
  }, [decodedCategoryName, products]);

  // Obtener productos filtrados y ordenados
  const getFilteredAndSortedProducts = () => {
    let filtered = [...categoryProducts];

    // Filtrar por rango de precio
    if (priceRange !== 'all') {
      switch (priceRange) {
        case 'under-5000':
          filtered = filtered.filter(product => product.price < 500000);
          break;
        case '5000-15000':
          filtered = filtered.filter(product => product.price >= 500000 && product.price < 1500000);
          break;
        case '15000-30000':
          filtered = filtered.filter(product => product.price >= 1500000 && product.price < 3000000);
          break;
        case 'over-30000':
          filtered = filtered.filter(product => product.price >= 3000000);
          break;
        default:
          break;
      }
    }

    // Ordenar productos
    const sorted = filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return sorted;
  };

  const filteredProducts = getFilteredAndSortedProducts();

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price / 100);
  };

  // Manejar agregar al carrito
  const handleAddToCart = (product) => {
    const result = addToCart(product);
    if (result.success) {
      alert(result.message);
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  // Si la categoría no existe
  if (!currentCategory) {
    return (
      <div className="category-products-container">
        <div className="category-header">
          <h1>Categoría no encontrada</h1>
          <p>La categoría que buscas no existe</p>
        </div>
        <div className="category-not-found">
          <div className="not-found-icon">❓</div>
          <h2>Categoría no disponible</h2>
          <p>La categoría "{decodedCategoryName}" no existe o ha sido eliminada.</p>
          <button onClick={() => navigate('/')} className="back-home-btn">
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="category-products-container">
      <div className="category-header">
        <div className="category-breadcrumb">
          <button onClick={() => navigate('/')} className="breadcrumb-link">
            Inicio
          </button>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">{decodedCategoryName}</span>
        </div>
        
        <h1>Productos en {decodedCategoryName}</h1>
        <p>
          {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} 
          {' '}disponible{filteredProducts.length !== 1 ? 's' : ''}
        </p>
      </div>

      {categoryProducts.length === 0 ? (
        <div className="no-products">
          <div className="no-products-icon">📦</div>
          <h2>No hay productos en esta categoría</h2>
          <p>Aún no hay productos disponibles en {decodedCategoryName}</p>
          <button onClick={() => navigate('/create-listing')} className="create-product-btn">
            Ser el primero en vender
          </button>
        </div>
      ) : (
        <>
          {/* Filtros y ordenamiento */}
          <div className="category-controls">
            <div className="filter-section">
              <label htmlFor="price-range">Rango de precio:</label>
              <select
                id="price-range"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="filter-select"
              >
                <option value="all">Todos los precios</option>
                <option value="under-5000">Menos de $50.000</option>
                <option value="5000-15000">$50.000 - $150.000</option>
                <option value="15000-30000">$150.000 - $300.000</option>
                <option value="over-30000">Más de $300.000</option>
              </select>
            </div>

            <div className="sort-section">
              <label htmlFor="sort-by">Ordenar por:</label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="name">Nombre A-Z</option>
                <option value="price-low">Precio: menor a mayor</option>
                <option value="price-high">Precio: mayor a menor</option>
              </select>
            </div>

            <div className="results-count">
              Mostrando {filteredProducts.length} de {categoryProducts.length} productos
            </div>
          </div>

          {/* Grid de productos */}
          <div className="products-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img 
                    src={(product.images && product.images[0]) || product.image} 
                    alt={product.name}
                    onClick={() => navigate(`/product/${product.id}`)}
                  />
                  {product.stock === 0 && (
                    <div className="out-of-stock-overlay">Sin Stock</div>
                  )}
                  {product.stock > 0 && product.stock <= 3 && (
                    <div className="low-stock-badge">¡Últimas {product.stock}!</div>
                  )}
                </div>

                <div className="product-info">
                  <h3 
                    className="product-name"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {product.name}
                  </h3>
                  <div className="product-price">{formatPrice(product.price)}</div>
                  
                  <div className="product-stock">
                    {product.stock > 0 ? (
                      <span className="in-stock">
                        ✅ {product.stock} disponible{product.stock !== 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="out-of-stock">❌ Sin stock</span>
                    )}
                  </div>

                  <div className="product-description">
                    {product.description.length > 100 
                      ? `${product.description.substring(0, 100)}...` 
                      : product.description
                    }
                  </div>

                  <div className="product-actions">
                    <button
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="view-details-btn"
                    >
                      Ver detalles
                    </button>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className="add-to-cart-btn"
                    >
                      {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && categoryProducts.length > 0 && (
            <div className="no-filtered-results">
              <h3>No hay productos en este rango de precio</h3>
              <p>Intenta con un rango diferente</p>
            </div>
          )}
        </>
      )}

      {/* Otras categorías relacionadas */}
      {categories.length > 1 && (
        <div className="related-categories">
          <h3>Explorar otras categorías</h3>
          <div className="categories-list">
            {categories
              .filter(cat => cat.name !== decodedCategoryName && cat.productCount > 0)
              .map(category => (
                <button
                  key={category.id}
                  onClick={() => navigate(`/category/${encodeURIComponent(category.name)}`)}
                  className="category-btn"
                >
                  {category.name}
                  <span className="category-count">({category.productCount})</span>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;
