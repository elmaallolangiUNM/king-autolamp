import Link from 'next/link';
import Image from 'next/image';
import { getStoredCategories } from '@/lib/categoryService';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const categories = await getStoredCategories();

  return (
    <div className="pt-20 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-10">
        <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-2">Kategori</p>
        <h1 className="section-title">Semua Kategori</h1>
        <p className="section-subtitle">Pilih kategori produk yang sesuai kebutuhan kendaraan Anda</p>
        <div className="accent-line" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${encodeURIComponent(cat.name)}`}
            className="card group overflow-hidden hover:scale-[1.02] transition-transform duration-300"
          >
            <div className="relative h-48 bg-dark-300">
              <Image
                src={cat.image || 'https://images.unsplash.com/photo-1558981852-426c06a93f46?w=600&q=80'}
                alt={cat.name}
                fill
                unoptimized={cat.image?.startsWith('data:')}
                className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h2 className="text-white font-bold text-xl group-hover:text-primary transition-colors">
                  {cat.name}
                </h2>
                <p className="text-gray-300 text-sm mt-1">{cat.description}</p>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <span className="text-primary text-sm font-semibold">Lihat Produk</span>
              <span className="text-primary text-xl">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
