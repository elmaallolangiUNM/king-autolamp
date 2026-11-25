'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Lock, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isAdmin = sessionStorage.getItem('lumora_admin');
    if (isAdmin === 'true') router.push('/admin/dashboard');
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simple demo auth — replace with Supabase Auth in production
    const adminUser = process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin';
    const adminPass = 'lumora2024admin'; // In production, use server-side check

    setTimeout(() => {
      if (form.username === adminUser && form.password === adminPass) {
        sessionStorage.setItem('lumora_admin', 'true');
        router.push('/admin/dashboard');
      } else {
        setError('Username atau password salah');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
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
          <h1 className="text-white text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-silver text-sm mt-1">Masuk untuk mengelola toko KING AUTOLAMP</p>
        </div>

        <form onSubmit={handleLogin} className="bg-dark-200 border border-white/5 rounded-2xl p-8">
          <div className="mb-5">
            <label className="text-sm text-gray-300 mb-2 block">Username</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
              placeholder="Masukkan username"
              className="input-field"
              required
            />
          </div>

          <div className="mb-6">
            <label className="text-sm text-gray-300 mb-2 block">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="Masukkan password"
                className="input-field pr-12"
                required
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-mid hover:text-white"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4" /> {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center py-3 disabled:opacity-70"
          >
            {loading ? 'Masuk...' : (
              <>
                <Lock className="w-4 h-4" /> Masuk ke Dashboard
              </>
            )}
          </button>

          <p className="text-gray-mid text-xs text-center mt-5">
            Demo: username <code className="text-primary">admin</code> / password{' '}
            <code className="text-primary">lumora2024admin</code>
          </p>
        </form>
      </div>
    </div>
  );
}
