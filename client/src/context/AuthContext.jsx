import React, { createContext, useState, useContext, useEffect } from 'react';
//createContext – ek naya context banane ke liye
//useContext – context ke data ko access karne ke liye.
import { tokenManager, authAPI } from '../api/api';

const AuthContext = createContext(null);  // // Is line se ek AuthContext create hota hai.

export const useAuth = () => {  // Ye ek custom React hook hai jo hume AuthContext ka data access karne deta hai.
  const context = useContext(AuthContext);  
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // current user info
  const [loading, setLoading] = useState(true);// auth check loading flag
  const [isAuthenticated, setIsAuthenticated] = useState(false); // login status

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {   // Jab app start hota hai (useEffect(() => checkAuth(), [])), ye check karta hai ki user ke paas valid token aur user info hai ya nahi.
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

  const login = (userData, token) => {  // jab use login karta hai backend se token aur userData milta hai.
    console.log('AuthContext: Setting user and token', { userData, token });
    setUser(userData);
    setIsAuthenticated(true);
    tokenManager.setToken(token);
    tokenManager.setUser(userData);
  };

  const logout = () => {  // Ye function user ko logout karta hai:
    console.log('AuthContext: Logging out');
    setUser(null);
    setIsAuthenticated(false);
    tokenManager.clearAuth();
  };

  const updateUser = (userData) => { // Update User Info
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
   // Ye React ka built-in component hai jo context data provide karta hai.
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;