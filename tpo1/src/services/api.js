// Archivo de servicios para hacer llamadas a la API con json-server
// Siguiendo el estilo de fetcheo enseñado en clase

const API_BASE_URL = 'http://localhost:3000';

// Función helper para hacer fetch de productos
export const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    
    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      throw new Error('Error al obtener los productos');
    }
    
    const products = await response.json();
    return products;
  } catch (error) {
    // Re-lanzar el error para que lo maneje el componente que llama
    throw new Error(`Error al cargar productos: ${error.message}`);
  }
};

// Función helper para hacer fetch de categorías
export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    
    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      throw new Error('Error al obtener las categorías');
    }
    
    const categories = await response.json();
    return categories;
  } catch (error) {
    // Re-lanzar el error para que lo maneje el componente que llama
    throw new Error(`Error al cargar categorías: ${error.message}`);
  }
};

// Función para obtener un producto por ID
export const fetchProductById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    
    if (!response.ok) {
      throw new Error('Producto no encontrado');
    }
    
    const product = await response.json();
    return product;
  } catch (error) {
    throw new Error(`Error al cargar producto: ${error.message}`);
  }
};

// Función para obtener productos por categoría
export const fetchProductsByCategory = async (categoryName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products?category=${encodeURIComponent(categoryName)}`);
    
    if (!response.ok) {
      throw new Error('Error al obtener productos por categoría');
    }
    
    const products = await response.json();
    return products;
  } catch (error) {
    throw new Error(`Error al cargar productos por categoría: ${error.message}`);
  }
};