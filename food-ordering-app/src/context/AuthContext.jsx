import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on app load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        // Configure Axios authorization header globally
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } catch (err) {
        console.error('Failed to parse stored user data:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { success, token: jwtToken, user: userData, message } = response.data;

      if (success && jwtToken) {
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        setToken(jwtToken);
        setUser(userData);
        api.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
        
        return { success: true, message: message || 'Login successful' };
      } else {
        return { success: false, message: message || 'Authentication failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      const errMsg = error.response?.data?.message || 'Failed to login. Please try again.';
      return { success: false, message: errMsg };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { success, message } = response.data;
      
      return { success, message: message || 'Registration completed successfully!' };
    } catch (error) {
      console.error('Registration error:', error);
      const errMsg = error.response?.data?.message || 'Registration failed. Please check details.';
      return { success: false, message: errMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
