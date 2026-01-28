import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import type { BaseStore } from '@/types/store.types';

/**
 * User interface representing an authenticated user
 */
export interface User {
  id?: string;
  _id?: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

/**
 * AuthState interface defining the shape of the authentication store
 */
export interface AuthState extends BaseStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User) => void;
  clearUser: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

/**
 * Initial state for the auth store
 */
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
} as const;

/**
 * Auth store using Zustand with devtools and persistence
 * Provides state management for user authentication
 */
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setUser: (user: User) =>
          set({ user, isAuthenticated: true, error: null }, false, 'setUser'),

        clearUser: () => set({ user: null, isAuthenticated: false }, false, 'clearUser'),

        setLoading: (isLoading: boolean) => set({ isLoading }, false, 'setLoading'),

        setError: (error: string | null) => set({ error, isLoading: false }, false, 'setError'),

        _reset: () => set(initialState, false, '_reset'),
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'AuthStore' }
  )
);

/**
 * Typed selectors for the auth store
 * Use these to avoid type inference issues and improve performance
 */
export const authSelectors = {
  /** Select the current user */
  user: (state: AuthState) => state.user,

  /** Select authentication status */
  isAuthenticated: (state: AuthState) => state.isAuthenticated,

  /** Select loading status */
  isLoading: (state: AuthState) => state.isLoading,

  /** Select error message */
  error: (state: AuthState) => state.error,
} as const;
