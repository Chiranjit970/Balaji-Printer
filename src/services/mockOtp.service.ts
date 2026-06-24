import { authConfig } from '../constants/auth.constants';
import type { User } from '../types/auth.types';
import type {
  OTPSession,
  OTPGenerateResponse,
  OTPVerifyResponse,
} from '../types/otp.types';

/**
 * Mock OTP service for demo/development.
 *
 * Simulates SMS-based OTP generation and verification using an in-memory
 * session store. The architecture mirrors a real backend so that swapping
 * to an actual SMS provider (e.g. Firebase Auth, BSNL, Twilio) requires
 * zero changes in the UI layer.
 *
 * Production swap checklist:
 * 1. Replace `requestOTP` with a POST to `/auth/request-otp`
 * 2. Replace `verifyOTP` with a POST to `/auth/verify-otp`
 * 3. Remove the `otp` field from `OTPGenerateResponse`
 * 4. Delete this file
 */

/** In-memory OTP sessions (simulates backend database) */
const otpSessions = new Map<string, OTPSession>();

export const MockOTPService = {
  /**
   * Generate and "send" an OTP for the given phone number.
   * In production: this would call an SMS provider API.
   */
  async requestOTP(phone: string): Promise<OTPGenerateResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const otp = authConfig.demoOtp;
    const generatedAt = Date.now();
    const expiresAt = generatedAt + authConfig.otpExpirySeconds * 1000;

    // Store session (overwrite any existing session for this phone)
    otpSessions.set(phone, {
      phone,
      otp,
      generatedAt,
      expiresAt,
      attempts: 0,
    });

    console.log(`[MOCK OTP] Generated OTP for ${phone}: ${otp}`);

    return {
      success: true,
      otp, // Only for demo mode — remove in production
      expiresAt,
      message: 'OTP sent successfully',
    };
  },

  /**
   * Verify an OTP entered by the user.
   * Returns a mock auth token and user on success.
   */
  async verifyOTP(
    phone: string,
    enteredOTP: string
  ): Promise<OTPVerifyResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const session = otpSessions.get(phone);

    // Session not found
    if (!session) {
      return {
        success: false,
        message: 'OTP expired or invalid. Please request a new one.',
      };
    }

    // Check expiry
    if (Date.now() > session.expiresAt) {
      otpSessions.delete(phone);
      return {
        success: false,
        message: 'OTP expired. Please request a new one.',
      };
    }

    // Increment attempts
    session.attempts += 1;

    // Max attempts exceeded
    if (session.attempts > authConfig.maxOtpAttempts) {
      otpSessions.delete(phone);
      return {
        success: false,
        message: 'Too many attempts. Please request a new OTP.',
      };
    }

    // Verify OTP
    if (session.otp !== enteredOTP) {
      return {
        success: false,
        message: 'Incorrect OTP. Please try again.',
      };
    }

    // Success — generate mock token and user
    otpSessions.delete(phone);

    const userId = `user_${Date.now()}`;
    const token = `mock_token_${userId}_${phone}_${Date.now()}`;
    const user: User = {
      id: userId,
      phone,
      name: null, // Will be collected in future profile completion
      createdAt: new Date().toISOString(),
    };

    console.log(`[MOCK OTP] Verification successful for ${phone}`);

    return {
      success: true,
      token,
      user,
      message: 'Verification successful',
    };
  },

  /**
   * Check remaining session expiry for UI countdown.
   * Returns the expiry timestamp or null if no session exists.
   */
  getSessionExpiry(phone: string): number | null {
    const session = otpSessions.get(phone);
    return session?.expiresAt ?? null;
  },
};
