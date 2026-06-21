import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { config } from '../constants/config';

/**
 * Secure token storage service.
 * Uses expo-secure-store (Android Keystore / iOS Keychain).
 * Falls back to localStorage on web.
 */
export const StorageService = {
  /**
   * Retrieve the stored auth token.
   * @returns The token string or null if not found.
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
   * @param token - The token string to store.
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
   * Remove the stored auth token (used during logout).
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
};
