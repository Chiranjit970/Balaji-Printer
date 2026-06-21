import { create } from 'zustand';
import { authConfig } from '../constants/auth.constants';

interface OTPState {
  /** Phone number for the current OTP session */
  phone: string | null;
  /** Demo OTP value (displayed in DemoCard) */
  demoOTP: string | null;
  /** Unix timestamp when OTP expires */
  expiresAt: number | null;

  /** Whether the user can request a new OTP */
  isResendAvailable: boolean;
  /** Unix timestamp when resend cooldown ends */
  resendCooldownEnd: number | null;

  // Actions
  setOTPSession: (phone: string, demoOTP: string, expiresAt: number) => void;
  clearOTPSession: () => void;
  startResendCooldown: () => void;
  setResendAvailable: (available: boolean) => void;
}

/**
 * Zustand store for OTP session state.
 *
 * Tracks the current phone number, demo OTP, expiry, and
 * resend cooldown state for the OTP verification screen.
 */
export const useOTPStore = create<OTPState>((set) => ({
  phone: null,
  demoOTP: null,
  expiresAt: null,
  isResendAvailable: false,
  resendCooldownEnd: null,

  setOTPSession: (phone, demoOTP, expiresAt) => {
    set({
      phone,
      demoOTP,
      expiresAt,
      isResendAvailable: false,
    });
  },

  clearOTPSession: () => {
    set({
      phone: null,
      demoOTP: null,
      expiresAt: null,
      isResendAvailable: false,
      resendCooldownEnd: null,
    });
  },

  startResendCooldown: () => {
    const cooldownEnd =
      Date.now() + authConfig.resendCooldownSeconds * 1000;
    set({
      isResendAvailable: false,
      resendCooldownEnd: cooldownEnd,
    });
  },

  setResendAvailable: (available) => {
    set({ isResendAvailable: available });
  },
}));
