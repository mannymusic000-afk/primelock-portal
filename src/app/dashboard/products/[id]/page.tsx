'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth';
import { api, Product, License } from '@/lib/api';

export default function ProductPage() {
  const { token } = useAuth();
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [product, setProduct]   = useState<Product | null>(null);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading]   = useState(true);
  const [issuing, setIssuing]   = useState(false);
  const [showIssue, setShowIssue] = useState(false);
  const [issueForm, setIssueForm] = useState({ customer_email: '', customer_name: '' });
  const [issueError, setIssueError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!token) return;
    Promise.all([
      api.products.get(token, id),
      api.licenses.list(token, { product_id: id }),
    ]).then(([p, l]) => {
      setProduct(p.product);
      setLicenses(l.licenses);
    }).finally(() => setLoading(false));
  }, [token, id]);

  const handleIssueLicense = async () => {
    if (!issueForm.customer_email) { setIssueError('Email is required'); return; }
    setIssueError('');
    setIssuing(true);
    try {
      const { license } = await api.licenses.issue(token!, {
        product_id: id,
        customer_email: issueForm.customer_email,
        customer_name: issueForm.customer_name || undefined,
      });
      setLicenses(prev => [license, ...prev]);
      setShowIssue(false);
      setIssueForm({ customer_email: '', customer_name: '' });
    } catch (err: unknown) {
      setIssueError(err instanceof Error ? err.message : 'Failed to issue license');
    } finally {
      setIssuing(false);
    }
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950">
      <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 text-gray-400">
      Product not found.
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Nav */}
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center gap-3">
        <Link href="/dashboard" className="text-gray-500 hover:text-gray-300 text-sm">← Dashboard</Link>
        <span className="text-gray-700">/</span>
        <span className="text-white text-sm font-medium">{product.name}</span>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Product header */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-white">{product.name}</h1>
              <p className="text-gray-400 text-sm mt-0.5">{product.slug} · {product.product_type} · v{product.version}</p>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${product.is_active ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-gray-400 bg-gray-700/30 border-gray-600/20'}`}>
              {product.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: 'Licenses Issued', value: licenses.length },
              { label: 'Max Seats / License', value: product.max_seats },
              { label: 'Active Licenses', value: licenses.filter(l => !l.is_revoked).length },
            ].map(s => (
              <div key={s.label} className="bg-gray-800/50 rounded-xl p-3">
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="text-xl font-bold text-white mt-0.5">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Public key */}
          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-400 font-medium">RSA Public Key — embed this in your plugin</p>
              <button
                onClick={() => copyKey(product.public_key_pem)}
                className="text-xs text-emerald-400 hover:text-emerald-300"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="text-xs text-gray-500 font-mono overflow-auto max-h-24 whitespace-pre-wrap break-all">
              {product.public_key_pem}
            </pre>
          </div>
        </div>

        {/* Licenses */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Licenses</h2>
            <button
              onClick={() => setShowIssue(true)}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
            >
              + Issue License
            </button>
          </div>

          {licenses.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 border-dashed rounded-xl p-10 text-center">
              <p className="text-gray-500 text-sm">No licenses issued yet</p>
            </div>
          ) : (
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase">
                    <th className="text-left px-4 py-3">License Key</th>
                    <th className="text-left px-4 py-3">Customer</th>
                    <th className="text-left px-4 py-3">Seats</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3">Issued</th>
                  </tr>
                </thead>
                <tbody>
                  {licenses.map(l => (
                    <tr key={l.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                      <td className="px-4 py-3 font-mono text-xs text-gray-300">
                        <button onClick={() => copyKey(l.license_key)} className="hover:text-emerald-400 transition-colors" title="Click to copy">
                          {l.license_key}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-gray-300">{l.customer_email}</td>
                      <td className="px-4 py-3 text-gray-400">{l.seats_used}/{l.max_seats}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${l.is_revoked ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                          {l.is_revoked ? 'Revoked' : 'Active'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {new Date(l.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Issue License Modal */}
      {showIssue && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold text-white mb-1">Issue a License</h2>
            <p className="text-sm text-gray-400 mb-5">For <strong className="text-white">{product.name}</strong></p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Customer Email</label>
                <input
                  type="email"
                  value={issueForm.customer_email}
                  onChange={e => setIssueForm(p => ({ ...p, customer_email: e.target.value }))}
                  placeholder="customer@email.com"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Customer Name <span className="text-gray-600">(optional)</span></label>
                <input
                  value={issueForm.customer_name}
                  onChange={e => setIssueForm(p => ({ ...p, customer_name: e.target.value }))}
                  placeholder="John Doe"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              {issueError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 text-red-400 text-sm">
                  {issueError}
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowIssue(false)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg py-2.5 text-sm transition-colors">
                Cancel
              </button>
              <button onClick={handleIssueLicense} disabled={issuing}
                className="flex-1 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-semibold rounded-lg py-2.5 text-sm transition-colors">
                {issuing ? 'Issuing…' : 'Issue License'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
