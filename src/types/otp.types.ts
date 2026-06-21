import type { User } from './auth.types';

/** In-memory OTP session (simulates backend DB record) */
export interface OTPSession {
  phone: string;
  otp: string;
  generatedAt: number;
  expiresAt: number;
  attempts: number;
}

/** Response from OTP generation / request */
export interface OTPGenerateResponse {
  success: boolean;
  /** The generated OTP — only returned in demo mode */
  otp?: string;
  expiresAt: number;
  message: string;
}

/** Response from OTP verification */
export interface OTPVerifyResponse {
  success: boolean;
  token?: string;
  user?: User;
  message: string;
}
