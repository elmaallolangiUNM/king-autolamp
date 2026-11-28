// ============================================================
// KING AUTOLAMP — Product Service
// Storage: Upstash Redis (REST API) — gratis, persisten di Vercel
// Fallback: in-memory dari INITIAL_PRODUCTS jika Redis belum di-setup
// ============================================================

import { Product, Category } from '@/types';
import { PRODUCTS as INITIAL_PRODUCTS } from '@/data/products';
import { redisGet, redisSet } from '@/lib/redis';

const LEGACY_CATEGORY_MAP: Record<string, Category> = {
  'LED Projector': 'BILED Projector',
  'Headlamp': 'BILED Projector',
  'LED Headlight': 'Automotive Accessories',
};

function normalizeCategory(category: string): Category {
  return LEGACY_CATEGORY_MAP[category] ?? (category as Category);
}

const REDIS_KEY = 'king_autolamp_products';

// ─── Public API ────────────────────────────────────────────

export async function getStoredProducts(): Promise<Product[]> {
  // Coba ambil dari Redis
  const raw = await redisGet(REDIS_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Product[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((p) => ({
          ...p,
          category: normalizeCategory(p.category as string),
        }));
      }
    } catch {
      // JSON corrupt, lanjut ke fallback
    }
  }
  // Fallback ke data awal
  return INITIAL_PRODUCTS;
}

export async function saveAllProducts(products: Product[]): Promise<boolean> {
  const ok = await redisSet(REDIS_KEY, JSON.stringify(products));
  return ok;
}

export async function addOrUpdateProduct(
  product: Product
): Promise<{ success: boolean; products: Product[] }> {
  const products = await getStoredProducts();
  const index = products.findIndex((p) => p.id === product.id);

  let updatedList: Product[];
  if (index >= 0) {
    updatedList = products.map((p) => (p.id === product.id ? product : p));
  } else {
    updatedList = [product, ...products];
  }

  const ok = await saveAllProducts(updatedList);
  return { success: ok, products: updatedList };
}

export async function deleteStoredProduct(
  id: string
): Promise<{ success: boolean; products: Product[] }> {
  const products = await getStoredProducts();
  const updatedList = products.filter((p) => p.id !== id);
  const ok = await saveAllProducts(updatedList);
  return { success: ok, products: updatedList };
}
