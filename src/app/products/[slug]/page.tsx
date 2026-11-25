import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PRODUCTS } from '@/data/products';
import ProductDetailClient from './ProductDetailClient';

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = PRODUCTS.find((p) => p.slug === params.slug && p.is_active);
  if (!product) {
    return { title: 'Produk Tidak Ditemukan' };
  }
  return {
    title: product.name,
    description: product.description,
  };
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = PRODUCTS.find((p) => p.slug === params.slug && p.is_active);
  if (!product) return notFound();

  const related = PRODUCTS.filter(
    (p) => p.id !== product.id && p.category === product.category && p.is_active
  ).slice(0, 4);

  return <ProductDetailClient product={product} related={related} />;
}
