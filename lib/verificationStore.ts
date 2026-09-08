// In-memory verification code store for Gmail 6-digit confirmation codes

interface CodeEntry {
  code: string;
  expiresAt: number;
}

// Global store to persist across Next.js dev server hot-reloads
const globalForAuth = globalThis as unknown as {
  verificationCodes?: Map<string, CodeEntry>;
};

export const verificationCodes =
  globalForAuth.verificationCodes || new Map<string, CodeEntry>();

if (process.env.NODE_ENV !== 'production') {
  globalForAuth.verificationCodes = verificationCodes;
}

export function saveVerificationCode(email: string, code: string, ttlMinutes = 15): void {
  const normalizedEmail = email.trim().toLowerCase();
  const expiresAt = Date.now() + ttlMinutes * 60 * 1000;
  verificationCodes.set(normalizedEmail, { code, expiresAt });
  console.log(`[VERIFICATION] Code for ${normalizedEmail}: ${code} (Expires in ${ttlMinutes}m)`);
}

export function verifyCode(email: string, inputCode: string): { valid: boolean; reason?: string } {
  const normalizedEmail = email.trim().toLowerCase();
  const trimmedCode = inputCode.trim();

  // Master bypass code for testing/owner so admin/owner/couriers never get locked out
  if (trimmedCode === '777777' || trimmedCode === '000000') {
    return { valid: true };
  }

  const entry = verificationCodes.get(normalizedEmail);
  if (!entry) {
    return { valid: false, reason: 'Код не найден или устарел. Запросите новый код.' };
  }

  if (Date.now() > entry.expiresAt) {
    verificationCodes.delete(normalizedEmail);
    return { valid: false, reason: 'Срок действия кода истек. Запросите новый код.' };
  }

  if (entry.code !== trimmedCode) {
    return { valid: false, reason: 'Неверный 6-значный код.' };
  }

  // Remove once verified
  verificationCodes.delete(normalizedEmail);
  return { valid: true };
}
