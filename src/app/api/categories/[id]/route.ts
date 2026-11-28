import { NextRequest, NextResponse } from 'next/server';
import { addOrUpdateCategory, deleteStoredCategory } from '@/lib/categoryService';
import { CategoryItem } from '@/types';

export const dynamic = 'force-dynamic';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = (await req.json()) as CategoryItem;
    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Nama kategori wajib diisi' },
        { status: 400 }
      );
    }

    const updated: CategoryItem = {
      ...body,
      id: params.id,
      name: body.name.trim(),
      description: body.description?.trim() || '',
      image:
        body.image?.trim() ||
        'https://images.unsplash.com/photo-1558981852-426c06a93f46?w=600&q=80',
      icon: body.icon?.trim() || '💡',
    };

    const result = await addOrUpdateCategory(updated);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Gagal memperbarui kategori' },
        { status: 500 }
      );
    }
    return NextResponse.json({
      success: true,
      category: updated,
      categories: result.categories,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan saat memperbarui kategori' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await deleteStoredCategory(params.id);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Gagal menghapus kategori' },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: true, categories: result.categories });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan saat menghapus kategori' },
      { status: 500 }
    );
  }
}
