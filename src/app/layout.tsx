import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingWhatsApp from '@/components/ui/FloatingWhatsApp';

export const metadata: Metadata = {
  title: {
    default: 'KING AUTOLAMP — Light Up Your Drive',
    template: '%s | KING AUTOLAMP',
  },
  description:
    'KING AUTOLAMP menghadirkan solusi pencahayaan otomotif dengan pilihan produk lampu berkualitas untuk meningkatkan pencahayaan, kenyamanan, dan tampilan kendaraan.',
  keywords: [
    'KING AUTOLAMP',
    'lampu LED otomotif',
    'LED projector mobil',
    'fog lamp LED',
    'headlamp projector',
    'mini projector LED',
    'toko lampu otomotif',
    'upgrade lampu mobil',
  ],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'KING AUTOLAMP',
    title: 'KING AUTOLAMP — Light Up Your Drive',
    description:
      'KING AUTOLAMP menghadirkan solusi pencahayaan otomotif dengan pilihan produk lampu berkualitas untuk meningkatkan pencahayaan, kenyamanan, dan tampilan kendaraan.',
    images: [
      {
        url: '/images/kingautolamp-logo.png',
        width: 685,
        height: 150,
        alt: 'KING AUTOLAMP',
      },
    ],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-dark text-white min-h-screen">
        <CartProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <FloatingWhatsApp />
        </CartProvider>
      </body>
    </html>
  );
}
