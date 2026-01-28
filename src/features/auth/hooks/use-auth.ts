import { useCallback } from 'react';

import { authService } from '../services';
import { authSelectors, useAuthStore, type User } from '../store/auth.store';

/**
 * Return type for the useAuth hook
 */
interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

/**
 * Custom hook for authentication operations
 * Provides a clean API for accessing auth state and actions
 */
export function useAuth(): UseAuthReturn {
  const user = useAuthStore(authSelectors.user);
  const isAuthenticated = useAuthStore(authSelectors.isAuthenticated);
  const isLoading = useAuthStore(authSelectors.isLoading);
  const error = useAuthStore(authSelectors.error);

  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const setError = useAuthStore((state) => state.setError);

  /**
   * Login function
   */
  const login = useCallback(
    async (email: string, password: string): Promise<User> => {
      setLoading(true);
      setError(null);

      try {
        const response = await authService.login({ email, password });
        setUser(response.user);
        localStorage.setItem('auth_token', response.access_token);
        return response.user;
      } catch {
        const errorMessage = 'Login failed. Please check your credentials.';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [setUser, setLoading, setError]
  );

  /**
   * Register function
   */
  const register = useCallback(
    async (name: string, email: string, password: string): Promise<User> => {
      setLoading(true);
      setError(null);

      try {
        const response = await authService.register({ name, email, password });
        setUser(response.user);
        localStorage.setItem('auth_token', response.access_token);
        return response.user;
      } catch {
        const errorMessage = 'Registration failed. Please try again.';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [setUser, setLoading, setError]
  );

  /**
   * Logout function
   * Clears user state and removes auth token
   */
  const logout = useCallback(() => {
    clearUser();
    localStorage.removeItem('auth_token');
  }, [clearUser]);

  /**
   * Update user profile
   */
  const updateProfile = useCallback(
    (updates: Partial<User>) => {
      if (user) {
        setUser({ ...user, ...updates });
      }
    },
    [user, setUser]
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
  };
}
