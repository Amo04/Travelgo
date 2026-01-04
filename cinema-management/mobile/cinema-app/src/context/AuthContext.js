import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Adjust if needed

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      // Verify token or set user
      setUser({ token });
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/login`, { email, mot_de_passe: password });
      await AsyncStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (nom, prenom, email, password) => {
    try {
      const res = await axios.post(`${API_URL}/register`, { nom, prenom, email, mot_de_passe: password });
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};