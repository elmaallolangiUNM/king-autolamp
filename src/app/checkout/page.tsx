'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingCart, User, MapPin, MessageCircle, ArrowLeft, Send, AlertCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { CheckoutFormData } from '@/types';
import { formatPrice } from '@/lib/utils';
import { buildWhatsAppURL } from '@/lib/config';

function buildWhatsAppMessage(form: CheckoutFormData, cart: ReturnType<typeof useCart>): string {
  const { cart: cartData, totalPrice } = cart;

  let items = '';
  const hasHiddenPrice = cartData.items.some((item) => item.hide_price);
  cartData.items.forEach((item, idx) => {
    items += `${idx + 1}. ${item.product_name}\n`;
    if (item.variant_name) items += `   Varian: ${item.variant_name}\n`;
    items += `   Jumlah: ${item.quantity}\n`;
    if (item.hide_price) {
      items += `   Harga: Konfirmasi via Admin\n\n`;
    } else {
      items += `   Harga: ${formatPrice(item.price)}\n`;
      items += `   Subtotal: ${formatPrice(item.price * item.quantity)}\n\n`;
    }
  });

  const totalText = hasHiddenPrice
    ? totalPrice > 0
      ? `${formatPrice(totalPrice)} (+ produk harga konfirmasi)`
      : 'Konfirmasi via Admin'
    : formatPrice(totalPrice);

  return `Halo Admin KING AUTOLAMP, saya ingin melakukan pemesanan produk.

━━━━━━━━━━━━━━━━━━━━
📋 DATA PELANGGAN
━━━━━━━━━━━━━━━━━━━━
Nama: ${form.full_name}
WhatsApp: ${form.whatsapp}
Alamat: ${form.address}
Kota: ${form.city}${form.notes ? `\nCatatan: ${form.notes}` : ''}

━━━━━━━━━━━━━━━━━━━━
🛒 DETAIL PESANAN
━━━━━━━━━━━━━━━━━━━━
${items}
━━━━━━━━━━━━━━━━━━━━
💰 TOTAL PEMBELIAN: ${totalText}
━━━━━━━━━━━━━━━━━━━━

Mohon konfirmasi ketersediaan produk dan informasi pembayaran serta pengiriman.

Terima kasih 🙏`;
}

