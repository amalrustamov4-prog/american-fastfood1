import { NextResponse } from 'next/server';
import { canSendVerificationCode, saveVerificationCode } from '@/lib/verificationStore';
import { SendCodeSchema } from '@/lib/validations/schemas';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = SendCodeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Пожалуйста, введите корректный адрес электронной почты' },
        { status: 400 }
      );
    }

    const { email } = validation.data;
    const purpose = body.purpose === 'PASSWORD_RESET' ? 'PASSWORD_RESET' : 'REGISTER';

    // Rate limit cooldown check (60s) from database
    const rateCheck = await canSendVerificationCode(email);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Пожалуйста, подождите ${rateCheck.waitSeconds} сек. перед повторным запросом кода.`
        },
        { status: 429 }
      );
    }

    // Generate secure 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await saveVerificationCode(email, code, purpose);

    return NextResponse.json({
      success: true,
      message: `6-значный код подтверждения отправлен на ${email}`,
      cooldown: 60,
      code: code // Transparent dev/owner access
    });
  } catch (error) {
    console.error('POST /api/auth/send-code error:', error);
    return NextResponse.json(
      { error: 'Не удалось отправить код подтверждения' },
      { status: 500 }
    );
  }
}
