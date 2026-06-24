import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from '../constants/config';
import { STORAGE_KEYS } from '../constants/storage';

/**
 * Secure token storage service.
 * Uses expo-secure-store (Android Keystore / iOS Keychain) for sensitive tokens.
 * Uses AsyncStorage for general user details and profile state.
 */
export const StorageService = {
  /**
   * Retrieve the stored auth token.
   */
  async getToken(): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem(config.tokenKey);
      }
      return await SecureStore.getItemAsync(config.tokenKey);
    } catch (error) {
      console.error('[StorageService] Failed to get token:', error);
      return null;
    }
  },

  /**
   * Store the auth token securely.
   */
  async setToken(token: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(config.tokenKey, token);
        return;
      }
      await SecureStore.setItemAsync(config.tokenKey, token);
    } catch (error) {
      console.error('[StorageService] Failed to set token:', error);
      throw error;
    }
  },

  /**
   * Remove the stored auth token.
   */
  async clearToken(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(config.tokenKey);
        return;
      }
      await SecureStore.deleteItemAsync(config.tokenKey);
    } catch (error) {
      console.error('[StorageService] Failed to clear token:', error);
      throw error;
    }
  },

  /**
   * Retrieve the stored user details from profile storage.
   */
  async getUser(): Promise<any | null> {
    try {
      const userJson = await AsyncStorage.getItem(STORAGE_KEYS.profile);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('[StorageService] Failed to get user profile:', error);
      return null;
    }
  },

  /**
   * Store the user details in profile storage.
   */
  async setUser(user: any): Promise<void> {
    try {
      const userJson = JSON.stringify(user);
      await AsyncStorage.setItem(STORAGE_KEYS.profile, userJson);
    } catch (error) {
      console.error('[StorageService] Failed to set user profile:', error);
      throw error;
    }
  },

  /**
   * Remove the stored user details.
   */
  async clearUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.profile);
    } catch (error) {
      console.error('[StorageService] Failed to clear user profile:', error);
      throw error;
    }
  },

  /**
   * Retrieve auth session info.
   */
  async getAuthUser(): Promise<any | null> {
    try {
      const authJson = await AsyncStorage.getItem(STORAGE_KEYS.authUser);
      return authJson ? JSON.parse(authJson) : null;
    } catch (error) {
      console.error('[StorageService] Failed to get auth user session:', error);
      return null;
    }
  },

  /**
   * Save auth session info.
   */
  async setAuthUser(authData: { phone: string | null; isLoggedIn: boolean; loginTime: number }): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(authData));
    } catch (error) {
      console.error('[StorageService] Failed to set auth user session:', error);
      throw error;
    }
  },

  /**
   * Clear auth session info.
   */
  async clearAuthUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.authUser);
    } catch (error) {
      console.error('[StorageService] Failed to clear auth user session:', error);
      throw error;
    }
  },

  /**
   * Save a user profile persistently mapped by phone number.
   */
  async saveUserProfile(user: any): Promise<void> {
    try {
      const profilesJson = await AsyncStorage.getItem('@balaji_printers/all_profiles');
      const profiles = profilesJson ? JSON.parse(profilesJson) : {};
      profiles[user.phone] = user;
      await AsyncStorage.setItem('@balaji_printers/all_profiles', JSON.stringify(profiles));
    } catch (error) {
      console.error('[StorageService] Failed to save mapped user profile:', error);
    }
  },

  /**
   * Retrieve a user profile persistently mapped by phone number.
   */
  async getUserProfile(phone: string): Promise<any | null> {
    try {
      const profilesJson = await AsyncStorage.getItem('@balaji_printers/all_profiles');
      if (profilesJson) {
        const profiles = JSON.parse(profilesJson);
        return profiles[phone] || null;
      }
      return null;
    } catch (error) {
      console.error('[StorageService] Failed to get mapped user profile:', error);
      return null;
    }
  },
};
