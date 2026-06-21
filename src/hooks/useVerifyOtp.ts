import { useMutation } from '@tanstack/react-query';
import { AuthService } from '../services/auth.service';
import { useAuthStore } from '../store/authStore';
import { useOTPStore } from '../store/otpStore';
import { validators } from '../utils/validation';
import type { User } from '../types/auth.types';

interface VerifyPayload {
  phone: string;
  otp: string;
}

interface VerifyResult {
  token: string;
  user: User;
}

/**
 * React Query mutation hook for OTP verification.
 *
 * Validates OTP format, verifies against the mock service,
 * saves the session token, and clears the OTP session.
 * Navigation is handled by the calling screen component.
 */
export function useVerifyOTP() {
  const login = useAuthStore((state) => state.login);
  const clearOTPSession = useOTPStore((state) => state.clearOTPSession);

  return useMutation<VerifyResult, Error, VerifyPayload>({
    mutationFn: async (payload: VerifyPayload) => {
      // Validate OTP format
      if (!validators.isValidOTP(payload.otp)) {
        throw new Error('OTP must be 6 digits');
      }

      // Verify OTP
      const response = await AuthService.verifyOTP(
        payload.phone,
        payload.otp
      );

      if (!response.success) {
        throw new Error(response.message);
      }

      if (!response.token || !response.user) {
        throw new Error('Invalid server response');
      }

      return {
        token: response.token,
        user: response.user,
      };
    },

    onSuccess: async (data) => {
      // Save token and user to auth store (persists to SecureStore)
      await login(data.token, data.user);

      // Clear OTP session
      clearOTPSession();
    },

    onError: (error: Error) => {
      console.error('[useVerifyOTP] Failed:', error.message);
    },
  });
}
