import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

// Helper to configure writable SQLite in Vercel serverless environment
function setupDatabaseUrl() {
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('file:')) {
    return;
  }

  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    try {
      const tmpDb = '/tmp/dev.db';
      if (!fs.existsSync(tmpDb)) {
        const candidates = [
          path.join(process.cwd(), 'prisma', 'dev.db'),
          path.join(process.cwd(), 'dev.db'),
          path.resolve('./prisma/dev.db'),
          path.resolve('./dev.db')
        ];
        for (const candidate of candidates) {
          if (fs.existsSync(candidate)) {
            try {
              fs.copyFileSync(candidate, tmpDb);
              console.log('✅ SQLite db copied to /tmp/dev.db from', candidate);
              break;
            } catch (e) {
              console.error('Error copying db to /tmp:', e);
            }
          }
        }
      }
      process.env.DATABASE_URL = `file:${tmpDb}`;
    } catch (err) {
      console.error('setupDatabaseUrl error:', err);
    }
  }
}

setupDatabaseUrl();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error']
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

