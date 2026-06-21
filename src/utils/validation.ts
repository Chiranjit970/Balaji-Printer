import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
import { authConfig } from '../constants/auth.constants';
import { z } from 'zod';

/**
 * Centralised validation utilities for auth forms.
 */
export const validators = {
  /**
   * Validate Indian mobile number (10 digits, starts with 6-9).
   * Uses a simple regex — suitable for quick client-side checks.
   */
  isValidPhone(phone: string): boolean {
    const cleaned = phone.replace(/[\s-]/g, '');
    return authConfig.phoneRegex.test(cleaned);
  },

  /**
   * Validate phone number using libphonenumber-js (more robust).
   * Handles international formatting edge cases.
   */
  isValidPhoneE164(phone: string, countryCode: string = 'IN'): boolean {
    try {
      // libphonenumber-js expects a specific CountryCode type
      return isValidPhoneNumber(phone, countryCode as 'IN');
    } catch {
      return false;
    }
  },

  /**
   * Validate OTP (exactly 6 digits).
   */
  isValidOTP(otp: string): boolean {
    return new RegExp(`^\\d{${authConfig.otpLength}}$`).test(otp);
  },

  /**
   * Format phone number for display (e.g. +91 98765 43210).
   */
  formatPhone(phone: string, countryCode: string = 'IN'): string {
    try {
      const phoneNumber = parsePhoneNumber(phone, countryCode as 'IN');
      return phoneNumber?.formatInternational() ?? phone;
    } catch {
      return phone;
    }
  },

  /**
   * Get E.164 format for API calls (e.g. +919876543210).
   */
  getE164Phone(phone: string, countryCode: string = 'IN'): string {
    try {
      const phoneNumber = parsePhoneNumber(phone, countryCode as 'IN');
      return phoneNumber?.format('E.164') ?? phone;
    } catch {
      return phone;
    }
  },
};

export const addressSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(60, 'Name is too long'),
  phone: z
    .string()
    .regex(/^(\+91)?[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  line1: z
    .string()
    .min(5, 'Address is too short')
    .max(100, 'Address is too long'),
  line2: z.string().optional(),
  landmark: z.string().optional(),
  city: z.string().min(2, 'Enter a valid city'),
  state: z.string().min(2, 'Select a state'),
  pincode: z
    .string()
    .regex(/^[1-9][0-9]{5}$/, 'Enter a valid 6-digit pincode'),
  label: z.string().optional(),
});

export type AddressSchema = z.infer<typeof addressSchema>;

