import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService';

interface AuthContextType {
  token: string | null;
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const storedUsername = await AsyncStorage.getItem('username');
      if (storedToken && storedUsername) {
        setToken(storedToken);
        setUsername(storedUsername);
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    }
  };

  const login = async (username: string, password: string) => {
    const response = await authService.login(username, password);
    setToken(response.tokenaccess);
    setUsername(username);
    await AsyncStorage.setItem('token', response.tokenaccess);
    await AsyncStorage.setItem('username', username);
  };

  const logout = async () => {
    setToken(null);
    setUsername(null);
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('username');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        username,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};




