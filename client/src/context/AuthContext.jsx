import React, { createContext, useState, useContext, useEffect } from 'react';
import { tokenManager, authAPI } from '../api/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = tokenManager.getToken();
      const savedUser = tokenManager.getUser();
      
      if (token && savedUser) {
        setUser(savedUser);
        setIsAuthenticated(true);
        
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (userData, token) => {
    console.log('AuthContext: Setting user and token', { userData, token });
    setUser(userData);
    setIsAuthenticated(true);
    tokenManager.setToken(token);
    tokenManager.setUser(userData);
  };

  const logout = () => {
    console.log('AuthContext: Logging out');
    setUser(null);
    setIsAuthenticated(false);
    tokenManager.clearAuth();
  };

  const updateUser = (userData) => {
    setUser(userData);
    tokenManager.setUser(userData);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;