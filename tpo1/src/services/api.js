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

// Función para crear un nuevo producto
export const createProduct = async (productData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...productData,
        createdAt: new Date().toISOString()
      })
    });
    
    if (!response.ok) {
      throw new Error('Error al crear el producto');
    }
    
    const newProduct = await response.json();
    return newProduct;
  } catch (error) {
    throw new Error(`Error al crear producto: ${error.message}`);
  }
};

// Función para eliminar un producto
export const deleteProductById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('Error al eliminar el producto');
    }
    
    // json-server devuelve un objeto vacío {} cuando se elimina correctamente
    return { success: true };
  } catch (error) {
    throw new Error(`Error al eliminar producto: ${error.message}`);
  }
};

// Función para actualizar un producto (incluyendo stock)
export const updateProduct = async (id, productData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData)
    });
    
    if (!response.ok) {
      throw new Error('Error al actualizar el producto');
    }
    
    const updatedProduct = await response.json();
    return updatedProduct;
  } catch (error) {
    throw new Error(`Error al actualizar producto: ${error.message}`);
  }
};

// Función específica para actualizar solo el stock
export const updateProductStock = async (id, newStock) => {
  try {
    // Primero obtenemos el producto actual
    const currentProduct = await fetchProductById(id);
    
    // Actualizamos solo el stock
    const updatedProduct = await updateProduct(id, {
      ...currentProduct,
      stock: newStock
    });
    console.log('Stock actualizado:', updatedProduct);
    return updatedProduct;
  } catch (error) {
    throw new Error(`Error al actualizar stock: ${error.message}`);
  }
};

// Función para crear una nueva categoría
export const createCategory = async (categoryData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...categoryData,
        productCount: 0,
        createdAt: new Date().toISOString()
      })
    });
    
    if (!response.ok) {
      throw new Error('Error al crear la categoría');
    }
    
    const newCategory = await response.json();
    return newCategory;
  } catch (error) {
    throw new Error(`Error al crear categoría: ${error.message}`);
  }
};