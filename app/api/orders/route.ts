import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CreateOrderSchema } from '@/lib/validations/schemas';
import { ensureDatabaseSeeded } from '@/lib/seedData';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    await ensureDatabaseSeeded();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (status && status !== 'all') {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
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
      updatedAt: o.updatedAt ? o.updatedAt.toISOString() : o.createdAt.toISOString(),
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
    console.error('GET /api/orders error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    await ensureDatabaseSeeded();
    const body = await request.json();
    const validation = CreateOrderSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Неверные данные заказа', details: validation.error.format() },
        { status: 400 }
      );
    }

    const {
      customerName,
      phone,
      address,
      deliveryType,
      paymentMethod,
      comment,
      promoCode,
      items,
      userId
    } = validation.data;

    // Check optional authenticated user
    const currentUser = await getCurrentUser();
    const effectiveUserId = userId || currentUser?.id || null;

    // 1. Fetch products from database to calculate real prices
    const productIds = items.map((i) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    let calculatedItemsTotal = 0;
    const orderItemsToCreate: Array<{
      productId: string;
      name: string;
      price: number;
      quantity: number;
      optionsJson: string;
    }> = [];

    for (const item of items) {
      const dbProd = productMap.get(item.productId);
      if (!dbProd) {
        return NextResponse.json(
          { error: `Товар с ID ${item.productId} не найден в меню` },
          { status: 400 }
        );
      }

      const optionsPrice = (item.selectedOptions || []).reduce((sum, opt) => sum + Math.max(0, opt.price), 0);
      const unitPrice = dbProd.price + optionsPrice;
      const itemSubtotal = unitPrice * item.quantity;
      calculatedItemsTotal += itemSubtotal;

      orderItemsToCreate.push({
        productId: dbProd.id,
        name: dbProd.name,
        price: unitPrice,
        quantity: item.quantity,
        optionsJson: JSON.stringify(item.selectedOptions || [])
      });
    }

    // 2. Fetch cafe settings for delivery calculations
    const settings = await prisma.cafeSettings.findUnique({
      where: { id: 'default' }
    });

    const deliveryFeeRate = settings?.deliveryFee ?? 15000;
    const freeDeliveryLimit = settings?.freeDeliveryThreshold ?? 150000;

    let deliveryFee = 0;
    if (deliveryType === 'delivery') {
      deliveryFee = calculatedItemsTotal >= freeDeliveryLimit ? 0 : deliveryFeeRate;
    }

    // 3. Check and apply promo code
    let discountAmount = 0;
    if (promoCode && promoCode.trim()) {
      const dbPromo = await prisma.promoCode.findUnique({
        where: { code: promoCode.trim().toUpperCase() }
      });

      if (dbPromo && dbPromo.isActive && calculatedItemsTotal >= dbPromo.minOrder) {
        if (dbPromo.discountPercent > 0) {
          discountAmount = Math.round((calculatedItemsTotal * dbPromo.discountPercent) / 100);
        } else if (dbPromo.discountAmount > 0) {
          discountAmount = Math.min(calculatedItemsTotal, dbPromo.discountAmount);
        }
      }
    }

    // 4. Server-computed total
    const finalTotal = Math.max(0, calculatedItemsTotal - discountAmount + deliveryFee);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `AM-${randomSuffix}`;
    const orderId = `order_${Date.now()}_${randomSuffix}`;

    // 5. Save order in database (Status is NEW) + create first StatusHistory entry
    const createdOrder = await prisma.order.create({
      data: {
        id: orderId,
        orderNumber,
        userId: effectiveUserId && effectiveUserId !== 'admin-master' ? effectiveUserId : null,
        customerName,
        phone,
        address: deliveryType === 'delivery' ? address : `Самовывоз: ${settings?.address || 'Кафе AMERICAN'}`,
        deliveryType,
        paymentMethod,
        paymentStatus: paymentMethod === 'cash' ? 'cash_on_delivery' : 'pending',
        status: 'new', // Directly to admin
        itemsTotal: calculatedItemsTotal,
        discountAmount,
        promoCode: promoCode || null,
        deliveryFee,
        total: finalTotal,
        comment: comment || '',
        items: {
          create: orderItemsToCreate
        },
        statusHistory: {
          create: [
            {
              status: 'new',
              comment: 'Заказ оформлен клиентом'
            }
          ]
        }
      },
      include: {
        items: true,
        statusHistory: true
      }
    });

    return NextResponse.json(
      {
        id: createdOrder.id,
        orderNumber: createdOrder.orderNumber,
        customerName: createdOrder.customerName,
        phone: createdOrder.phone,
        address: createdOrder.address,
        deliveryType: createdOrder.deliveryType,
        paymentMethod: createdOrder.paymentMethod,
        paymentStatus: createdOrder.paymentStatus,
        status: createdOrder.status,
        itemsTotal: createdOrder.itemsTotal,
        discountAmount: createdOrder.discountAmount,
        promoCode: createdOrder.promoCode,
        deliveryFee: createdOrder.deliveryFee,
        total: createdOrder.total,
        comment: createdOrder.comment,
        createdAt: createdOrder.createdAt.toISOString(),
        items: createdOrder.items.map((i) => ({
          id: i.productId || i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          selectedOptions: i.optionsJson ? JSON.parse(i.optionsJson) : []
        })),
        statusHistory: createdOrder.statusHistory.map((h) => ({
          id: h.id,
          orderId: h.orderId,
          status: h.status,
          comment: h.comment,
          createdAt: h.createdAt.toISOString()
        }))
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/orders error:', error);
    return NextResponse.json(
      { error: 'Не удалось создать заказ на сервере' },
      { status: 500 }
    );
  }
}
