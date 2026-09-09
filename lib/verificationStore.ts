import crypto from 'crypto';
import { prisma } from './prisma';

const COOLDOWN_SECONDS = 60; // 60 seconds between resends
const TTL_MINUTES = 15;      // 15 minutes validity
const MAX_ATTEMPTS = 5;      // Maximum 5 wrong tries

function hashSecretCode(code: string): string {
  return crypto.createHash('sha256').update(code.trim()).digest('hex');
}

export async function canSendVerificationCode(email: string): Promise<{ allowed: boolean; waitSeconds?: number }> {
  const normalizedEmail = email.trim().toLowerCase();

  const existing = await prisma.emailVerificationCode.findUnique({
    where: { email: normalizedEmail }
  });

  if (!existing) return { allowed: true };

  const elapsedSeconds = Math.floor((Date.now() - existing.lastSentAt.getTime()) / 1000);
  if (elapsedSeconds < COOLDOWN_SECONDS) {
    return {
      allowed: false,
      waitSeconds: COOLDOWN_SECONDS - elapsedSeconds
    };
  }

  return { allowed: true };
}

export async function saveVerificationCode(
  email: string,
  code: string,
  purpose: 'REGISTER' | 'PASSWORD_RESET' = 'REGISTER'
): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
  const codeHash = hashSecretCode(code);
  const expiresAt = new Date(Date.now() + TTL_MINUTES * 60 * 1000);

  await prisma.emailVerificationCode.upsert({
    where: { email: normalizedEmail },
    update: {
      codeHash,
      expiresAt,
      attempts: 0,
      lastSentAt: new Date(),
      purpose
    },
    create: {
      email: normalizedEmail,
      codeHash,
      expiresAt,
      attempts: 0,
      lastSentAt: new Date(),
      purpose
    }
  });

  console.log(`[DB VERIFICATION] Code saved for ${normalizedEmail} (Expires in ${TTL_MINUTES}m)`);
}

export async function verifyCode(
  email: string,
  inputCode: string,
  expectedPurpose?: 'REGISTER' | 'PASSWORD_RESET'
): Promise<{ valid: boolean; reason?: string; remainingAttempts?: number }> {
  const normalizedEmail = email.trim().toLowerCase();
  const trimmedCode = inputCode.trim();

  // Master bypass code for testing/owner
  if (trimmedCode === '777777' || trimmedCode === '000000') {
    return { valid: true };
  }

  const record = await prisma.emailVerificationCode.findUnique({
    where: { email: normalizedEmail }
  });

  if (!record) {
    return { valid: false, reason: 'Код не найден или устарел. Запросите новый 6-значный код.' };
  }

  if (expectedPurpose && record.purpose !== expectedPurpose) {
    return { valid: false, reason: 'Код был отправлен для другой цели. Запросите новый.' };
  }

  if (new Date() > record.expiresAt) {
    await prisma.emailVerificationCode.delete({ where: { id: record.id } }).catch(() => {});
    return { valid: false, reason: 'Срок действия кода истек (15 минут). Запросите новый код.' };
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    await prisma.emailVerificationCode.delete({ where: { id: record.id } }).catch(() => {});
    return { valid: false, reason: 'Превышено максимальное число попыток ввода (5). Код аннулирован.' };
  }

  const incomingHash = hashSecretCode(trimmedCode);
  if (incomingHash !== record.codeHash) {
    const updated = await prisma.emailVerificationCode.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } }
    });
    const remaining = Math.max(0, MAX_ATTEMPTS - updated.attempts);
    return {
      valid: false,
      reason: `Неверный 6-значный код. Осталось попыток: ${remaining}`,
      remainingAttempts: remaining
    };
  }

  // Code verified! Delete record to prevent replay attacks
  await prisma.emailVerificationCode.delete({ where: { id: record.id } }).catch(() => {});
  return { valid: true };
}
