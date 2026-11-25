'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronRight, Shield, Package, MessageCircle, Wrench, Zap, TrendingUp } from 'lucide-react';
import { PRODUCTS, TESTIMONIALS } from '@/data/products';
import ProductCard from '@/components/ui/ProductCard';
import StarRating from '@/components/ui/StarRating';
import { useCart } from '@/context/CartContext';
import { CartItem } from '@/types';

const CATEGORIES = [
  {
    name: 'LED Projector',
    description: 'Projector bi-LED super terang',
    icon: '💡',
    href: '/products?category=LED+Projector',
  },
  {
    name: 'LED Headlight',
    description: 'Headlight LED canbus ready',
    icon: '🔦',
    href: '/products?category=LED+Headlight',
  },
  {
    name: 'Mini Projector',
    description: 'Kompak, terang & tahan lama',
    icon: '🎯',
    href: '/products?category=Mini+Projector',
  },
  {
    name: 'Fog Lamp',
    description: 'Optimal untuk kabut & hujan',
    icon: '🌫️',
    href: '/products?category=Fog+Lamp',
  },
  {
    name: 'Headlamp',
    description: 'Projector retrofit premium',
    icon: '🚗',
    href: '/products?category=Headlamp',
  },
  {
    name: 'Accessories',
    description: 'DRL, ballast & aksesoris',
    icon: '⚙️',
    href: '/products?category=Automotive+Accessories',
  },
];

const WHY_US = [
  {
    icon: Shield,
    title: 'Produk Berkualitas',
    desc: 'Semua produk terseleksi ketat dan bergaransi resmi dari supplier terpercaya.',
  },
  {
    icon: Package,
    title: 'Pilihan Produk Lengkap',
    desc: 'Tersedia ratusan varian lampu otomotif untuk semua jenis kendaraan.',
  },
  {
    icon: MessageCircle,
    title: 'Konsultasi Gratis',
    desc: 'Tim kami siap membantu konsultasi produk yang sesuai untuk kendaraan Anda.',
  },
  {
    icon: Wrench,
    title: 'Pelayanan Profesional',
    desc: 'Respon cepat, pengiriman aman, dan after-sales service yang memuaskan.',
  },
];

