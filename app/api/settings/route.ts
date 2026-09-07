import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CafeSettingsInputSchema } from '@/lib/validations/schemas';
import { getCurrentUser } from '@/lib/auth';
import { ensureDatabaseSeeded } from '@/lib/seedData';

export async function GET() {
  try {
    await ensureDatabaseSeeded();
    let settings = await prisma.cafeSettings.findUnique({
      where: { id: 'default' }
    });

    if (!settings) {
      settings = await prisma.cafeSettings.create({
        data: { id: 'default' }
      });
    }

    return NextResponse.json({
      name: settings.cafeName,
      brand: 'AMERICAN',
      slogan: 'Premium Fast Food, Pizza, Burgers, San Sebastian & Sushi',
      phone: settings.phone,
      phoneClean: settings.phone.replace(/[^0-9+]/g, ''),
      workHours: settings.workHours,
      deliveryTime: '25–35 мин',
      deliveryFee: settings.deliveryFee,
      freeDeliveryThreshold: settings.freeDeliveryThreshold,
      address: settings.address,
      currency: 'сум',
      isOpen: settings.isOpen,
      minOrderAmount: settings.minOrderAmount,
      bannerText: settings.bannerText
    });
  } catch (error) {
    console.error('GET /api/settings error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
    }

    const body = await request.json();
    const validation = CafeSettingsInputSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Неверные данные настроек', details: validation.error.format() },
        { status: 400 }
      );
    }

    const data = validation.data;

    const updated = await prisma.cafeSettings.upsert({
      where: { id: 'default' },
      update: {
        cafeName: data.cafeName,
        phone: data.phone,
        address: data.address,
        deliveryFee: data.deliveryFee,
        freeDeliveryThreshold: data.freeDeliveryThreshold,
        minOrderAmount: data.minOrderAmount,
        isOpen: data.isOpen,
        workHours: data.workHours,
        bannerText: data.bannerText || 'Бесплатная доставка от 150 000 сум! 🔥'
      },
      create: {
        id: 'default',
        cafeName: data.cafeName,
        phone: data.phone,
        address: data.address,
        deliveryFee: data.deliveryFee,
        freeDeliveryThreshold: data.freeDeliveryThreshold,
        minOrderAmount: data.minOrderAmount,
        isOpen: data.isOpen,
        workHours: data.workHours,
        bannerText: data.bannerText || 'Бесплатная доставка от 150 000 сум! 🔥'
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT /api/settings error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
