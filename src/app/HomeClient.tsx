'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronRight, Shield, Package, MessageCircle, Wrench, Zap, Camera, Play } from 'lucide-react';
import { TESTIMONIALS } from '@/data/products';
import ProductCard from '@/components/ui/ProductCard';
import StarRating from '@/components/ui/StarRating';
import { useCart } from '@/context/CartContext';
import { CartItem, CategoryItem, Product, ProjectItem } from '@/types';

const WHY_US = [
  { icon: Shield, title: 'Produk Berkualitas', desc: 'Semua produk terseleksi ketat dan bergaransi resmi dari supplier terpercaya.' },
  { icon: Package, title: 'Pilihan Produk Lengkap', desc: 'Tersedia ratusan varian lampu otomotif untuk semua jenis kendaraan.' },
  { icon: MessageCircle, title: 'Konsultasi Gratis', desc: 'Tim kami siap membantu konsultasi produk yang sesuai untuk kendaraan Anda.' },
  { icon: Wrench, title: 'Pelayanan Profesional', desc: 'Respon cepat, pengiriman aman, dan after-sales service yang memuaskan.' },
];

function isVideoUrl(url?: string) {
  if (!url) return false;
  return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('drive.google.com') || /\.(mp4|webm|ogg)(\?|$)/i.test(url);
}

