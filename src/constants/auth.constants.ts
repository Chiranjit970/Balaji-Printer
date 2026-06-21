import { colors } from './colors';

/**
 * Auth-specific semantic colors extending the base palette.
 * Used in login, OTP, and auth-related components.
 */
export const authColors = {
  ...colors,

  // Input states
  inputBackground: colors.white,
  inputBorder: colors.border,
  inputBorderFocus: colors.blue,
  inputBorderError: colors.danger,

  // Demo card
  demoCardBg: colors.blueLight,
  demoCardBorder: colors.blue,
  demoCardText: colors.blue,

  // Trust / info card
  trustCardBg: colors.surface,

  // OTP boxes
  otpBoxInactive: colors.surface,
  otpBoxActive: colors.blueLight,
  otpBoxFilled: colors.white,
  otpBoxBorder: colors.border,
  otpBoxBorderActive: colors.blue,
} as const;

/**
 * Configuration for the authentication flow.
 * In production, these would come from a backend config endpoint.
 */
export const authConfig = {
  /** Number of digits in the OTP */
  otpLength: 6,

  /** OTP validity period in seconds */
  otpExpirySeconds: 120,

  /** Demo OTP for testing (all environments) */
  demoOtp: '123456',

  /** Default country code for phone input */
  defaultCountryCode: 'IN' as const,

  /** Expected phone number length (Indian mobile) */
  phoneNumberLength: 10,

  /** Cooldown before allowing OTP resend (seconds) */
  resendCooldownSeconds: 30,

  /** Indian mobile number regex: starts with 6-9, exactly 10 digits */
  phoneRegex: /^[6-9]\d{9}$/,

  /** Maximum OTP verification attempts per session */
  maxOtpAttempts: 5,
} as const;
