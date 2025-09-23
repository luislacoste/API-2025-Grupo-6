import React, { useState } from 'react';
// Se importa el contexto de productos para acceder a funciones y datos globales
import { useProducts } from '../context/ProductContext';
// Se importa el contexto de autenticación para obtener datos del usuario logueado 
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './MyProducts.css';

// Se define el componente principal MyProducts
const MyProducts = () => {
  // Se obtiene del contexto los productos y, las funciones para eliminar y actualizar stock
  const { products, deleteProduct, updateProductStock } = useProducts();
  // Se obtiene el usuario actual desde el contexto de autenticación
  const { user } = useAuth();
  // Hook de navegación para redirigir entre páginas
  const navigate = useNavigate();
  
  // Estados locales para controlar la UI de modales y formulasrios
  const [showDeleteModal, setShowDeleteModal] = useState(false); // controla modal de eliminación
  const [showStockModal, setShowStockModal] = useState(false); // controla modal de stock
  const [selectedProduct, setSelectedProduct] = useState(null); // guarda producto seleccionado
  const [stockForm, setStockForm] = useState({ newStock: '', operation: 'add' }); // datos del formulario de stock
  const [loading, setLoading] = useState(false); // estado de carga al hacer operaciones asincronas

  // Se filtran los productos para mostrar solo los creados por el usuario logueado
  const myProducts = products.filter(product => {
    if (!user?.id) return false; // Si no hay usuario logueado, no mostrar productos
    
    // Se verifica tanto userId como createdBy para compatibilidad
    return product.userId === user.id || 
           product.createdBy === user.id ||
           product.userId === user?.id || 
           product.createdBy === user?.id;
  });

  // Función auxiliar para formatear precios a pesos argentinos
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price / 100); // el precio se divide entre 100 porque está en centavos
  };

  // Se abre el modal de confirmación para eliminar producto
  const openDeleteModal = (product) => {
    setSelectedProduct(product); // se guarda el producto a eliminar
    setShowDeleteModal(true); // se muestra el modal
  };

  // Se abre el modal de gestión de stock
  const openStockModal = (product) => {
    setSelectedProduct(product); // se guarda producto a modificar
    setStockForm({ newStock: '', operation: 'add' }); // se resetea formulario
    setShowStockModal(true); // se muestra el modal
  };

  // Se cierran todos los modales y se resetean estados relacionados
  const closeModals = () => {
    setShowDeleteModal(false);
    setShowStockModal(false);
    setSelectedProduct(null);
    setStockForm({ newStock: '', operation: 'add' });
  };

  // Función asincrónica para eliminar un producto
  const handleDeleteProduct = async () => {
    if (!selectedProduct) return; // para evitar errores si no hay producto seleccionado, salir

    setLoading(true); // se muestra un estado de carga
    try {
      // Se ejecuta la función de eliminación desde el contexto
      const result = await deleteProduct(selectedProduct.id);
      
      if (result.success) {
        alert('Producto eliminado exitosamente');
        closeModals(); // se cierra el modal si la eliminación fue exitosa
      } else {
        alert(`Error al eliminar producto: ${result.error}`);
      }
    } catch (error) {
      alert('Error al eliminar producto. Inténtalo nuevamente.');
    } finally {
      setLoading(false); // se termina el estado de carga
    }
  };

  // Función para actualizar stock (asincrónica)
  const handleUpdateStock = async (e) => {
    e.preventDefault(); // evita la recarga de la página al enviar formulario
    
    // Se valida que haya un producto seleccionado y un valor en el formulario
    if (!selectedProduct || !stockForm.newStock) {
      alert('Por favor ingresa una cantidad válida');
      return;
    }

    // Se convierte el valor del input (string) a un número entero 
    const quantity = parseInt(stockForm.newStock);
    // Se valida que sea un número válido y no negativo
    // Evita que el usuario ponga letras, símbolos o números inválidos
    if (isNaN(quantity) || quantity < 0) {
      alert('La cantidad debe ser un número positivo');
      return;
    }

    // Se indica que empieza un proceso asincronico (mostramos loading)
    setLoading(true);
    try {
      let newStock;
      
      // Según la operación elegida en el select, calculamos el nuevo stock (renderizado condicional)
      if (stockForm.operation === 'add') {
        // Sumar stock actual + la cantidad ingresada
        newStock = selectedProduct.stock + quantity;
      } else if (stockForm.operation === 'subtract') {
        // Restar stock actual - la cantidad ingresada, pero sin bajar de 0
        // Se aplica Math.max para asegurar que no haya stock negativo
        newStock = Math.max(0, selectedProduct.stock - quantity);
      } else {
        // Si la operación es "set", directamente usamos el valor ingresado como el stock exacto
        newStock = quantity;
      }

      // Se llama a la función del contexto para actualizar el stock en la base de datos (json-server)
      // Se uutiliza async/await porque es una llamada asíncrona a la API
      const result = await updateProductStock(selectedProduct.id, newStock);
      
      // Si la API respondió bien, se avisa al usuario y se cierra el modal
      if (result.success) {
        alert(`Stock actualizado exitosamente. Nuevo stock: ${newStock}`);
        closeModals();
      } else {
        // Si hubo un error, se muestra el mensaje de error que vino de la API
        alert(`Error al actualizar stock: ${result.error}`);
      }
    } catch (error) {
      // Manejo de error generico, en caso de que la API no responsa o falle la conexión
      alert('Error al actualizar stock. Inténtalo nuevamente.');
    } finally {
      // Siempre, al final, se saca el loading para que el usuario pueda volver a interactuar
      setLoading(false);
    }
  };

  // Navegar a la pantalla de creación de producto
  const goToCreateProduct = () => {
    navigate('/create-listing');
  };

  // Si no hay usuario logueado, muestra el título y un mensaje 
  // Con un botón que permite iniciar sesión o registrarse, redirigiendo a /auth
  if (!user) {
    return (
      <div className="my-products-container">
        <div className="my-products-header">
          <h1>Mis Productos</h1>
        </div>
        
        <div className="empty-state">
          <div className="empty-icon">🔒</div>
          <h2>Inicia sesión para ver tus productos</h2>
          <p>Necesitas estar logueado para gestionar tus publicaciones</p>
          <button onClick={() => navigate('/auth')} className="create-first-product-btn">
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  // Si el usuario no tiene productos publicados, muestra el título y un botón para 
  // crear un producto, con mensaje y botón adicional que lo guia a crear su primera publicación
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

  // Si hay un usuario logueado con productos publicados, muestra la lista de productos
  return (
    <div className="my-products-container">
      {/* Encabezado de la sección "Mis Productos" */}
      <div className="my-products-header">
        <div>
          {/* Título de la sección */}
          <h1>Mis Productos</h1>
          {/* Muestra la cantidad de productos en venta, ajustando pluralización */}
          <p>{myProducts.length} producto{myProducts.length !== 1 ? 's' : ''} en venta</p>
        </div>
        {/* Botón para crear un nuevo producto */}
        <button onClick={goToCreateProduct} className="create-product-btn">
          + Crear Producto
        </button>
      </div>

      {/* Grid que muestra todos los productos del usuario */}
      <div className="products-grid">
        {/* Se recorre el array de productos y se genera una card por cada uno */}
        {myProducts.map(product => (
          <div key={product.id} className="product-card">
            {/* Imagen y estado del producto */}
            <div className="product-image">
              <img 
                src={(product.images && product.images[0]) || product.image} 
                alt={product.name} 
              />
              <div className="product-status">
                {/* Badge que indica si el producto está en stock o no */}
                <span className={`status-badge ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>
                  {product.stock > 0 ? 'En Stock' : 'Sin Stock'}
                </span>
              </div>
            </div>

            {/* Información principal del producto */}
            <div className="product-info">
              <div className="product-category">{product.category}</div>
              <h3 className="product-name">{product.name}</h3>
              <div className="product-price">{formatPrice(product.price)}</div>
              
              {/* Información de stock */}
              <div className="stock-info">
                <span className="stock-label">Stock:</span>
                <span className={`stock-amount ${product.stock === 0 ? 'zero-stock' : ''}`}>
                  {product.stock} unidades
                </span>
              </div>

              {/* Fecha de publicación */}
              <div className="product-date">
                Publicado: {new Date(product.createdAt).toLocaleDateString('es-AR')}
              </div>
            </div>

            {/* Acciones disponibles sobre el producto */}
            <div className="product-actions">
              {/* Botón para ver detalles del producto */}
              <button 
                onClick={() => navigate(`/product/${product.id}`)}
                className="action-btn view-btn"
              >
                👁️ Ver
              </button>
              {/* Botón para abrir modal de gestión de stock */}
              <button 
                onClick={() => openStockModal(product)}
                className="action-btn stock-btn"
              >
                📦 Stock
              </button>
              {/* Botón para abrir modal de eliminación */}
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

      {/* Modal de eliminación de producto */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirmar Eliminación</h3>
            <p>¿Estás seguro de que quieres eliminar el producto <strong>{selectedProduct?.name}</strong>?</p>
            <p className="warning-text">Esta acción no se puede deshacer.</p>
            
            <div className="modal-actions">
              {/* Botón para cancelar y cerrar el modal */}
              <button 
                onClick={closeModals}
                className="modal-btn cancel-btn"
                disabled={loading}
              >
                Cancelar
              </button>
              {/* Botón para confirmar eliminación */}
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

      {/* Modal de gestión de stock */}
      {showStockModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Gestionar Stock</h3>
            <div className="product-summary">
              <strong>{selectedProduct?.name}</strong>
              <div>Stock actual: <span className="current-stock">{selectedProduct?.stock}</span> unidades</div>
            </div>

            {/* Formulario para actualizar stock */}
            <form onSubmit={handleUpdateStock} className="stock-form">
              <div className="form-group">
                <label>Operación:</label>
                {/* Selector de operación de stock */}
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
                {/* Input para cantidad a modificar */}
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

              {/* Vista previa del nuevo stock si no se está estableciendo un valor exacto */}
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

              {/* Acciones del modal */}
              <div className="modal-actions">
                {/* Cancelar */}
                <button 
                  type="button"
                  onClick={closeModals}
                  className="modal-btn cancel-btn"
                  disabled={loading}
                >
                  Cancelar
                </button>
                {/* Confirmar actualización */}
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