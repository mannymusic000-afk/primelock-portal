'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth';

const API_BASE = 'https://api.primelock.theprimis.org';

interface Bundle {
  id: string;
  name: string;
  slug: string;
  product_ids: string[];
  created_at: string;
}

export default function BundlesPage() {
  const { developer, token, loading } = useAuth();
  const router = useRouter();
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !developer) router.replace('/login');
  }, [developer, loading, router]);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE}/bundles`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        setBundles(data.bundles ?? data ?? []);
      })
      .catch(() => setError('Failed to load bundles.'))
      .finally(() => setFetching(false));
  }, [token]);

  if (loading || fetching) return (
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
        <Link href="/dashboard" style={{ fontSize: 12, color: '#555570', textDecoration: 'none', padding: '7px 12px', background: '#0f0f1a', border: '1px solid #141428', borderRadius: 8 }}>
          ← Dashboard
        </Link>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 20px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', margin: '0 0 4px' }}>Bundles</h1>
            <p style={{ fontSize: 13, color: '#444460', margin: 0 }}>Group products and issue a single order with keys for all of them.</p>
          </div>
          <Link
            href="/dashboard/bundles/new"
            style={{
              background: 'linear-gradient(135deg, #F5A623, #e8940f)',
              color: '#000',
              fontWeight: 700,
              fontSize: 13,
              padding: '10px 18px',
              borderRadius: 10,
              textDecoration: 'none',
              whiteSpace: 'nowrap' as const,
            }}
          >
            + Create Bundle
          </Link>
        </div>

        {error && (
          <div style={{ background: '#f8717115', border: '1px solid #f8717130', borderRadius: 12, padding: '12px 16px', marginBottom: 20, color: '#f87171', fontSize: 13 }}>
            {error}
          </div>
        )}

        {bundles.length === 0 ? (
          <div style={{ background: '#0f0f1a', border: '1px dashed #1e1e36', borderRadius: 14, padding: '48px 36px', textAlign: 'center' }}>
            <p style={{ fontSize: 32, margin: '0 0 12px' }}>🎁</p>
            <p style={{ color: '#444460', fontSize: 14, margin: '0 0 14px', fontWeight: 600 }}>No bundles yet</p>
            <p style={{ color: '#333348', fontSize: 13, margin: '0 0 20px' }}>Create a bundle to sell multiple products together under one license order.</p>
            <Link
              href="/dashboard/bundles/new"
              style={{ color: '#F5A623', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}
            >
              Create your first bundle →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {bundles.map(bundle => (
              <div
                key={bundle.id}
                style={{
                  background: '#0f0f1a',
                  border: '1px solid #141428',
                  borderRadius: 14,
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  flexWrap: 'wrap' as const,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                    {bundle.name}
                  </p>
                  <p style={{ fontSize: 11, color: '#333348', margin: 0, fontFamily: 'monospace' }}>{bundle.slug}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: 20,
                    background: '#F5A62315',
                    border: '1px solid #F5A62330',
                    color: '#F5A623',
                  }}>
                    {Array.isArray(bundle.product_ids) ? bundle.product_ids.length : 0} product{Array.isArray(bundle.product_ids) && bundle.product_ids.length === 1 ? '' : 's'}
                  </span>
                  <span style={{ fontSize: 11, color: '#333348' }}>
                    {new Date(bundle.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
