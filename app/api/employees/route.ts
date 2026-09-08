import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureDatabaseSeeded } from '@/lib/seedData';

export async function GET(request: Request) {
  try {
    await ensureDatabaseSeeded();
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const status = searchParams.get('status');

    const where: any = {};
    if (role && role !== 'all') {
      where.role = role;
    }
    if (status && status !== 'all') {
      where.status = status;
    }

    const employees = await prisma.employee.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(employees);
  } catch (error) {
    console.error('GET /api/employees error:', error);
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await ensureDatabaseSeeded();
    const body = await request.json();

    const {
      lastName,
      firstName,
      middleName,
      phone,
      birthDate,
      role = 'kuryer',
      courierType = 'piyoda',
      workCondition = '1,4% (Standart)',
      drivingExperienceDate,
      licenseNumber,
      licenseCountry = 'Uzbekistan',
      licenseIssueDate,
      licenseExpiryDate,
      address,
      jshshir,
      trafficSource = 'Organik trafik',
      hearingImpaired = false,
      notes,
      vehiclePlate,
      vehicleModel
    } = body;

    if (!lastName || !firstName || !phone) {
      return NextResponse.json(
        { error: 'Familiya, Ism va Telefon raqami to\'ldirilishi shart' },
        { status: 400 }
      );
    }

    // Default coords in city center with slight random offset for map visualization
    const randomOffsetLat = (Math.random() - 0.5) * 0.04;
    const randomOffsetLng = (Math.random() - 0.5) * 0.04;
    const baseLat = 37.2285 + randomOffsetLat;
    const baseLng = 67.2783 + randomOffsetLng;

    const created = await prisma.employee.create({
      data: {
        lastName,
        firstName,
        middleName: middleName || null,
        phone,
        birthDate: birthDate || null,
        role,
        courierType: role === 'kuryer' || role === 'taksi' ? courierType : null,
        workCondition: workCondition || '1,4% (Standart)',
        drivingExperienceDate: drivingExperienceDate || null,
        licenseNumber: licenseNumber || null,
        licenseCountry: licenseCountry || 'Uzbekistan',
        licenseIssueDate: licenseIssueDate || null,
        licenseExpiryDate: licenseExpiryDate || null,
        address: address || null,
        jshshir: jshshir || null,
        trafficSource: trafficSource || 'Organik trafik',
        hearingImpaired: !!hearingImpaired,
        notes: notes || null,
        vehiclePlate: vehiclePlate || null,
        vehicleModel: vehicleModel || (courierType === 'piyoda' ? 'Piyoda kuryer' : courierType === 'moto' ? 'Skuter / Moto' : 'Avtomobil'),
        status: 'free',
        hasGps: true,
        lat: baseLat,
        lng: baseLng,
        balance: 0,
        completedOrdersCount: 0,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'
      }
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/employees error:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ushbu telefon raqamiga ega xodim allaqachon ro\'yxatdan o\'tgan' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: 'Xodimni saqlashda xatolik' }, { status: 500 });
  }
}
