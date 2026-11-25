'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Minus, Plus, ShoppingCart, ArrowLeft, Zap } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { cart, removeItem, updateQuantity, totalItems, totalPrice } = useCart();

  if (cart.items.length === 0) {
    return (
      <div className="pt-28 pb-20 min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 bg-dark-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-gray-mid" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Keranjang Kosong</h1>
          <p className="text-gray-mid text-sm mb-8">
            Belum ada produk yang ditambahkan ke keranjang. Yuk mulai belanja!
          </p>
          <Link href="/products" className="btn-primary">
            <ShoppingCart className="w-5 h-5" /> Mulai Belanja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="py-8">
        <h1 className="section-title">Keranjang Belanja</h1>
        <p className="text-gray-mid text-sm mt-1">{totalItems} produk dalam keranjang</p>
        <div className="accent-line" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div
              key={`${item.product_id}-${item.variant_id}`}
              className="bg-dark-200 border border-white/5 rounded-xl p-5 flex gap-4"
            >
              {/* Image */}
              <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-dark-300">
                <Image
                  src={item.product_image}
                  alt={item.product_name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1">
                  {item.product_name}
                </h3>
                {item.variant_name && (
                  <p className="text-gray-mid text-xs mb-2">Varian: {item.variant_name}</p>
                )}
                <p className="text-primary font-bold">{formatPrice(item.price)}</p>
              </div>

              {/* Controls */}
              <div className="flex flex-col items-end justify-between flex-shrink-0">
                <button
                  onClick={() => removeItem(item.product_id, item.variant_id)}
                  className="text-gray-mid hover:text-red-400 transition-colors p-1"
                  aria-label="Hapus produk"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex flex-col items-end gap-2">
                  {/* Qty controls */}
                  <div className="flex items-center border border-white/10 rounded-lg overflow-hidden">
                    <button
                      onClick={() =>
                        updateQuantity(item.product_id, item.quantity - 1, item.variant_id)
                      }
                      className="w-8 h-8 flex items-center justify-center hover:bg-dark-300 transition-colors text-gray-300"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-white text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product_id, item.quantity + 1, item.variant_id)
                      }
                      className="w-8 h-8 flex items-center justify-center hover:bg-dark-300 transition-colors text-gray-300"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="text-white font-bold text-sm">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <Link
            href="/products"
            className="flex items-center gap-2 text-gray-mid hover:text-white transition-colors text-sm mt-4"
          >
            <ArrowLeft className="w-4 h-4" /> Lanjut Belanja
          </Link>
        </div>

        {/* Summary */}
        <div>
          <div className="bg-dark-200 border border-white/5 rounded-xl p-6 sticky top-24">
            <h2 className="text-white font-semibold text-lg mb-5 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded"></span>
              Ringkasan Pesanan
            </h2>

            <div className="space-y-3 mb-6">
              {cart.items.map((item) => (
                <div
                  key={`${item.product_id}-${item.variant_id}`}
                  className="flex justify-between text-sm"
                >
                  <span className="text-gray-mid line-clamp-1 flex-1 mr-2">
                    {item.product_name}
                    {item.variant_name ? ` (${item.variant_name})` : ''} ×{item.quantity}
                  </span>
                  <span className="text-white flex-shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-white font-semibold">Total Pembayaran</span>
                <span className="text-primary font-bold text-xl">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <p className="text-gray-mid text-xs mt-1">
                * Ongkos kirim dikonfirmasi via WhatsApp
              </p>
            </div>

            <Link href="/checkout" className="btn-primary w-full justify-center py-4 glow-red">
              <Zap className="w-5 h-5" /> Lanjut ke Checkout
            </Link>

            <div className="mt-4 text-center text-xs text-gray-mid">
              Pembayaran & konfirmasi via WhatsApp
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
