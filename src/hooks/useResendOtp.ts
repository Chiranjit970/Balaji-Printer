import { useMutation } from '@tanstack/react-query';
import { AuthService } from '../services/auth.service';
import { useOTPStore } from '../store/otpStore';

/**
 * React Query mutation hook for resending OTP.
 *
 * Re-requests an OTP for the current phone number in the OTP store,
 * updates the session with the new OTP/expiry, and starts a cooldown
 * timer to prevent rapid re-sends.
 */
export function useResendOTP() {
  const phone = useOTPStore((state) => state.phone);
  const setOTPSession = useOTPStore((state) => state.setOTPSession);
  const startResendCooldown = useOTPStore(
    (state) => state.startResendCooldown
  );

  return useMutation<{ demoOTP: string; expiresAt: number }, Error, void>({
    mutationFn: async () => {
      if (!phone) {
        throw new Error('No active OTP session');
      }

      const response = await AuthService.requestOTP(phone);

      if (!response.success) {
        throw new Error(response.message);
      }

      return {
        demoOTP: response.otp ?? '',
        expiresAt: response.expiresAt,
      };
    },

    onSuccess: (data) => {
      if (phone) {
        // Update OTP session with new OTP and expiry
        setOTPSession(phone, data.demoOTP, data.expiresAt);

        // Start cooldown timer for next resend
        startResendCooldown();
      }
    },

    onError: (error: Error) => {
      console.error('[useResendOTP] Failed:', error.message);
    },
  });
}
