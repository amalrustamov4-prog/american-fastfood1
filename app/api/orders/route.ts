import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CreateOrderSchema } from '@/lib/validations/schemas';
import { ensureDatabaseSeeded } from '@/lib/seedData';

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
        items: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
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
      courierId: o.courierId,
      courierName: o.courierName,
      courierPhone: o.courierPhone,
      createdAt: o.createdAt.toISOString(),
      items: o.items.map((i) => ({
        id: i.productId || i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        selectedOptions: i.optionsJson ? JSON.parse(i.optionsJson) : []
      }))
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('GET /api/orders error:', error);
    const { INITIAL_ORDERS } = await import('@/lib/initialData');
    return NextResponse.json(INITIAL_ORDERS);
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
      items
    } = validation.data;

    // 1. Fetch products from database to calculate real prices (Server-side validation)
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

      // Calculate unit price including valid selected options
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

    // 3. Check and apply promo code on the server
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
    const orderId = `FF-${Math.floor(1000 + Math.random() * 9000)}`;

    // 5. Atomic save in database
    const createdOrder = await prisma.order.create({
      data: {
        id: orderId,
        orderNumber: orderId,
        customerName,
        phone,
        address: deliveryType === 'delivery' ? address : `Самовывоз: ${settings?.address || 'Кафе AMERICAN'}`,
        deliveryType,
        paymentMethod,
        paymentStatus: paymentMethod === 'cash' ? 'cash_on_delivery' : 'pending',
        status: 'new',
        itemsTotal: calculatedItemsTotal,
        discountAmount,
        promoCode: promoCode || null,
        deliveryFee,
        total: finalTotal,
        comment: comment || '',
        items: {
          create: orderItemsToCreate
        }
      },
      include: {
        items: true
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
