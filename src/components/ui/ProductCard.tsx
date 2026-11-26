import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Eye, Star, Tag } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import clsx from 'clsx';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const hasDiscount = !product.hide_price && product.original_price && product.discount_percent;

  return (
    <div className="card group flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden aspect-square bg-dark-300">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.is_best_seller && (
            <span className="badge-bestseller flex items-center gap-1">
              <Star className="w-3 h-3" /> Best Seller
            </span>
          )}
          {product.is_new_arrival && (
            <span className="badge-new">New</span>
          )}
          {hasDiscount && (
            <span className="badge-sale flex items-center gap-1">
              <Tag className="w-3 h-3" /> -{product.discount_percent}%
            </span>
          )}
        </div>

        {/* Stock badge */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-sm bg-dark-400 px-3 py-1 rounded">Habis</span>
          </div>
        )}

        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link
            href={`/products/${product.slug}`}
            className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-all flex items-center gap-2"
          >
            <Eye className="w-4 h-4" /> Quick View
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-primary font-semibold mb-1 uppercase tracking-wide">
          {product.category}
        </p>
        <h3 className="text-white font-semibold text-sm leading-snug mb-3 flex-1 line-clamp-2">
          {product.name}
        </h3>

        {/* Price */}
        <div className="mb-4">
          {product.hide_price ? (
            <div className="flex items-center">
              <span className="text-primary font-semibold text-sm">
                Hubungi Admin untuk Harga
              </span>
            </div>
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="text-primary font-bold text-lg">{formatPrice(product.price)}</span>
              {hasDiscount && (
                <span className="text-gray-mid text-sm line-through">
                  {formatPrice(product.original_price!)}
                </span>
              )}
            </div>
          )}
          <p className="text-xs text-gray-mid mt-1">
            Stok:{' '}
            <span className={clsx(product.stock > 5 ? 'text-green-400' : 'text-yellow-400')}>
              {product.stock > 0 ? `${product.stock} unit` : 'Habis'}
            </span>
          </p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/products/${product.slug}`}
            className="btn-outline text-xs py-2 px-3 justify-center text-center"
          >
            Detail
          </Link>
          <button
            onClick={() => onAddToCart?.(product)}
            disabled={product.stock === 0}
            className={clsx(
              'btn-primary text-xs py-2 px-3 justify-center',
              product.stock === 0 && 'opacity-50 cursor-not-allowed'
            )}
          >
            <ShoppingCart className="w-3 h-3" />
            Keranjang
          </button>
        </div>
      </div>
    </div>
  );
}
