import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { RegisterInputSchema } from '@/lib/validations/schemas';
import { verifyCode } from '@/lib/verificationStore';
import { AUTH_COOKIE_NAME, hashPassword, signAuthToken } from '@/lib/auth';
import { ensureDatabaseSeeded } from '@/lib/seedData';

export async function POST(request: Request) {
  try {
    await ensureDatabaseSeeded();
    const body = await request.json();
    const validation = RegisterInputSchema.safeParse(body);

    if (!validation.success) {
      const firstError = validation.error.issues?.[0]?.message || 'Неверные данные регистрации';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { username, firstName, lastName, phone, birthDate, email, password, code } = validation.data;
    const normalizedEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();
    const cleanUsername = username ? username.trim().toLowerCase() : null;

    // 1. Verify 6-digit confirmation code from database
    const codeResult = await verifyCode(normalizedEmail, code, 'REGISTER');
    if (!codeResult.valid) {
      return NextResponse.json(
        {
          error: codeResult.reason || 'Неверный или просроченный код',
          remainingAttempts: codeResult.remainingAttempts
        },
        { status: 400 }
      );
    }

    // 2. Check existing user by email, phone, or username
    if (cleanUsername) {
      const existingByUsername = await prisma.user.findUnique({
        where: { username: cleanUsername }
      });
      if (existingByUsername) {
        return NextResponse.json(
          { error: 'Никнейм уже занят. Пожалуйста, выберите другой никнейм.' },
          { status: 400 }
        );
      }
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: normalizedEmail },
          { phone: cleanPhone }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.email === normalizedEmail) {
        return NextResponse.json(
          { error: 'Пользователь с таким Email уже зарегистрирован' },
          { status: 400 }
        );
      }
      if (existingUser.phone === cleanPhone) {
        return NextResponse.json(
          { error: 'Пользователь с таким номером телефона уже зарегистрирован' },
          { status: 400 }
        );
      }
    }

    // 3. Hash password with bcrypt
    const passwordHash = await hashPassword(password);
    const fullName = `${firstName.trim()} ${lastName.trim()}`;

    // 4. Create user in SQLite database
    const newUser = await prisma.user.create({
      data: {
        username: cleanUsername || normalizedEmail.split('@')[0],
        name: fullName,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: cleanPhone,
        email: normalizedEmail,
        birthDate: birthDate ? birthDate.trim() : null,
        passwordHash,
        role: 'CUSTOMER'
      }
    });

    // 5. Create Auth session & cookie
    const payload = {
      id: newUser.id,
      username: newUser.username || newUser.email || 'user',
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: 'CUSTOMER' as const
    };

    const token = await signAuthToken(payload, true);
    const response = NextResponse.json({
      success: true,
      message: 'Аккаунт успешно создан!',
      user: payload
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30 // 30 days session
    });

    return response;
  } catch (error) {
    console.error('POST /api/auth/register error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка при создании аккаунта' },
      { status: 500 }
    );
  }
}
