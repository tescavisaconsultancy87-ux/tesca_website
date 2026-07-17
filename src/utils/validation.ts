/**
 * Utility functions for validating and sanitizing user inputs.
 */

// Simple email validation regex (RFC 5322 standard-ish)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Phone validation regex: allows digits, spaces, hyphens, parentheses, and optional leading '+'
const PHONE_REGEX = /^\+?[0-9\s\-()]{8,20}$/;

// Safe string matching for basic alphanumeric review inputs
const ALPHANUMERIC_SPACE_HYPHEN = /^[a-zA-Z0-9\s\-',.()]+$/;

export function validateEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const cleanEmail = email.trim();
  return cleanEmail.length <= 254 && EMAIL_REGEX.test(cleanEmail);
}

export function validatePhone(phone: string | null | undefined): boolean {
  if (!phone) return false;
  const cleanPhone = phone.trim();
  return PHONE_REGEX.test(cleanPhone);
}

export function validateName(name: string | null | undefined, maxLen = 100): boolean {
  if (!name) return false;
  const cleanName = name.trim();
  return cleanName.length > 0 && cleanName.length <= maxLen;
}

export function validateScoreRange(score: any, min: number, max: number): boolean {
  const num = parseFloat(score);
  return !isNaN(num) && num >= min && num <= max;
}

// Minimum length for admin account passwords.
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 16;

/**
 * Validate an admin password against a baseline strength policy:
 * at least MIN_PASSWORD_LENGTH and at most MAX_PASSWORD_LENGTH chars, with a lowercase letter,
 * an uppercase letter, and a digit. Returns a human-readable message when invalid.
 */
export function validatePassword(
  password: string | null | undefined
): { valid: boolean; message?: string } {
  if (!password) {
    return { valid: false, message: "Password is required." };
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { valid: false, message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.` };
  }
  if (password.length > MAX_PASSWORD_LENGTH) {
    return { valid: false, message: `Password must be at most ${MAX_PASSWORD_LENGTH} characters long.` };
  }
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    return {
      valid: false,
      message: "Password must include a lowercase letter, an uppercase letter, and a number.",
    };
  }
  return { valid: true };
}

export function sanitizeText(text: string | null | undefined, maxLen = 100): string {
  if (!text) return "";
  let cleaned = text.trim();
  // Strip simple HTML tags to prevent XSS
  cleaned = cleaned.replace(/<\/?[^>]+(>|$)/g, "");
  // Limit length
  if (cleaned.length > maxLen) {
    cleaned = cleaned.substring(0, maxLen);
  }
  return cleaned;
}

export function sanitizeReviewInput(text: string | null | undefined, maxLen = 50): string {
  if (!text) return "";
  const cleaned = text.trim().substring(0, maxLen);
  // Restrict to safe characters to prevent prompt injections
  if (!ALPHANUMERIC_SPACE_HYPHEN.test(cleaned)) {
    // Return filtered string with only letters, numbers, spaces, and hyphens
    return cleaned.replace(/[^a-zA-Z0-9\s\-]/g, "");
  }
  return cleaned;
}
