import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UpdateOrderStatusSchema } from '@/lib/validations/schemas';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const validation = UpdateOrderStatusSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Неверные данные статуса', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { status, paymentStatus } = validation.data;

    const data: any = { status };
    if (paymentStatus) {
      data.paymentStatus = paymentStatus;
    }
    if (body.courierId) {
      data.courierId = body.courierId;
    }
    if (body.courierName) {
      data.courierName = body.courierName;
    }
    if (body.courierPhone) {
      data.courierPhone = body.courierPhone;
    }

    const updated = await prisma.order.update({
      where: { id },
      data,
      include: { items: true }
    });

    // If courier was assigned and delivering, update courier status
    if (body.courierId && status === 'delivering') {
      try {
        await prisma.employee.update({
          where: { id: body.courierId },
          data: { status: 'on_order' }
        });
      } catch (e) {
        // ignore if courier not in employee table
      }
    } else if (status === 'completed' && updated.courierId) {
      try {
        await prisma.employee.update({
          where: { id: updated.courierId },
          data: {
            status: 'free',
            completedOrdersCount: { increment: 1 }
          }
        });
      } catch (e) {
        // ignore
      }
    }

    return NextResponse.json({
      id: updated.id,
      orderNumber: updated.orderNumber,
      customerName: updated.customerName,
      phone: updated.phone,
      address: updated.address,
      deliveryType: updated.deliveryType,
      paymentMethod: updated.paymentMethod,
      paymentStatus: updated.paymentStatus,
      status: updated.status,
      itemsTotal: updated.itemsTotal,
      discountAmount: updated.discountAmount,
      promoCode: updated.promoCode,
      deliveryFee: updated.deliveryFee,
      total: updated.total,
      comment: updated.comment,
      courierId: updated.courierId,
      courierName: updated.courierName,
      courierPhone: updated.courierPhone,
      createdAt: updated.createdAt.toISOString(),
      items: updated.items.map((i) => ({
        id: i.productId || i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        selectedOptions: i.optionsJson ? JSON.parse(i.optionsJson) : []
      }))
    });
  } catch (error) {
    console.error('PATCH /api/orders/[id] error:', error);
    return NextResponse.json({ error: 'Не удалось обновить статус заказа' }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true }
    });

    if (!order) {
      return NextResponse.json({ error: 'Заказ не найден' }, { status: 404 });
    }

    return NextResponse.json({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      phone: order.phone,
      address: order.address,
      deliveryType: order.deliveryType,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      status: order.status,
      itemsTotal: order.itemsTotal,
      discountAmount: order.discountAmount,
      promoCode: order.promoCode,
      deliveryFee: order.deliveryFee,
      total: order.total,
      comment: order.comment,
      createdAt: order.createdAt.toISOString(),
      items: order.items.map((i) => ({
        id: i.productId || i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        selectedOptions: i.optionsJson ? JSON.parse(i.optionsJson) : []
      }))
    });
  } catch (error) {
    console.error('GET /api/orders/[id] error:', error);
    return NextResponse.json({ error: 'Ошибка получения заказа' }, { status: 500 });
  }
}
