import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureDatabaseSeeded } from '@/lib/seedData';

export async function GET() {
  try {
    await ensureDatabaseSeeded();
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' }
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('GET /api/categories error:', error);
    const { INITIAL_CATEGORIES } = await import('@/lib/initialData');
    return NextResponse.json(INITIAL_CATEGORIES);
  }
}
