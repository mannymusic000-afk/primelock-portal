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

  const usagePct   = usage ? Math.min(100, Math.round((usage.usage.licensesThisMonth / usage.limits.licenses) * 100)) : 0;
  const usageColor = usagePct >= 90 ? '#f87171' : usagePct >= 70 ? '#F5A623' : '#29C6D9';
  const planLabel  = (usage?.plan ?? 'free').charAt(0).toUpperCase() + (usage?.plan ?? 'free').slice(1);
  const isPaidPlan = usage?.plan && usage.plan !== 'free';

  return (
    <div style={{ minHeight: '100vh', background: '#07070f', color: '#e8e8f0', fontFamily: "'SF Pro Display', 'Inter', system-ui, sans-serif" }}>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #0f0f1e', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/logo.png" alt="PrimeLock" style={{ width: 30, height: 30, borderRadius: 8 }} />
          <span style={{ fontWeight: 800, color: '#fff', fontSize: 15 }}>PrimeLock</span>
          <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: '#F5A62315', border: '1px solid #F5A62330', color: '#F5A623' }}>
            {planLabel}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <Link href="/dashboard/bundles" style={{ fontSize: 12, color: '#555570', textDecoration: 'none', padding: '7px 12px', background: '#0f0f1a', border: '1px solid #141428', borderRadius: 8 }}>
            🎁 Bundles
          </Link>
          <Link href="/dashboard/integrate" style={{ fontSize: 12, color: '#555570', textDecoration: 'none', padding: '7px 12px', background: '#0f0f1a', border: '1px solid #141428', borderRadius: 8 }}>
            🧩 Integrate
          </Link>
          {!isPaidPlan && (
            <Link href="/dashboard/upgrade" style={{ fontSize: 12, color: '#000', fontWeight: 700, padding: '7px 14px', background: 'linear-gradient(135deg, #F5A623, #e8940f)', borderRadius: 8, textDecoration: 'none' }}>
              ⬆ Upgrade
            </Link>
          )}
          <button onClick={logout} style={{ fontSize: 12, color: '#333348', background: 'none', border: 'none', cursor: 'pointer', padding: '7px 0' }}>
            Sign out
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 20px' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', margin: '0 0 4px' }}>
            Welcome back, {developer?.name?.split(' ')[0]}
          </h1>
          <p style={{ fontSize: 13, color: '#444460', margin: 0 }}>{developer?.email}</p>
        </div>

        {/* Upgrade banner — only on free plan */}
        {!isPaidPlan && (
          <div style={{
            background: 'linear-gradient(135deg, #F5A62312, #29C6D912)',
            border: '1px solid #F5A62330', borderRadius: 16,
            padding: '16px 20px', marginBottom: 24,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
          }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#F5A623', margin: '0 0 3px' }}>You're on the Free plan</p>
              <p style={{ fontSize: 12, color: '#888070', margin: 0 }}>1 product · 50 licenses/month. Upgrade to unlock more.</p>
            </div>
            <Link href="/dashboard/upgrade" style={{
              fontSize: 13, fontWeight: 700, color: '#000',
              background: 'linear-gradient(135deg, #F5A623, #e8940f)',
              padding: '10px 20px', borderRadius: 10, textDecoration: 'none', whiteSpace: 'nowrap',
            }}>
              View Plans →
            </Link>
          </div>
        )}

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
          <StatCard label="Products" value={products.length} />
          <StatCard label="Total Licenses" value={usage?.usage.totalLicenses ?? licenses.length} />
          <StatCard label="Active Licenses" value={licenses.filter(l => !l.is_revoked).length} accent />
        </div>

        {/* Usage */}
        {usage && (
          <div style={{ background: '#0f0f1a', border: '1px solid #141428', borderRadius: 16, padding: '18px 20px', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <p style={{ fontSize: 12, color: '#444460', margin: 0, textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>This month</p>
              <p style={{ fontSize: 12, color: '#333348', margin: 0 }}>
                Resets {new Date(usage.resetDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <p style={{ fontSize: 22, fontWeight: 800, color: usageColor, margin: 0 }}>
                {usage.usage.licensesThisMonth}
                <span style={{ fontSize: 13, color: '#444460', fontWeight: 400, marginLeft: 4 }}>/ {usage.limits.licenses} licenses</span>
              </p>
              {!isPaidPlan && usagePct >= 50 && (
                <Link href="/dashboard/upgrade" style={{ fontSize: 11, color: '#F5A623', textDecoration: 'none', fontWeight: 700, background: '#F5A62312', border: '1px solid #F5A62325', padding: '4px 10px', borderRadius: 20 }}>
                  Upgrade
                </Link>
              )}
            </div>
            <div style={{ height: 6, background: '#141428', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${usagePct}%`, background: usageColor, borderRadius: 4, transition: 'width 0.5s ease' }} />
            </div>
          </div>
        )}

        {/* Products */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 }}>Products</h2>
            <Link href="/dashboard/products/new" style={{ background: 'linear-gradient(135deg, #F5A623, #e8940f)', color: '#000', fontWeight: 700, fontSize: 12, padding: '8px 14px', borderRadius: 8, textDecoration: 'none' }}>
              + Add Product
            </Link>
          </div>

          {products.length === 0 ? (
            <div style={{ background: '#0f0f1a', border: '1px dashed #1e1e36', borderRadius: 14, padding: '36px', textAlign: 'center' }}>
              <p style={{ color: '#333348', fontSize: 14, margin: '0 0 10px' }}>No products yet</p>
              <Link href="/dashboard/products/new" style={{ color: '#F5A623', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Register your first product →</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {products.map(p => (
                <Link key={p.id} href={`/dashboard/products/${p.id}`} style={{
                  background: '#0f0f1a', border: '1px solid #141428', borderRadius: 14,
                  padding: '14px 18px', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', textDecoration: 'none', gap: 12,
                }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#fff', margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                    <p style={{ fontSize: 11, color: '#333348', margin: 0 }}>{p.slug} · {p.product_type}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    <span style={{ fontSize: 11, color: '#444460' }}>{Array.isArray((p as any).pl_licenses) ? (p as any).pl_licenses[0]?.count ?? 0 : 0} licenses</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: p.is_active ? '#29C6D915' : '#1a1a2a', border: `1px solid ${p.is_active ? '#29C6D930' : '#242436'}`, color: p.is_active ? '#29C6D9' : '#444460' }}>
                      {p.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 2.5L8 6L4.5 9.5" stroke="#333348" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Licenses */}
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: '0 0 14px' }}>Recent Licenses</h2>

          {licenses.length === 0 ? (
            <div style={{ background: '#0f0f1a', border: '1px dashed #1e1e36', borderRadius: 14, padding: '28px', textAlign: 'center' }}>
              <p style={{ color: '#333348', fontSize: 13, margin: 0 }}>No licenses issued yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {licenses.slice(0, 10).map(l => (
                <div key={l.id} style={{ background: '#0f0f1a', border: '1px solid #141428', borderRadius: 12, padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 12, fontFamily: 'monospace', color: '#888898', margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.license_key}</p>
                      <p style={{ fontSize: 11, color: '#444460', margin: 0 }}>{l.customer_email} · {(l as any).pl_products?.name ?? '—'}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      <span style={{ fontSize: 10, color: '#444460' }}>{l.seats_used}/{l.max_seats}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: l.is_revoked ? '#f8717115' : '#29C6D915', border: `1px solid ${l.is_revoked ? '#f8717130' : '#29C6D930'}`, color: l.is_revoked ? '#f87171' : '#29C6D9' }}>
                        {l.is_revoked ? 'Revoked' : 'Active'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div style={{ background: '#0f0f1a', border: '1px solid #141428', borderRadius: 14, padding: '16px 18px' }}>
      <p style={{ fontSize: 10, color: '#444460', textTransform: 'uppercase' as const, letterSpacing: '0.08em', margin: '0 0 8px' }}>{label}</p>
      <p style={{ fontSize: 28, fontWeight: 800, color: accent ? '#F5A623' : '#fff', margin: 0, letterSpacing: '-1px' }}>{value}</p>
    </div>
  );
}
