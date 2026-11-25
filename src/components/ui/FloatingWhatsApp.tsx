'use client';

import { MessageCircle } from 'lucide-react';
import { storeConfig } from '@/lib/config';

export default function FloatingWhatsApp() {
  const url = `https://wa.me/${storeConfig.whatsapp_number}?text=${encodeURIComponent(
    'Halo Admin KING AUTOLAMP, saya ingin bertanya mengenai produk lampu otomotif.'
  )}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white pl-4 pr-5 py-3 rounded-full shadow-xl shadow-black/50 transition-all duration-200 hover:scale-105 group"
      aria-label="Chat via WhatsApp"
    >
      <MessageCircle className="w-5 h-5" />
      <span className="text-sm font-semibold hidden sm:block">Chat WhatsApp</span>
    </a>
  );
}
