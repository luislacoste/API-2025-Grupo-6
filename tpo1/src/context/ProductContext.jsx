import React, { createContext, useContext, useState, useEffect } from 'react';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts debe ser usado dentro de un ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Datos iniciales de ejemplo
  const initialProducts = [
    {
      id: 1,
      name: "Auriculares Bluetooth Sony",
      price: 89999,
      category: "Electrónicos",
      description: "Auriculares inalámbricos con cancelación de ruido",
      image: "https://via.placeholder.com/300x300?text=Auriculares",
      stock: 15,
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      name: "Camiseta Deportiva Nike",
      price: 25999,
      category: "Ropa",
      description: "Camiseta deportiva de alta calidad para entrenar",
      image: "https://via.placeholder.com/300x300?text=Camiseta",
      stock: 30,
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      name: "Libro: JavaScript Avanzado",
      price: 15999,
      category: "Libros",
      description: "Guía completa para dominar JavaScript moderno",
      image: "https://via.placeholder.com/300x300?text=Libro+JS",
      stock: 8,
      createdAt: new Date().toISOString()
    },
    {
      id: 4,
      name: "Botella de Agua Deportiva",
      price: 8999,
      category: "Deportes",
      description: "Botella térmica de acero inoxidable 750ml",
      image: "https://via.placeholder.com/300x300?text=Botella",
      stock: 25,
      createdAt: new Date().toISOString()
    },
    {
      id: 5,
      name: "Mouse Gaming Logitech",
      price: 45999,
      category: "Electrónicos",
      description: "Mouse gaming con sensor de alta precisión",
      image: "https://via.placeholder.com/300x300?text=Mouse",
      stock: 12,
      createdAt: new Date().toISOString()
    },
    {
      id: 6,
      name: "Zapatillas Running Adidas",
      price: 79999,
      category: "Deportes",
      description: "Zapatillas para running con tecnología Boost",
      image: "https://via.placeholder.com/300x300?text=Zapatillas",
      stock: 18,
      createdAt: new Date().toISOString()
    },
    {
      id: 7,
      name: "Crema Hidratante Facial",
      price: 12999,
      category: "Belleza",
      description: "Crema hidratante con ácido hialurónico",
      image: "https://via.placeholder.com/300x300?text=Crema",
      stock: 20,
      createdAt: new Date().toISOString()
    },
    {
      id: 8,
      name: "Mochila para Laptop",
      price: 35999,
      category: "Accesorios",
      description: "Mochila resistente al agua para laptop hasta 15.6\"",
      image: "https://via.placeholder.com/300x300?text=Mochila",
      stock: 10,
      createdAt: new Date().toISOString()
    }
  ];

  const initialCategories = [
    {
      id: 1,
      name: "Electrónicos",
      description: "Dispositivos y gadgets tecnológicos",
      icon: "📱",
      productCount: 0
    },
    {
      id: 2,
      name: "Ropa",
      description: "Vestimenta para todas las ocasiones",
      icon: "👕",
      productCount: 0
    },
    {
      id: 3,
      name: "Deportes",
      description: "Artículos deportivos y de fitness",
      icon: "⚽",
      productCount: 0
    },
    {
      id: 4,
      name: "Libros",
      description: "Literatura y libros educativos",
      icon: "📚",
      productCount: 0
    },
    {
      id: 5,
      name: "Belleza",
      description: "Productos de cuidado personal",
      icon: "💄",
      productCount: 0
    },
    {
      id: 6,
      name: "Accesorios",
      description: "Complementos y accesorios diversos",
      icon: "🎒",
      productCount: 0
    }
  ];

  // Cargar datos al iniciar
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      setLoading(true);
      
      // Cargar productos desde localStorage o usar datos iniciales
      const savedProducts = localStorage.getItem('products');
      const loadedProducts = savedProducts ? JSON.parse(savedProducts) : initialProducts;
      
      // Ordenar productos alfabéticamente
      const sortedProducts = loadedProducts.sort((a, b) => a.name.localeCompare(b.name));
      setProducts(sortedProducts);

      // Cargar categorías y actualizar contador de productos
      const savedCategories = localStorage.getItem('categories');
      let loadedCategories = savedCategories ? JSON.parse(savedCategories) : initialCategories;
      
      // Actualizar contador de productos por categoría
      loadedCategories = loadedCategories.map(category => ({
        ...category,
        productCount: loadedProducts.filter(product => product.category === category.name).length
      }));
      
      setCategories(loadedCategories);

      // Guardar en localStorage si no existían
      if (!savedProducts) {
        localStorage.setItem('products', JSON.stringify(sortedProducts));
      }
      if (!savedCategories) {
        localStorage.setItem('categories', JSON.stringify(loadedCategories));
      }
      
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para agregar producto
  const addProduct = (productData) => {
    try {
      const newProduct = {
        id: Date.now(),
        ...productData,
        createdAt: new Date().toISOString()
      };

      const updatedProducts = [...products, newProduct].sort((a, b) => a.name.localeCompare(b.name));
      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));

      // Actualizar contador de categorías
      updateCategoryCount();

      return { success: true, product: newProduct };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Función para actualizar producto
  const updateProduct = (id, productData) => {
    try {
      const updatedProducts = products.map(product =>
        product.id === id ? { ...product, ...productData } : product
      ).sort((a, b) => a.name.localeCompare(b.name));

      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));

      // Actualizar contador de categorías
      updateCategoryCount();

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Función para eliminar producto
  const deleteProduct = (id) => {
    try {
      const updatedProducts = products.filter(product => product.id !== id);
      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));

      // Actualizar contador de categorías
      updateCategoryCount();

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Función para actualizar stock de un producto específico
  const updateProductStock = (productId, newStock) => {
    try {
      const updatedProducts = products.map(product =>
        product.id === productId 
          ? { ...product, stock: Math.max(0, newStock) } // Asegurar que el stock no sea negativo
          : product
      );

      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));

      // Actualizar contador de categorías
      updateCategoryCount();

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Función para actualizar contador de productos por categoría
  const updateCategoryCount = () => {
    const updatedCategories = categories.map(category => ({
      ...category,
      productCount: products.filter(product => product.category === category.name).length
    }));
    setCategories(updatedCategories);
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
  };

  // Función para crear nueva publicación de producto
  const createProductListing = (productData) => {
    try {
      // Validar datos requeridos
      if (!productData.name || !productData.price || !productData.category || !productData.description) {
        return { 
          success: false, 
          error: 'Todos los campos son obligatorios' 
        };
      }

      if (!productData.images || productData.images.length === 0) {
        return { 
          success: false, 
          error: 'Debes agregar al menos una imagen del producto' 
        };
      }

      // Generar nuevo ID
      const newId = Math.max(...products.map(p => p.id), 0) + 1;

      // Crear nuevo producto
      const newProduct = {
        id: newId,
        name: productData.name.trim(),
        price: parseFloat(productData.price),
        category: productData.category,
        description: productData.description.trim(),
        image: productData.images[0], // Imagen principal
        images: productData.images, // Todas las imágenes
        stock: parseInt(productData.stock) || 0,
        createdAt: new Date().toISOString(),
        createdBy: productData.userId || 'usuario' // ID del usuario que crea la publicación
      };

      // Agregar producto al estado
      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));

      // Verificar si la categoría existe, si no, crearla
      const categoryExists = categories.find(cat => cat.name === productData.category);
      if (!categoryExists) {
        const newCategory = {
          id: categories.length + 1,
          name: productData.category,
          productCount: 1
        };
        const updatedCategories = [...categories, newCategory];
        setCategories(updatedCategories);
        localStorage.setItem('categories', JSON.stringify(updatedCategories));
      } else {
        // Actualizar contador de categorías
        updateCategoryCount();
      }

      return { 
        success: true, 
        message: 'Producto publicado exitosamente',
        productId: newId
      };
    } catch (error) {
      return { 
        success: false, 
        error: 'Error al crear la publicación: ' + error.message 
      };
    }
  };

  // Función para filtrar productos por categoría
  const getProductsByCategory = (categoryName) => {
    return products.filter(product => product.category === categoryName);
  };

  // Función para obtener productos por usuario (si se implementa sistema de usuarios)
  const getProductsByUser = (userId) => {
    return products.filter(product => product.createdBy === userId);
  };

  const value = {
    products,
    categories,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
    createProductListing,
    getProductsByCategory,
    getProductsByUser,
    loadData
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
