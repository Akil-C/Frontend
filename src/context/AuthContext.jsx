import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMyProfile, logoutUser } from '../services/apiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await getMyProfile();
      setUser(res.data.data);
    } catch {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = (userData, accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
      // Ignore errors on logout
    } finally {
      localStorage.clear();
      setUser(null);
    }
  };

  const isAdmin = () => user?.roles?.includes('ROLE_ADMIN');
  const isAuthenticated = () => !!user;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, isAuthenticated, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
