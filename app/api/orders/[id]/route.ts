import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UpdateOrderStatusSchema } from '@/lib/validations/schemas';
import { getCurrentUser } from '@/lib/auth';

const ADMIN_ONLY_STATUSES = ['accepted', 'cooking', 'ready', 'completed', 'rejected'];

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

    const { status, paymentStatus, rejectionReason } = validation.data;

    // Check authentication and authorization
    const currentUser = await getCurrentUser();

    // Only ADMIN can set admin-only statuses
    if (ADMIN_ONLY_STATUSES.includes(status)) {
      if (!currentUser || currentUser.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Недостаточно прав. Только администратор может изменить этот статус.' },
          { status: 403 }
        );
      }
    }

    // Regular user can only cancel their OWN order when it's 'new'
    if (status === 'cancelled') {
      if (!currentUser) {
        return NextResponse.json(
          { error: 'Необходима авторизация для отмены заказа.' },
          { status: 401 }
        );
      }

      // If not admin, can only cancel own order and only when status is 'new'
      if (currentUser.role !== 'ADMIN') {
        const order = await prisma.order.findUnique({ where: { id } });
        if (!order) {
          return NextResponse.json({ error: 'Заказ не найден' }, { status: 404 });
        }
        if (order.userId !== currentUser.id) {
          return NextResponse.json(
            { error: 'Вы можете отменить только свой заказ.' },
            { status: 403 }
          );
        }
        if (order.status !== 'new') {
          return NextResponse.json(
            { error: 'Отменить можно только заказ в статусе «Новый». Обратитесь в ресторан.' },
            { status: 400 }
          );
        }
      }
    }

    const data: any = { status };
    if (paymentStatus) {
      data.paymentStatus = paymentStatus;
    }
    if (rejectionReason !== undefined) {
      data.rejectionReason = rejectionReason;
    }

    // If order is completed, mark payment as paid if cash_on_delivery or pending
    if (status === 'completed' && !paymentStatus) {
      data.paymentStatus = 'paid';
    }

    // Build status history comment
    const historyComments: Record<string, string> = {
      accepted: 'Заказ принят администратором',
      cooking: 'Блюда начали готовить на кухне',
      ready: 'Заказ готов к выдаче / упакован',
      completed: 'Заказ завершён и выдан',
      rejected: rejectionReason ? `Отклонён: ${rejectionReason}` : 'Заказ отклонён рестораном',
      cancelled: 'Заказ отменён клиентом'
    };

    // Update order and create history record in a transaction
    const updated = await prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { id },
        data,
        include: {
          items: true,
          statusHistory: {
            orderBy: { createdAt: 'asc' }
          }
        }
      });

      // Always create a status history entry
      await tx.orderStatusHistory.create({
        data: {
          orderId: id,
          status,
          comment: historyComments[status] || status
        }
      });

      // Re-fetch with fresh history
      return tx.order.findUnique({
        where: { id },
        include: {
          items: true,
          statusHistory: {
            orderBy: { createdAt: 'asc' }
          }
        }
      });
    });

    if (!updated) {
      return NextResponse.json({ error: 'Заказ не найден' }, { status: 404 });
    }

    return NextResponse.json({
      id: updated.id,
      orderNumber: updated.orderNumber || updated.id,
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
      rejectionReason: updated.rejectionReason,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
      items: updated.items.map((i) => ({
        id: i.productId || i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        selectedOptions: i.optionsJson ? JSON.parse(i.optionsJson) : []
      })),
      statusHistory: updated.statusHistory.map((h) => ({
        id: h.id,
        orderId: h.orderId,
        status: h.status,
        comment: h.comment,
        createdAt: h.createdAt.toISOString()
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
      include: {
        items: true,
        statusHistory: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!order) {
      return NextResponse.json({ error: 'Заказ не найден' }, { status: 404 });
    }

    return NextResponse.json({
      id: order.id,
      orderNumber: order.orderNumber || order.id,
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
      rejectionReason: order.rejectionReason,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      items: order.items.map((i) => ({
        id: i.productId || i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        selectedOptions: i.optionsJson ? JSON.parse(i.optionsJson) : []
      })),
      statusHistory: order.statusHistory.map((h) => ({
        id: h.id,
        orderId: h.orderId,
        status: h.status,
        comment: h.comment,
        createdAt: h.createdAt.toISOString()
      }))
    });
  } catch (error) {
    console.error('GET /api/orders/[id] error:', error);
    return NextResponse.json({ error: 'Ошибка получения заказа' }, { status: 500 });
  }
}
