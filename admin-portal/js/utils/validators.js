/**
 * Validation utilities for Balaji Printers Admin Portal
 */

export const validators = {
  /**
   * Validate email format using RFC-compliant regex
   * @param {string} email
   * @returns {boolean}
   */
  isValidEmail(email) {
    if (!email) return false;
    // Standard email validation regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
  },

  /**
   * Check if string is non-empty (ignoring whitespace)
   * @param {string} value 
   * @returns {boolean}
   */
  isNonEmpty(value) {
    if (value === null || value === undefined) return false;
    return value.toString().trim().length > 0;
  },

  /**
   * Get validation error message for email
   * @param {string} email 
   * @returns {string|null} Error message or null if valid
   */
  getEmailError(email) {
    if (!this.isNonEmpty(email)) {
      return 'Email address is required';
    }
    if (!this.isValidEmail(email)) {
      return 'Please enter a valid email address';
    }
    return null;
  },

  /**
   * Get validation error message for password
   * @param {string} password 
   * @returns {string|null} Error message or null if valid
   */
  getPasswordError(password) {
    if (!this.isNonEmpty(password)) {
      return 'Password is required';
    }
    // Spec: No format check (allow any characters, any length at this stage)
    return null;
  }
};
