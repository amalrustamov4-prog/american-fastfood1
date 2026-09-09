import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { LoginInputSchema } from '@/lib/validations/schemas';
import { AUTH_COOKIE_NAME, signAuthToken, verifyPassword } from '@/lib/auth';
import { ensureDatabaseSeeded } from '@/lib/seedData';

export async function POST(request: Request) {
  try {
    await ensureDatabaseSeeded();
    const body = await request.json();
    const validation = LoginInputSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Введите корректный логин/email и пароль' },
        { status: 400 }
      );
    }

    const { username, password, rememberMe } = validation.data;
    const cleanLogin = username.trim();

    // 1. Master admin fallback
    const masterAdminUser = (process.env.ADMIN_USERNAME || 'admin').trim();
    const masterAdminPass = (process.env.ADMIN_PASSWORD || 'admin_secure_password_2026').trim();

    if (
      (cleanLogin.toLowerCase() === masterAdminUser.toLowerCase() ||
        cleanLogin === 'admin' ||
        cleanLogin === '+998908220101' ||
        cleanLogin.toLowerCase() === 'admin@american-fastfood.uz') &&
      password === masterAdminPass
    ) {
      const payload = {
        id: 'admin-master',
        username: 'admin',
        name: 'Главный Администратор',
        email: 'admin@american-fastfood.uz',
        phone: '+998908220101',
        role: 'ADMIN' as const
      };

      const token = await signAuthToken(payload, rememberMe ?? true);
      const response = NextResponse.json({
        success: true,
        user: payload
      });

      const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24;

      response.cookies.set({
        name: AUTH_COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge
      });

      return response;
    }

    // 2. Lookup user by email, phone, or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanLogin.toLowerCase() },
          { phone: cleanLogin },
          { username: cleanLogin }
        ]
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь с такими данными не найден' },
        { status: 401 }
      );
    }

    // 3. Verify password hash
    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Неверный пароль' },
        { status: 401 }
      );
    }

    const payload = {
      id: user.id,
      username: user.email || user.phone || 'user',
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: (user.role as 'ADMIN' | 'CUSTOMER') || 'CUSTOMER'
    };

    const token = await signAuthToken(payload, rememberMe ?? true);
    const response = NextResponse.json({
      success: true,
      user: payload
    });

    const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24;

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
