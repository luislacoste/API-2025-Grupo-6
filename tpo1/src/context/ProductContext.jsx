// ProductContext.jsx - Contexto para manejar productos y categorías
// Siguiendo el estilo de fetcheo enseñado en clase con useEffect y fetch

import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchProducts, fetchCategories, createProduct, deleteProductById, updateProductStock as updateProductStockAPI, createCategory } from '../services/api';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts debe ser usado dentro de un ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  // 1. Definimos los estados que necesitará nuestro contexto

  // 'products' guardará la lista de productos que recibamos de la API
  // Inicializa como un array vacío porque esperamos una lista
  const [products, setProducts] = useState([]);

  // 'categories' guardará la lista de categorías que recibamos de la API
  // Inicializa como un array vacío porque esperamos una lista
  const [categories, setCategories] = useState([]);

  // 'loading' nos ayudará a mostrar un mensaje mientras se obtienen los datos
  // Inicializa en 'true' porque al montar el componente, empezamos a cargar
  const [loading, setLoading] = useState(true);

  // 'error' guardará cualquier error que ocurra durante las llamadas a la API
  // Inicializa en 'null' porque al principio no hay errores
  const [error, setError] = useState(null);

  // 2. Usamos el hook useEffect para ejecutar código después de que el componente se renderice
  // Este es el lugar ideal para hacer llamadas a APIs
  useEffect(() => {
    // La función que pasamos a useEffect se ejecutará después del primer renderizado

    // Definimos una función asíncrona para poder usar 'await' con fetch
    const cargarDatos = async () => {
      try {
        // Hacemos las peticiones a la API usando nuestros helpers
        // Podemos hacerlas en paralelo usando Promise.all
        const [productosData, categoriasData] = await Promise.all([
          fetchProducts(),
          fetchCategories()
        ]);

        // Ordenamos los productos alfabéticamente como se especifica en la consigna
        const productosOrdenados = productosData.sort((a, b) => a.name.localeCompare(b.name));

        // Actualizamos el contador de productos por categoría
        const categoriasConContador = categoriasData.map(categoria => ({
          ...categoria,
          productCount: productosData.filter(producto => producto.category === categoria.name).length
        }));

        // Actualizamos los estados con los datos recibidos
        setProducts(productosOrdenados);
        setCategories(categoriasConContador);

      } catch (err) {
        // Si ocurre cualquier error en el bloque 'try', lo capturamos aquí
        console.error('Error cargando datos:', err);
        // Actualizamos el estado 'error' con el mensaje del error
        setError(err.message);
      } finally {
        // El bloque 'finally' se ejecuta siempre, tanto si hubo éxito como si hubo error
        // Dejamos de mostrar el mensaje de "cargando"
        setLoading(false);
      }
    };

    // Llamamos a la función que acabamos de definir
    cargarDatos();

    // 3. El array de dependencias vacío `[]` es MUY IMPORTANTE
    // Significa que el efecto se ejecutará SOLAMENTE UNA VEZ, justo después de que se renderiza el componente
  }, []);

  // Función para recargar los datos (útil para refrescar después de cambios)
  const recargarDatos = () => {
    setLoading(true);
    setError(null);

    const cargarDatos = async () => {
      try {
        const [productosData, categoriasData] = await Promise.all([
          fetchProducts(),
          fetchCategories()
        ]);

        const productosOrdenados = productosData.sort((a, b) => a.name.localeCompare(b.name));

        const categoriasConContador = categoriasData.map(categoria => ({
          ...categoria,
          productCount: productosData.filter(producto => producto.category === categoria.name).length
        }));

        setProducts(productosOrdenados);
        setCategories(categoriasConContador);

      } catch (err) {
        console.error('Error recargando datos:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  };

  const ensureDataLoaded = async () => {
    if (!loading && products.length === 0) {
      try {
        setLoading(true);
        const productosData = await fetchProducts();
        const categoriasData = await fetchCategories();
        const productosOrdenados = productosData.sort((a, b) => a.name.localeCompare(b.name));
        const categoriasConContador = categoriasData.map(c => ({
          ...c,
          productCount: productosData.filter(p => p.category === c.name).length
        }));
        setProducts(productosOrdenados);
        setCategories(categoriasConContador);
      } catch (err) {
        console.error('Reintento fallido de carga de datos:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const isDataReady = !loading && products.length > 0;

  // Función para filtrar productos por categoría
  const getProductsByCategory = (categoryName) => {
    return products.filter(product => product.category === categoryName);
  };

  // Función para obtener un producto por ID
  const getProductById = (id) => {
    return products.find(product => product.id === id);
  };

  // Versión asíncrona: si no está en memoria intenta traerlo del servidor
  const getProductByIdAsync = async (id) => {
    const local = getProductById(id);
    if (local) return { product: local, from: 'cache' };
    try {
      const { fetchProductById } = await import('../services/api');
      const remote = await fetchProductById(id);
      return { product: remote, from: 'server' };
    } catch (err) {
      return { product: null, error: err.message };
    }
  };

  // Función para buscar productos por nombre
  const searchProducts = (searchTerm) => {
    if (!searchTerm) return products;

    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // FUNCIONES TEMPORALES (STUBS) PARA COMPATIBILIDAD
  // Estas funciones mantendrán la aplicación funcionando hasta que se implementen
  // las operaciones POST/PUT/DELETE en json-server

  const updateProductStock = async (productId, newStock) => {
    try {
      // Validar que el ID y el stock sean válidos
      if (!productId) {
        throw new Error('ID del producto es requerido');
      }

      if (typeof newStock !== 'number' || newStock < 0) {
        throw new Error('El stock debe ser un número mayor o igual a 0');
      }

      // Verificar que el producto existe localmente
      const existingProduct = getProductById(productId);
      if (!existingProduct) {
        throw new Error('Producto no encontrado');
      }

      // Actualizar el stock en el servidor
      const updatedProduct = await updateProductStockAPI(productId, newStock);

      // Actualizar el estado local
      const updatedProducts = products.map(product =>
        product.id === productId
          ? { ...product, stock: newStock }
          : product
      );

      setProducts(updatedProducts);

      return {
        success: true,
        message: `Stock actualizado exitosamente a ${newStock}`,
        product: updatedProduct
      };
    } catch (error) {
      console.error('Error actualizando stock:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };

  const createProductListing = async (productData) => {
    try {
      // Validar datos requeridos
      if (!productData.name || !productData.price || !productData.category) {
        throw new Error('Nombre, precio y categoría son requeridos');
      }

      // Verificar si necesitamos crear una nueva categoría
      const categoryExists = categories.find(cat => cat.name === productData.category);

      if (!categoryExists) {
        // Crear nueva categoría si no existe
        const newCategoryData = {
          name: productData.category,
          description: `Categoría de ${productData.category}`,
          icon: '📦' // Icono por defecto
        };

        const newCategory = await createCategory(newCategoryData);

        // Actualizar las categorías locales
        setCategories(prev => [...prev, newCategory]);
      }

      // Crear el producto en el servidor
      const newProduct = await createProduct(productData);

      // Actualizar el estado local con el nuevo producto
      const updatedProducts = [...products, newProduct].sort((a, b) => a.name.localeCompare(b.name));
      setProducts(updatedProducts);

      // Actualizar el contador de productos por categoría
      const updatedCategories = categories.map(categoria => ({
        ...categoria,
        productCount: updatedProducts.filter(producto => producto.category === categoria.name).length
      }));

      // Si es una nueva categoría, asegurarse de que esté incluida
      if (!categoryExists) {
        const newCategoryWithCount = {
          name: productData.category,
          description: `Categoría de ${productData.category}`,
          icon: '📦',
          productCount: 1
        };
        updatedCategories.push(newCategoryWithCount);
      }

      setCategories(updatedCategories);

      return {
        success: true,
        product: newProduct,
        message: 'Producto creado exitosamente'
      };
    } catch (error) {
      console.error('Error creando producto:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };

  const deleteProduct = async (id) => {
    try {
      // Validar que el ID sea válido
      if (!id) {
        throw new Error('ID del producto es requerido');
      }

      // Verificar que el producto existe localmente
      const existingProduct = getProductById(id);
      if (!existingProduct) {
        throw new Error('Producto no encontrado');
      }

      // Eliminar el producto del servidor
      await deleteProductById(id);

      // Actualizar el estado local removiendo el producto
      const updatedProducts = products.filter(product => product.id !== id);
      setProducts(updatedProducts);

      // Actualizar el contador de productos por categoría
      const updatedCategories = categories.map(categoria => ({
        ...categoria,
        productCount: updatedProducts.filter(producto => producto.category === categoria.name).length
      }));
      setCategories(updatedCategories);

      return {
        success: true,
        message: 'Producto eliminado exitosamente',
        deletedProduct: existingProduct
      };
    } catch (error) {
      console.error('Error eliminando producto:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };

  // Valor que proporcionará el contexto a todos sus hijos
  const value = {
    // Estados
    products,
    categories,
    loading,
    error,

    // Funciones implementadas
    recargarDatos,
    getProductsByCategory,
    getProductById,
    getProductByIdAsync,
    searchProducts,

    // Funciones temporales para compatibilidad
    updateProductStock,
    createProductListing,
    deleteProduct,
    ensureDataLoaded,
    isDataReady
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
