import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../services/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Extract username from token (simple decode - in production use proper JWT library)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ username: payload.username, id: payload.id });
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = async (username, password) => {
    try {
      const data = await loginUser(username, password);
      const payload = JSON.parse(atob(data.token.split('.')[1]));
      setUser({ username: payload.username, id: payload.id });
      navigate('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const register = async (username, password) => {
    try {
      const data = await registerUser(username, password);
      const payload = JSON.parse(atob(data.token.split('.')[1]));
      setUser({ username: payload.username, id: payload.id });
      navigate('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};