'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { Category, FilterState, SortOption } from '@/types';
import ProductCard from '@/components/ui/ProductCard';
import { useCart } from '@/context/CartContext';
import { CartItem, Product } from '@/types';
import clsx from 'clsx';

const CATEGORIES: Array<Category | 'All'> = [
  'All',
  'LED Projector',
  'LED Headlight',
  'Mini Projector',
  'Fog Lamp',
  'Headlamp',
  'Automotive Accessories',
];

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'newest', label: 'Terbaru' },
  { value: 'best_seller', label: 'Best Seller' },
  { value: 'price_asc', label: 'Harga Terendah' },
  { value: 'price_desc', label: 'Harga Tertinggi' },
];

const ITEMS_PER_PAGE = 8;

function ProductsContent() {
  const searchParams = useSearchParams();
  const { addItem } = useCart();

  const [filters, setFilters] = useState<FilterState>({
    category: (searchParams.get('category') as Category) || 'All',
    search: searchParams.get('search') || '',
    price_min: 0,
    price_max: 2000000,
    sort: (searchParams.get('sort') as SortOption) || 'newest',
  });

  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Sync from URL params on load
  useEffect(() => {
    const cat = searchParams.get('category') as Category;
    const sort = searchParams.get('sort') as SortOption;
    setFilters((f) => ({
      ...f,
      category: cat || 'All',
      sort: sort || 'newest',
    }));
    setPage(1);
  }, [searchParams]);

  const handleAddToCart = (product: Product) => {
    const firstVariant = product.variants[0];
    const item: CartItem = {
      product_id: product.id,
      product_name: product.name,
      product_image: product.images[0],
      variant_id: firstVariant?.id,
      variant_name: firstVariant?.name,
      price: firstVariant?.price ?? product.price,
      quantity: 1,
    };
    addItem(item);
  };

  // Filter logic
  let filtered = PRODUCTS.filter((p) => p.is_active);

  if (filters.category !== 'All') {
    filtered = filtered.filter((p) => p.category === filters.category);
  }

  if (filters.search.trim()) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  filtered = filtered.filter(
    (p) => p.price >= filters.price_min && p.price <= filters.price_max
  );

  // Sort
  switch (filters.sort) {
    case 'price_asc':
      filtered = [...filtered].sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      filtered = [...filtered].sort((a, b) => b.price - a.price);
      break;
    case 'best_seller':
      filtered = [...filtered].sort((a, b) => Number(b.is_best_seller) - Number(a.is_best_seller));
      break;
    case 'newest':
    default:
      filtered = [...filtered].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      break;
  }

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(0, page * ITEMS_PER_PAGE);

  return (
    <div className="pt-20 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="py-10">
        <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-2">Katalog</p>
        <h1 className="section-title">All Products</h1>
        <div className="accent-line" />
      </div>

      {/* Search + Sort bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-mid" />
          <input
            type="text"
            placeholder="Cari produk..."
            value={filters.search}
            onChange={(e) => {
              setFilters((f) => ({ ...f, search: e.target.value }));
              setPage(1);
            }}
            className="input-field pl-10"
          />
          {filters.search && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-mid hover:text-white"
              onClick={() => setFilters((f) => ({ ...f, search: '' }))}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort */}
        <select
          value={filters.sort}
          onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value as SortOption }))}
          className="input-field md:w-52 cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-dark-300">
              {opt.label}
            </option>
          ))}
        </select>

        {/* Mobile filter toggle */}
        <button
          className="btn-outline md:hidden gap-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filter
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar filters */}
        <aside
          className={clsx(
            'w-64 flex-shrink-0 space-y-6',
            showFilters ? 'block' : 'hidden md:block'
          )}
        >
          {/* Category */}
          <div className="bg-dark-200 border border-white/5 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-primary rounded"></span>
              Kategori
            </h3>
            <div className="space-y-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setFilters((f) => ({ ...f, category: cat }));
                    setPage(1);
                  }}
                  className={clsx(
                    'w-full text-left px-3 py-2 rounded-lg text-sm transition-all',
                    filters.category === cat
                      ? 'bg-primary text-white font-semibold'
                      : 'text-gray-mid hover:text-white hover:bg-dark-300'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price range */}
          <div className="bg-dark-200 border border-white/5 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-primary rounded"></span>
              Harga
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-mid mb-1 block">Min (Rp)</label>
                <input
                  type="number"
                  value={filters.price_min}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, price_min: Number(e.target.value) }))
                  }
                  min={0}
                  step={50000}
                  className="input-field text-sm py-2"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-xs text-gray-mid mb-1 block">Max (Rp)</label>
                <input
                  type="number"
                  value={filters.price_max}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, price_max: Number(e.target.value) }))
                  }
                  min={0}
                  step={50000}
                  className="input-field text-sm py-2"
                  placeholder="2000000"
                />
              </div>
              <button
                onClick={() =>
                  setFilters((f) => ({ ...f, price_min: 0, price_max: 2000000 }))
                }
                className="text-xs text-primary hover:underline"
              >
                Reset Harga
              </button>
            </div>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-5">
            <p className="text-gray-mid text-sm">
              Menampilkan <span className="text-white font-semibold">{paginated.length}</span>{' '}
              dari <span className="text-white font-semibold">{filtered.length}</span> produk
            </p>
          </div>

          {paginated.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-5xl mb-4">🔦</p>
              <p className="text-white font-semibold text-lg">Produk tidak ditemukan</p>
              <p className="text-gray-mid text-sm mt-1">Coba ubah filter atau kata kunci pencarian</p>
              <button
                onClick={() =>
                  setFilters({
                    category: 'All',
                    search: '',
                    price_min: 0,
                    price_max: 2000000,
                    sort: 'newest',
                  })
                }
                className="btn-primary mt-6"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {paginated.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>

              {page < totalPages && (
                <div className="text-center mt-10">
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    className="btn-outline px-10 py-3"
                  >
                    Load More ({filtered.length - paginated.length} produk lagi)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center text-gray-mid">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
