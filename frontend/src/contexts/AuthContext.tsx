import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types/auth';
import { authService } from '../services/authService';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true for initial check
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user && !!token;

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login({ username, password });

      if (response.success && response.data) {
        setUser(response.data.user);
        setToken(response.data.token);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.register({ username, password });

      if (response.success && response.data) {
        setUser(response.data.user);
        setToken(response.data.token);
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
    setError(null);
  };

  const checkAuth = async () => {
    setIsLoading(true);

    try {
      const isValid = await authService.verifyToken();

      if (isValid) {
        const storedUser = authService.getStoredUser();
        const storedToken = authService.getStoredToken();

        if (storedUser && storedToken) {
          setUser(storedUser);
          setToken(storedToken);
        }
      } else {
        logout();
      }
    } catch (err) {
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  // Check authentication on mount
  useEffect(() => {
    const checkInitialAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const storedUser = authService.getStoredUser();
          const storedToken = authService.getStoredToken();

          if (storedUser && storedToken) {
            // Verify token is still valid
            const isValid = await authService.verifyToken();
            if (isValid) {
              setUser(storedUser);
              setToken(storedToken);
            } else {
              authService.logout();
            }
          }
        }
      } catch (error) {
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkInitialAuth();
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};