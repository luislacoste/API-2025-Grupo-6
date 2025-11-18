import React, { createContext, useContext, useState, useEffect } from 'react';
import { registerUser, loginUser } from '../services/api';

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
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carga inicial: intenta restaurar sesión desde localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedToken) {
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  // Registro contra backend: envía datos, guarda token y usuario básico en localStorage
  const register = async (userData) => {
    try {
      const result = await registerUser(userData);
      if (!result.success) throw new Error(result.error);

      const userSession = {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        username: userData.username || undefined
      };
      setUser(userSession);
      setToken(result.token || null);
      localStorage.setItem('user', JSON.stringify(userSession));
      if (result.token) {
        localStorage.setItem('token', result.token);
      }

      return { success: true, user: userSession };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Login contra backend
  const login = async (email, password) => {
    try {
      const result = await loginUser(email, password);
      if (!result.success) throw new Error(result.error);

      const userSession = {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName
      };
      setUser(userSession);
      setToken(result.token || null);
      localStorage.setItem('user', JSON.stringify(userSession));
      if (result.token) {
        localStorage.setItem('token', result.token);
      }

      return { success: true, user: userSession };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Logout: limpia la sesión actual
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const value = {
    user,
    token,
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
