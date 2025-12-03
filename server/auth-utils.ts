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
function getSuperadminEmail(): string | undefined {
  return process.env.SUPERADMIN_EMAIL;
}

function getSuperadminPasswordHash(): string | undefined {
  return process.env.SUPERADMIN_PASSWORD_HASH;
}

function checkSuperadminConfiguration(): boolean {
  const email = getSuperadminEmail();
  const passwordHash = getSuperadminPasswordHash();
  
  if (!email || !passwordHash) {
    console.warn("WARNING: SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD_HASH must be set in environment variables");
    return false;
  }
  return true;
}

export async function getSuperadminCredentials(): Promise<{ email: string; passwordHash: string } | null> {
  if (!checkSuperadminConfiguration()) {
    return null;
  }
  
  return {
    email: getSuperadminEmail()!,
    passwordHash: getSuperadminPasswordHash()!,
  };
}

export async function verifySuperadminCredentials(email: string, password: string): Promise<boolean> {
  const credentials = await getSuperadminCredentials();
  
  if (!credentials) {
    console.error("Superadmin credentials not configured");
    return false;
  }
  
  if (email.toLowerCase() !== credentials.email.toLowerCase()) {
    return false;
  }
  
  return verifyPassword(password, credentials.passwordHash);
}
