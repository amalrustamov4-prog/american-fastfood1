import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const JWT_SECRET_STRING = process.env.JWT_SECRET || 'american-super-secret-jwt-key-2026-secure-token';
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET_STRING);
export const AUTH_COOKIE_NAME = 'american_auth_token';

export interface AuthUserPayload {
  id: string;
  username: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  role: 'ADMIN' | 'CUSTOMER';
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signAuthToken(payload: AuthUserPayload, rememberMe: boolean = true): Promise<string> {
  const expiration = rememberMe ? '30d' : '24h';
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiration)
    .sign(SECRET_KEY);
}

export async function verifyAuthToken(token: string): Promise<AuthUserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return {
      id: payload.id as string,
      username: (payload.username as string) || 'user',
      name: (payload.name as string) || 'Пользователь',
      email: payload.email as string | undefined,
      phone: payload.phone as string | undefined,
      role: (payload.role as 'ADMIN' | 'CUSTOMER') || 'CUSTOMER'
    };
  } catch (error) {
    return null;
  }
}

export async function getCurrentUser(): Promise<AuthUserPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifyAuthToken(token);
  } catch (error) {
    return null;
  }
}
