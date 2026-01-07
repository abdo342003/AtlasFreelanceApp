// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from storage on app start
  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const loadUserFromStorage = async () => {
    try {
      const userString = await AsyncStorage.getItem('user');
      if (userString) {
        const userData = JSON.parse(userString);
        setUser(userData);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveUserToStorage = async (userData) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const removeUserFromStorage = async () => {
    try {
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Error removing user:', error);
    }
  };

  // Admin login
  const loginAsAdmin = async () => {
    const adminUser = { 
      id: 'admin-1',
      email: 'admin@atlas.com', 
      name: 'Admin Atlas',
      role: 'admin',
      token: 'admin-token-' + Date.now()
    };
    setUser(adminUser);
    await saveUserToStorage(adminUser);
  };

  // Regular user login
  const loginAsUser = async () => {
    const regularUser = { 
      id: 'user-1',
      email: 'user@atlas.com', 
      name: 'User Atlas',
      role: 'user',
      token: 'user-token-' + Date.now()
    };
    setUser(regularUser);
    await saveUserToStorage(regularUser);
  };

  // Login with credentials (real auth)
  const login = async (email, password) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('API_URL/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });
      // const data = await response.json();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user based on email
      const userData = {
        id: email.includes('admin') ? 'admin-1' : 'user-' + Date.now(),
        email,
        name: email.includes('admin') ? 'Admin User' : 'Regular User',
        role: email.includes('admin') ? 'admin' : 'user',
        token: 'token-' + Date.now(),
      };
      
      setUser(userData);
      await saveUserToStorage(userData);
      
      return { success: true, data: userData };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  // Signup function
  const signup = async (userData) => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser = {
        id: 'user-' + Date.now(),
        ...userData,
        role: userData.role || 'user',
        token: 'token-' + Date.now(),
      };
      
      setUser(newUser);
      await saveUserToStorage(newUser);
      
      return { success: true, data: newUser };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    }
  };

  // Logout
  const logout = async () => {
    setUser(null);
    await removeUserFromStorage();
  };

  const value = {
    user,
    loading,
    login,
    signup,
    loginAsAdmin,
    loginAsUser,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}