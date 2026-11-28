import { MessageCircle, Instagram, MapPin, Clock, Phone } from 'lucide-react';
import { storeConfig } from '@/lib/config';

export default function ContactPage() {
  const waUrl = `https://wa.me/${storeConfig.whatsapp_number}?text=${encodeURIComponent(
    'Halo Admin KING AUTOLAMP, saya ingin bertanya mengenai produk lampu otomotif.'
  )}`;

  return (
    <div className="pt-20 pb-20">
      {/* Header */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-2">
            Kontak
          </p>
          <h1 className="section-title">Hubungi Kami</h1>
          <p className="section-subtitle">
            Kami siap membantu konsultasi produk dan pemesanan Anda
          </p>
          <div className="accent-line mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact info */}
          <div className="space-y-6">
            {/* WhatsApp */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-5 p-6 bg-dark-200 border border-white/5 rounded-xl hover:border-green-500/30 transition-all group"
            >
              <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-600/30 transition-colors">
                <MessageCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">WhatsApp</h3>
                <p className="text-green-400 text-sm">+{storeConfig.whatsapp_number}</p>
                <p className="text-gray-mid text-xs mt-1">
                  Klik untuk mulai chat langsung via WhatsApp
                </p>
              </div>
            </a>

            {/* Instagram */}
            <a
              href={storeConfig.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-5 p-6 bg-dark-200 border border-white/5 rounded-xl hover:border-pink-500/30 transition-all group"
            >
              <div className="w-12 h-12 bg-pink-600/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-pink-600/30 transition-colors">
                <Instagram className="w-6 h-6 text-pink-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Instagram</h3>
                <p className="text-pink-400 text-sm">{storeConfig.instagram}</p>
                <p className="text-gray-mid text-xs mt-1">
                  Follow untuk update produk dan promo terbaru
                </p>
              </div>
            </a>

            {/* Address */}
            <div className="flex gap-5 p-6 bg-dark-200 border border-white/5 rounded-xl">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Alamat Toko</h3>
                <p className="text-gray-300 text-sm">{storeConfig.store_address}</p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex gap-5 p-6 bg-dark-200 border border-white/5 rounded-xl">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Jam Operasional</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between gap-8">
                    <span className="text-gray-mid">Senin – Jumat</span>
                    <span className="text-white">08.00 – 17.00 WIB</span>
                  </div>
                  <div className="flex justify-between gap-8">
                    <span className="text-gray-mid">Sabtu</span>
                    <span className="text-white">08.00 – 15.00 WIB</span>
                  </div>
                  <div className="flex justify-between gap-8">
                    <span className="text-gray-mid">Minggu</span>
                    <span className="text-red-400">Tutup</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <div>
            <div className="bg-dark-200 border border-white/5 rounded-2xl overflow-hidden h-80 md:h-full min-h-80">
              {process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL ? (
                <iframe
                  src={process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokasi KING AUTOLAMP"
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center gap-4 p-8 text-center">
                  <MapPin className="w-12 h-12 text-primary" />
                  <div>
                    <h3 className="text-white font-semibold mb-2">Lokasi Toko</h3>
                    <p className="text-gray-mid text-sm mb-4">{storeConfig.store_address}</p>
                    <p className="text-gray-mid text-xs">
                      Tambahkan Google Maps Embed URL di file .env.local
                      <br />
                      (NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL)
                    </p>
                  </div>
                <a
                    href="https://maps.app.goo.gl/8CRAoimUK1a7dbuy8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline text-sm"
                  >
                    <MapPin className="w-4 h-4" /> Buka di Google Maps
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA WhatsApp */}
      <section className="py-10 max-w-3xl mx-auto px-4 text-center">
        <div className="bg-green-900/20 border border-green-500/20 rounded-2xl p-10">
          <MessageCircle className="w-10 h-10 text-green-400 mx-auto mb-4" />
          <h2 className="text-white text-2xl font-bold mb-3">Chat Langsung via WhatsApp</h2>
          <p className="text-gray-mid mb-6 text-sm">
            Respon cepat — tim kami siap membantu konsultasi produk dan menjawab pertanyaan
            Anda dalam hitungan menit.
          </p>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white font-bold px-10 py-4 rounded-xl inline-flex items-center gap-3 transition-all hover:scale-105 shadow-lg shadow-green-900/40"
          >
            <MessageCircle className="w-5 h-5" /> Chat WhatsApp Sekarang
          </a>
        </div>
      </section>
    </div>
  );
}
