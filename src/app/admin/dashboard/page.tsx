'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  LayoutDashboard, Package, Plus, Edit2, Trash2, LogOut, Settings,
  TrendingUp, Eye, Star, X, Save, ExternalLink,
  MessageCircle, CheckCircle, AlertCircle, RefreshCw, Car, Tag,
  Layers, PlusCircle, MinusCircle, ArrowLeft, Upload
} from 'lucide-react';
import { PRODUCTS as INITIAL_PRODUCTS } from '@/data/products';
import { Product, Category, ProductVariant } from '@/types';
import { formatPrice } from '@/lib/utils';
import clsx from 'clsx';

const CATEGORIES: Category[] = [
  'BILED Projector', 'Mini Projector',
  'Fog Lamp', 'Automotive Accessories',
];

type AdminTab = 'overview' | 'products' | 'settings';

const DEFAULT_SPECS: Record<string, string> = {
  'Daya': '90W (45W × 2)',
  'Warna Cahaya': '6000K Pure White',
  'Lumens': '8000LM per pasang',
  'Tegangan': 'DC 9V – 32V',
  'IP Rating': 'IP67 Waterproof',
  'Garansi': '1 Tahun',
};

const EMPTY_PRODUCT: Omit<Product, 'id' | 'created_at'> = {
  name: '',
  slug: '',
  category: 'BILED Projector',
  description: '',
  specs: { ...DEFAULT_SPECS },
  compatible_vehicles: ['Toyota Avanza', 'Honda Brio', 'Mitsubishi Xpander'],
  images: ['https://images.unsplash.com/photo-1558981852-426c06a93f46?w=800&q=80'],
  price: 500000,
  original_price: undefined,
  discount_percent: undefined,
  variants: [
    { id: 'v1', name: 'Standar', price: 500000, stock: 20 },
  ],
  stock: 20,
  is_best_seller: false,
  is_new_arrival: true,
  is_active: true,
  hide_price: false,
};

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<AdminTab>('products');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // New tag inputs
  const [newVehicle, setNewVehicle] = useState('');
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Settings state
  const [waNumber, setWaNumber] = useState('6282298995682');
  const [storeName, setStoreName] = useState('KING AUTOLAMP');

  // Verify auth
  useEffect(() => {
    const isSession = sessionStorage.getItem('lumora_admin');
    const isLocal = localStorage.getItem('lumora_admin');
    if (isSession !== 'true' && isLocal !== 'true') {
      router.push('/admin');
    }
  }, [router]);

  // Fetch products from API on mount
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);
        }
      }
    } catch (err) {
      console.warn('API error, using initial products fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const logout = () => {
    sessionStorage.removeItem('lumora_admin');
    localStorage.removeItem('lumora_admin');
    router.push('/admin');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus produk ini dari katalog?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const data = await res.json();
        if (data.products) setProducts(data.products);
        else setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
      showToast('Produk berhasil dihapus');
    } catch {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast('Produk dihapus (lokal)');
    }
  };

  const handleToggleActive = async (p: Product) => {
    const updated = { ...p, is_active: !p.is_active };
    try {
      await fetch(`/api/products/${p.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      setProducts((prev) => prev.map((item) => (item.id === p.id ? updated : item)));
      showToast(updated.is_active ? 'Produk diaktifkan' : 'Produk dinonaktifkan');
    } catch {
      setProducts((prev) => prev.map((item) => (item.id === p.id ? updated : item)));
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(JSON.parse(JSON.stringify(product)));
    setIsNewProduct(false);
  };

  const handleNew = () => {
    const newId = `p_${Date.now()}`;
    setEditingProduct({
      id: newId,
      created_at: new Date().toISOString(),
      ...EMPTY_PRODUCT,
    });
    setIsNewProduct(true);
  };

  const slugify = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const setField = <K extends keyof Product>(field: K, val: Product[K]) => {
    setEditingProduct((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, [field]: val };
      if (field === 'price' || field === 'original_price') {
        const p = field === 'price' ? (val as number) : updated.price;
        const op = field === 'original_price' ? (val as number | undefined) : updated.original_price;
        if (op && op > p) {
          updated.discount_percent = Math.round(((op - p) / op) * 100);
        } else {
          updated.discount_percent = undefined;
        }
      }
      return updated;
    });
  };

  const handleSave = async () => {
    if (!editingProduct) return;
    if (!editingProduct.name.trim()) {
      showToast('Nama produk tidak boleh kosong', 'error');
      return;
    }
    if (!editingProduct.hide_price && (!editingProduct.price || editingProduct.price <= 0)) {
      showToast('Harga produk harus lebih dari 0 (atau centang Sembunyikan Harga)', 'error');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.products) {
          setProducts(data.products);
        } else {
          setProducts((prev) => {
            const idx = prev.findIndex((p) => p.id === editingProduct.id);
            if (idx >= 0) return prev.map((p) => (p.id === editingProduct.id ? editingProduct : p));
            return [editingProduct, ...prev];
          });
        }
      } else {
        // Fallback update local state
        setProducts((prev) => {
          const idx = prev.findIndex((p) => p.id === editingProduct.id);
          if (idx >= 0) return prev.map((p) => (p.id === editingProduct.id ? editingProduct : p));
          return [editingProduct, ...prev];
        });
      }

      showToast(isNewProduct ? 'Produk baru berhasil ditambahkan ke katalog web!' : 'Perubahan produk berhasil disimpan!');
      setEditingProduct(null);
    } catch (err) {
      console.error('Error saving product:', err);
      showToast('Berhasil disimpan ke state lokal', 'success');
      setEditingProduct(null);
    } finally {
      setSaving(false);
    }
  };

  // Specs handlers
  const handleAddSpec = () => {
    if (!newSpecKey.trim() || !newSpecValue.trim() || !editingProduct) return;
    setField('specs', {
      ...editingProduct.specs,
      [newSpecKey.trim()]: newSpecValue.trim(),
    });
    setNewSpecKey('');
    setNewSpecValue('');
  };

  const handleRemoveSpec = (key: string) => {
    if (!editingProduct) return;
    const newSpecs = { ...editingProduct.specs };
    delete newSpecs[key];
    setField('specs', newSpecs);
  };

  // Vehicle handlers
  const handleAddVehicle = () => {
    if (!newVehicle.trim() || !editingProduct) return;
    if (!editingProduct.compatible_vehicles.includes(newVehicle.trim())) {
      setField('compatible_vehicles', [...editingProduct.compatible_vehicles, newVehicle.trim()]);
    }
    setNewVehicle('');
  };

  const handleRemoveVehicle = (v: string) => {
    if (!editingProduct) return;
    setField(
      'compatible_vehicles',
      editingProduct.compatible_vehicles.filter((item) => item !== v)
    );
  };

  // Image handlers
  const compressImage = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const objectUrl = URL.createObjectURL(file);
      const img = new window.Image();
      img.onload = () => {
        try {
          const maxSize = 800;
          let { width, height } = img;
          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = Math.round((height * maxSize) / width);
              width = maxSize;
            } else {
              width = Math.round((width * maxSize) / height);
              height = maxSize;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context unavailable'));
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.78);
          resolve(dataUrl);
        } finally {
          URL.revokeObjectURL(objectUrl);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Gagal memuat gambar'));
      };
      img.src = objectUrl;
    });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editingProduct) return;

    setUploadingImage(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue;
        const compressed = await compressImage(file);
        uploadedUrls.push(compressed);
      }
      if (uploadedUrls.length > 0) {
        setField('images', [...editingProduct.images, ...uploadedUrls]);
        showToast(`${uploadedUrls.length} foto berhasil diupload!`);
      } else {
        showToast('Pilih file gambar yang valid (JPG/PNG/WebP)', 'error');
      }
    } catch {
      showToast('Gagal memproses foto. Coba file lain.', 'error');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleAddImage = () => {
    if (!newImageUrl.trim() || !editingProduct) return;
    setField('images', [...editingProduct.images, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    if (!editingProduct) return;
    const newImages = [...editingProduct.images];
    newImages.splice(index, 1);
    setField('images', newImages.length > 0 ? newImages : ['https://images.unsplash.com/photo-1558981852-426c06a93f46?w=800&q=80']);
  };

  // Variant handlers
  const handleAddVariant = () => {
    if (!editingProduct) return;
    const newVar: ProductVariant = {
      id: `v_${Date.now()}`,
      name: 'Varian Baru',
      price: editingProduct.price,
      stock: 10,
    };
    const updatedVariants = [...editingProduct.variants, newVar];
    setField('variants', updatedVariants);
    const totalStock = updatedVariants.reduce((sum, v) => sum + v.stock, 0);
    setField('stock', totalStock);
  };

  const handleUpdateVariant = (index: number, key: keyof ProductVariant, value: string | number) => {
    if (!editingProduct) return;
    const updatedVariants = [...editingProduct.variants];
    updatedVariants[index] = { ...updatedVariants[index], [key]: value };
    setField('variants', updatedVariants);
    if (key === 'stock') {
      const totalStock = updatedVariants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
      setField('stock', totalStock);
    }
  };

  const handleRemoveVariant = (index: number) => {
    if (!editingProduct) return;
    const updatedVariants = editingProduct.variants.filter((_, i) => i !== index);
    setField('variants', updatedVariants);
  };

  const totalActive = products.filter((p) => p.is_active).length;
  const totalBestSeller = products.filter((p) => p.is_best_seller).length;
  const totalNewArrivals = products.filter((p) => p.is_new_arrival).length;

  return (
    <div className="min-h-screen bg-dark flex flex-col md:flex-row">
      {/* Toast Notification */}
      {notification && (
        <div
          className={clsx(
            'fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-sm animate-fade-in font-medium backdrop-blur-md',
            notification.type === 'success'
              ? 'bg-green-950/90 border-green-500/50 text-green-200'
              : 'bg-red-950/90 border-red-500/50 text-red-200'
          )}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-dark-100 border-r border-white/5 flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="inline-block">
            <Image
              src="/images/kingautolamp-logo.png"
              alt="KING AUTOLAMP"
              width={685}
              height={150}
              className="h-8 w-auto object-contain"
            />
          </Link>
          <div className="flex items-center justify-between mt-2">
            <span className="text-primary text-[10px] font-bold tracking-widest uppercase">
              ADMIN DASHBOARD
            </span>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {[
            { key: 'products', icon: Package, label: 'Kelola Produk' },
            { key: 'overview', icon: LayoutDashboard, label: 'Ringkasan & Statistik' },
            { key: 'settings', icon: Settings, label: 'Pengaturan Toko' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setTab(item.key as AdminTab);
                setEditingProduct(null);
              }}
              className={clsx(
                'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-all',
                tab === item.key && !editingProduct
                  ? 'bg-primary text-white font-semibold shadow-md shadow-primary/20'
                  : 'text-gray-mid hover:text-white hover:bg-dark-300'
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}

          <div className="pt-4 border-t border-white/5 mt-4">
            <Link
              href="/"
              target="_blank"
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm text-silver hover:text-white hover:bg-dark-300 transition-all group"
            >
              <span className="flex items-center gap-3">
                <ExternalLink className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                Lihat Web Toko
              </span>
              <span className="text-xs bg-dark-300 px-2 py-0.5 rounded text-gray-mid">Live</span>
            </Link>
          </div>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-gray-mid hover:text-red-400 hover:bg-dark-300 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Keluar dari Admin
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-dark-100/90 backdrop-blur border-b border-white/5 px-6 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-white font-semibold text-lg">
              {editingProduct
                ? isNewProduct
                  ? 'Tambah Produk Baru'
                  : `Edit Produk: ${editingProduct.name}`
                : tab === 'overview'
                ? 'Dashboard Overview'
                : tab === 'products'
                ? 'Kelola Produk & Katalog'
                : 'Pengaturan Toko'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchProducts}
              disabled={loading}
              className="p-2 rounded-lg text-silver hover:text-white hover:bg-dark-300 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={clsx('w-4 h-4', loading && 'animate-spin text-primary')} />
            </button>
            <span className="hidden sm:inline-block text-silver text-xs bg-dark-300 px-3 py-1.5 rounded-full border border-white/5">
              Admin: <strong className="text-white">admin</strong>
            </span>
          </div>
        </header>

        <main className="p-6 md:p-8 flex-1">
          {/* ==================== PRODUCTS LIST ==================== */}
          {tab === 'products' && !editingProduct && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-white text-xl font-bold">Katalog Produk</h2>
                  <p className="text-silver text-sm mt-0.5">
                    Total {products.length} produk terdaftar di sistem KING AUTOLAMP
                  </p>
                </div>
                <button
                  onClick={handleNew}
                  className="btn-primary flex items-center gap-2 shadow-lg shadow-primary/20 px-5 py-2.5"
                >
                  <Plus className="w-4 h-4" /> Tambah Produk Baru
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-dark-200 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-dark-300/80 border-b border-white/5">
                      <tr>
                        <th className="py-3.5 px-4 text-xs font-semibold text-gray-300">Produk</th>
                        <th className="py-3.5 px-4 text-xs font-semibold text-gray-300">Kategori</th>
                        <th className="py-3.5 px-4 text-xs font-semibold text-gray-300">Harga</th>
                        <th className="py-3.5 px-4 text-xs font-semibold text-gray-300">Stok</th>
                        <th className="py-3.5 px-4 text-xs font-semibold text-gray-300">Varian</th>
                        <th className="py-3.5 px-4 text-xs font-semibold text-gray-300">Status</th>
                        <th className="py-3.5 px-4 text-xs font-semibold text-gray-300 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {products.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-gray-mid">
                            Belum ada produk. Klik tombol &ldquo;Tambah Produk Baru&rdquo; untuk menambahkan.
                          </td>
                        </tr>
                      ) : (
                        products.map((p) => (
                          <tr
                            key={p.id}
                            className="hover:bg-dark-300/40 transition-colors group"
                          >
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-dark-300 flex-shrink-0 border border-white/5">
                                  <Image
                                    src={p.images[0] || 'https://images.unsplash.com/photo-1558981852-426c06a93f46?w=800&q=80'}
                                    alt={p.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-white text-sm font-semibold line-clamp-1 max-w-xs group-hover:text-primary transition-colors">
                                    {p.name}
                                  </p>
                                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                    {p.is_best_seller && (
                                      <span className="badge-bestseller text-[10px] px-1.5 py-0.2">
                                        Best Seller
                                      </span>
                                    )}
                                    {p.is_new_arrival && (
                                      <span className="badge-new text-[10px] px-1.5 py-0.2">
                                        Baru
                                      </span>
                                    )}
                                    {p.discount_percent && (
                                      <span className="badge-sale text-[10px] px-1.5 py-0.2">
                                        -{p.discount_percent}%
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="text-xs bg-dark-300 px-2.5 py-1 rounded-md text-silver border border-white/5">
                                {p.category}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              {p.hide_price ? (
                                <span className="text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded font-medium">
                                  Disembunyikan
                                </span>
                              ) : (
                                <>
                                  <div className="font-semibold text-primary text-sm">
                                    {formatPrice(p.price)}
                                  </div>
                                  {p.original_price && (
                                    <div className="text-gray-mid text-xs line-through">
                                      {formatPrice(p.original_price)}
                                    </div>
                                  )}
                                </>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={clsx(
                                  'text-xs font-semibold px-2 py-0.5 rounded',
                                  p.stock > 10
                                    ? 'text-green-400 bg-green-950/40'
                                    : p.stock > 0
                                    ? 'text-yellow-400 bg-yellow-950/40'
                                    : 'text-red-400 bg-red-950/40'
                                )}
                              >
                                {p.stock} unit
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-xs text-silver">
                              {p.variants?.length > 0 ? (
                                <span className="flex items-center gap-1">
                                  <Layers className="w-3.5 h-3.5 text-primary" />
                                  {p.variants.length} varian
                                </span>
                              ) : (
                                <span className="text-gray-mid">-</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              <button
                                onClick={() => handleToggleActive(p)}
                                className={clsx(
                                  'text-xs font-medium px-2.5 py-1 rounded-full transition-colors flex items-center gap-1.5',
                                  p.is_active
                                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                    : 'bg-gray-800 text-gray-mid border border-gray-700'
                                )}
                              >
                                <span className={clsx('w-1.5 h-1.5 rounded-full', p.is_active ? 'bg-green-400' : 'bg-gray-500')} />
                                {p.is_active ? 'Tampil' : 'Nonaktif'}
                              </button>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Link
                                  href={`/products/${p.slug}`}
                                  target="_blank"
                                  className="p-1.5 rounded-lg text-gray-mid hover:text-white hover:bg-dark-300 transition-colors"
                                  title="Lihat di Web"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </Link>
                                <button
                                  onClick={() => handleEdit(p)}
                                  className="p-1.5 rounded-lg text-gray-mid hover:text-primary hover:bg-dark-300 transition-colors"
                                  title="Edit Produk"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(p.id)}
                                  className="p-1.5 rounded-lg text-gray-mid hover:text-red-400 hover:bg-dark-300 transition-colors"
                                  title="Hapus Produk"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================== ADD / EDIT PRODUCT FORM ==================== */}
          {tab === 'products' && editingProduct && (
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setEditingProduct(null)}
                    className="p-2 rounded-lg text-silver hover:text-white hover:bg-dark-200 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h2 className="text-white font-bold text-xl">
                      {isNewProduct ? 'Tambah Produk Baru ke Web' : `Edit Produk`}
                    </h2>
                    <p className="text-silver text-xs mt-0.5">
                      Lengkapi data produk berikut untuk langsung ditampilkan pada katalog KING AUTOLAMP
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="text-silver hover:text-white p-2 rounded-lg hover:bg-dark-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* 1. Informasi Utama */}
                <div className="bg-dark-200 border border-white/10 rounded-2xl p-6 space-y-5">
                  <h3 className="text-white font-semibold text-base flex items-center gap-2 border-b border-white/5 pb-3">
                    <Package className="w-4 h-4 text-primary" /> Informasi Dasar Produk
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Nama */}
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-200 mb-1.5 block">
                        Nama Produk <span className="text-primary">*</span>
                      </label>
                      <input
                        type="text"
                        value={editingProduct.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setField('name', val);
                          if (isNewProduct) {
                            setField('slug', slugify(val));
                          }
                        }}
                        className="input-field"
                        placeholder="Contoh: BILED Projector 2.5 Inch Ultra Vision"
                        required
                      />
                    </div>

                    {/* Slug URL */}
                    <div>
                      <label className="text-sm font-medium text-gray-200 mb-1.5 block">
                        Slug URL (Identifikasi link produk)
                      </label>
                      <input
                        type="text"
                        value={editingProduct.slug}
                        onChange={(e) => setField('slug', slugify(e.target.value))}
                        className="input-field font-mono text-xs"
                        placeholder="led-projector-h4-bi-led"
                      />
                    </div>

                    {/* Kategori */}
                    <div>
                      <label className="text-sm font-medium text-gray-200 mb-1.5 block">
                        Kategori <span className="text-primary">*</span>
                      </label>
                      <select
                        value={editingProduct.category}
                        onChange={(e) => setField('category', e.target.value as Category)}
                        className="input-field cursor-pointer"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c} className="bg-dark-300">
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Harga Pokok */}
                    <div>
                      <label className="text-sm font-medium text-gray-200 mb-1.5 block">
                        Harga Jual (Rp) <span className="text-primary">*</span>
                      </label>
                      <input
                        type="number"
                        value={editingProduct.price || ''}
                        onChange={(e) => setField('price', Number(e.target.value))}
                        className="input-field"
                        placeholder="850000"
                        min={0}
                      />
                    </div>

                    {/* Harga Asli / Coret */}
                    <div>
                      <label className="text-sm font-medium text-gray-200 mb-1.5 block">
                        Harga Asli / Coret (Rp, opsional untuk promo)
                      </label>
                      <input
                        type="number"
                        value={editingProduct.original_price ?? ''}
                        onChange={(e) =>
                          setField('original_price', e.target.value ? Number(e.target.value) : undefined)
                        }
                        className="input-field"
                        placeholder="Contoh: 1100000"
                        min={0}
                      />
                    </div>

                    {/* Total Stok */}
                    <div>
                      <label className="text-sm font-medium text-gray-200 mb-1.5 block">
                        Total Stok Barang <span className="text-primary">*</span>
                      </label>
                      <input
                        type="number"
                        value={editingProduct.stock || ''}
                        onChange={(e) => setField('stock', Number(e.target.value))}
                        className="input-field"
                        placeholder="25"
                        min={0}
                      />
                    </div>

                    {/* Diskon % */}
                    <div>
                      <label className="text-sm font-medium text-gray-200 mb-1.5 block">
                        Diskon (%) {editingProduct.discount_percent ? `— Terhitung ${editingProduct.discount_percent}%` : ''}
                      </label>
                      <input
                        type="number"
                        value={editingProduct.discount_percent ?? ''}
                        onChange={(e) =>
                          setField('discount_percent', e.target.value ? Number(e.target.value) : undefined)
                        }
                        className="input-field"
                        placeholder="20"
                        min={0}
                        max={100}
                      />
                    </div>
                  </div>

                  {/* Deskripsi */}
                  <div>
                    <label className="text-sm font-medium text-gray-200 mb-1.5 block">
                      Deskripsi Lengkap Produk
                    </label>
                    <textarea
                      value={editingProduct.description}
                      onChange={(e) => setField('description', e.target.value)}
                      rows={3}
                      className="input-field resize-none"
                      placeholder="Jelaskan keunggulan produk, spesifikasi cahaya, ketahanan, dsb..."
                    />
                  </div>
                </div>

                {/* 2. Foto Produk */}
                <div className="bg-dark-200 border border-white/10 rounded-2xl p-6 space-y-4">
                  <h3 className="text-white font-semibold text-base flex items-center justify-between border-b border-white/5 pb-3">
                    <span className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-primary" /> Foto Produk (URL Image)
                    </span>
                    <span className="text-xs text-silver">{editingProduct.images.length} gambar</span>
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {editingProduct.images.map((img, idx) => (
                      <div key={idx} className="relative group rounded-xl overflow-hidden bg-dark-300 border border-white/10 aspect-video">
                        <Image
                          src={img || 'https://images.unsplash.com/photo-1558981852-426c06a93f46?w=800&q=80'}
                          alt={`Foto ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1.5 right-1.5 bg-red-600/90 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Hapus Foto"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <div className="absolute bottom-1 left-1.5 bg-black/60 px-1.5 py-0.5 rounded text-[10px] text-white font-mono">
                          #{idx + 1}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Upload langsung dari Laptop / HP */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
                    <label
                      className={clsx(
                        'btn-primary text-xs px-4 py-2.5 inline-flex items-center justify-center gap-2 cursor-pointer flex-shrink-0',
                        uploadingImage && 'opacity-60 pointer-events-none'
                      )}
                    >
                      <Upload className="w-4 h-4" />
                      {uploadingImage ? 'Memproses foto...' : 'Upload Foto dari Laptop / HP'}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                    <span className="text-xs text-silver">
                      Bisa pilih lebih dari 1 foto sekaligus (otomatis dikompres agar ringan)
                    </span>
                  </div>

                  {/* Atau tambah lewat URL */}
                  <div className="flex gap-2 pt-1">
                    <input
                      type="url"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="Atau paste URL foto (https://...)"
                      className="input-field flex-1 text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleAddImage}
                      className="btn-outline text-xs px-4 flex items-center gap-1.5 flex-shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" /> Tambah URL
                    </button>
                  </div>
                </div>

                {/* 3. Varian Produk */}
                <div className="bg-dark-200 border border-white/10 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <h3 className="text-white font-semibold text-base flex items-center gap-2">
                      <Layers className="w-4 h-4 text-primary" /> Varian Produk (Socket / Tipe / Warna)
                    </h3>
                    <button
                      type="button"
                      onClick={handleAddVariant}
                      className="text-xs px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-white transition-all flex items-center gap-1"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Tambah Varian
                    </button>
                  </div>

                  {editingProduct.variants.length === 0 ? (
                    <p className="text-silver text-xs py-2">
                      Belum ada varian spesifik (akan menggunakan harga dan stok umum produk di atas).
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {editingProduct.variants.map((v, i) => (
                        <div key={v.id || i} className="flex items-center gap-3 bg-dark-300 p-3 rounded-xl border border-white/5">
                          <input
                            type="text"
                            value={v.name}
                            onChange={(e) => handleUpdateVariant(i, 'name', e.target.value)}
                            placeholder="Nama varian (cth: H4, H7, 6000K)"
                            className="input-field text-xs flex-1 py-1.5"
                          />
                          <input
                            type="number"
                            value={v.price}
                            onChange={(e) => handleUpdateVariant(i, 'price', Number(e.target.value))}
                            placeholder="Harga (Rp)"
                            className="input-field text-xs w-32 py-1.5"
                          />
                          <input
                            type="number"
                            value={v.stock}
                            onChange={(e) => handleUpdateVariant(i, 'stock', Number(e.target.value))}
                            placeholder="Stok"
                            className="input-field text-xs w-24 py-1.5"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(i)}
                            className="text-gray-mid hover:text-red-400 p-1.5 transition-colors"
                          >
                            <MinusCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4. Spesifikasi Teknis */}
                <div className="bg-dark-200 border border-white/10 rounded-2xl p-6 space-y-4">
                  <h3 className="text-white font-semibold text-base flex items-center gap-2 border-b border-white/5 pb-3">
                    <Tag className="w-4 h-4 text-primary" /> Spesifikasi Teknis Produk
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(editingProduct.specs).map(([key, val]) => (
                      <div key={key} className="flex items-center justify-between bg-dark-300 px-3 py-2 rounded-lg border border-white/5">
                        <div className="min-w-0 pr-2">
                          <div className="text-gray-mid text-xs">{key}</div>
                          <div className="text-white text-xs font-medium truncate">{val}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveSpec(key)}
                          className="text-gray-mid hover:text-red-400 p-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      value={newSpecKey}
                      onChange={(e) => setNewSpecKey(e.target.value)}
                      placeholder="Label spesifikasi (cth: Daya, Lumens, Garansi)"
                      className="input-field text-xs flex-1"
                    />
                    <input
                      type="text"
                      value={newSpecValue}
                      onChange={(e) => setNewSpecValue(e.target.value)}
                      placeholder="Nilai (cth: 90W, 8000LM, 1 Tahun)"
                      className="input-field text-xs flex-1"
                    />
                    <button
                      type="button"
                      onClick={handleAddSpec}
                      className="btn-primary text-xs px-4 flex items-center gap-1.5 flex-shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" /> Tambah
                    </button>
                  </div>
                </div>

                {/* 5. Kendaraan Kompatibel */}
                <div className="bg-dark-200 border border-white/10 rounded-2xl p-6 space-y-4">
                  <h3 className="text-white font-semibold text-base flex items-center gap-2 border-b border-white/5 pb-3">
                    <Car className="w-4 h-4 text-primary" /> Kendaraan Kompatibel
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {editingProduct.compatible_vehicles.map((v) => (
                      <span
                        key={v}
                        className="inline-flex items-center gap-1.5 bg-dark-300 border border-white/5 px-3 py-1 rounded-full text-xs text-silver"
                      >
                        {v}
                        <button
                          type="button"
                          onClick={() => handleRemoveVehicle(v)}
                          className="hover:text-red-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newVehicle}
                      onChange={(e) => setNewVehicle(e.target.value)}
                      placeholder="Tambah model mobil / motor (cth: Toyota Avanza, Honda Jazz)"
                      className="input-field text-xs flex-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddVehicle();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddVehicle}
                      className="btn-primary text-xs px-4 flex items-center gap-1.5 flex-shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" /> Tambah
                    </button>
                  </div>
                </div>

                {/* 6. Status & Tampilan Produk */}
                <div className="bg-dark-200 border border-white/10 rounded-2xl p-6 space-y-4">
                  <h3 className="text-white font-semibold text-base flex items-center gap-2 border-b border-white/5 pb-3">
                    <Star className="w-4 h-4 text-primary" /> Status & Visibilitas Katalog
                  </h3>

                  <div className="flex flex-wrap gap-6">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={editingProduct.is_active}
                        onChange={(e) => setField('is_active', e.target.checked)}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-gray-200 text-sm font-medium">Tampilkan di Web (Aktif)</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={editingProduct.is_best_seller}
                        onChange={(e) => setField('is_best_seller', e.target.checked)}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-gray-200 text-sm font-medium">Tandai Best Seller</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={editingProduct.is_new_arrival}
                        onChange={(e) => setField('is_new_arrival', e.target.checked)}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-gray-200 text-sm font-medium">Tandai Produk Baru (New Arrival)</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={Boolean(editingProduct.hide_price)}
                        onChange={(e) => setField('hide_price', e.target.checked)}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-gray-200 text-sm font-medium">Sembunyikan Harga (Hubungi Admin)</span>
                    </label>
                  </div>
                </div>

                {/* Tombol Simpan & Batal */}
                <div className="flex items-center gap-4 pt-4 pb-12">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary px-8 py-3 text-sm font-semibold flex items-center gap-2 shadow-xl shadow-primary/25 disabled:opacity-70"
                  >
                    {saving ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Menyimpan ke Web...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" /> Simpan & Publikasikan Produk
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setEditingProduct(null)}
                    disabled={saving}
                    className="btn-ghost px-6 py-3 text-sm text-silver hover:text-white"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==================== OVERVIEW ==================== */}
          {tab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { label: 'Total Produk', value: products.length, icon: Package, color: 'text-blue-400' },
                  { label: 'Produk Aktif', value: totalActive, icon: Eye, color: 'text-green-400' },
                  { label: 'Best Seller', value: totalBestSeller, icon: Star, color: 'text-yellow-400' },
                  { label: 'New Arrivals', value: totalNewArrivals, icon: TrendingUp, color: 'text-primary' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-dark-200 border border-white/5 rounded-2xl p-5 shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-mid text-sm font-medium">{stat.label}</span>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div className="text-white text-3xl font-bold">{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* Quick Products List */}
              <div className="bg-dark-200 border border-white/5 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-white font-semibold flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-primary rounded-full"></span>
                    Daftar Produk Teratas
                  </h2>
                  <button
                    onClick={() => setTab('products')}
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    Lihat Semua ({products.length}) →
                  </button>
                </div>
                <div className="space-y-3">
                  {products.slice(0, 6).map((p) => (
                    <div key={p.id} className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-dark-300 flex-shrink-0">
                        <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium line-clamp-1">{p.name}</p>
                        <p className="text-gray-mid text-xs mt-0.5">{p.category} · Stok: {p.stock}</p>
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

          {/* ==================== SETTINGS ==================== */}
          {tab === 'settings' && (
            <div className="max-w-2xl space-y-6">
              <div className="bg-dark-200 border border-white/5 rounded-2xl p-6 shadow-lg">
                <h2 className="text-white font-semibold mb-5 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-primary rounded-full"></span>
                  Pengaturan Toko
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-200 mb-1.5 block">Nama Toko</label>
                    <input
                      type="text"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-200 mb-1.5 flex items-center gap-2 block">
                      <MessageCircle className="w-4 h-4 text-green-400" />
                      Nomor WhatsApp Checkout
                    </label>
                    <input
                      type="text"
                      value={waNumber}
                      onChange={(e) => setWaNumber(e.target.value)}
                      className="input-field"
                      placeholder="62812xxxxxxxx"
                    />
                    <p className="text-gray-mid text-xs mt-1">
                      Format nomor diawali 62 tanpa spasi atau tanda hubung.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
