import type { User } from '../types/auth.types';
import type {
  OTPGenerateResponse,
  OTPVerifyResponse,
} from '../types/otp.types';
import { MockOTPService } from './mockOtp.service';
import { StorageService } from './storage.service';

/**
 * Authentication service — single entry point for all auth operations.
 *
 * Currently backed by MockOTPService for demo mode.
 * In production, replace the method bodies with real API calls:
 *   requestOTP  → POST /auth/request-otp
 *   verifyOTP   → POST /auth/verify-otp
 *   validateToken → GET /auth/me
 */
export const AuthService = {
  /**
   * Validate a stored token and return the associated user.
   * Mock: checks token format and 30-day expiry.
   * Future: GET /auth/me with Bearer token.
   */
  async validateToken(
    token: string
  ): Promise<{ valid: boolean; user?: User }> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!token || !token.startsWith('mock_token_')) {
      return { valid: false };
    }

    const parts = token.split('_');
    if (parts.length < 4) {
      return { valid: false };
    }

    const timestamp = parseInt(parts[parts.length - 1], 10);
    if (isNaN(timestamp)) {
      return { valid: false };
    }

    const now = Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;

    if (now - timestamp > thirtyDays) {
      return { valid: false }; // Token expired
    }

    const phone = parts.length >= 5 ? parts[3] : '+919876543210';
    const existingProfile = await StorageService.getUserProfile(phone);
    const user: User = existingProfile || {
      id: parts[2],
      name: 'Test User',
      phone,
    };

    return {
      valid: true,
      user,
    };
  },

  /**
   * Generate a mock token for development.
   */
  generateMockToken(userId: string = '1'): string {
    return `mock_token_${userId}_${Date.now()}`;
  },

  /**
   * Request OTP for phone-based login.
   * Delegates to MockOTPService in demo mode.
   */
  async requestOTP(phone: string): Promise<OTPGenerateResponse> {
    return MockOTPService.requestOTP(phone);

    // Production version:
    // const response = await apiClient.post('/auth/request-otp', { phone });
    // return response.data;
  },

  /**
   * Verify OTP and create authenticated session.
   * Returns token + user on success.
   */
  async verifyOTP(
    phone: string,
    otp: string
  ): Promise<OTPVerifyResponse> {
    return MockOTPService.verifyOTP(phone, otp);

    // Production version:
    // const response = await apiClient.post('/auth/verify-otp', { phone, otp });
    // return response.data;
  },
};
