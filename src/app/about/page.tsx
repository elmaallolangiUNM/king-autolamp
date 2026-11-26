import Image from 'next/image';
import { Shield, Zap, Award, Users, ChevronRight, Eye } from 'lucide-react';
import Link from 'next/link';

const VALUES = [
  {
    icon: Shield,
    title: 'Kualitas Terjamin',
    desc: 'Semua produk melalui seleksi ketat dan didukung garansi resmi dari supplier terpercaya Indonesia dan internasional.',
  },
  {
    icon: Zap,
    title: 'Teknologi Terkini',
    desc: 'Kami selalu menghadirkan produk dengan teknologi lampu otomotif terbaru untuk memenuhi kebutuhan pasar yang berkembang.',
  },
  {
    icon: Award,
    title: 'Pengalaman Bertahun-tahun',
    desc: 'Didukung tim yang berpengalaman di bidang otomotif, kami memahami kebutuhan setiap pelanggan secara mendalam.',
  },
  {
    icon: Users,
    title: 'Pelayanan Personal',
    desc: 'Konsultasi produk secara personal via WhatsApp memastikan Anda mendapat produk yang tepat untuk kendaraan Anda.',
  },
];

export default function AboutPage() {
  return (
    <div className="pt-20 pb-20">
      {/* Hero */}
      <section className="relative py-28 bg-dark overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/about/about-2.jpg"
            alt="About KING AUTOLAMP"
            fill
            className="object-cover opacity-20 object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark/85 to-dark" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">
            Tentang Kami
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-5">
            KING <span className="text-gradient-red">AUTOLAMP</span>
          </h1>
          <p className="text-silver-light text-lg max-w-2xl mx-auto leading-relaxed">
            KING AUTOLAMP menghadirkan solusi pencahayaan otomotif dengan pilihan produk lampu
            berkualitas untuk meningkatkan pencahayaan, kenyamanan, dan tampilan kendaraan.
          </p>

          {/* Stats placed right below the sentence */}
          <div className="flex flex-wrap justify-center gap-12 mt-10 pt-8 border-t border-white/10 max-w-md mx-auto">
            <div>
              <div className="text-3xl font-bold text-white font-display">500+</div>
              <div className="text-xs text-silver mt-1">Varian Produk</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white font-display">2000+</div>
              <div className="text-xs text-silver mt-1">Pelanggan Puas</div>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">
              Kisah Kami
            </p>
            <h2 className="section-title mb-5">
              Berawal dari Passion Otomotif
            </h2>
            <div className="accent-line" />
            <div className="space-y-4 text-silver-light text-sm leading-relaxed">
              <p>
                KING AUTOLAMP lahir dari kecintaan mendalam terhadap dunia otomotif dan
                keyakinan bahwa setiap kendaraan berhak mendapatkan pencahayaan terbaik.
                Kami memulai perjalanan kami dengan visi sederhana: menghadirkan produk lampu
                otomotif berkualitas premium yang dapat diakses oleh semua kalangan.
              </p>
              <p>
                Dengan pengalaman bertahun-tahun di industri otomotif, tim kami memahami betapa
                pentingnya kualitas pencahayaan bagi keselamatan berkendara. Setiap produk yang
                kami pilih telah melalui pengujian ketat untuk memastikan performa terbaik di
                berbagai kondisi berkendara malam hari.
              </p>
              <p>
                Hari ini, KING AUTOLAMP melayani ribuan pelanggan di seluruh Indonesia dengan
                koleksi lengkap BILED Projector, Mini Projector, Fog Lamp,
                dan berbagai aksesori pencahayaan otomotif premium lainnya.
              </p>
            </div>
          </div>

          {/* Dual photo showcase (clean, without overlapping badges) */}
          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Photo 1: On-road illuminated beam */}
              <div className="relative h-96 sm:h-[440px] rounded-2xl overflow-hidden border border-white/10 group">
                <Image
                  src="/images/about/about-2.jpg"
                  alt="Hasil pencahayaan KING AUTOLAMP di jalan raya"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-primary bg-dark/80 px-2.5 py-1 rounded">
                    Night Road Test
                  </span>
                  <p className="text-white text-xs font-medium mt-2">
                    Cahaya fokus & cut-off rapi tidak menyilaukan pengendara lain
                  </p>
                </div>
              </div>

              {/* Photo 2: Headlight & DRL detail */}
              <div className="relative h-96 sm:h-[440px] rounded-2xl overflow-hidden border border-white/10 group">
                <Image
                  src="/images/about/about-1.jpg"
                  alt="Detail DRL dan Headlight KING AUTOLAMP"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-silver bg-dark/80 px-2.5 py-1 rounded">
                    Aesthetic DRL
                  </span>
                  <p className="text-white text-xs font-medium mt-2">
                    Tampilan futuristik, elegan, dan berkarakter
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-dark-100 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-silver text-xs font-semibold tracking-widest uppercase mb-2">
              Nilai Kami
            </p>
            <h2 className="section-title">Komitmen & Keunggulan</h2>
            <div className="accent-line mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="bg-dark-200 border border-white/5 rounded-xl p-6 hover:border-silver/20 transition-all group"
              >
                <div className="w-12 h-12 bg-dark-300 border border-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:border-primary/40 transition-colors">
                  <v.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-white font-semibold mb-2 text-sm">{v.title}</h3>
                <p className="text-silver text-xs leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="section-title mb-4">Siap Upgrade Lampu Kendaraan Anda?</h2>
        <p className="text-silver mb-8 text-sm">
          Konsultasikan kebutuhan pencahayaan kendaraan Anda dengan tim ahli KING AUTOLAMP.
          Gratis, cepat, dan terpercaya via WhatsApp.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products" className="btn-primary px-8 py-3.5 glow-red">
            Lihat Produk <ChevronRight className="w-4 h-4" />
          </Link>
          <Link href="/contact" className="btn-ghost px-8 py-3.5">
            Hubungi Kami
          </Link>
        </div>
      </section>
    </div>
  );
}
