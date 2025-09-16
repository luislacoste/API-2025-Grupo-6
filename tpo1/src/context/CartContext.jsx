import React, { createContext, useContext, useState, useEffect } from 'react';
import { useProducts } from './ProductContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Obtener funciones del contexto de productos
  const { products, updateProductStock } = useProducts();

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    setLoading(false);
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, loading]);

  // Validar stock actual antes de agregar al carrito
  const getUpdatedProduct = (productId) => {
    return products.find(p => p.id === productId);
  };

  // Agregar producto al carrito
  const addToCart = (product, quantity = 1) => {
    try {
      // Obtener stock actualizado del producto
      const updatedProduct = getUpdatedProduct(product.id);
      if (!updatedProduct) {
        return { success: false, error: 'Producto no encontrado' };
      }

      if (updatedProduct.stock === 0) {
        return { success: false, error: 'El producto no tiene stock disponible' };
      }

      if (quantity > updatedProduct.stock) {
        return { success: false, error: `Solo hay ${updatedProduct.stock} unidades disponibles` };
      }

      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === product.id);
        
        if (existingItem) {
          // Si el producto ya existe, validar que la nueva cantidad no exceda el stock
          const newQuantity = existingItem.quantity + quantity;
          
          if (newQuantity > updatedProduct.stock) {
            return prevItems; // No agregar si excede el stock
          }
          
          return prevItems.map(item =>
            item.id === product.id
              ? { ...item, quantity: newQuantity, stock: updatedProduct.stock }
              : item
          );
        } else {
          // Si es nuevo, agregarlo al carrito con stock actualizado
          return [...prevItems, {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            stock: updatedProduct.stock,
            quantity: quantity
          }];
        }
      });

      return { success: true, message: `${product.name} agregado al carrito` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Actualizar cantidad de un producto en el carrito
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    // Validar stock actual
    const updatedProduct = getUpdatedProduct(productId);
    if (!updatedProduct) return;

    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === productId) {
          // Verificar que no exceda el stock actual
          const quantity = Math.min(newQuantity, updatedProduct.stock);
          return { ...item, quantity, stock: updatedProduct.stock };
        }
        return item;
      })
    );
  };

  // Remover producto del carrito
  const removeFromCart = (productId) => {
    setCartItems(prevItems =>
      prevItems.filter(item => item.id !== productId)
    );
  };

  // Limpiar carrito
  const clearCart = () => {
    setCartItems([]);
  };

  // Obtener cantidad total de items
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Obtener precio total
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Verificar si un producto está en el carrito
  const isInCart = (productId) => {
    return cartItems.some(item => item.id === productId);
  };

  // Obtener cantidad de un producto específico en el carrito
  const getItemQuantity = (productId) => {
    const item = cartItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  // Validar stock antes del checkout
  const validateCartStock = () => {
    const stockErrors = [];
    
    for (const cartItem of cartItems) {
      const currentProduct = getUpdatedProduct(cartItem.id);
      
      if (!currentProduct) {
        stockErrors.push(`${cartItem.name} ya no está disponible`);
        continue;
      }
      
      if (currentProduct.stock === 0) {
        stockErrors.push(`${cartItem.name} se ha agotado`);
        continue;
      }
      
      if (cartItem.quantity > currentProduct.stock) {
        stockErrors.push(`${cartItem.name}: solo quedan ${currentProduct.stock} unidades (tienes ${cartItem.quantity} en el carrito)`);
      }
    }
    
    return stockErrors;
  };

  // Simular proceso de compra con descuento de stock
  const checkout = async () => {
    try {
      if (cartItems.length === 0) {
        return { success: false, error: 'El carrito está vacío' };
      }

      // Validar stock antes del checkout
      const stockErrors = validateCartStock();
      if (stockErrors.length > 0) {
        return { 
          success: false, 
          error: 'Problemas de stock encontrados:\n' + stockErrors.join('\n')
        };
      }

      // Preparar datos de la orden
      const orderTotal = getTotalPrice();
      const orderItems = [...cartItems];
      
      // Descontar stock de cada producto
      const stockUpdates = [];
      for (const item of cartItems) {
        const currentProduct = getUpdatedProduct(item.id);
        const newStock = currentProduct.stock - item.quantity;
        
        stockUpdates.push({
          productId: item.id,
          newStock: Math.max(0, newStock) // Asegurar que no sea negativo
        });
      }

      // Aplicar descuentos de stock (ahora con await)
      let stockUpdateSuccess = true;
      for (const update of stockUpdates) {
        const result = await updateProductStock(update.productId, update.newStock);
        console.log('Resultado actualización stock:', result);
        if (!result.success) {
          stockUpdateSuccess = false;
          console.error('Error actualizando stock:', result.error);
          break;
        }
      }
      
      console.log('Resultados de la actualización de stock:', stockUpdates);
      if (!stockUpdateSuccess) {
        return { 
          success: false, 
          error: 'Error al actualizar el stock. Intenta nuevamente.' 
        };
      }

      // Limpiar carrito después del checkout exitoso
      clearCart();

      return { 
        success: true, 
        message: 'Compra realizada con éxito. Stock actualizado.',
        order: {
          id: Date.now(),
          items: orderItems,
          total: orderTotal,
          date: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error en checkout:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isInCart,
    getItemQuantity,
    checkout,
    validateCartStock
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
