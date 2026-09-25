import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sentinel_user');
    return saved ? JSON.parse(saved) : {
      id: 'demo-operator-id',
      name: 'Duty Meteorological Operator',
      email: 'operator@weathersentinel.ai',
      role: 'OPERATOR',
      department: '24/7 Weather Surveillance Operations'
    };
  });
  const [token, setToken] = useState(() => localStorage.getItem('sentinel_token') || 'demo-token');
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authService.login(email, password);
      if (res.data.success) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem('sentinel_token', res.data.token);
        localStorage.setItem('sentinel_user', JSON.stringify(res.data.user));
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Authentication failed'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('sentinel_token');
    localStorage.removeItem('sentinel_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
