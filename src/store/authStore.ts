import { create } from 'zustand';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import type { User } from '../types/auth.types';

interface AuthState {
  // Session
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;

  // Loading states
  isInitializing: boolean; // App bootstrap
  isLoading: boolean; // Auth operations (login/logout)

  // Error state
  initError: string | null;

  // Actions
  initialize: () => Promise<void>;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isInitializing: true,
  isLoading: false,
  initError: null,

  initialize: async () => {
    try {
      set({ isInitializing: true, initError: null });

      const token = await StorageService.getToken();

      if (token) {
        const { valid, user } = await AuthService.validateToken(token);
        if (valid && user) {
          set({ token, user, isAuthenticated: true });
        } else {
          // Token is invalid or expired — clear it
          await StorageService.clearToken();
          set({ token: null, user: null, isAuthenticated: false });
        }
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to initialize session';
      console.error('[AuthStore] Initialization failed:', error);
      set({ initError: message });
    } finally {
      set({ isInitializing: false });
    }
  },

  login: async (token: string, user: User) => {
    set({ isLoading: true });
    try {
      await StorageService.setToken(token);
      set({ token, user, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await StorageService.clearToken();
      set({ token: null, user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  setUser: (user: User | null) => set({ user }),
}));
