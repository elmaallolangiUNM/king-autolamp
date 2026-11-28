import { NextRequest, NextResponse } from 'next/server';
import {
  getStoredCategories,
  addOrUpdateCategory,
  saveAllCategories,
} from '@/lib/categoryService';
import { CategoryItem } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await getStoredCategories();
    return NextResponse.json({ success: true, categories });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data kategori' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (Array.isArray(body)) {
      const ok = await saveAllCategories(body as CategoryItem[]);
      if (!ok) {
        return NextResponse.json(
          { success: false, error: 'Gagal menyimpan daftar kategori' },
          { status: 500 }
        );
      }
      return NextResponse.json({ success: true, categories: body });
    }

    const category = body as CategoryItem;
    if (!category.name || !category.name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Nama kategori wajib diisi' },
        { status: 400 }
      );
    }

    const cleanCategory: CategoryItem = {
      id: category.id || `cat_${Date.now()}`,
      name: category.name.trim(),
      description: category.description?.trim() || '',
      image:
        category.image?.trim() ||
        'https://images.unsplash.com/photo-1558981852-426c06a93f46?w=600&q=80',
      icon: category.icon?.trim() || '💡',
    };

    const result = await addOrUpdateCategory(cleanCategory);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Gagal menyimpan kategori ke database' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      category: cleanCategory,
      categories: result.categories,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan saat memproses kategori' },
      { status: 500 }
    );
  }
}
