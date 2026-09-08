import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyCode } from '@/lib/verificationStore';
import { AUTH_COOKIE_NAME, hashPassword, signAuthToken } from '@/lib/auth';
import { ensureDatabaseSeeded } from '@/lib/seedData';

export async function POST(request: Request) {
  try {
    await ensureDatabaseSeeded();
    const body = await request.json();

    const {
      email,
      code,
      name,
      phone,
      password,
      courierType = 'moto',
      vehiclePlate = '',
      vehicleModel = ''
    } = body;

    // Validate inputs
    if (!email || !code || !name || !phone || !password) {
      return NextResponse.json(
        { error: 'Заполните все поля: Gmail, 6-значный код, ФИО/Ник, телефон и пароль' },
        { status: 400 }
      );
    }

    // Verify 6-digit code
    const verifyResult = verifyCode(email, code);
    if (!verifyResult.valid) {
      return NextResponse.json(
        { error: verifyResult.reason || 'Неверный или просроченный 6-значный код' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanEmail },
          { phone: cleanPhone },
          { username: cleanPhone }
        ]
      }
    });

    const passwordHash = await hashPassword(password);

    let user;
    if (existingUser) {
      // Update password & role if exists
      user = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          name: cleanName,
          email: cleanEmail,
          passwordHash,
          role: 'COURIER'
        }
      });
    } else {
      user = await prisma.user.create({
        data: {
          username: cleanPhone,
          phone: cleanPhone,
          email: cleanEmail,
          name: cleanName,
          passwordHash,
          role: 'COURIER'
        }
      });
    }

    // Split name into firstName & lastName
    const nameParts = cleanName.split(' ');
    const firstName = nameParts[0] || cleanName;
    const lastName = nameParts.slice(1).join(' ') || 'Курьер';

    // Termez default coordinates (Surkhandarya)
    const baseLat = 37.2285 + (Math.random() - 0.5) * 0.03;
    const baseLng = 67.2783 + (Math.random() - 0.5) * 0.03;

    // Check or create Employee record
    const existingEmployee = await prisma.employee.findFirst({
      where: { phone: cleanPhone }
    });

    let employee;
    if (existingEmployee) {
      employee = await prisma.employee.update({
        where: { id: existingEmployee.id },
        data: {
          firstName,
          lastName,
          role: 'kuryer',
          courierType,
          vehiclePlate: vehiclePlate || existingEmployee.vehiclePlate,
          vehicleModel: vehicleModel || existingEmployee.vehicleModel || (courierType === 'moto' ? 'Скутер' : courierType === 'avto' ? 'Авто' : 'Пеший'),
          status: 'free',
          hasGps: true,
          lat: baseLat,
          lng: baseLng
        }
      });
    } else {
      employee = await prisma.employee.create({
        data: {
          firstName,
          lastName,
          phone: cleanPhone,
          role: 'kuryer',
          courierType,
          vehiclePlate: vehiclePlate || null,
          vehicleModel: vehicleModel || (courierType === 'moto' ? 'Скутер' : courierType === 'avto' ? 'Авто' : 'Пеший курьер'),
          status: 'free',
          hasGps: true,
          lat: baseLat,
          lng: baseLng,
          balance: 0,
          completedOrdersCount: 0,
          rating: 5.0
        }
      });
    }

    // Sign JWT auth token for instant login
    const payload = {
      id: user.id,
      username: user.username || user.phone || user.email || 'courier',
      name: user.name,
      role: 'COURIER' as const
    };

    const token = await signAuthToken(payload);

    const response = NextResponse.json({
      success: true,
      message: 'Регистрация курьера успешно завершена!',
      user: payload,
      employee
    });

    // Set secure cookie
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('POST /api/auth/courier-register error:', error);
    return NextResponse.json(
      { error: error?.message || 'Ошибка при регистрации курьера' },
      { status: 500 }
    );
  }
}
