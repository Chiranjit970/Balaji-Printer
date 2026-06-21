import { Address } from '../types/address.types';

export const AddressUtils = {
  /**
   * Format address to single display line
   */
  formatShort(address: Address): string {
    return `${address.line1}, ${address.city} - ${address.pincode}`;
  },

  /**
   * Format address to full multi-line display
   */
  formatFull(address: Address): string {
    const parts = [
      address.line1,
      address.line2,
      address.landmark,
      `${address.city}, ${address.state} - ${address.pincode}`,
    ].filter(Boolean);
    return parts.join('\n');
  },

  /**
   * Validate Indian pincode
   */
  isValidPincode(pincode: string): boolean {
    return /^[1-9][0-9]{5}$/.test(pincode);
  },

  /**
   * Validate Indian phone number
   */
  isValidPhone(phone: string): boolean {
    const cleaned = phone.replace(/[\s+\-]/g, '');
    return /^[6-9]\d{9}$/.test(cleaned) ||
           /^91[6-9]\d{9}$/.test(cleaned);
  },
};
