// ============================================================
// KING AUTOLAMP — Product Service
// Storage: Upstash Redis (REST API) — gratis, persisten di Vercel
// Fallback: in-memory dari INITIAL_PRODUCTS jika Redis belum di-setup
// ============================================================

import { Product } from '@/types';
import { PRODUCTS as INITIAL_PRODUCTS } from '@/data/products';

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const REDIS_KEY = 'king_autolamp_products';

// ─── Redis Helpers ─────────────────────────────────────────

async function redisGet(key: string): Promise<string | null> {
  if (!REDIS_URL || !REDIS_TOKEN) return null;
  try {
    const res = await fetch(`${REDIS_URL}/get/${key}`, {
      headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.result ?? null;
  } catch {
    return null;
  }
}

async function redisSet(key: string, value: string): Promise<boolean> {
  if (!REDIS_URL || !REDIS_TOKEN) return false;
  try {
    const res = await fetch(`${REDIS_URL}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${REDIS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(['SET', key, value]),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ─── Public API ────────────────────────────────────────────

export async function getStoredProducts(): Promise<Product[]> {
  // Coba ambil dari Redis
  const raw = await redisGet(REDIS_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Product[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
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
