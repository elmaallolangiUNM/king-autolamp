'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft,
  ShoppingCart,
  Zap,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Minus,
  Plus,
  Star,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { CartItem, Product, ProductVariant } from '@/types';
import { formatPrice } from '@/lib/utils';
import ProductCard from '@/components/ui/ProductCard';
import clsx from 'clsx';

interface ProductDetailClientProps {
  product: Product;
  related: Product[];
}

export default function ProductDetailClient({ product, related }: ProductDetailClientProps) {
  const { addItem } = useCart();

  const [mainImage, setMainImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants.length > 0 ? product.variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const price = selectedVariant?.price ?? product.price;
  const stock = selectedVariant?.stock ?? product.stock;

  const handleAddToCart = () => {
    const item: CartItem = {
      product_id: product.id,
      product_name: product.name,
      product_image: product.images[0],
      variant_id: selectedVariant?.id,
      variant_name: selectedVariant?.name,
      price: product.hide_price ? 0 : price,
      hide_price: product.hide_price,
      quantity,
    };
    addItem(item);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => (window.location.href = '/checkout'), 100);
  };

  const handleRelatedAddToCart = (relProduct: Product) => {
    const firstVariant = relProduct.variants[0];
    addItem({
      product_id: relProduct.id,
      product_name: relProduct.name,
      product_image: relProduct.images[0],
      variant_id: firstVariant?.id,
      variant_name: firstVariant?.name,
      price: relProduct.hide_price ? 0 : (firstVariant?.price ?? relProduct.price),
      hide_price: relProduct.hide_price,
      quantity: 1,
    });
  };

  return (
    <div className="pt-20 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-mid py-6">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/products" className="hover:text-white transition-colors">Products</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-400">{product.category}</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-white line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div>
          <div className="relative aspect-square bg-dark-200 rounded-2xl overflow-hidden mb-4">
            <Image
              src={product.images[mainImage]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.is_best_seller && (
              <div className="absolute top-4 left-4 flex items-center gap-1 bg-yellow-500 text-black text-xs font-bold px-3 py-1.5 rounded-full">
                <Star className="w-3 h-3 fill-black" /> Best Seller
              </div>
            )}
            {product.discount_percent && (
              <div className="absolute top-4 right-4 bg-primary text-white text-sm font-bold px-3 py-1.5 rounded-full">
                -{product.discount_percent}%
              </div>
            )}

            {/* Prev/next arrows */}
            {product.images.length > 1 && (
              <>
                <button
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/70 rounded-full flex items-center justify-center transition-all"
                  onClick={() => setMainImage((i) => (i === 0 ? product.images.length - 1 : i - 1))}
                  aria-label="Foto sebelumnya"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/70 rounded-full flex items-center justify-center transition-all"
                  onClick={() => setMainImage((i) => (i === product.images.length - 1 ? 0 : i + 1))}
                  aria-label="Foto berikutnya"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(idx)}
                  className={clsx(
                    'relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0',
                    mainImage === idx ? 'border-primary' : 'border-white/10 hover:border-white/30'
                  )}
                >
                  <Image src={img} alt={`Foto ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-primary text-xs font-semibold tracking-widest uppercase mb-2">
            {product.category}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">{product.name}</h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-2">
            {product.hide_price ? (
              <span className="text-primary text-2xl font-bold">
                Hubungi Admin untuk Harga
              </span>
            ) : (
              <>
                <span className="text-primary text-3xl font-bold">{formatPrice(price)}</span>
                {product.original_price && (
                  <span className="text-gray-mid text-lg line-through">
                    {formatPrice(product.original_price)}
                  </span>
                )}
              </>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            {stock > 0 ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm">
                  Stok Tersedia ({stock} unit)
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span className="text-red-400 text-sm">Stok Habis</span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm leading-relaxed mb-6">{product.description}</p>

          {/* Variants */}
          {product.variants.length > 0 && (
            <div className="mb-6">
              <p className="text-white font-semibold text-sm mb-3">Pilih Varian:</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    disabled={v.stock === 0}
                    className={clsx(
                      'px-4 py-2 rounded-lg border text-sm font-medium transition-all',
                      selectedVariant?.id === v.id
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-white/10 text-gray-300 hover:border-white/30',
                      v.stock === 0 && 'opacity-40 cursor-not-allowed line-through'
                    )}
                  >
                    {v.name}
                    {!product.hide_price && v.price !== product.price && (
                      <span className="ml-1 text-xs text-gray-mid">
                        (+{formatPrice(v.price - product.price)})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-8">
            <p className="text-white font-semibold text-sm">Jumlah:</p>
            <div className="flex items-center border border-white/10 rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-dark-300 transition-colors text-gray-300"
                aria-label="Kurangi jumlah"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center text-white font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                disabled={quantity >= stock}
                className="w-10 h-10 flex items-center justify-center hover:bg-dark-300 transition-colors text-gray-300 disabled:opacity-40"
                aria-label="Tambah jumlah"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {!product.hide_price && (
              <span className="text-gray-mid text-sm">
                Subtotal:{' '}
                <span className="text-primary font-bold">{formatPrice(price * quantity)}</span>
              </span>
            )}
          </div>

          {/* CTA buttons */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={stock === 0}
              className={clsx(
                'flex-1 btn-outline justify-center py-3',
                addedToCart && 'border-green-500 text-green-500',
                stock === 0 && 'opacity-50 cursor-not-allowed'
              )}
            >
              {addedToCart ? (
                <>
                  <CheckCircle className="w-5 h-5" /> Ditambahkan!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" /> Add to Cart
                </>
              )}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={stock === 0}
              className={clsx(
                'flex-1 btn-primary justify-center py-3 glow-red',
                stock === 0 && 'opacity-50 cursor-not-allowed'
              )}
            >
              <Zap className="w-5 h-5" /> Buy Now
            </button>
          </div>

          {/* Compatible vehicles */}
          {product.compatible_vehicles.length > 0 && (
            <div className="bg-dark-200 border border-white/5 rounded-xl p-4 mb-6">
              <p className="text-white font-semibold text-sm mb-2">Kompatibel dengan:</p>
              <div className="flex flex-wrap gap-2">
                {product.compatible_vehicles.map((v) => (
                  <span
                    key={v}
                    className="text-xs text-gray-300 bg-dark-300 px-3 py-1 rounded-full"
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Specs */}
          <div className="bg-dark-200 border border-white/5 rounded-xl p-4">
            <p className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-primary rounded"></span>
              Spesifikasi Teknis
            </p>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(product.specs).map(([key, val]) => (
                <div
                  key={key}
                  className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                >
                  <span className="text-gray-mid text-xs">{key}</span>
                  <span className="text-white text-xs font-medium">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-20">
          <div className="mb-8">
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-2">
              Rekomendasi
            </p>
            <h2 className="text-2xl font-bold text-white">Produk Terkait</h2>
            <div className="accent-line" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} onAddToCart={handleRelatedAddToCart} />
            ))}
          </div>
        </div>
      )}

      {/* Back link */}
      <div className="mt-10">
        <Link href="/products" className="flex items-center gap-2 text-gray-mid hover:text-white transition-colors text-sm">
          <ChevronLeft className="w-4 h-4" /> Kembali ke Katalog
        </Link>
      </div>
    </div>
  );
}
