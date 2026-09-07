import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ProductInputSchema } from '@/lib/validations/schemas';
import { getCurrentUser } from '@/lib/auth';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
    }

    const { id } = params;
    const body = await request.json();

    // Check if it's a simple stock toggle
    if (typeof body.inStock === 'boolean' && Object.keys(body).length === 1) {
      const updated = await prisma.product.update({
        where: { id },
        data: { inStock: body.inStock }
      });
      return NextResponse.json(updated);
    }

    const validation = ProductInputSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Ошибка валидации', details: validation.error.format() },
        { status: 400 }
      );
    }

    const data = validation.data;

    const updated = await prisma.product.update({
      where: { id },
      data: {
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

    return NextResponse.json({
      id: updated.id,
      name: updated.name,
      category: updated.categoryId,
      price: updated.price,
      oldPrice: updated.oldPrice,
      weight: updated.weight || '',
      calories: updated.calories || '',
      image: updated.image,
      description: updated.description || '',
      inStock: updated.inStock,
      options: updated.optionsJson ? JSON.parse(updated.optionsJson) : []
    });
  } catch (error) {
    console.error('PUT /api/products/[id] error:', error);
    return NextResponse.json({ error: 'Не удалось обновить товар' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
    }

    const { id } = params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Товар удален' });
  } catch (error) {
    console.error('DELETE /api/products/[id] error:', error);
    return NextResponse.json({ error: 'Не удалось удалить товар' }, { status: 500 });
  }
}
