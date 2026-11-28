import { getStoredProducts } from '@/lib/productService';
import { getStoredCategories } from '@/lib/categoryService';
import HomeClient from './HomeClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getStoredProducts(),
    getStoredCategories(),
  ]);

  return <HomeClient initialProducts={products} initialCategories={categories} />;
}
