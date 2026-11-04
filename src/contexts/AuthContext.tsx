import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { superAdminService } from '../services/superAdminService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { mobile?: string; email?: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('superadmin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('superadmin_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('superadmin_token');
      if (storedToken) {
        try {
          const profile = await superAdminService.getCurrentUser();
          if (profile && (profile.data || profile.user || profile._id)) {
            const resolvedUser = profile.data || profile.user || profile;
            setUser(resolvedUser);
            localStorage.setItem('superadmin_user', JSON.stringify(resolvedUser));
          }
        } catch (err) {
          console.warn('Session expired or invalid token');
          localStorage.removeItem('superadmin_token');
          localStorage.removeItem('superadmin_user');
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    verifyToken();
  }, []);

  const login = async (credentials: { mobile?: string; email?: string; password: string }) => {
    setIsLoading(true);
    try {
      const res = await superAdminService.login(credentials);
      const authToken = res.token || res.data?.token;
      const authUser = res.user || res.data?.user || res.data;

      if (!authToken) {
        throw new Error('Authentication succeeded but no token received.');
      }

      localStorage.setItem('superadmin_token', authToken);
      localStorage.setItem('superadmin_user', JSON.stringify(authUser));
      setToken(authToken);
      setUser(authUser);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await superAdminService.logout();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
      }}
    >
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

