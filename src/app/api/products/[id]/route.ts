import { NextRequest, NextResponse } from 'next/server';
import { deleteStoredProduct, addOrUpdateProduct } from '@/lib/productService';
import { Product } from '@/types';

export const dynamic = 'force-dynamic';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const result = await deleteStoredProduct(id);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Gagal menghapus produk' },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: true, products: result.products });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan saat menghapus produk' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json() as Product;
    body.id = params.id;
    const result = await addOrUpdateProduct(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Gagal memperbarui produk' },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: true, product: body, products: result.products });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan saat memperbarui produk' },
      { status: 500 }
    );
  }
}
