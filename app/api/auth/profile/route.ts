import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request) {
  try {
    const authPayload = await getCurrentUser();
    if (!authPayload || authPayload.id === 'admin-master') {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, phone, birthDate, address } = body;

    const fullName = `${(firstName || '').trim()} ${(lastName || '').trim()}`.trim();

    const updated = await prisma.user.update({
      where: { id: authPayload.id },
      data: {
        name: fullName || undefined,
        firstName: firstName ? firstName.trim() : undefined,
        lastName: lastName ? lastName.trim() : undefined,
        phone: phone ? phone.trim() : undefined,
        birthDate: birthDate ? birthDate.trim() : undefined,
        address: address !== undefined ? address.trim() : undefined
      }
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updated.id,
        name: updated.name,
        firstName: updated.firstName,
        lastName: updated.lastName,
        email: updated.email,
        phone: updated.phone,
        birthDate: updated.birthDate,
        address: updated.address,
        role: updated.role
      }
    });
  } catch (error) {
    console.error('PUT /api/auth/profile error:', error);
    return NextResponse.json({ error: 'Не удалось обновить профиль' }, { status: 500 });
  }
}
