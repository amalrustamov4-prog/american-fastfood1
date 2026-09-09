import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ResetPasswordSchema } from '@/lib/validations/schemas';
import { verifyCode } from '@/lib/verificationStore';
import { hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = ResetPasswordSchema.safeParse(body);

    if (!validation.success) {
      const firstError = validation.error.issues?.[0]?.message || 'Неверные данные';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { email, code, newPassword } = validation.data;
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Verify 6-digit code from database
    const codeResult = await verifyCode(normalizedEmail, code, 'PASSWORD_RESET');
    if (!codeResult.valid) {
      return NextResponse.json(
        {
          error: codeResult.reason || 'Неверный или просроченный код',
          remainingAttempts: codeResult.remainingAttempts
        },
        { status: 400 }
      );
    }

    // 2. Find user
    const user = await prisma.user.findFirst({
      where: { email: normalizedEmail }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь с таким Email не найден' },
        { status: 404 }
      );
    }

    // 3. Update password
    const newHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash }
    });

    return NextResponse.json({
      success: true,
      message: 'Пароль успешно обновлен! Теперь вы можете войти.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Не удалось сбросить пароль' },
      { status: 500 }
    );
  }
}
