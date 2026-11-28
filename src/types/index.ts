// ============================================================
// KING AUTOLAMP — Type Definitions
// ============================================================

export type Category = string;

export interface CategoryItem {
  id: string;
  name: string;
  description: string;
  image: string;
  icon?: string;
}

export interface ProductVariant {
  id: string;
  name: string; // e.g. "H4", "H7", "9005/HB3"
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: Category;
  description: string;
  specs: Record<string, string>;
  compatible_vehicles: string[];
  images: string[];       // array of image URLs
  price: number;          // base/main price
  original_price?: number; // before discount
  discount_percent?: number;
  variants: ProductVariant[];
  stock: number;          // total stock (sum of variants if has variants)
  is_best_seller: boolean;
  is_new_arrival: boolean;
  is_active: boolean;
  hide_price?: boolean;
  created_at: string;
}

export interface CartItem {
  product_id: string;
  product_name: string;
  product_image: string;
  variant_id?: string;
  variant_name?: string;
  price: number;
  hide_price?: boolean;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
}

export interface CheckoutFormData {
  full_name: string;
  whatsapp: string;
  address: string;
  city: string;
  notes?: string;
}

export interface StoreConfig {
  whatsapp_number: string;
  store_name: string;
  store_tagline: string;
  store_description: string;
  instagram: string;
  instagram_url: string;
  store_address: string;
  store_hours_weekday: string;
  store_hours_weekend: string;
  store_hours_sunday: string;
}

export interface Testimonial {
  id: string;
  name: string;
  vehicle: string;
  rating: number;
  review: string;
  product_purchased: string;
  date: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  cta_text: string;
  cta_link: string;
  is_active: boolean;
}

export type SortOption =
  | 'newest'
  | 'price_asc'
  | 'price_desc'
  | 'best_seller';

export interface FilterState {
  category: Category | 'All';
  search: string;
  price_min: number;
  price_max: number;
  sort: SortOption;
}

export interface AdminUser {
  username: string;
  is_logged_in: boolean;
}
