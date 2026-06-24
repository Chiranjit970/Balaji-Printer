import { create } from 'zustand';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import type { User } from '../types/auth.types';

interface AuthState {
  // Session
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;

  // Redirect handling
  redirectAfterAuth: string | null;

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
  setRedirectAfterAuth: (path: string | null) => void;
  updateUserName: (name: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  redirectAfterAuth: null,
  isInitializing: true,
  isLoading: false,
  initError: null,
  setRedirectAfterAuth: (path) => set({ redirectAfterAuth: path }),

  initialize: async () => {
    try {
      set({ isInitializing: true, initError: null });

      const token = await StorageService.getToken();
      const storedUser = await StorageService.getUser();
      const authUser = await StorageService.getAuthUser();

      if (token && authUser?.isLoggedIn) {
        if (storedUser) {
          set({ token, user: storedUser, isAuthenticated: true });
        } else {
          const { valid, user } = await AuthService.validateToken(token);
          if (valid && user) {
            await StorageService.setUser(user);
            set({ token, user, isAuthenticated: true });
          } else {
            // Token is invalid or expired — clear it
            await StorageService.clearToken();
            await StorageService.clearUser();
            await StorageService.clearAuthUser();
            set({ token: null, user: null, isAuthenticated: false });
          }
        }
      } else {
        // Not logged in or no token — ensure clean state
        set({ token: null, user: null, isAuthenticated: false });
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
      
      // Load mapped profile if exists, otherwise save this one
      const existingProfile = await StorageService.getUserProfile(user.phone);
      const profileToUse = existingProfile ? { ...user, ...existingProfile } : user;
      
      await StorageService.setUser(profileToUse);
      await StorageService.saveUserProfile(profileToUse);
      await StorageService.setAuthUser({
        phone: profileToUse.phone,
        isLoggedIn: true,
        loginTime: Date.now(),
      });
      set({ token, user: profileToUse, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await StorageService.clearToken();
      await StorageService.clearUser();
      await StorageService.clearAuthUser();
      set({ token: null, user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  setUser: (user: User | null) => {
    if (user) {
      StorageService.setUser(user).catch((err) =>
        console.error('[AuthStore] Failed to persist user:', err)
      );
      StorageService.saveUserProfile(user).catch((err) =>
        console.error('[AuthStore] Failed to persist mapped user profile:', err)
      );
    } else {
      StorageService.clearUser().catch((err) =>
        console.error('[AuthStore] Failed to clear user:', err)
      );
    }
    set({ user });
  },

  updateUserName: (name: string) =>
    set((state) => {
      const currentUser = state.user || {
        id: `guest_${Date.now()}`,
        phone: '+91 XXXXX XXXXX',
        name: '',
        createdAt: new Date().toISOString(),
      };
      const updatedUser = { ...currentUser, name };

      StorageService.setUser(updatedUser).catch((err) =>
        console.error('[AuthStore] Failed to persist name update:', err)
      );
      StorageService.saveUserProfile(updatedUser).catch((err) =>
        console.error('[AuthStore] Failed to persist name update mapped:', err)
      );

      const token = state.token || `mock_token_guest_${Date.now()}`;
      if (!state.token) {
        StorageService.setToken(token).catch((err) =>
          console.error('[AuthStore] Failed to persist guest token:', err)
        );
      }

      StorageService.setAuthUser({
        phone: updatedUser.phone,
        isLoggedIn: true,
        loginTime: Date.now(),
      }).catch((err) =>
        console.error('[AuthStore] Failed to persist guest auth:', err)
      );

      return { token, user: updatedUser, isAuthenticated: true };
    }),
}));

