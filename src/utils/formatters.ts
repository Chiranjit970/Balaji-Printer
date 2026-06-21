/**
 * UI formatting utilities for phone numbers and text display.
 */

/**
 * Format a raw 10-digit phone string for display with spaces.
 * E.g. "9876543210" → "98765 43210"
 */
export function formatPhoneDisplay(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length <= 5) return cleaned;
  return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
}

/**
 * Mask the middle digits of a phone number for privacy.
 * E.g. "9876543210" → "987****210"
 */
export function maskPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 6) return cleaned;
  const start = cleaned.slice(0, 3);
  const end = cleaned.slice(-3);
  const masked = '*'.repeat(cleaned.length - 6);
  return `${start}${masked}${end}`;
}
