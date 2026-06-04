'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth';
import { api, Product, License } from '@/lib/api';

const API_BASE = 'https://api.primelock.theprimis.org';

interface Usage {
  plan: string;
  usage: { licensesThisMonth: number; totalProducts: number; totalLicenses: number };
  limits: { licenses: number; products: number };
  resetDate: string;
}

export default function DashboardPage() {
  const { developer, token, logout, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [usage, setUsage]       = useState<Usage | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !developer) router.replace('/login');
  }, [developer, loading, router]);

  useEffect(() => {
    if (!token) return;
    Promise.all([
      api.products.list(token),
      api.licenses.list(token, { page: 1 }),
      fetch(`${API_BASE}/auth/usage`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ]).then(([p, l, u]) => {
      setProducts(p.products ?? []);
      setLicenses(l.licenses ?? []);
      if (u.ok) setUsage(u);
    }).finally(() => setFetching(false));
  }, [token]);

  if (loading || fetching) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#07070f' }}>
      <div style={{ width: 24, height: 24, border: '2px solid #F5A623', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  const usagePct = usage ? Math.min(100, Math.round((usage.usage.licensesThisMonth / usage.limits.licenses) * 100)) : 0;
  const usageColor = usagePct >= 90 ? '#f87171' : usagePct >= 70 ? '#F5A623' : '#29C6D9';
  const planLabel = (usage?.plan ?? 'free').charAt(0).toUpperCase() + (usage?.plan ?? 'free').slice(1);

  return (
    <div style={{ minHeight: '100vh', background: '#07070f', color: '#e8e8f0', fontFamily: "'SF Pro Display', 'Inter', system-ui, sans-serif" }}>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #0f0f1e', padding: '18px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/logo.png" alt="PrimeLock" style={{ width: 32, height: 32, borderRadius: 8 }} />
          <span style={{ fontWeight: 800, color: '#fff', fontSize: 16, letterSpacing: '-0.3px' }}>PrimeLock</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ fontSize: 13, color: '#444460' }}>{developer?.email}</span>
          <span style={{
            fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20,
            background: '#F5A62315', border: '1px solid #F5A62330', color: '#F5A623',
          }}>{planLabel}</span>
          <button onClick={logout} style={{ fontSize: 13, color: '#333348', background: 'none', border: 'none', cursor: 'pointer' }}>
            Sign out
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 40px' }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', margin: '0 0 6px' }}>
            Welcome back, {developer?.name?.split(' ')[0]}
          </h1>
          <p style={{ fontSize: 14, color: '#444460', margin: 0 }}>Manage your products and licenses</p>
        </div>

        {/* Stats + Usage row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.4fr', gap: 16, marginBottom: 36 }}>
          {[
            { label: 'Products', value: products.length, color: '#29C6D9' },
            { label: 'Total Licenses', value: usage?.usage.totalLicenses ?? licenses.length, color: '#fff' },
            { label: 'Active Licenses', value: licenses.filter(l => !l.is_revoked).length, color: '#F5A623' },
          ].map(s => (
            <div key={s.label} style={{ background: '#0f0f1a', border: '1px solid #141428', borderRadius: 16, padding: '20px 22px' }}>
              <p style={{ fontSize: 11, color: '#444460', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>{s.label}</p>
              <p style={{ fontSize: 34, fontWeight: 800, color: s.color, margin: 0, letterSpacing: '-1px' }}>{s.value}</p>
            </div>
          ))}

          {/* Usage card */}
          {usage && (
            <div style={{ background: '#0f0f1a', border: '1px solid #141428', borderRadius: 16, padding: '20px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <p style={{ fontSize: 11, color: '#444460', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                  This Month
                </p>
                <Link href="#" style={{
                  fontSize: 10, color: '#F5A623', textDecoration: 'none', fontWeight: 700,
                  background: '#F5A62312', border: '1px solid #F5A62325', padding: '3px 8px', borderRadius: 20,
                }}>
                  Upgrade
                </Link>
              </div>
              <p style={{ fontSize: 22, fontWeight: 800, color: usageColor, margin: '0 0 10px', letterSpacing: '-0.5px' }}>
                {usage.usage.licensesThisMonth}
                <span style={{ fontSize: 13, color: '#444460', fontWeight: 400, marginLeft: 4 }}>
                  / {usage.limits.licenses}
                </span>
              </p>
              {/* Progress bar */}
              <div style={{ height: 6, background: '#141428', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${usagePct}%`,
                  background: usageColor, borderRadius: 4,
                  transition: 'width 0.5s ease',
                }} />
              </div>
              <p style={{ fontSize: 10, color: '#2a2a3a', margin: '8px 0 0' }}>
                Resets {new Date(usage.resetDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              </p>
            </div>
          )}
        </div>

        {/* Products */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.3px' }}>Products</h2>
            <Link href="/dashboard/products/new" style={{
              background: 'linear-gradient(135deg, #F5A623, #e8940f)',
              color: '#000', fontWeight: 700, fontSize: 13,
              padding: '9px 18px', borderRadius: 10, textDecoration: 'none',
            }}>
              + Add Product
            </Link>
          </div>

          {products.length === 0 ? (
            <div style={{
              background: '#0f0f1a', border: '1px dashed #1e1e36',
              borderRadius: 16, padding: '48px', textAlign: 'center',
            }}>
              <p style={{ color: '#333348', fontSize: 14, margin: '0 0 12px' }}>No products yet</p>
              <Link href="/dashboard/products/new" style={{ color: '#F5A623', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                Register your first product →
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {products.map(p => (
                <Link key={p.id} href={`/dashboard/products/${p.id}`} style={{
                  background: '#0f0f1a', border: '1px solid #141428',
                  borderRadius: 14, padding: '16px 20px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  textDecoration: 'none', transition: 'border-color 0.15s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#242436')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#141428')}
                >
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 600, color: '#fff', margin: '0 0 4px' }}>{p.name}</p>
                    <p style={{ fontSize: 12, color: '#333348', margin: 0 }}>{p.slug} · {p.product_type} · v{p.version}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ fontSize: 13, color: '#444460' }}>
                      {Array.isArray((p as any).pl_licenses) ? (p as any).pl_licenses[0]?.count ?? 0 : 0} licenses
                    </span>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20,
                      background: p.is_active ? '#29C6D915' : '#1a1a2a',
                      border: `1px solid ${p.is_active ? '#29C6D930' : '#242436'}`,
                      color: p.is_active ? '#29C6D9' : '#444460',
                    }}>
                      {p.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M5.25 3.5L8.75 7L5.25 10.5" stroke="#333348" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Licenses */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.3px' }}>Recent Licenses</h2>
          </div>

          {licenses.length === 0 ? (
            <div style={{ background: '#0f0f1a', border: '1px dashed #1e1e36', borderRadius: 16, padding: '36px', textAlign: 'center' }}>
              <p style={{ color: '#333348', fontSize: 14, margin: 0 }}>No licenses issued yet</p>
            </div>
          ) : (
            <div style={{ background: '#0f0f1a', border: '1px solid #141428', borderRadius: 16, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #141428' }}>
                    {['License Key', 'Customer', 'Product', 'Seats', 'Status'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 10, color: '#333348', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {licenses.slice(0, 10).map((l, i) => (
                    <tr key={l.id} style={{ borderBottom: i < 9 ? '1px solid #0f0f18' : 'none' }}>
                      <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: 12, color: '#888898' }}>{l.license_key}</td>
                      <td style={{ padding: '12px 16px', color: '#c8c8e0' }}>{l.customer_email}</td>
                      <td style={{ padding: '12px 16px', color: '#555570' }}>{(l as any).pl_products?.name ?? '—'}</td>
                      <td style={{ padding: '12px 16px', color: '#555570' }}>{l.seats_used}/{l.max_seats}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                          background: l.is_revoked ? '#f8717115' : '#29C6D915',
                          border: `1px solid ${l.is_revoked ? '#f8717130' : '#29C6D930'}`,
                          color: l.is_revoked ? '#f87171' : '#29C6D9',
                        }}>
                          {l.is_revoked ? 'Revoked' : 'Active'}
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
