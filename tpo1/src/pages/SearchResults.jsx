import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import './SearchResults.css';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addToCart } = useCart();
  
  const query = searchParams.get('q') || '';
  const [searchResults, setSearchResults] = useState([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [filterCategory, setFilterCategory] = useState('all');

  // Obtener categorías únicas de los resultados
  const categories = [...new Set(searchResults.map(product => product.category))];

  useEffect(() => {
    if (query.trim()) {
      performSearch(query);
    }
  }, [query, products]);

  // Función para realizar la búsqueda
  const performSearch = (searchQuery) => {
    const results = products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSearchResults(results);
  };

  // Filtrar y ordenar resultados
  const getFilteredAndSortedResults = () => {
    let filtered = searchResults;

    // Filtrar por categoría
    if (filterCategory !== 'all') {
      filtered = filtered.filter(product => product.category === filterCategory);
    }

    // Ordenar resultados
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'relevance':
        default:
          // Ordenar por relevancia (productos que contienen el término en el nombre primero)
          const aNameMatch = a.name.toLowerCase().includes(query.toLowerCase());
          const bNameMatch = b.name.toLowerCase().includes(query.toLowerCase());
          if (aNameMatch && !bNameMatch) return -1;
          if (!aNameMatch && bNameMatch) return 1;
          return a.name.localeCompare(b.name);
      }
    });

    return sorted;
  };

  const filteredResults = getFilteredAndSortedResults();

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

  if (!query.trim()) {
    return (
      <div className="search-results-container">
        <div className="search-header">
          <h1>Búsqueda</h1>
          <p>Ingresa un término para buscar productos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-container">
      <div className="search-header">
        <h1>Resultados de búsqueda</h1>
        <p>
          {filteredResults.length} resultado{filteredResults.length !== 1 ? 's' : ''} 
          {' '}para "<strong>{query}</strong>"
        </p>
      </div>

      {searchResults.length === 0 ? (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h2>No se encontraron productos</h2>
          <p>Intenta con otros términos de búsqueda</p>
          <button onClick={() => navigate('/')} className="back-home-btn">
            Volver al inicio
          </button>
        </div>
      ) : (
        <>
          {/* Filtros y ordenamiento */}
          <div className="search-controls">
            <div className="filter-section">
              <label htmlFor="category-filter">Categoría:</label>
              <select
                id="category-filter"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="filter-select"
              >
                <option value="all">Todas las categorías</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
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
                <option value="relevance">Relevancia</option>
                <option value="name">Nombre A-Z</option>
                <option value="price-low">Precio: menor a mayor</option>
                <option value="price-high">Precio: mayor a menor</option>
              </select>
            </div>
          </div>

          {/* Resultados */}
          <div className="search-results-grid">
            {filteredResults.map(product => (
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
                </div>

                <div className="product-info">
                  <div className="product-category">{product.category}</div>
                  <h3 
                    className="product-name"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {product.name}
                  </h3>
                  <div className="product-price">{formatPrice(product.price)}</div>
                  
                  <div className="product-stock">
                    {product.stock > 0 ? (
                      <span className="in-stock">✅ {product.stock} disponibles</span>
                    ) : (
                      <span className="out-of-stock">❌ Sin stock</span>
                    )}
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

          {filteredResults.length === 0 && searchResults.length > 0 && (
            <div className="no-filtered-results">
              <h3>No hay productos en esta categoría</h3>
              <p>Intenta con una categoría diferente</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;
