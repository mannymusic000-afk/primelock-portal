'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '', name: '', company: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token } = await api.auth.register(form);
      localStorage.setItem('pl_token', token);
      router.replace('/onboarding');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="text-2xl">🔐</span>
            <span className="text-2xl font-bold text-white">PrimeLock</span>
          </div>
          <p className="text-gray-400 text-sm">Create your developer account</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <h1 className="text-xl font-semibold text-white mb-6">Get started — it&apos;s free</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Full name</label>
                <input type="text" value={form.name} onChange={set('name')} required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                  placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Company (optional)</label>
                <input type="text" value={form.company} onChange={set('company')}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                  placeholder="Studio / brand" />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input type="email" value={form.email} onChange={set('email')} required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                placeholder="you@example.com" />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Password</label>
              <input type="password" value={form.password} onChange={set('password')} required minLength={8}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                placeholder="Min 8 characters" />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-semibold rounded-lg py-2.5 text-sm transition-colors">
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-emerald-400 hover:text-emerald-300">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