function getEmbedUrl(url: string) {
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${ytMatch[1]}&controls=0&rel=0&showinfo=0`;
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (driveMatch) return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
  return url;
}

function isEmbedVideo(url?: string) {
  if (!url) return false;
  return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('drive.google.com');
}

interface HomeClientProps {
  initialProducts: Product[];
  initialCategories: CategoryItem[];
  initialProjects: ProjectItem[];
}

export default function HomeClient({ initialProducts, initialCategories, initialProjects }: HomeClientProps) {
  const { addItem } = useCart();

  const handleAddToCart = (product: Product) => {
    const firstVariant = product.variants[0];
    const item: CartItem = {
      product_id: product.id,
      product_name: product.name,
      product_image: product.images[0],
      variant_id: firstVariant?.id,
      variant_name: firstVariant?.name,
      price: product.hide_price ? 0 : (firstVariant?.price ?? product.price),
      hide_price: product.hide_price,
      quantity: 1,
    };
    addItem(item);
  };

  const bestSellers = initialProducts.filter((p) => p.is_best_seller && p.is_active);
  const newArrivals = initialProducts.filter((p) => p.is_new_arrival && p.is_active);
  const featured = initialProjects.find((p) => p.is_featured) || initialProjects[0];
  const rest = initialProjects.filter((p) => p.id !== featured?.id).slice(0, 5);

  const ProjectMedia = ({ proj, className }: { proj: ProjectItem; className?: string }) => {
    if (isEmbedVideo(proj.video_url)) {
      return (
        <iframe
          src={getEmbedUrl(proj.video_url!)}
          className={`absolute inset-0 w-full h-full ${className || ''}`}
          allow="autoplay; fullscreen"
          allowFullScreen
          title={proj.title}
          style={{ border: 0 }}
        />
      );
    }
    if (isVideoUrl(proj.video_url)) {
      return <video src={proj.video_url} autoPlay muted loop playsInline className={`absolute inset-0 w-full h-full object-cover ${className || ''}`} />;
    }
    return (
      <Image
        src={proj.image || 'https://images.unsplash.com/photo-1558981852-426c06a93f46?w=900&q=85'}
        alt={proj.title}
        fill
        unoptimized={proj.image?.startsWith('data:')}
        className={`object-cover ${className || ''}`}
      />
    );
  };

  return (
    <div className="pt-16 md:pt-20">

      {/* ==================== HERO ==================== */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden bg-dark">
        <div className="absolute inset-0 z-0">
          <Image src="/images/hero-bg.jpg" alt="KING AUTOLAMP Premium Automotive Lighting" fill className="object-cover object-center opacity-70" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/80 via-dark/45 to-dark" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark/60 via-transparent to-dark/60" />
        </div>
        <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: `linear-gradient(rgba(167,169,172,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(167,169,172,.12) 1px, transparent 1px)`, backgroundSize: '64px 64px' }} />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-200/90 border border-silver/20 mb-6">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span className="text-silver-light text-xs font-semibold tracking-widest uppercase">KING AUTOLAMP · Power Your Vision</span>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-none mb-5 tracking-tight">
              LIGHT UP<br /><span className="text-gradient-red">YOUR DRIVE</span>
            </h1>
            <p className="text-silver-light text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              KING AUTOLAMP menghadirkan solusi pencahayaan otomotif dengan pilihan produk lampu berkualitas untuk meningkatkan pencahayaan, kenyamanan, dan tampilan kendaraan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products" className="btn-primary text-base px-8 py-4 glow-red justify-center">Explore Products <ArrowRight className="w-5 h-5" /></Link>
              <Link href="/products?sort=best_seller" className="btn-ghost text-base px-8 py-4 justify-center">Shop Now <ChevronRight className="w-5 h-5" /></Link>
            </div>
            <div className="flex flex-wrap justify-center gap-10 mt-14 pt-8 border-t border-white/10">
              {[{ label: 'Produk Tersedia', value: '500+' }, { label: 'Merek Kendaraan', value: '50+' }, { label: 'Pelanggan Puas', value: '2000+' }].map((stat) => (
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
          <p className="text-silver text-xs font-semibold tracking-widest uppercase mb-2">Kategori Produk</p>
          <h2 className="section-title">Featured Categories</h2>
          <p className="section-subtitle">Temukan produk sesuai kebutuhan kendaraan Anda</p>
          <div className="accent-line mx-auto" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {initialCategories.map((cat) => (
            <Link key={cat.id} href={`/products?category=${encodeURIComponent(cat.name)}`} className="bg-dark-200 border border-white/10 hover:border-primary/60 rounded-xl p-5 text-center hover:-translate-y-1 transition-all duration-300 group">
              <div className="text-3xl mb-3">{cat.icon || '💡'}</div>
              <h3 className="text-white text-sm font-semibold mb-1 group-hover:text-primary transition-colors">{cat.name}</h3>
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
              <p className="text-silver text-xs font-semibold tracking-widest uppercase mb-2">Terlaris</p>
              <h2 className="section-title">Best Seller Products</h2>
              <div className="accent-line" />
            </div>
            <Link href="/products?sort=best_seller" className="text-silver-light hover:text-primary text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </div>
      </section>

      {/* ==================== WHY CHOOSE US ==================== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-silver text-xs font-semibold tracking-widest uppercase mb-2">Keunggulan KING AUTOLAMP</p>
          <h2 className="section-title">Why Choose Us</h2>
          <p className="section-subtitle">Alasan mengapa ribuan pelanggan mempercayai kami</p>
          <div className="accent-line mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_US.map((item) => (
            <div key={item.title} className="bg-dark-200 border border-white/5 rounded-xl p-6 hover:border-silver/25 transition-all duration-300 group">
              <div className="w-12 h-12 bg-dark-300 border border-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:border-primary/40 transition-colors">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-white font-semibold mb-2">{item.title}</h3>
              <p className="text-silver text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== OUR RECENT PROJECTS ==================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dark overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Camera className="w-4 h-4 text-primary" />
                <span className="text-primary text-xs font-semibold tracking-widest uppercase">Portfolio Pemasangan</span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight">
                Our Recent<br /><span className="text-gradient-red">Projects</span>
              </h2>
              <p className="text-silver text-sm mt-3 max-w-md leading-relaxed">
                Setiap kendaraan mendapat sentuhan terbaik — dari pemilihan produk hingga hasil instalasi yang presisi dan memuaskan.
              </p>
              <div className="accent-line mt-5" />
            </div>
            <Link href="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-silver-light hover:text-primary transition-colors self-start md:self-end pb-1">
              Lihat Semua Produk <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {initialProjects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[260px]">
              {/* Large featured */}
              {featured && (
                <div className="md:col-span-7 md:row-span-2 group relative rounded-2xl overflow-hidden bg-dark-300">
                  <ProjectMedia proj={featured} className="transition-transform duration-700 group-hover:scale-105 opacity-70 group-hover:opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent pointer-events-none" />
                  <div className="absolute top-5 left-5 flex items-center gap-2 pointer-events-none">
                    <span className="bg-primary/90 backdrop-blur text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full">{featured.category}</span>
                    {isVideoUrl(featured.video_url) && <span className="bg-dark/80 backdrop-blur border border-white/20 text-white text-[10px] flex items-center gap-1 px-2.5 py-1.5 rounded-full"><Play className="w-3 h-3 fill-white" /> Video</span>}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-7 pointer-events-none">
                    <h3 className="text-white font-bold text-2xl leading-tight mb-2 group-hover:text-primary transition-colors">{featured.title}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed max-w-sm">{featured.desc}</p>
                  </div>
                </div>
              )}

              {/* Side cards */}
              {rest.slice(0, 2).map((proj) => (
                <div key={proj.id} className="md:col-span-5 group relative rounded-2xl overflow-hidden bg-dark-300">
                  <ProjectMedia proj={proj} className="transition-transform duration-700 group-hover:scale-105 opacity-65 group-hover:opacity-85" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent pointer-events-none" />
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 pointer-events-none">
                    <span className="bg-dark/70 backdrop-blur border border-white/20 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">{proj.category}</span>
                    {isVideoUrl(proj.video_url) && <span className="bg-primary/80 backdrop-blur text-white text-[10px] flex items-center gap-1 px-2 py-1 rounded-full"><Play className="w-2.5 h-2.5 fill-white" /></span>}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5 pointer-events-none">
                    <h3 className="text-white font-bold text-lg leading-tight group-hover:text-primary transition-colors">{proj.title}</h3>
                    <p className="text-gray-400 text-xs mt-1.5 leading-relaxed line-clamp-2">{proj.desc}</p>
                  </div>
                </div>
              ))}

              {/* Bottom row */}
              {rest.slice(2, 5).map((proj) => (
                <div key={proj.id} className="md:col-span-4 group relative rounded-2xl overflow-hidden bg-dark-300">
                  <ProjectMedia proj={proj} className="transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/55 to-transparent pointer-events-none" />
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 pointer-events-none">
                    <span className="bg-dark/70 backdrop-blur border border-white/20 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">{proj.category}</span>
                    {isVideoUrl(proj.video_url) && <span className="bg-primary/80 backdrop-blur text-white text-[10px] flex items-center gap-1 px-2 py-1 rounded-full"><Play className="w-2.5 h-2.5 fill-white" /></span>}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5 pointer-events-none">
                    <h3 className="text-white font-bold text-base leading-tight group-hover:text-primary transition-colors line-clamp-2">{proj.title}</h3>
                    <p className="text-gray-400 text-xs mt-1 leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{proj.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-10 grid grid-cols-3 gap-4 border border-white/5 rounded-2xl bg-dark-200 p-6">
            {[{ value: '500+', label: 'Unit Terpasang' }, { value: '4 Kota', label: 'Area Layanan' }, { value: '100%', label: 'Kepuasan Pelanggan' }].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white font-display">{s.value}</div>
                <div className="text-silver text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== NEW ARRIVALS ==================== */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-silver text-xs font-semibold tracking-widest uppercase mb-2">Terbaru</p>
            <h2 className="section-title">New Arrivals</h2>
            <div className="accent-line" />
          </div>
          <Link href="/products?sort=newest" className="text-silver-light hover:text-primary text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            Lihat Semua <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {newArrivals.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="py-16 bg-dark-100 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-silver text-xs font-semibold tracking-widest uppercase mb-2">Ulasan Pelanggan</p>
            <h2 className="section-title">Customer Testimonials</h2>
            <p className="text-xs text-silver-dark italic mt-2">* Testimoni ini adalah data placeholder contoh untuk tampilan website.</p>
            <div className="accent-line mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.id} className="bg-dark-200 border border-white/5 rounded-xl p-5 hover:border-silver/20 transition-all">
                <StarRating rating={t.rating} size="sm" />
                <p className="text-silver-light text-sm leading-relaxed mt-3 mb-4 italic">&ldquo;{t.review}&rdquo;</p>
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
