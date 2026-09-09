import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const authUser = await getCurrentUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { userId: authUser.id },
          ...(authUser.phone ? [{ phone: authUser.phone }] : [])
        ]
      },
      include: {
        items: true,
        statusHistory: {
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber || o.id,
      customerName: o.customerName,
      phone: o.phone,
      address: o.address,
      deliveryType: o.deliveryType as 'delivery' | 'pickup',
      paymentMethod: o.paymentMethod as any,
      paymentStatus: o.paymentStatus as any,
      status: o.status as any,
      itemsTotal: o.itemsTotal,
      discountAmount: o.discountAmount,
      promoCode: o.promoCode,
      deliveryFee: o.deliveryFee,
      total: o.total,
      comment: o.comment || '',
      rejectionReason: o.rejectionReason,
      createdAt: o.createdAt.toISOString(),
      items: o.items.map((i) => ({
        id: i.productId || i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        selectedOptions: i.optionsJson ? JSON.parse(i.optionsJson) : []
      })),
      statusHistory: o.statusHistory.map((h) => ({
        id: h.id,
        orderId: h.orderId,
        status: h.status,
        comment: h.comment,
        createdAt: h.createdAt.toISOString()
      }))
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('GET /api/orders/my error:', error);
    return NextResponse.json({ error: 'Ошибка получения истории заказов' }, { status: 500 });
  }
}
