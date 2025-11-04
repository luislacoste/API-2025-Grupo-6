# Guía de Integración Frontend-Backend

## 📋 Configuración del Frontend React para JWT

### 1. Actualizar el archivo `api.js`

Ubicación: `tpo1/src/services/api.js`

```javascript
import axios from 'axios';

// Base URL del backend
const API_URL = 'http://localhost:3000';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token JWT automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 2. Actualizar `AuthContext.jsx`

Ubicación: `tpo1/src/context/AuthContext.jsx`

```javascript
import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario del localStorage al iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token, ...userData } = response.data;
      
      setToken(token);
      setUser(userData);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  // Register
  const register = async (nombre, apellido, email, password) => {
    try {
      const response = await api.post('/api/auth/register', {
        nombre,
        apellido,
        email,
        password,
      });
      const { token, ...userData } = response.data;
      
      setToken(token);
      setUser(userData);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  };

  // Logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Verificar si el usuario es admin
  const isAdmin = () => {
    return user?.role === 'ADMIN';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAdmin,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
```

### 3. Actualizar componente `Login.jsx`

Ubicación: `tpo1/src/components/Auth/Login.jsx`

```javascript
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              minLength={6}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
```

### 4. Actualizar componente `Register.jsx`

Ubicación: `tpo1/src/components/Auth/Register.jsx`

```javascript
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    const result = await register(
      formData.nombre,
      formData.apellido,
      formData.email,
      formData.password
    );
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">First Name</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              minLength={2}
            />
          </div>

          <div className="form-group">
            <label htmlFor="apellido">Last Name</label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
              minLength={2}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
```

### 5. Actualizar `ProtectedRoute.jsx`

Ubicación: `tpo1/src/components/ProtectedRoute.jsx`

```javascript
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
```

### 6. Actualizar el Navbar

Ubicación: `tpo1/src/components/Navbar/Navbar.jsx`

```javascript
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          E-Commerce
        </Link>

        <ul className="navbar-menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/products">Products</Link></li>
          <li><Link to="/categories">Categories</Link></li>
          
          {isAuthenticated ? (
            <>
              <li><Link to="/cart">Cart</Link></li>
              <li><Link to="/my-products">My Products</Link></li>
              <li>
                <span className="user-name">
                  Hello, {user?.nombre}
                </span>
              </li>
              <li>
                <button onClick={handleLogout} className="btn-logout">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
```

---

## 🔄 Actualización de Llamadas a la API

### Ejemplo: Crear Producto

```javascript
// En CreateListing.jsx o similar
import api from '../services/api';

const createProduct = async (productData) => {
  try {
    const response = await api.post('/products', productData);
    console.log('Product created:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error creating product:', error);
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to create product' 
    };
  }
};
```

### Ejemplo: Obtener Productos

```javascript
// En ProductList.jsx o ProductContext
import api from '../services/api';

const fetchProducts = async () => {
  try {
    const response = await api.get('/products');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { success: false, error: error.message };
  }
};
```

---

## 🚀 Pasos para Ejecutar

1. **Asegurarse de que el backend esté corriendo:**
   ```bash
   cd tpo1/spring-backend
   mvn spring-boot:run
   ```

2. **Verificar que MySQL esté corriendo:**
   ```bash
   cd tpo1
   docker-compose ps
   ```

3. **Instalar dependencias del frontend (si no lo has hecho):**
   ```bash
   cd tpo1
   npm install
   ```

4. **Ejecutar el frontend:**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador:** http://localhost:5173

---

## ✅ Checklist de Integración

- [ ] Actualizar `api.js` con interceptores JWT
- [ ] Actualizar `AuthContext.jsx` con login/register que usan tokens
- [ ] Actualizar componentes `Login.jsx` y `Register.jsx`
- [ ] Actualizar `ProtectedRoute.jsx` para verificar autenticación
- [ ] Actualizar `Navbar.jsx` para mostrar usuario logueado
- [ ] Probar flujo de registro
- [ ] Probar flujo de login
- [ ] Probar creación de producto autenticado
- [ ] Probar que rutas protegidas redirigen a login
- [ ] Probar logout

---

## 🔐 Manejo de Errores Comunes

### Error: CORS

Si ves errores de CORS en la consola del navegador, verifica que:
- El backend tenga CORS configurado correctamente (ya está en `SecurityConfig.java`)
- El frontend esté corriendo en `http://localhost:5173`

### Error: 401 Unauthorized

- Verifica que el token se esté guardando en localStorage
- Verifica que el interceptor de axios esté agregando el header Authorization
- Verifica que el token no haya expirado (24 horas)

### Error: 403 Forbidden

- Verifica que el usuario tenga el rol correcto para la operación
- Para operaciones de ADMIN, asegúrate de que el usuario tenga role='ADMIN' en la base de datos

---

## 📝 Notas Finales

1. **Tokens en localStorage:** Los tokens se guardan en localStorage, lo cual es conveniente pero tiene implicaciones de seguridad. En producción, considera usar httpOnly cookies.

2. **Expiración de Tokens:** Los tokens expiran en 24 horas. El interceptor de axios redirige automáticamente al login cuando detecta un 401.

3. **Refresh Tokens:** Esta implementación no incluye refresh tokens. En producción, considera implementarlos para mejor UX.

4. **Roles:** Por defecto, los usuarios registrados tienen rol USER. Para crear un ADMIN, actualiza manualmente en la base de datos.

5. **Validaciones:** El backend valida todos los datos. Los errores de validación se muestran con código 400 y detalles de los campos.
