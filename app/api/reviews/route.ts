import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ReviewInputSchema } from '@/lib/validations/schemas';
import { getCurrentUser } from '@/lib/auth';
import { ensureDatabaseSeeded } from '@/lib/seedData';

export async function GET(request: Request) {
  try {
    await ensureDatabaseSeeded();
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get('all') === 'true';

    const where: any = {};
    if (!showAll) {
      where.status = 'approved';
    }

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('GET /api/reviews error:', error);
    const { INITIAL_REVIEWS } = await import('@/lib/initialData');
    return NextResponse.json(INITIAL_REVIEWS);
  }
}

export async function POST(request: Request) {
  try {
    await ensureDatabaseSeeded();
    const body = await request.json();
    const validation = ReviewInputSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Неверные данные отзыва', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { author, rating, text, avatar } = validation.data;

    // Prevent spam / empty reviews
    if (!text || text.trim().length < 5) {
      return NextResponse.json(
        { error: 'Отзыв должен содержать минимум 5 символов' },
        { status: 400 }
      );
    }

    // New reviews require admin moderation (Anti-Fake System!)
    const review = await prisma.review.create({
      data: {
        author: author.trim(),
        rating,
        text: text.trim(),
        avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        date: new Date().toISOString().split('T')[0],
        status: 'pending' // requires admin approval to prevent fake reviews
      }
    });

    return NextResponse.json(
      { ...review, message: 'Отзыв отправлен на модерацию администратору! Спасибо.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/reviews error:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID обязателен' }, { status: 400 });

    const body = await request.json();
    const { status } = body;

    const updated = await prisma.review.update({
      where: { id },
      data: { status: status || 'approved' }
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID обязателен' }, { status: 400 });

    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
