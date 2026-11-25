// ============================================================
// KING AUTOLAMP — Store Configuration
// ============================================================

import { StoreConfig } from '@/types';

export const storeConfig: StoreConfig = {
  whatsapp_number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6282298995682',
  store_name: process.env.NEXT_PUBLIC_STORE_NAME || 'KING AUTOLAMP',
  store_tagline: process.env.NEXT_PUBLIC_STORE_TAGLINE || 'LIGHT UP YOUR DRIVE',
  store_description:
    process.env.NEXT_PUBLIC_STORE_DESCRIPTION ||
    'KING AUTOLAMP menghadirkan solusi pencahayaan otomotif dengan pilihan produk lampu berkualitas untuk meningkatkan pencahayaan, kenyamanan, dan tampilan kendaraan.',
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM || '@kingautolamp',
  instagram_url:
    process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/kingautolamp/',
  store_address:
    process.env.NEXT_PUBLIC_STORE_ADDRESS ||
    'Perumahan Rindini Green Life, Unnamed Road, Panaikang Blok C No. 287, Panaikang, Panakkukang, Makassar, Sulawesi Selatan',
  store_hours_weekday:
    process.env.NEXT_PUBLIC_STORE_HOURS_WEEKDAY || 'Senin - Jumat: 08.00 - 17.00 WIB',
  store_hours_weekend:
    process.env.NEXT_PUBLIC_STORE_HOURS_WEEKEND || 'Sabtu: 08.00 - 15.00 WIB',
  store_hours_sunday: process.env.NEXT_PUBLIC_STORE_HOURS_SUNDAY || 'Minggu: Tutup',
};

// ============================================================
// WhatsApp checkout URL builder
// ============================================================
export function buildWhatsAppURL(message: string, number?: string): string {
  const phone = number || storeConfig.whatsapp_number;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
}
