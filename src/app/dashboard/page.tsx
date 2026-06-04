'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth';
import { api, Product, License } from '@/lib/api';

export default function DashboardPage() {
  const { developer, token, logout, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !developer) router.replace('/login');
  }, [developer, loading, router]);

  useEffect(() => {
    if (!token) return;
    Promise.all([
      api.products.list(token),
      api.licenses.list(token, { page: 1 }),
    ]).then(([p, l]) => {
      setProducts(p.products);
      setLicenses(l.licenses);
    }).finally(() => setFetching(false));
  }, [token]);

  if (loading || fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const activeLicenses = licenses.filter(l => !l.is_revoked).length;
  const totalSeats     = licenses.reduce((s, l) => s + l.seats_used, 0);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Nav */}
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔐</span>
          <span className="font-bold text-white">PrimeLock</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">{developer?.email}</span>
          <button onClick={logout} className="text-sm text-gray-500 hover:text-gray-300">Sign out</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Welcome back, {developer?.name?.split(' ')[0]} 👋</h1>
          <p className="text-gray-400 mt-1">Manage your products and licenses</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Products', value: products.length, color: 'text-blue-400' },
            { label: 'Active Licenses', value: activeLicenses, color: 'text-emerald-400' },
            { label: 'Total Activations', value: totalSeats, color: 'text-purple-400' },
          ].map(stat => (
            <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p className="text-gray-400 text-sm">{stat.label}</p>
              <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Products */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Your Products</h2>
            <Link href="/dashboard/products/new"
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
              + Add Product
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 border-dashed rounded-xl p-10 text-center">
              <p className="text-gray-500 mb-3">No products yet</p>
              <Link href="/dashboard/products/new"
                className="text-emerald-400 hover:text-emerald-300 text-sm font-medium">
                Register your first product →
              </Link>
            </div>
          ) : (
            <div className="grid gap-3">
              {products.map(p => (
                <Link key={p.id} href={`/dashboard/products/${p.id}`}
                  className="bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl p-4 flex items-center justify-between transition-colors">
                  <div>
                    <p className="font-medium text-white">{p.name}</p>
                    <p className="text-sm text-gray-500">{p.slug} • {p.product_type} • v{p.version}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">
                      {Array.isArray(p.licenses) ? p.licenses[0]?.count ?? 0 : 0} licenses
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-700 text-gray-400'}`}>
                      {p.is_active ? 'active' : 'inactive'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Licenses */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Licenses</h2>
            <Link href="/dashboard/licenses" className="text-sm text-emerald-400 hover:text-emerald-300">
              View all →
            </Link>
          </div>

          {licenses.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 border-dashed rounded-xl p-8 text-center">
              <p className="text-gray-500 text-sm">No licenses issued yet</p>
            </div>
          ) : (
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase">
                    <th className="text-left px-4 py-3">License Key</th>
                    <th className="text-left px-4 py-3">Customer</th>
                    <th className="text-left px-4 py-3">Product</th>
                    <th className="text-left px-4 py-3">Seats</th>
                    <th className="text-left px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {licenses.slice(0, 10).map(l => (
                    <tr key={l.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                      <td className="px-4 py-3 font-mono text-xs text-gray-300">{l.license_key}</td>
                      <td className="px-4 py-3 text-gray-300">{l.customer_email}</td>
                      <td className="px-4 py-3 text-gray-400">{l.products?.name ?? '—'}</td>
                      <td className="px-4 py-3 text-gray-400">{l.seats_used}/{l.max_seats}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          l.is_revoked
                            ? 'bg-red-500/10 text-red-400'
                            : 'bg-emerald-500/10 text-emerald-400'
                        }`}>
                          {l.is_revoked ? 'revoked' : 'active'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
