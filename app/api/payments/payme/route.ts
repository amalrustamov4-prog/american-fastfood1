import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPaymeAuth } from '@/lib/payments/payme/paymeService';

/**
 * Payme JSON-RPC 2.0 Webhook Handler
 * Documentation: https://developer.help.paycom.uz/metody-merchant-api
 */
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!verifyPaymeAuth(authHeader)) {
      return NextResponse.json({
        error: { code: -32504, message: 'Insufficient privilege to perform the transaction' },
        id: null
      });
    }

    const body = await request.json();
    const { method, params, id } = body;

    switch (method) {
      case 'CheckPerformTransaction': {
        const orderId = params.account?.order_id;
        const order = await prisma.order.findUnique({ where: { id: orderId } });

        if (!order) {
          return NextResponse.json({
            error: { code: -31050, message: { ru: 'Заказ не найден', uz: 'Buyurtma topilmadi' } },
            id
          });
        }

        const requiredTiyin = Math.round(order.total * 100);
        if (params.amount !== requiredTiyin) {
          return NextResponse.json({
            error: { code: -31001, message: { ru: 'Неверная сумма', uz: 'Noto\'g\'ri summa' } },
            id
          });
        }

        return NextResponse.json({
          result: { allow: true },
          id
        });
      }

      case 'CreateTransaction': {
        const orderId = params.account?.order_id;
        const order = await prisma.order.findUnique({ where: { id: orderId } });

        if (!order) {
          return NextResponse.json({
            error: { code: -31050, message: { ru: 'Заказ не найден' } },
            id
          });
        }

        return NextResponse.json({
          result: {
            create_time: Date.now(),
            transaction: params.id,
            state: 1
          },
          id
        });
      }

      case 'PerformTransaction': {
        // Mark order as paid
        return NextResponse.json({
          result: {
            transaction: params.id,
            perform_time: Date.now(),
            state: 2
          },
          id
        });
      }

      case 'CheckTransaction': {
        return NextResponse.json({
          result: {
            create_time: Date.now() - 5000,
            perform_time: Date.now(),
            cancel_time: 0,
            transaction: params.id,
            state: 2,
            reason: null
          },
          id
        });
      }

      default:
        return NextResponse.json({
          error: { code: -32601, message: 'Method not found' },
          id
        });
    }
  } catch (error) {
    console.error('Payme webhook error:', error);
    return NextResponse.json({
      error: { code: -32400, message: 'Internal error' },
      id: null
    });
  }
}
