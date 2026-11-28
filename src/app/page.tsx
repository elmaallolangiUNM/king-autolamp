import { getStoredProducts } from '@/lib/productService';
import { getStoredCategories } from '@/lib/categoryService';
import { getStoredProjects } from '@/lib/projectService';
import HomeClient from './HomeClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [products, categories, projects] = await Promise.all([
    getStoredProducts(),
    getStoredCategories(),
    getStoredProjects(),
  ]);

  return (
    <HomeClient
      initialProducts={products}
      initialCategories={categories}
      initialProjects={projects}
    />
  );
}
