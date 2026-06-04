'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth';
import { api } from '@/lib/api';

export default function NewProductPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    version: '1.0.0',
    product_type: 'plugin',
    max_seats: 2,
    trial_days: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [k]: e.target.value }));

  const autoSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.products.create(token!, {
        ...form,
        max_seats: Number(form.max_seats),
        trial_days: Number(form.trial_days),
      });
      router.replace('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10">
      <div className="max-w-lg mx-auto">
        {/* Back */}
        <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-300 mb-6 inline-block">
          ← Back to dashboard
        </Link>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <h1 className="text-xl font-semibold text-white mb-1">Register a Product</h1>
          <p className="text-sm text-gray-400 mb-6">
            PrimeLock will generate an RSA keypair for this product automatically.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Product Name</label>
              <input
                value={form.name}
                onChange={e => {
                  setForm(prev => ({
                    ...prev,
                    name: e.target.value,
                    slug: autoSlug(e.target.value),
                  }));
                }}
                required
                placeholder="e.g. Cue Engine"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Slug</label>
              <input
                value={form.slug}
                onChange={set('slug')}
                required
                placeholder="cue-engine"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-emerald-500"
              />
              <p className="text-xs text-gray-600 mt-1">Lowercase, hyphens only. Used in webhook URLs.</p>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Description <span className="text-gray-600">(optional)</span></label>
              <textarea
                value={form.description}
                onChange={set('description')}
                placeholder="What does this plugin do?"
                rows={2}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Type</label>
                <select
                  value={form.product_type}
                  onChange={set('product_type')}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="plugin">Plugin</option>
                  <option value="desktop">Desktop</option>
                  <option value="web">Web</option>
                  <option value="game">Game</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Seats</label>
                <input
                  type="number" min={1} max={100}
                  value={form.max_seats}
                  onChange={set('max_seats')}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Version</label>
                <input
                  value={form.version}
                  onChange={set('version')}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-semibold rounded-lg py-2.5 text-sm transition-colors mt-2"
            >
              {loading ? 'Creating…' : 'Create Product'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
