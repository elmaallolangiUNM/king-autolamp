import { Suspense } from 'react';
import { getStoredProducts } from '@/lib/productService';
import { getStoredCategories } from '@/lib/categoryService';
import ProductsClient from './ProductsClient';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getStoredProducts(),
    getStoredCategories(),
  ]);

  return (
    <Suspense fallback={<div className="pt-32 text-center text-gray-mid">Loading...</div>}>
      <ProductsClient initialProducts={products} initialCategories={categories} />
    </Suspense>
  );
}
