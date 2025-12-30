/**
 * Shared validation utilities for email and phone numbers
 * Use these functions consistently across the application
 */

/**
 * Validates email format
 * @param email - Email address to validate
 * @returns true if email format is valid
 */
export function validateEmail(email: string): boolean {
  if (!email || !email.trim()) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates Indian mobile phone number format
 * Must be 10 digits starting with 6, 7, 8, or 9
 * @param phone - Phone number to validate (can include spaces/dashes)
 * @returns true if phone format is valid
 */
export function validatePhone(phone: string): boolean {
  if (!phone || !phone.trim()) return false;
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length === 10 && /^[6-9]\d{9}$/.test(cleaned);
}

/**
 * Cleans phone number by removing non-digit characters
 * @param phone - Phone number to clean
 * @returns cleaned phone number (digits only) or empty string
 */
export function cleanPhone(phone: string): string {
  if (!phone) return "";
  return phone.replace(/\D/g, "");
}

/**
 * Normalizes email by trimming and converting to lowercase
 * @param email - Email to normalize
 * @returns normalized email or empty string
 */
export function normalizeEmail(email: string): string {
  if (!email) return "";
  return email.trim().toLowerCase();
}

/**
 * Gets validation error message for email
 * @param email - Email to validate
 * @returns error message or null if valid
 */
export function getEmailValidationError(email: string): string | null {
  if (!email || !email.trim()) {
    return "Email is required";
  }
  if (!validateEmail(email)) {
    return "Please enter a valid email address";
  }
  return null;
}

/**
 * Gets validation error message for phone
 * @param phone - Phone to validate
 * @param required - Whether phone is required (default: false)
 * @returns error message or null if valid
 */
export function getPhoneValidationError(phone: string, required: boolean = false): string | null {
  if (!phone || !phone.trim()) {
    return required ? "Phone number is required" : null;
  }
  if (!validatePhone(phone)) {
    return "Please enter a valid 10-digit Indian mobile number starting with 6-9";
  }
  return null;
}