export default function CheckoutPage() {
  const cart = useCart();
  const { cart: cartData, totalPrice, clearCart } = cart;
  const router = useRouter();

  const [form, setForm] = useState<CheckoutFormData>({
    full_name: '',
    whatsapp: '',
    address: '',
    city: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});
  const [submitted, setSubmitted] = useState(false);

  if (cartData.items.length === 0 && !submitted) {
    return (
      <div className="pt-28 pb-20 min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <ShoppingCart className="w-16 h-16 text-gray-mid mx-auto mb-4" />
          <h1 className="text-xl font-bold text-white mb-2">Keranjang Kosong</h1>
          <p className="text-gray-mid text-sm mb-6">Tambahkan produk ke keranjang terlebih dahulu.</p>
          <Link href="/products" className="btn-primary">Belanja Sekarang</Link>
        </div>
      </div>
    );
  }

  const validate = () => {
    const errs: Partial<CheckoutFormData> = {};
    if (!form.full_name.trim()) errs.full_name = 'Nama lengkap wajib diisi';
    if (!form.whatsapp.trim()) errs.whatsapp = 'Nomor WhatsApp wajib diisi';
    else if (!/^[0-9+\s\-()]{8,16}$/.test(form.whatsapp)) errs.whatsapp = 'Format nomor tidak valid';
    if (!form.address.trim()) errs.address = 'Alamat wajib diisi';
    if (!form.city.trim()) errs.city = 'Kota/Kabupaten wajib diisi';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    const message = buildWhatsAppMessage(form, cart);
    const url = buildWhatsAppURL(message);
    setSubmitted(true);
    window.open(url, '_blank');
  };

  const handleClearCart = () => {
    clearCart();
    router.push('/');
  };

  const setField = (field: keyof CheckoutFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: undefined }));
  };

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8">
        <h1 className="section-title">Checkout</h1>
        <div className="accent-line" />
      </div>

      {submitted && (
        <div className="bg-green-900/30 border border-green-500/40 rounded-xl p-5 mb-8 flex gap-4 items-start">
          <MessageCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-green-300 font-semibold mb-1">
              Pesan WhatsApp telah dibuat!
            </p>
            <p className="text-green-400/80 text-sm">
              WhatsApp sudah terbuka dengan format pesanan. Setelah mendapat konfirmasi dari admin,
              Anda dapat menghapus keranjang.
            </p>
            <div className="flex gap-3 mt-3">
              <button
                onClick={handleClearCart}
                className="text-sm text-red-400 hover:text-red-300 underline"
              >
                Hapus keranjang setelah konfirmasi
              </button>
              <button
                onClick={() => setSubmitted(false)}
                className="text-sm text-gray-400 hover:text-white underline"
              >
                Kembali edit pesanan
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-dark-200 border border-white/5 rounded-xl p-6">
              <h2 className="text-white font-semibold mb-5 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Data Pelanggan
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Full name */}
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">
                    Nama Lengkap <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.full_name}
                    onChange={setField('full_name')}
                    placeholder="Masukkan nama lengkap Anda"
                    className="input-field"
                  />
                  {errors.full_name && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.full_name}
                    </p>
                  )}
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">
                    Nomor WhatsApp <span className="text-primary">*</span>
                  </label>
                  <input
                    type="tel"
                    value={form.whatsapp}
                    onChange={setField('whatsapp')}
                    placeholder="08xxxxxxxxxx"
                    className="input-field"
                  />
                  {errors.whatsapp && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.whatsapp}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5">
                <label className="text-sm text-gray-300 mb-2 flex items-center gap-2 block">
                  <MapPin className="w-4 h-4 text-primary" />
                  Alamat Pengiriman <span className="text-primary">*</span>
                </label>
                <textarea
                  value={form.address}
                  onChange={setField('address')}
                  rows={3}
                  placeholder="Jl. Nama Jalan No. xxx, RT/RW, Kelurahan, Kecamatan"
                  className="input-field resize-none"
                />
                {errors.address && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.address}
                  </p>
                )}
              </div>

              <div className="mt-5">
                <label className="text-sm text-gray-300 mb-2 block">
                  Kota / Kabupaten <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  value={form.city}
                  onChange={setField('city')}
                  placeholder="Contoh: Jakarta Selatan"
                  className="input-field"
                />
                {errors.city && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.city}
                  </p>
                )}
              </div>

              <div className="mt-5">
                <label className="text-sm text-gray-300 mb-2 block">
                  Catatan Tambahan (opsional)
                </label>
                <textarea
                  value={form.notes}
                  onChange={setField('notes')}
                  rows={2}
                  placeholder="Contoh: warna hitam, kirim pagi hari, dll."
                  className="input-field resize-none"
                />
              </div>
            </div>
          </div>

          {/* Summary + Submit */}
          <div>
            <div className="bg-dark-200 border border-white/5 rounded-xl p-6 sticky top-24">
              <h2 className="text-white font-semibold mb-5 flex items-center gap-2">
                <span className="w-1 h-5 bg-primary rounded"></span>
                Ringkasan Pesanan
              </h2>

              <div className="space-y-3 mb-5 max-h-64 overflow-y-auto pr-1">
                {cartData.items.map((item) => (
                  <div key={`${item.product_id}-${item.variant_id}`} className="flex gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-dark-300">
                      <Image
                        src={item.product_image}
                        alt={item.product_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium line-clamp-1">
                        {item.product_name}
                      </p>
                      {item.variant_name && (
                        <p className="text-gray-mid text-xs">{item.variant_name}</p>
                      )}
                      <div className="flex justify-between mt-1">
                        <span className="text-gray-mid text-xs">×{item.quantity}</span>
                        <span className="text-primary text-xs font-semibold">
                          {item.hide_price ? 'Hubungi Admin' : formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-mid text-sm">Subtotal</span>
                  <span className="text-white text-sm">
                    {cartData.items.some((i) => i.hide_price)
                      ? totalPrice > 0
                        ? `${formatPrice(totalPrice)} + Konfirmasi`
                        : 'Konfirmasi Admin'
                      : formatPrice(totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-gray-mid text-sm">Ongkos Kirim</span>
                  <span className="text-yellow-400 text-sm">Dikonfirmasi Admin</span>
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/10">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-primary font-bold text-xl">
                    {cartData.items.some((i) => i.hide_price)
                      ? totalPrice > 0
                        ? `${formatPrice(totalPrice)}+`
                        : 'Konfirmasi Admin'
                      : formatPrice(totalPrice)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary w-full justify-center py-4 glow-red text-base"
              >
                <Send className="w-5 h-5" /> CHECKOUT VIA WHATSAPP
              </button>

              <p className="text-gray-mid text-xs text-center mt-3">
                Klik tombol untuk membuka WhatsApp dengan format pesanan otomatis
              </p>

              <div className="mt-4">
                <Link
                  href="/cart"
                  className="flex items-center gap-2 text-gray-mid hover:text-white transition-colors text-xs justify-center"
                >
                  <ArrowLeft className="w-3 h-3" /> Kembali ke Keranjang
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
