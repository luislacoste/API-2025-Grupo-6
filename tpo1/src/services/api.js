// Archivo de servicios para hacer llamadas a la API con json-server
// Siguiendo el estilo de fetcheo enseñado en clase

const API_BASE_URL = 'http://localhost:3000';

// Helper to build headers including Authorization if token exists in localStorage
// Resilient: looks for token under several keys in localStorage and falls back
// to parsing a saved `user` object if necessary.
const getAuthHeaders = (extraHeaders = {}) => {
  const headers = { ...extraHeaders };
  try {
    // Primary location: explicit `token` key
    let token = localStorage.getItem('token');

    // Fallback: maybe older code saved token inside the `user` object
    if (!token) {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed && parsed.token) token = parsed.token;
        } catch (err) {
          // ignore parse errors
        }
      }
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (e) {
    // localStorage might not be available in some environments (SSR/tests)
  }

  return headers;
};

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
    // Transformar datos al formato esperado por el backend
    const priceCents = Math.round(parseFloat(productData.price) * 100);
    const stockInt = parseInt(productData.stock, 10);
    const image = Array.isArray(productData.images) && productData.images.length > 0
      ? productData.images[0]
      : productData.image || '';

    const payload = {
      name: productData.name,
      price: priceCents,
      category: productData.category,
      description: productData.description,
      image,
      stock: Number.isFinite(stockInt) ? stockInt : 0,
      // userId opcional: sólo si viene numérico
      ...(typeof productData.userId === 'number' ? { userId: productData.userId } : {}),
      createdAt: new Date().toISOString()
    };

    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders({ 'Content-Type': 'application/json' }),
      },
      body: JSON.stringify(payload)
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
      method: 'DELETE',
      headers: getAuthHeaders()
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
    console.log(getAuthHeaders());
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
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
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
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

// ===================== AUTH =====================
// Registro de usuario contra Spring Boot
export const registerUser = async ({ firstName, lastName, email, password }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: firstName,
        apellido: lastName,
        email,
        password
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || 'Error en registro');
    }
    // Mapeo a user de frontend
    const user = {
      id: data.id,
      firstName: data.nombre,
      lastName: data.apellido,
      email: data.email
    };
    // Return token when present
    return { success: true, user, token: data.token };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Login contra Spring Boot
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    console.log('Login response data:', data);
    if (!response.ok) {
      throw new Error(data?.message || 'Error en login');
    }
    const user = {
      id: data.id,
      firstName: data.nombre,
      lastName: data.apellido,
      email: data.email
    };
    return { success: true, user, token: data.token };
  } catch (error) {
    return { success: false, error: error.message };
  }
};