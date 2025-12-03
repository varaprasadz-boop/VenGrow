import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
}

export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters long" };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Password must contain at least one uppercase letter" };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: "Password must contain at least one lowercase letter" };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "Password must contain at least one number" };
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, message: "Password must contain at least one special character" };
  }
  return { valid: true };
}

// Read environment variables at runtime (not at module load time)
// This ensures dotenv has loaded before we access them
// Default credentials are provided as fallback
const DEFAULT_SUPERADMIN_EMAIL = "superadmin@vengrow.com";
const DEFAULT_SUPERADMIN_PASSWORD_HASH = "$2b$10$N1sHD/nd9YwsI7z.2E0RE.gs6kZCUz2.8nwAVsbpqTEkCu3O02fki";

function getSuperadminEmail(): string {
  return process.env.SUPERADMIN_EMAIL || DEFAULT_SUPERADMIN_EMAIL;
}

function getSuperadminPasswordHash(): string {
  return process.env.SUPERADMIN_PASSWORD_HASH || DEFAULT_SUPERADMIN_PASSWORD_HASH;
}

export async function getSuperadminCredentials(): Promise<{ email: string; passwordHash: string }> {
  return {
    email: getSuperadminEmail(),
    passwordHash: getSuperadminPasswordHash(),
  };
}

export async function verifySuperadminCredentials(email: string, password: string): Promise<boolean> {
  const credentials = await getSuperadminCredentials();
  
  if (email.toLowerCase() !== credentials.email.toLowerCase()) {
    return false;
  }
  
  return verifyPassword(password, credentials.passwordHash);
}
