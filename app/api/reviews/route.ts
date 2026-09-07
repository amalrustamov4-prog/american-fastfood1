import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ReviewInputSchema } from '@/lib/validations/schemas';
import { getCurrentUser } from '@/lib/auth';
import { ensureDatabaseSeeded } from '@/lib/seedData';

export async function GET() {
  try {
    await ensureDatabaseSeeded();
    const reviews = await prisma.review.findMany({
      where: { status: 'approved' },
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

    const review = await prisma.review.create({
      data: {
        author,
        rating,
        text,
        avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        date: new Date().toISOString().split('T')[0],
        status: 'approved'
      }
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('POST /api/reviews error:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID обязателен' }, { status: 400 });

    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
