import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ProductInputSchema } from '@/lib/validations/schemas';
import { getCurrentUser } from '@/lib/auth';
import { ensureDatabaseSeeded } from '@/lib/seedData';

export async function GET(request: Request) {
  try {
    await ensureDatabaseSeeded();
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category');
    const search = searchParams.get('search');

    const where: any = {};
    if (categoryId && categoryId !== 'all') {
      where.categoryId = categoryId;
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } }
      ];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    const formatted = products.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.categoryId,
      price: p.price,
      oldPrice: p.oldPrice,
      weight: p.weight || '',
      calories: p.calories || '',
      image: p.image,
      description: p.description || '',
      inStock: p.inStock,
      options: p.optionsJson ? JSON.parse(p.optionsJson) : []
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('GET /api/products error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
    }

    const body = await request.json();
    const validation = ProductInputSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Ошибка валидации товара', details: validation.error.format() },
        { status: 400 }
      );
    }

    const data = validation.data;
    const productId = data.id || `prod-custom-${Date.now()}`;

    // Ensure category exists
    await prisma.category.upsert({
      where: { id: data.categoryId },
      update: {},
      create: { id: data.categoryId, name: data.categoryId, sortOrder: 99 }
    });

    const created = await prisma.product.create({
      data: {
        id: productId,
        name: data.name,
        categoryId: data.categoryId,
        price: data.price,
        oldPrice: data.oldPrice || null,
        weight: data.weight || null,
        calories: data.calories || null,
        image: data.image,
        description: data.description || null,
        inStock: data.inStock,
        optionsJson: JSON.stringify(data.options || [])
      }
    });

    return NextResponse.json(
      {
        id: created.id,
        name: created.name,
        category: created.categoryId,
        price: created.price,
        oldPrice: created.oldPrice,
        weight: created.weight || '',
        calories: created.calories || '',
        image: created.image,
        description: created.description || '',
        inStock: created.inStock,
        options: created.optionsJson ? JSON.parse(created.optionsJson) : []
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/products error:', error);
    return NextResponse.json({ error: 'Не удалось создать товар' }, { status: 500 });
  }
}
