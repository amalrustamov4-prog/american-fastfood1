import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { employeeId, phone, lat, lng, speed = 0, heading = 0 } = body;

    if (lat === undefined || lng === undefined) {
      return NextResponse.json(
        { error: 'Координаты lat и lng обязательны' },
        { status: 400 }
      );
    }

    const latitude = Number(lat);
    const longitude = Number(lng);

    // Identify employee by ID, phone, or current logged-in user
    let employee = null;

    if (employeeId) {
      employee = await prisma.employee.findUnique({
        where: { id: employeeId }
      });
    }

    if (!employee && phone) {
      employee = await prisma.employee.findFirst({
        where: { phone: phone.trim() }
      });
    }

    if (!employee) {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        employee = await prisma.employee.findFirst({
          where: {
            OR: [
              { phone: currentUser.username },
              { id: currentUser.id }
            ]
          }
        });
      }
    }

    if (!employee) {
      // Find the first courier to attach location to if not identified
      employee = await prisma.employee.findFirst({
        where: { role: 'kuryer' }
      });
    }

    if (employee) {
      const updated = await prisma.employee.update({
        where: { id: employee.id },
        data: {
          lat: latitude,
          lng: longitude,
          hasGps: true,
          status: employee.status === 'no_gps' ? 'free' : employee.status
        }
      });

      return NextResponse.json({
        success: true,
        employeeId: updated.id,
        lat: updated.lat,
        lng: updated.lng,
        hasGps: true
      });
    }

    return NextResponse.json({
      success: true,
      lat: latitude,
      lng: longitude,
      note: 'Location received'
    });
  } catch (error: any) {
    console.error('POST /api/courier/location error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update GPS location' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');

    if (employeeId) {
      const emp = await prisma.employee.findUnique({
        where: { id: employeeId },
        select: { id: true, firstName: true, lastName: true, lat: true, lng: true, hasGps: true, status: true }
      });
      return NextResponse.json(emp);
    }

    const couriers = await prisma.employee.findMany({
      where: { role: 'kuryer' },
      select: { id: true, firstName: true, lastName: true, phone: true, courierType: true, lat: true, lng: true, hasGps: true, status: true }
    });

    return NextResponse.json(couriers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch GPS locations' }, { status: 500 });
  }
}
