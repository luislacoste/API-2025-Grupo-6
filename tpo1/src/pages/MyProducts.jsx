import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './MyProducts.css';

const MyProducts = () => {
  const { products, deleteProduct, updateProductStock } = useProducts();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Estados para modales y formularios
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockForm, setStockForm] = useState({ newStock: '', operation: 'add' });
  const [loading, setLoading] = useState(false);

  // Filtrar productos del usuario actual
  const myProducts = products.filter(product => 
    product.createdBy === user?.id || product.createdBy === 'usuario'
  );

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price / 100);
  };

  // Abrir modal de eliminación
  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  // Abrir modal de stock
  const openStockModal = (product) => {
    setSelectedProduct(product);
    setStockForm({ newStock: '', operation: 'add' });
    setShowStockModal(true);
  };

  // Cerrar modales
  const closeModals = () => {
    setShowDeleteModal(false);
    setShowStockModal(false);
    setSelectedProduct(null);
    setStockForm({ newStock: '', operation: 'add' });
  };

  // Eliminar producto
  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    setLoading(true);
    try {
      const result = deleteProduct(selectedProduct.id);
      
      if (result.success) {
        alert('Producto eliminado exitosamente');
        closeModals();
      } else {
        alert(`Error al eliminar producto: ${result.error}`);
      }
    } catch (error) {
      alert('Error al eliminar producto. Inténtalo nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Actualizar stock
  const handleUpdateStock = async (e) => {
    e.preventDefault();
    
    if (!selectedProduct || !stockForm.newStock) {
      alert('Por favor ingresa una cantidad válida');
      return;
    }

    const quantity = parseInt(stockForm.newStock);
    if (isNaN(quantity) || quantity < 0) {
      alert('La cantidad debe ser un número positivo');
      return;
    }

    setLoading(true);
    try {
      let newStock;
      
      if (stockForm.operation === 'add') {
        newStock = selectedProduct.stock + quantity;
      } else if (stockForm.operation === 'subtract') {
        newStock = Math.max(0, selectedProduct.stock - quantity);
      } else {
        newStock = quantity; // set exact amount
      }

      const result = updateProductStock(selectedProduct.id, newStock);
      
      if (result.success) {
        alert(`Stock actualizado exitosamente. Nuevo stock: ${newStock}`);
        closeModals();
      } else {
        alert(`Error al actualizar stock: ${result.error}`);
      }
    } catch (error) {
      alert('Error al actualizar stock. Inténtalo nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Navegar a crear producto
  const goToCreateProduct = () => {
    navigate('/create-listing');
  };

  if (myProducts.length === 0) {
    return (
      <div className="my-products-container">
        <div className="my-products-header">
          <h1>Mis Productos</h1>
          <button onClick={goToCreateProduct} className="create-product-btn">
            + Crear Producto
          </button>
        </div>
        
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h2>No tienes productos en venta</h2>
          <p>Comienza a vender creando tu primera publicación</p>
          <button onClick={goToCreateProduct} className="create-first-product-btn">
            Crear Mi Primer Producto
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-products-container">
      <div className="my-products-header">
        <div>
          <h1>Mis Productos</h1>
          <p>{myProducts.length} producto{myProducts.length !== 1 ? 's' : ''} en venta</p>
        </div>
        <button onClick={goToCreateProduct} className="create-product-btn">
          + Crear Producto
        </button>
      </div>

      <div className="products-grid">
        {myProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img 
                src={(product.images && product.images[0]) || product.image} 
                alt={product.name} 
              />
              <div className="product-status">
                <span className={`status-badge ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>
                  {product.stock > 0 ? 'En Stock' : 'Sin Stock'}
                </span>
              </div>
            </div>

            <div className="product-info">
              <div className="product-category">{product.category}</div>
              <h3 className="product-name">{product.name}</h3>
              <div className="product-price">{formatPrice(product.price)}</div>
              
              <div className="stock-info">
                <span className="stock-label">Stock:</span>
                <span className={`stock-amount ${product.stock === 0 ? 'zero-stock' : ''}`}>
                  {product.stock} unidades
                </span>
              </div>

              <div className="product-date">
                Publicado: {new Date(product.createdAt).toLocaleDateString('es-AR')}
              </div>
            </div>

            <div className="product-actions">
              <button 
                onClick={() => navigate(`/product/${product.id}`)}
                className="action-btn view-btn"
              >
                👁️ Ver
              </button>
              <button 
                onClick={() => openStockModal(product)}
                className="action-btn stock-btn"
              >
                📦 Stock
              </button>
              <button 
                onClick={() => openDeleteModal(product)}
                className="action-btn delete-btn"
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de eliminación */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirmar Eliminación</h3>
            <p>¿Estás seguro de que quieres eliminar el producto <strong>{selectedProduct?.name}</strong>?</p>
            <p className="warning-text">Esta acción no se puede deshacer.</p>
            
            <div className="modal-actions">
              <button 
                onClick={closeModals}
                className="modal-btn cancel-btn"
                disabled={loading}
              >
                Cancelar
              </button>
              <button 
                onClick={handleDeleteProduct}
                className="modal-btn confirm-btn"
                disabled={loading}
              >
                {loading ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de stock */}
      {showStockModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Gestionar Stock</h3>
            <div className="product-summary">
              <strong>{selectedProduct?.name}</strong>
              <div>Stock actual: <span className="current-stock">{selectedProduct?.stock}</span> unidades</div>
            </div>

            <form onSubmit={handleUpdateStock} className="stock-form">
              <div className="form-group">
                <label>Operación:</label>
                <select 
                  value={stockForm.operation}
                  onChange={(e) => setStockForm(prev => ({ ...prev, operation: e.target.value }))}
                  className="operation-select"
                >
                  <option value="add">Agregar stock</option>
                  <option value="subtract">Quitar stock</option>
                  <option value="set">Establecer cantidad exacta</option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  {stockForm.operation === 'add' ? 'Cantidad a agregar:' :
                   stockForm.operation === 'subtract' ? 'Cantidad a quitar:' :
                   'Nueva cantidad total:'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={stockForm.newStock}
                  onChange={(e) => setStockForm(prev => ({ ...prev, newStock: e.target.value }))}
                  placeholder="Ingresa la cantidad"
                  className="stock-input"
                  required
                />
              </div>

              {stockForm.operation !== 'set' && stockForm.newStock && (
                <div className="stock-preview">
                  Nuevo stock: <strong>
                    {stockForm.operation === 'add' 
                      ? selectedProduct?.stock + parseInt(stockForm.newStock || 0)
                      : Math.max(0, selectedProduct?.stock - parseInt(stockForm.newStock || 0))
                    }
                  </strong> unidades
                </div>
              )}

              <div className="modal-actions">
                <button 
                  type="button"
                  onClick={closeModals}
                  className="modal-btn cancel-btn"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="modal-btn confirm-btn"
                  disabled={loading}
                >
                  {loading ? 'Actualizando...' : 'Actualizar Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProducts;
