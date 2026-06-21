import axios from 'axios';
import { config } from '../constants/config';
import { useAuthStore } from '../store/authStore';

/**
 * Pre-configured axios instance for Laravel API calls.
 *
 * Features:
 * - Base URL from config
 * - Auto-attaches Bearer token from auth store
 * - Auto-logout on 401 responses (expired/invalid token)
 */
const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor: attach auth token
apiClient.interceptors.request.use(
  (requestConfig) => {
    const token = useAuthStore.getState().token;
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    return requestConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: handle 401 (auto-logout)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — trigger logout
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
