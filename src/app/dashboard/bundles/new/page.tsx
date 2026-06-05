'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth';

const API_BASE = 'https://api.primelock.theprimis.org';

interface Product {
  id: string;
  name: string;
  slug: string;
  product_type: string;
}

export default function NewBundlePage() {
  const { developer, token, loading } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [fetchingProducts, setFetchingProducts] = useState(true);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !developer) router.replace('/login');
  }, [developer, loading, router]);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE}/products`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => setProducts(data.products ?? data ?? []))
      .catch(() => setError('Could not load your products.'))
      .finally(() => setFetchingProducts(false));
  }, [token]);

  const autoSlug = (value: string) =>
    value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleNameChange = (value: string) => {
    setName(value);
    setSlug(autoSlug(value));
  };

  const toggleProduct = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Bundle name is required.');
      return;
    }
    if (selectedIds.size < 2) {
      setError('Select at least 2 products to include in the bundle.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/bundles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim() || autoSlug(name.trim()),
          product_ids: Array.from(selectedIds),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? body.message ?? `Request failed (${res.status})`);
      }

      router.replace('/dashboard/bundles');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create bundle.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#0a0a16',
    border: '1px solid #1e1e36',
    borderRadius: 10,
    padding: '10px 14px',
    color: '#e8e8f0',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'SF Pro Display', 'Inter', system-ui, sans-serif",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    color: '#444460',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    marginBottom: 6,
    display: 'block',
    fontWeight: 600,
  };

  if (loading || fetchingProducts) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#07070f' }}>
      <div style={{ width: 24, height: 24, border: '2px solid #F5A623', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#07070f', color: '#e8e8f0', fontFamily: "'SF Pro Display', 'Inter', system-ui, sans-serif" }}>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #0f0f1e', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/logo.png" alt="PrimeLock" style={{ width: 30, height: 30, borderRadius: 8 }} />
          <span style={{ fontWeight: 800, color: '#fff', fontSize: 15 }}>PrimeLock</span>
        </div>
        <Link href="/dashboard/bundles" style={{ fontSize: 12, color: '#555570', textDecoration: 'none', padding: '7px 12px', background: '#0f0f1a', border: '1px solid #141428', borderRadius: 8 }}>
          ← Bundles
        </Link>
      </nav>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '32px 20px' }}>

        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', margin: '0 0 6px' }}>Create a Bundle</h1>
        <p style={{ fontSize: 13, color: '#444460', margin: '0 0 28px' }}>
          Group products together. Customers who purchase this bundle receive a license key for each included product.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ background: '#0f0f1a', border: '1px solid #141428', borderRadius: 16, padding: '24px', marginBottom: 16 }}>

            {/* Bundle name */}
            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>Bundle Name</label>
              <input
                value={name}
                onChange={e => handleNameChange(e.target.value)}
                placeholder="e.g. Producer Starter Pack"
                required
                style={inputStyle}
              />
            </div>

            {/* Slug */}
            <div>
              <label style={labelStyle}>Slug</label>
              <input
                value={slug}
                onChange={e => setSlug(e.target.value)}
                placeholder="producer-starter-pack"
                style={{ ...inputStyle, fontFamily: 'monospace' }}
              />
              <p style={{ fontSize: 11, color: '#333348', margin: '6px 0 0' }}>
                Auto-generated from name. Lowercase, hyphens only.
              </p>
            </div>
          </div>

          {/* Product selection */}
          <div style={{ background: '#0f0f1a', border: '1px solid #141428', borderRadius: 16, padding: '24px', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <label style={{ ...labelStyle, margin: 0 }}>Products to Include</label>
              <span style={{
                fontSize: 11,
                color: selectedIds.size >= 2 ? '#29C6D9' : '#444460',
                fontWeight: 600,
                padding: '3px 8px',
                background: selectedIds.size >= 2 ? '#29C6D915' : '#0a0a16',
                border: `1px solid ${selectedIds.size >= 2 ? '#29C6D930' : '#1e1e36'}`,
                borderRadius: 20,
              }}>
                {selectedIds.size} selected{selectedIds.size < 2 ? ' (min 2)' : ''}
              </span>
            </div>

            {products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <p style={{ fontSize: 13, color: '#333348', margin: '0 0 10px' }}>No products found.</p>
                <Link href="/dashboard/products/new" style={{ fontSize: 13, color: '#F5A623', textDecoration: 'none', fontWeight: 600 }}>
                  Register a product first →
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {products.map(product => {
                  const checked = selectedIds.has(product.id);
                  return (
                    <label
                      key={product.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '12px 14px',
                        background: checked ? '#F5A62310' : '#0a0a16',
                        border: `1px solid ${checked ? '#F5A62340' : '#1e1e36'}`,
                        borderRadius: 10,
                        cursor: 'pointer',
                        transition: 'border-color 0.15s, background 0.15s',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleProduct(product.id)}
                        style={{ accentColor: '#F5A623', width: 16, height: 16, cursor: 'pointer', flexShrink: 0 }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: checked ? '#fff' : '#aaaacc', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {product.name}
                        </p>
                        <p style={{ fontSize: 11, color: '#333348', margin: 0, fontFamily: 'monospace' }}>
                          {product.slug} · {product.product_type}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {error && (
            <div style={{ background: '#f8717115', border: '1px solid #f8717130', borderRadius: 10, padding: '12px 14px', marginBottom: 14, color: '#f87171', fontSize: 13 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || products.length === 0}
            style={{
              width: '100%',
              background: submitting || products.length === 0
                ? '#1a1a2a'
                : 'linear-gradient(135deg, #F5A623, #e8940f)',
              color: submitting || products.length === 0 ? '#444460' : '#000',
              fontWeight: 700,
              fontSize: 14,
              padding: '13px 0',
              borderRadius: 12,
              border: 'none',
              cursor: submitting || products.length === 0 ? 'not-allowed' : 'pointer',
              letterSpacing: '-0.2px',
              transition: 'opacity 0.15s',
            }}
          >
            {submitting ? 'Creating…' : 'Create Bundle'}
          </button>
        </form>
      </div>
    </div>
  );
}
