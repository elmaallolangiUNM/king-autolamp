import Link from 'next/link';
import Image from 'next/image';

// Reuse category data
const CATEGORY_LIST = [
  { name: 'LED Projector', href: '/products?category=LED+Projector', image: 'https://images.unsplash.com/photo-1558981852-426c06a93f46?w=600&q=80', desc: 'Proyektor bi-LED super terang untuk visibilitas maksimal' },
  { name: 'LED Headlight', href: '/products?category=LED+Headlight', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80', desc: 'Headlight LED canbus ready, plug-and-play' },
  { name: 'Mini Projector', href: '/products?category=Mini+Projector', image: 'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=600&q=80', desc: 'Projector kompak untuk motor dan kendaraan kecil' },
  { name: 'Fog Lamp', href: '/products?category=Fog+Lamp', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=80', desc: 'Lampu kabut optimal untuk cuaca ekstrem' },
  { name: 'Headlamp', href: '/products?category=Headlamp', image: 'https://images.unsplash.com/photo-1558981852-426c06a93f46?w=600&q=80', desc: 'Headlamp projector retrofit premium' },
  { name: 'Automotive Accessories', href: '/products?category=Automotive+Accessories', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80', desc: 'DRL, ballast, strips dan aksesori otomotif' },
];

export default function CategoriesPage() {
  return (
    <div className="pt-20 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-10">
        <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-2">Kategori</p>
        <h1 className="section-title">Semua Kategori</h1>
        <p className="section-subtitle">Pilih kategori produk yang sesuai kebutuhan kendaraan Anda</p>
        <div className="accent-line" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORY_LIST.map((cat) => (
          <Link
            key={cat.name}
            href={cat.href}
            className="card group overflow-hidden hover:scale-[1.02] transition-transform duration-300"
          >
            <div className="relative h-48 bg-dark-300">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h2 className="text-white font-bold text-xl group-hover:text-primary transition-colors">
                  {cat.name}
                </h2>
                <p className="text-gray-300 text-sm mt-1">{cat.desc}</p>
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
