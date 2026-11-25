import { NextRequest, NextResponse } from 'next/server';
import { getStoredProducts, addOrUpdateProduct, saveAllProducts } from '@/lib/productService';
import { Product } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await getStoredProducts();
    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data produk' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // If an array of products is sent (bulk update)
    if (Array.isArray(body)) {
      await saveAllProducts(body);
      return NextResponse.json({ success: true, products: body });
    }

    const product = body as Product;
    if (!product.name || !product.category) {
      return NextResponse.json(
        { success: false, error: 'Nama produk dan kategori wajib diisi' },
        { status: 400 }
      );
    }

    const result = await addOrUpdateProduct(product);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Gagal menyimpan produk' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, product, products: result.products });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan saat memproses data' },
      { status: 500 }
    );
  }
}
