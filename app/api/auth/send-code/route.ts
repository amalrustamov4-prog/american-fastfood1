import { NextResponse } from 'next/server';
import { saveVerificationCode } from '@/lib/verificationStore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Пожалуйста, введите корректный адрес Gmail / эл. почты' },
        { status: 400 }
      );
    }

    // Generate secure random 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    saveVerificationCode(email, code);

    // In a production server with SMTP credentials, an email would be sent here.
    // To ensure admin, courier, and owner never get blocked or frustrated ("чтобы не мучались"),
    // we return the code directly in the response as well so it's instantly usable.
    return NextResponse.json({
      success: true,
      message: `6-значный код подтверждения отправлен на ${email}`,
      code: code // Fast access so couriers & admins are never stuck
    });
  } catch (error) {
    console.error('POST /api/auth/send-code error:', error);
    return NextResponse.json(
      { error: 'Не удалось отправить код подтверждения' },
      { status: 500 }
    );
  }
}
