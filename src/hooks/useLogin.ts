import { useMutation } from '@tanstack/react-query';
import { AuthService } from '../services/auth.service';
import { useOTPStore } from '../store/otpStore';
import { validators } from '../utils/validation';

interface LoginPayload {
  phone: string;
}

interface LoginResult {
  phone: string;
  demoOTP: string;
  expiresAt: number;
}

/**
 * React Query mutation hook for phone login (OTP request).
 *
 * Validates the phone number, converts to E.164 format,
 * requests an OTP, and stores the session in otpStore.
 */
export function useLogin() {
  const setOTPSession = useOTPStore((state) => state.setOTPSession);

  return useMutation<LoginResult, Error, LoginPayload>({
    mutationFn: async (payload: LoginPayload) => {
      // Validate phone
      if (!validators.isValidPhone(payload.phone)) {
        throw new Error('Please enter a valid 10-digit mobile number');
      }

      // Get E.164 format for API
      const e164Phone = validators.getE164Phone(payload.phone);

      // Request OTP
      const response = await AuthService.requestOTP(e164Phone);

      if (!response.success) {
        throw new Error(response.message);
      }

      return {
        phone: e164Phone,
        demoOTP: response.otp ?? '',
        expiresAt: response.expiresAt,
      };
    },

    onSuccess: (data) => {
      setOTPSession(data.phone, data.demoOTP, data.expiresAt);
    },

    onError: (error: Error) => {
      console.error('[useLogin] Failed:', error.message);
    },
  });
}
