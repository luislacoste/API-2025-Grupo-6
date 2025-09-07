import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Función para registrar usuario
  const register = (userData) => {
    try {
      // Obtener usuarios existentes
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Verificar si el email ya existe
      const userExists = existingUsers.find(u => u.email === userData.email);
      if (userExists) {
        throw new Error('El email ya está registrado');
      }

      // Verificar si el nombre de usuario ya existe
      const usernameExists = existingUsers.find(u => u.username === userData.username);
      if (usernameExists) {
        throw new Error('El nombre de usuario ya está en uso');
      }

      // Crear nuevo usuario
      const newUser = {
        id: Date.now(),
        ...userData,
        createdAt: new Date().toISOString()
      };

      // Guardar en lista de usuarios
      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      // Establecer como usuario actual
      const userSession = { 
        id: newUser.id, 
        username: newUser.username, 
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName
      };
      setUser(userSession);
      localStorage.setItem('user', JSON.stringify(userSession));

      return { success: true, user: userSession };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Función para iniciar sesión
  const login = (email, password) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Email o contraseña incorrectos');
      }

      const userSession = { 
        id: user.id, 
        username: user.username, 
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      };
      setUser(userSession);
      localStorage.setItem('user', JSON.stringify(userSession));

      return { success: true, user: userSession };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
