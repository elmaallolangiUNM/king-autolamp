'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard, Package, Plus, Edit2, Trash2, LogOut, Settings,
  TrendingUp, Eye, Star, ChevronDown, ChevronUp, X, Save, Zap,
  MessageCircle, CheckCircle,
} from 'lucide-react';
import { PRODUCTS as INITIAL_PRODUCTS } from '@/data/products';
import { Product, Category } from '@/types';
import { formatPrice } from '@/lib/utils';
import clsx from 'clsx';

const CATEGORIES: Category[] = [
  'LED Projector', 'LED Headlight', 'Mini Projector',
  'Fog Lamp', 'Headlamp', 'Automotive Accessories',
];

type AdminTab = 'overview' | 'products' | 'settings';

const EMPTY_PRODUCT: Omit<Product, 'id' | 'created_at'> = {
  name: '',
  slug: '',
  category: 'LED Projector',
  description: '',
  specs: {},
  compatible_vehicles: [],
  images: ['https://images.unsplash.com/photo-1558981852-426c06a93f46?w=800&q=80'],
  price: 0,
  original_price: undefined,
  discount_percent: undefined,
  variants: [],
  stock: 0,
  is_best_seller: false,
  is_new_arrival: false,
  is_active: true,
};

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<AdminTab>('overview');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [saved, setSaved] = useState(false);

  // Settings state
  const [waNumber, setWaNumber] = useState('6282298995682');
  const [storeName, setStoreName] = useState('KING AUTOLAMP');

  useEffect(() => {
    const isAdmin = sessionStorage.getItem('lumora_admin');
    if (isAdmin !== 'true') router.push('/admin');
  }, [router]);

  const logout = () => {
    sessionStorage.removeItem('lumora_admin');
    router.push('/admin');
  };

  const handleDelete = (id: string) => {
    if (confirm('Yakin ingin menghapus produk ini?')) {
      setProducts((p) => p.filter((item) => item.id !== id));
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setIsNewProduct(false);
  };

  const handleNew = () => {
    setEditingProduct({
      id: `p${Date.now()}`,
      created_at: new Date().toISOString(),
      ...EMPTY_PRODUCT,
    });
    setIsNewProduct(true);
  };

  const handleSave = () => {
    if (!editingProduct) return;
    if (isNewProduct) {
      setProducts((p) => [...p, editingProduct]);
    } else {
      setProducts((p) => p.map((item) => (item.id === editingProduct.id ? editingProduct : item)));
    }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setEditingProduct(null);
    }, 1500);
  };

  const totalActive = products.filter((p) => p.is_active).length;
  const totalBestSeller = products.filter((p) => p.is_best_seller).length;
  const totalNewArrivals = products.filter((p) => p.is_new_arrival).length;

  const setField = <K extends keyof Product>(field: K, val: Product[K]) =>
    setEditingProduct((p) => p ? { ...p, [field]: val } : p);

  const slugify = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  return (
    <div className="min-h-screen bg-dark flex">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-100 border-r border-white/5 flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <Image
            src="/images/kingautolamp-logo.png"
            alt="KING AUTOLAMP"
            width={685}
            height={150}
            className="h-8 w-auto object-contain"
          />
          <div className="text-primary text-[10px] font-semibold tracking-widest mt-2">
            ADMIN DASHBOARD
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {[
            { key: 'overview', icon: LayoutDashboard, label: 'Overview' },
            { key: 'products', icon: Package, label: 'Kelola Produk' },
            { key: 'settings', icon: Settings, label: 'Pengaturan' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key as AdminTab)}
              className={clsx(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
                tab === item.key
                  ? 'bg-primary text-white font-semibold'
                  : 'text-gray-mid hover:text-white hover:bg-dark-300'
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-mid hover:text-white hover:bg-dark-300 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-dark-100/90 backdrop-blur border-b border-white/5 px-8 py-4 flex items-center justify-between">
          <h1 className="text-white font-semibold">
            {tab === 'overview' && 'Dashboard Overview'}
            {tab === 'products' && 'Kelola Produk'}
            {tab === 'settings' && 'Pengaturan Toko'}
          </h1>
          <span className="text-silver text-sm">Admin · KING AUTOLAMP</span>
        </div>

        <div className="p-8">
          {/* ==================== OVERVIEW ==================== */}
          {tab === 'overview' && (
            <div className="space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { label: 'Total Produk', value: products.length, icon: Package, color: 'text-blue-400' },
                  { label: 'Produk Aktif', value: totalActive, icon: Eye, color: 'text-green-400' },
                  { label: 'Best Seller', value: totalBestSeller, icon: Star, color: 'text-yellow-400' },
                  { label: 'New Arrivals', value: totalNewArrivals, icon: TrendingUp, color: 'text-primary' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-dark-200 border border-white/5 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-mid text-sm">{stat.label}</span>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div className="text-white text-3xl font-bold">{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* Quick product list */}
              <div className="bg-dark-200 border border-white/5 rounded-xl p-6">
                <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-primary rounded"></span>
                  Produk Terbaru
                </h2>
                <div className="space-y-3">
                  {products.slice(0, 5).map((p) => (
                    <div key={p.id} className="flex items-center gap-4 py-2 border-b border-white/5 last:border-0">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-dark-300 flex-shrink-0">
                        <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium line-clamp-1">{p.name}</p>
                        <p className="text-gray-mid text-xs">{p.category}</p>
                      </div>
                      <span className="text-primary text-sm font-semibold flex-shrink-0">
                        {formatPrice(p.price)}
                      </span>
                      <span className={clsx('w-2 h-2 rounded-full flex-shrink-0', p.is_active ? 'bg-green-400' : 'bg-gray-600')} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================== PRODUCTS ==================== */}
          {tab === 'products' && !editingProduct && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-mid text-sm">{products.length} produk terdaftar</p>
                <button onClick={handleNew} className="btn-primary">
                  <Plus className="w-4 h-4" /> Tambah Produk
                </button>
              </div>

              <div className="bg-dark-200 border border-white/5 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-dark-300 border-b border-white/5">
                    <tr>
                      <th className="text-left text-xs text-gray-mid font-semibold py-3 px-4">Produk</th>
                      <th className="text-left text-xs text-gray-mid font-semibold py-3 px-4">Kategori</th>
                      <th className="text-left text-xs text-gray-mid font-semibold py-3 px-4">Harga</th>
                      <th className="text-left text-xs text-gray-mid font-semibold py-3 px-4">Stok</th>
                      <th className="text-left text-xs text-gray-mid font-semibold py-3 px-4">Status</th>
                      <th className="text-left text-xs text-gray-mid font-semibold py-3 px-4">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} className="border-b border-white/5 hover:bg-dark-300/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-dark-300 flex-shrink-0">
                              <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                            </div>
                            <div>
                              <p className="text-white text-sm font-medium line-clamp-1 max-w-xs">{p.name}</p>
                              <div className="flex gap-1 mt-0.5">
                                {p.is_best_seller && <span className="badge-bestseller text-xs">BS</span>}
                                {p.is_new_arrival && <span className="badge-new text-xs">New</span>}
                                {p.discount_percent && <span className="badge-sale text-xs">-{p.discount_percent}%</span>}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-gray-300 text-xs">{p.category}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-primary text-sm font-semibold">{formatPrice(p.price)}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={clsx('text-sm', p.stock > 5 ? 'text-green-400' : p.stock > 0 ? 'text-yellow-400' : 'text-red-400')}>
                            {p.stock}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() =>
                              setProducts((pr) =>
                                pr.map((item) =>
                                  item.id === p.id ? { ...item, is_active: !item.is_active } : item
                                )
                              )
                            }
                            className={clsx(
                              'text-xs font-semibold px-2 py-1 rounded-full',
                              p.is_active ? 'bg-green-900/40 text-green-400' : 'bg-gray-700 text-gray-mid'
                            )}
                          >
                            {p.is_active ? 'Aktif' : 'Nonaktif'}
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(p)}
                              className="p-1.5 text-gray-mid hover:text-primary transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(p.id)}
                              className="p-1.5 text-gray-mid hover:text-red-400 transition-colors"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================== EDIT PRODUCT FORM ==================== */}
          {tab === 'products' && editingProduct && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white font-semibold text-lg">
                  {isNewProduct ? 'Tambah Produk Baru' : `Edit: ${editingProduct.name}`}
                </h2>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="text-gray-mid hover:text-white p-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-dark-200 border border-white/5 rounded-xl p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Name */}
                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">Nama Produk *</label>
                    <input
                      type="text"
                      value={editingProduct.name}
                      onChange={(e) => {
                        setField('name', e.target.value);
                        if (isNewProduct) setField('slug', slugify(e.target.value));
                      }}
                      className="input-field"
                      placeholder="Nama produk"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">Kategori *</label>
                    <select
                      value={editingProduct.category}
                      onChange={(e) => setField('category', e.target.value as Category)}
                      className="input-field cursor-pointer"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c} className="bg-dark-300">{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">Harga (Rp) *</label>
                    <input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) => setField('price', Number(e.target.value))}
                      className="input-field"
                      min={0}
                    />
                  </div>

                  {/* Original Price */}
                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">Harga Asli (Rp, opsional)</label>
                    <input
                      type="number"
                      value={editingProduct.original_price ?? ''}
                      onChange={(e) => setField('original_price', e.target.value ? Number(e.target.value) : undefined)}
                      className="input-field"
                      min={0}
                      placeholder="Kosongkan jika tidak ada diskon"
                    />
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">Stok *</label>
                    <input
                      type="number"
                      value={editingProduct.stock}
                      onChange={(e) => setField('stock', Number(e.target.value))}
                      className="input-field"
                      min={0}
                    />
                  </div>

                  {/* Discount */}
                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">Diskon (%, opsional)</label>
                    <input
                      type="number"
                      value={editingProduct.discount_percent ?? ''}
                      onChange={(e) => setField('discount_percent', e.target.value ? Number(e.target.value) : undefined)}
                      className="input-field"
                      min={0}
                      max={100}
                      placeholder="Contoh: 20"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">Deskripsi</label>
                  <textarea
                    value={editingProduct.description}
                    onChange={(e) => setField('description', e.target.value)}
                    rows={3}
                    className="input-field resize-none"
                    placeholder="Deskripsi produk..."
                  />
                </div>

                {/* Images */}
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">URL Foto Produk (satu per baris)</label>
                  <textarea
                    value={editingProduct.images.join('\n')}
                    onChange={(e) => setField('images', e.target.value.split('\n').filter(Boolean))}
                    rows={3}
                    className="input-field resize-none font-mono text-xs"
                    placeholder="https://..."
                  />
                </div>

                {/* Toggles */}
                <div className="flex flex-wrap gap-6">
                  {[
                    { field: 'is_best_seller', label: 'Best Seller' },
                    { field: 'is_new_arrival', label: 'New Arrival' },
                    { field: 'is_active', label: 'Aktif / Tampil' },
                  ].map((toggle) => (
                    <label key={toggle.field} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingProduct[toggle.field as keyof Product] as boolean}
                        onChange={(e) => setField(toggle.field as keyof Product, e.target.checked as never)}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-gray-300 text-sm">{toggle.label}</span>
                    </label>
                  ))}
                </div>

                {/* Save button */}
                <div className="flex gap-3 pt-2">
                  <button onClick={handleSave} className="btn-primary px-8">
                    {saved ? (
                      <><CheckCircle className="w-4 h-4" /> Tersimpan!</>
                    ) : (
                      <><Save className="w-4 h-4" /> Simpan Produk</>
                    )}
                  </button>
                  <button onClick={() => setEditingProduct(null)} className="btn-ghost px-6">
                    Batal
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==================== SETTINGS ==================== */}
          {tab === 'settings' && (
            <div className="max-w-2xl space-y-6">
              <div className="bg-dark-200 border border-white/5 rounded-xl p-6">
                <h2 className="text-white font-semibold mb-5 flex items-center gap-2">
                  <span className="w-1 h-4 bg-primary rounded"></span>
                  Pengaturan Toko
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">Nama Toko</label>
                    <input
                      type="text"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-300 mb-2 flex items-center gap-2 block">
                      <MessageCircle className="w-4 h-4 text-green-400" />
                      Nomor WhatsApp Admin
                    </label>
                    <input
                      type="text"
                      value={waNumber}
                      onChange={(e) => setWaNumber(e.target.value)}
                      className="input-field"
                      placeholder="62812xxxxxxxx"
                    />
                    <p className="text-gray-mid text-xs mt-1">
                      Format: 62xxxxxxxxx (kode negara 62, tanpa angka 0 di depan)
                    </p>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-dark-300 rounded-lg">
                  <p className="text-yellow-400 text-xs font-semibold mb-1">⚠️ Catatan Penting</p>
                  <p className="text-gray-mid text-xs">
                    Perubahan pengaturan di sini bersifat sementara (session). Untuk perubahan
                    permanen, edit file <code className="text-primary">.env.local</code> dan
                    restart server, atau gunakan Supabase untuk penyimpanan database.
                  </p>
                </div>
                <button className="btn-primary mt-5">
                  <Save className="w-4 h-4" /> Simpan Pengaturan
                </button>
              </div>

              <div className="bg-dark-200 border border-white/5 rounded-xl p-6">
                <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-primary rounded"></span>
                  Integrasi Supabase
                </h2>
                <p className="text-gray-mid text-sm mb-4">
                  Untuk menghubungkan database Supabase, tambahkan konfigurasi berikut ke file{' '}
                  <code className="text-primary">.env.local</code>:
                </p>
                <pre className="bg-dark-300 rounded-lg p-4 text-xs text-green-400 overflow-auto">
{`NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key`}
                </pre>
                <p className="text-gray-mid text-xs mt-3">
                  Lihat dokumentasi lengkap di{' '}
                  <code className="text-primary">SUPABASE_SETUP.md</code> di root project.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
