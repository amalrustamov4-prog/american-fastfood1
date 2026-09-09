import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getClickConfig, verifyClickSign } from '@/lib/payments/click/clickService';

/**
 * Click Webhook Handler
 * Documentation: https://docs.click.uz/click-api/
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const clickTransId = formData.get('click_trans_id')?.toString() || '';
    const serviceId = formData.get('service_id')?.toString() || '';
    const clickPaydocId = formData.get('click_paydoc_id')?.toString() || '';
    const merchantTransId = formData.get('merchant_trans_id')?.toString() || '';
    const amount = formData.get('amount')?.toString() || '';
    const action = formData.get('action')?.toString() || '0';
    const error = formData.get('error')?.toString() || '0';
    const signTime = formData.get('sign_time')?.toString() || '';
    const signString = formData.get('sign_string')?.toString() || '';

    const config = getClickConfig();

    // Verify signature
    const isValidSign = verifyClickSign(
      clickTransId,
      serviceId,
      config.secretKey,
      merchantTransId,
      amount,
      action,
      signTime,
      signString
    );

    if (!isValidSign) {
      return NextResponse.json({
        error: -1,
        error_note: 'SIGN CHECK FAILED!'
      });
    }

    // Check order in database
    const order = await prisma.order.findUnique({
      where: { id: merchantTransId }
    });

    if (!order) {
      return NextResponse.json({
        error: -5,
        error_note: 'User does not exist'
      });
    }

    // Action = 0: Prepare
    if (action === '0') {
      return NextResponse.json({
        click_trans_id: clickTransId,
        merchant_trans_id: merchantTransId,
        merchant_prepare_id: merchantTransId,
        error: 0,
        error_note: 'Success'
      });
    }

    // Action = 1: Complete
    if (action === '1') {
      await prisma.order.update({
        where: { id: merchantTransId },
        data: {
          paymentStatus: 'paid'
        }
      });

      return NextResponse.json({
        click_trans_id: clickTransId,
        merchant_trans_id: merchantTransId,
        merchant_confirm_id: merchantTransId,
        error: 0,
        error_note: 'Success'
      });
    }

    return NextResponse.json({
      error: -3,
      error_note: 'Action not found'
    });
  } catch (err) {
    console.error('Click webhook error:', err);
    return NextResponse.json({
      error: -8,
      error_note: 'Internal system error'
    });
  }
}
