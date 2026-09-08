import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const updated = await prisma.employee.update({
      where: { id },
      data: body
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('PATCH /api/employees/[id] error:', error);
    return NextResponse.json({ error: 'Xodimni yangilashda xatolik' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.employee.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/employees/[id] error:', error);
    return NextResponse.json({ error: 'Xodimni o\'chirishda xatolik' }, { status: 500 });
  }
}
