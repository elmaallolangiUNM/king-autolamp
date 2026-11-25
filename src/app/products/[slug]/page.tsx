import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getStoredProducts } from '@/lib/productService';
import ProductDetailClient from './ProductDetailClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const products = await getStoredProducts();
  const product = products.find((p) => p.slug === params.slug && p.is_active);
  if (!product) {
    return { title: 'Produk Tidak Ditemukan | KING AUTOLAMP' };
  }
  return {
    title: `${product.name} | KING AUTOLAMP`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const products = await getStoredProducts();
  const product = products.find((p) => p.slug === params.slug && p.is_active);
  if (!product) return notFound();

  const related = products.filter(
    (p) => p.id !== product.id && p.category === product.category && p.is_active
  ).slice(0, 4);

  return <ProductDetailClient product={product} related={related} />;
}
