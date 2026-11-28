// ============================================================
// KING AUTOLAMP — Category Service
// Storage: Upstash Redis (REST API) with default fallback
// ============================================================

import { CategoryItem } from '@/types';
import { redisGet, redisSet } from '@/lib/redis';

const REDIS_KEY = 'king_autolamp_categories';

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat_biled',
    name: 'BILED Projector',
    description: 'Proyektor BILED super terang untuk visibilitas maksimal',
    image: 'https://images.unsplash.com/photo-1558981852-426c06a93f46?w=600&q=80',
    icon: '💡',
  },
  {
    id: 'cat_mini',
    name: 'Mini Projector',
    description: 'Projector kompak untuk motor dan kendaraan kecil',
    image: 'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=600&q=80',
    icon: '🎯',
  },
  {
    id: 'cat_fog',
    name: 'Fog Lamp',
    description: 'Lampu kabut optimal untuk cuaca ekstrem',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=80',
    icon: '🌫️',
  },
  {
    id: 'cat_accessories',
    name: 'Automotive Accessories',
    description: 'DRL, ballast, strips dan aksesori otomotif',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80',
    icon: '⚙️',
  },
];

export async function getStoredCategories(): Promise<CategoryItem[]> {
  const raw = await redisGet(REDIS_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as CategoryItem[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // JSON corrupt, fallback to defaults
    }
  }
  return DEFAULT_CATEGORIES;
}

export async function saveAllCategories(categories: CategoryItem[]): Promise<boolean> {
  return redisSet(REDIS_KEY, JSON.stringify(categories));
}

export async function addOrUpdateCategory(
  category: CategoryItem
): Promise<{ success: boolean; categories: CategoryItem[] }> {
  const categories = await getStoredCategories();
  const index = categories.findIndex((c) => c.id === category.id);

  const updatedList =
    index >= 0
      ? categories.map((c) => (c.id === category.id ? category : c))
      : [...categories, category];

  const ok = await saveAllCategories(updatedList);
  return { success: ok, categories: updatedList };
}

export async function deleteStoredCategory(
  id: string
): Promise<{ success: boolean; categories: CategoryItem[] }> {
  const categories = await getStoredCategories();
  const updatedList = categories.filter((c) => c.id !== id);
  const ok = await saveAllCategories(updatedList);
  return { success: ok, categories: updatedList };
}
