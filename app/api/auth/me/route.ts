import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const authPayload = await getCurrentUser();
    if (!authPayload) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    if (authPayload.id === 'admin-master') {
      return NextResponse.json({
        user: {
          id: 'admin-master',
          name: 'Главный Администратор',
          username: 'admin',
          email: 'admin@american-fastfood.uz',
          phone: '+998908220101',
          role: 'ADMIN'
        }
      });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: authPayload.id }
    });

    if (!dbUser) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: dbUser.id,
        name: dbUser.name,
        firstName: dbUser.firstName || '',
        lastName: dbUser.lastName || '',
        username: dbUser.username || dbUser.email || 'user',
        email: dbUser.email,
        phone: dbUser.phone,
        birthDate: dbUser.birthDate || '',
        address: dbUser.address || '',
        role: dbUser.role
      }
    });
  } catch (error) {
    console.error('GET /api/auth/me error:', error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
