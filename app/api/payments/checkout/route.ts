import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateClickPaymentUrl } from '@/lib/payments/click/clickService';
import { generatePaymePaymentUrl } from '@/lib/payments/payme/paymeService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, method } = body;

    if (!orderId || !method) {
      return NextResponse.json({ error: 'Параметры orderId и method обязательны' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return NextResponse.json({ error: 'Заказ не найден' }, { status: 404 });
    }

    let paymentUrl = '';
    if (method === 'click') {
      paymentUrl = generateClickPaymentUrl(order.id, order.total);
    } else if (method === 'payme') {
      paymentUrl = generatePaymePaymentUrl(order.id, order.total);
    } else {
      return NextResponse.json({ error: 'Неподдерживаемый метод онлайн-оплаты' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      method,
      amount: order.total,
      paymentUrl
    });
  } catch (error) {
    console.error('POST /api/payments/checkout error:', error);
    return NextResponse.json({ error: 'Ошибка генерации ссылки на оплату' }, { status: 500 });
  }
}