export default function HomePage() {
  const { addItem } = useCart();

  const handleAddToCart = (product: (typeof PRODUCTS)[0]) => {
    const firstVariant = product.variants[0];
    const item: CartItem = {
      product_id: product.id,
      product_name: product.name,
      product_image: product.images[0],
      variant_id: firstVariant?.id,
      variant_name: firstVariant?.name,
      price: firstVariant?.price ?? product.price,
      quantity: 1,
    };
    addItem(item);
  };

  const bestSellers = PRODUCTS.filter((p) => p.is_best_seller && p.is_active);
  const newArrivals = PRODUCTS.filter((p) => p.is_new_arrival && p.is_active);

  return (
    <div className="pt-16 md:pt-20">
      {/* ==================== HERO ==================== */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden bg-dark">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-bg.jpg"
            alt="KING AUTOLAMP Premium Automotive Lighting"
            fill
            className="object-cover object-center opacity-70"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/80 via-dark/45 to-dark" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark/60 via-transparent to-dark/60" />
        </div>

        {/* Subtle metallic grid pattern overlay */}
        <div
          className="absolute inset-0 z-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(167,169,172,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(167,169,172,.12) 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-200/90 border border-silver/20 mb-6">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span className="text-silver-light text-xs font-semibold tracking-widest uppercase">
                KING AUTOLAMP · Power Your Vision
              </span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-none mb-5 tracking-tight">
              LIGHT UP
              <br />
              <span className="text-gradient-red">YOUR DRIVE</span>
            </h1>

            <p className="text-silver-light text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              KING AUTOLAMP menghadirkan solusi pencahayaan otomotif dengan pilihan produk lampu
              berkualitas untuk meningkatkan pencahayaan, kenyamanan, dan tampilan kendaraan.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products" className="btn-primary text-base px-8 py-4 glow-red justify-center">
                Explore Products <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/products?sort=best_seller" className="btn-ghost text-base px-8 py-4 justify-center">
                Shop Now <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-10 mt-14 pt-8 border-t border-white/10">
              {[
                { label: 'Produk Tersedia', value: '500+' },
                { label: 'Merek Kendaraan', value: '50+' },
                { label: 'Pelanggan Puas', value: '2000+' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-white font-display">{stat.value}</div>
                  <div className="text-xs text-silver">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>

      {/* ==================== FEATURED CATEGORIES ==================== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-silver text-xs font-semibold tracking-widest uppercase mb-2">
            Kategori Produk
          </p>
          <h2 className="section-title">Featured Categories</h2>
          <p className="section-subtitle">Temukan produk sesuai kebutuhan kendaraan Anda</p>
          <div className="accent-line mx-auto" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="bg-dark-200 border border-white/10 hover:border-primary/60 rounded-xl p-5 text-center hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="text-3xl mb-3">{cat.icon}</div>
              <h3 className="text-white text-sm font-semibold mb-1 group-hover:text-primary transition-colors">
                {cat.name}
              </h3>
              <p className="text-silver text-xs leading-tight">{cat.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ==================== BEST SELLERS ==================== */}
      <section className="py-16 bg-dark-100 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-silver text-xs font-semibold tracking-widest uppercase mb-2">
                Terlaris
              </p>
              <h2 className="section-title">Best Seller Products</h2>
              <div className="accent-line" />
            </div>
            <Link
              href="/products?sort=best_seller"
              className="text-silver-light hover:text-primary text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
            >
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ==================== WHY CHOOSE US ==================== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-silver text-xs font-semibold tracking-widest uppercase mb-2">
            Keunggulan KING AUTOLAMP
          </p>
          <h2 className="section-title">Why Choose Us</h2>
          <p className="section-subtitle">Alasan mengapa ribuan pelanggan mempercayai kami</p>
          <div className="accent-line mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_US.map((item) => (
            <div
              key={item.title}
              className="bg-dark-200 border border-white/5 rounded-xl p-6 hover:border-silver/25 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-dark-300 border border-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:border-primary/40 transition-colors">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-white font-semibold mb-2">{item.title}</h3>
              <p className="text-silver text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== PROMO BANNER ==================== */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-dark-200 border border-white/10 rounded-2xl overflow-hidden p-10 md:p-16">
            {/* Subtle red accent bar on left */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary" />
            <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden md:block">
              <Image
                src="https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800&q=80"
                alt="Promo KING AUTOLAMP"
                fill
                className="object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-dark-200 via-dark-200/70 to-transparent" />
            </div>

            <div className="relative z-10 max-w-lg">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-silver-light text-xs font-semibold tracking-widest uppercase">
                  Penawaran Spesial · KING AUTOLAMP
                </span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">
                POWER YOUR VISION
                <br />
                <span className="text-primary">DISKON UP TO 30%</span>
              </h2>
              <p className="text-silver mb-6">
                Dapatkan penawaran terbaik untuk produk LED Projector dan Fog Lamp pilihan.
                Stok terbatas, segera order via WhatsApp!
              </p>
              <Link href="/products" className="btn-primary px-8 py-3.5 glow-red">
                Belanja Sekarang <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== NEW ARRIVALS ==================== */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-silver text-xs font-semibold tracking-widest uppercase mb-2">
              Terbaru
            </p>
            <h2 className="section-title">New Arrivals</h2>
            <div className="accent-line" />
          </div>
          <Link
            href="/products?sort=newest"
            className="text-silver-light hover:text-primary text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
          >
            Lihat Semua <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {newArrivals.slice(0, 3).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="py-16 bg-dark-100 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-silver text-xs font-semibold tracking-widest uppercase mb-2">
              Ulasan Pelanggan
            </p>
            <h2 className="section-title">Customer Testimonials</h2>
            <p className="text-xs text-silver-dark italic mt-2">
              * Testimoni ini adalah data placeholder contoh untuk tampilan website.
            </p>
            <div className="accent-line mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="bg-dark-200 border border-white/5 rounded-xl p-5 hover:border-silver/20 transition-all"
              >
                <StarRating rating={t.rating} size="sm" />
                <p className="text-silver-light text-sm leading-relaxed mt-3 mb-4 italic">
                  &ldquo;{t.review}&rdquo;
                </p>
                <div className="border-t border-white/5 pt-3">
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-silver text-xs">{t.vehicle}</p>
                  <p className="text-primary text-xs mt-1">{t.product_purchased}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
