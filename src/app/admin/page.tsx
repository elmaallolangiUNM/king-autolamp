'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Lock, Eye, EyeOff, ShieldCheck, ArrowLeft, KeyRound } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isAdminSession = sessionStorage.getItem('lumora_admin');
    const isAdminLocal = localStorage.getItem('lumora_admin');
    if (isAdminSession === 'true' || isAdminLocal === 'true') {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const validUsernames = [
      (process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin').toLowerCase(),
      'kingautolamp',
      'king autolamp',
      'admin',
    ];

    const validPasswords = [
      'kingautolamp2024',
      'lumora2024admin',
      'admin123',
    ];

    const inputUser = form.username.trim().toLowerCase();
    const inputPass = form.password.trim();

    setTimeout(() => {
      if (validUsernames.includes(inputUser) && validPasswords.includes(inputPass)) {
        sessionStorage.setItem('lumora_admin', 'true');
        localStorage.setItem('lumora_admin', 'true');
        router.push('/admin/dashboard');
      } else {
        setError('Username atau password tidak sesuai. Silakan cek informasi akun di bawah.');
        setLoading(false);
      }
    }, 600);
  };

  const fillDemoCredentials = () => {
    setForm({
      username: 'admin',
      password: 'kingautolamp2024',
    });
    setError('');
  };

  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center px-4 py-12 relative">
      {/* Back to store link */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-silver text-sm hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-dark-200/60 border border-white/5"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Toko
        </Link>
      </div>

      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex justify-center mb-4">
            <Image
              src="/images/kingautolamp-logo.png"
              alt="KING AUTOLAMP"
              width={685}
              height={150}
              className="h-11 w-auto object-contain"
              priority
            />
          </div>
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3">
            <ShieldCheck className="w-3.5 h-3.5" /> Portal Administrasi
          </div>
          <h1 className="text-white text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-silver text-sm mt-1">Masuk untuk mengelola produk dan konfigurasi katalog web</p>
        </div>

        <form onSubmit={handleLogin} className="bg-dark-200 border border-white/10 rounded-2xl p-7 shadow-2xl backdrop-blur-sm">
          <div className="mb-5">
            <label className="text-sm font-medium text-gray-200 mb-2 block">Username Admin</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
              placeholder="Masukkan username (cth: admin)"
              className="input-field"
              required
            />
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium text-gray-200 mb-2 block">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="Masukkan password admin"
                className="input-field pr-12"
                required
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-mid hover:text-white"
                onClick={() => setShowPass(!showPass)}
                aria-label="Toggle password visibility"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 mb-5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 text-sm flex items-center gap-2">
              <Lock className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center py-3 text-sm font-semibold tracking-wide disabled:opacity-70 shadow-lg shadow-primary/20"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Memverifikasi...
              </span>
            ) : (
              <>
                <Lock className="w-4 h-4" /> Masuk ke Dashboard
              </>
            )}
          </button>

          {/* Quick Demo Fill */}
          <div className="mt-6 pt-5 border-t border-white/5 bg-dark-300/40 -mx-7 -mb-7 p-5 rounded-b-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-gray-300 text-xs font-semibold flex items-center gap-1.5 mb-1">
                  <KeyRound className="w-3.5 h-3.5 text-primary" /> Informasi Akses Admin:
                </p>
                <div className="text-xs text-silver space-y-0.5">
                  <p>Username: <code className="text-primary font-mono bg-dark-200 px-1.5 py-0.5 rounded">admin</code></p>
                  <p>Password: <code className="text-primary font-mono bg-dark-200 px-1.5 py-0.5 rounded">kingautolamp2024</code></p>
                </div>
              </div>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="text-xs px-2.5 py-1.5 rounded bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-white transition-all font-medium flex-shrink-0"
              >
                Isi Otomatis
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
