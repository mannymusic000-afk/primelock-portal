'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth';
import { api, Product, License } from '@/lib/api';

// ─── helpers ────────────────────────────────────────────────────────────────

function pkeyPreview(pem: string): string {
  const lines = pem.split('\n').filter(Boolean);
  // show header + first data line + ellipsis
  return lines.slice(0, 2).join('\n') + '\n...';
}

// ─── sub-components ─────────────────────────────────────────────────────────

interface CopyRowProps {
  fieldKey: string;
  label: string;
  description: string;
  value: string;
  copyLabel?: string;
  mono?: boolean;
  preview?: string;         // if provided, show preview + expand toggle
  copied: Record<string, boolean>;
  onCopy: (key: string, value: string) => void;
}

function CopyRow({
  fieldKey,
  label,
  description,
  value,
  copyLabel = 'Copy',
  mono = true,
  preview,
  copied,
  onCopy,
}: CopyRowProps) {
  const [expanded, setExpanded] = useState(false);
  const isCopied = copied[fieldKey];

  return (
    <div style={{ background: '#0a0a18', border: '1px solid #141428', borderRadius: 12, padding: '16px 20px' }}>
      {/* label row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#F5A623', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
            {label}
          </p>
          <p style={{ fontSize: 12, color: '#6b6b9a', marginBottom: 10 }}>{description}</p>

          {/* value */}
          <pre
            style={{
              fontFamily: mono ? 'monospace' : 'inherit',
              fontSize: 12,
              color: '#c4c4e0',
              margin: 0,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              lineHeight: 1.6,
            }}
          >
            {preview ? (expanded ? value : preview) : value}
          </pre>

          {/* expand toggle for long fields */}
          {preview && (
            <button
              onClick={() => setExpanded(e => !e)}
              style={{
                marginTop: 8,
                fontSize: 11,
                color: '#6b6b9a',
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              {expanded ? 'Collapse' : 'Show full key'}
            </button>
          )}
        </div>

        {/* copy button */}
        <button
          onClick={() => onCopy(fieldKey, value)}
          style={{
            flexShrink: 0,
            fontSize: 12,
            fontWeight: 600,
            padding: '6px 14px',
            borderRadius: 8,
            border: isCopied ? '1px solid #2a7a2a' : '1px solid #141428',
            background: isCopied ? '#0d2e0d' : '#141428',
            color: isCopied ? '#4ade80' : '#a0a0c8',
            cursor: 'pointer',
            transition: 'all 0.15s',
            whiteSpace: 'nowrap',
            alignSelf: 'flex-start',
            marginTop: 22,          // align with value
          }}
        >
          {isCopied ? '✓ Copied' : copyLabel}
        </button>
      </div>
    </div>
  );
}

// ─── page ───────────────────────────────────────────────────────────────────

export default function ProductPage() {
  const { token, developer } = useAuth();
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [product, setProduct]     = useState<Product | null>(null);
  const [licenses, setLicenses]   = useState<License[]>([]);
  const [loading, setLoading]     = useState(true);
  const [issuing, setIssuing]     = useState(false);
  const [showIssue, setShowIssue] = useState(false);
  const [issueForm, setIssueForm] = useState({ customer_email: '', customer_name: '' });
  const [issueError, setIssueError] = useState('');
  const [copied, setCopied]       = useState<Record<string, boolean>>({});

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

  const handleCopy = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(prev => ({ ...prev, [key]: true }));
    setTimeout(() => setCopied(prev => ({ ...prev, [key]: false })), 2000);
  };

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

  // ── loading / not found ───────────────────────────────────────────────────

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#07070f' }}>
      <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid #F5A623', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!product) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#07070f', color: '#6b6b9a' }}>
      Product not found.
    </div>
  );

  // ── derived values ────────────────────────────────────────────────────────

  const apiKey   = developer?.api_key ?? '';
  const selarUrl  = `https://api.primelock.theprimis.org/webhooks/selar?api_key=${apiKey}&product=${product.slug}`;
  const genericUrl = `https://api.primelock.theprimis.org/webhooks/generic?api_key=${apiKey}&product=${product.slug}`;

  const activeLicenses  = licenses.filter(l => !l.is_revoked).length;
  const seatsInUse      = licenses.reduce((sum, l) => sum + l.seats_used, 0);

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: '100vh', background: '#07070f', color: '#e0e0f0' }}>

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <nav style={{ borderBottom: '1px solid #141428', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* logo */}
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginRight: 8 }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#F5A623', letterSpacing: '-0.03em' }}>Prime</span>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em' }}>Lock</span>
        </Link>
        <span style={{ color: '#2a2a4a' }}>|</span>
        <Link href="/dashboard" style={{ fontSize: 13, color: '#6b6b9a', textDecoration: 'none' }}>
          ← Dashboard
        </Link>
        <span style={{ color: '#2a2a4a' }}>/</span>
        <span style={{ fontSize: 13, color: '#c4c4e0', fontWeight: 500 }}>{product.name}</span>
      </nav>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 20px 64px' }}>

        {/* ── Page title ──────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28, flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#ffffff', margin: 0 }}>{product.name}</h1>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: '3px 10px',
              borderRadius: 20,
              border: product.is_active ? '1px solid rgba(74,222,128,0.25)' : '1px solid #2a2a4a',
              background: product.is_active ? 'rgba(74,222,128,0.08)' : 'rgba(255,255,255,0.04)',
              color: product.is_active ? '#4ade80' : '#6b6b9a',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            {product.is_active ? 'Active' : 'Inactive'}
          </span>
          <span style={{ fontSize: 12, color: '#6b6b9a' }}>{product.slug} · {product.product_type} · v{product.version}</span>
        </div>

        {/* ── Section 1: Integration ───────────────────────────────────────── */}
        <section style={{ background: '#0f0f1a', border: '1px solid #141428', borderRadius: 16, padding: '24px 24px 20px', marginBottom: 24 }}>
          {/* section header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <span style={{ fontSize: 20 }}>🔌</span>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', margin: 0 }}>Integration</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* 1. Product ID */}
            <CopyRow
              fieldKey="product_id"
              label="Product ID"
              description="Embed this in your plugin as PRODUCT_ID"
              value={product.id}
              copyLabel="Copy"
              copied={copied}
              onCopy={handleCopy}
            />

            {/* 2. Public Key */}
            <CopyRow
              fieldKey="public_key"
              label="RSA Public Key"
              description="Embed this in your plugin as PUBLIC_KEY"
              value={product.public_key_pem}
              preview={pkeyPreview(product.public_key_pem)}
              copyLabel="Copy Full Key"
              copied={copied}
              onCopy={handleCopy}
            />

            {/* 3. Selar Webhook URL */}
            <CopyRow
              fieldKey="selar_url"
              label="Selar Webhook URL"
              description="Paste this in your Selar product webhook settings"
              value={selarUrl}
              copyLabel="Copy"
              copied={copied}
              onCopy={handleCopy}
            />

            {/* 4. Generic Webhook URL */}
            <CopyRow
              fieldKey="generic_url"
              label="Generic Webhook URL"
              description="For Gumroad, Paystack, Stripe, or any other platform"
              value={genericUrl}
              copyLabel="Copy"
              copied={copied}
              onCopy={handleCopy}
            />
          </div>
        </section>

        {/* ── Section 3: Stats ─────────────────────────────────────────────── */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
          {[
            { label: 'Licenses Issued', value: licenses.length },
            { label: 'Active Licenses',  value: activeLicenses },
            { label: 'Seats in Use',     value: seatsInUse },
          ].map(s => (
            <div
              key={s.label}
              style={{ background: '#0f0f1a', border: '1px solid #141428', borderRadius: 12, padding: '16px 18px' }}
            >
              <p style={{ fontSize: 11, color: '#6b6b9a', margin: '0 0 6px', fontWeight: 500 }}>{s.label}</p>
              <p style={{ fontSize: 26, fontWeight: 800, color: '#ffffff', margin: 0 }}>{s.value}</p>
            </div>
          ))}
        </section>

        {/* ── Section 2: Licenses ───────────────────────────────────────────── */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', margin: 0 }}>Licenses</h2>
            <button
              onClick={() => setShowIssue(true)}
              style={{
                fontSize: 13,
                fontWeight: 700,
                padding: '8px 18px',
                borderRadius: 10,
                border: 'none',
                background: '#F5A623',
                color: '#07070f',
                cursor: 'pointer',
              }}
            >
              + Issue License
            </button>
          </div>

          {licenses.length === 0 ? (
            <div
              style={{
                background: '#0f0f1a',
                border: '1px dashed #141428',
                borderRadius: 14,
                padding: '40px 24px',
                textAlign: 'center',
                color: '#6b6b9a',
                fontSize: 14,
              }}
            >
              No licenses issued yet
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {licenses.map(l => (
                <div
                  key={l.id}
                  style={{
                    background: '#0f0f1a',
                    border: '1px solid #141428',
                    borderRadius: 12,
                    padding: '14px 18px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  {/* license key — clickable to copy */}
                  <button
                    onClick={() => handleCopy(`lic_${l.id}`, l.license_key)}
                    title="Click to copy"
                    style={{
                      fontFamily: 'monospace',
                      fontSize: 12,
                      color: copied[`lic_${l.id}`] ? '#4ade80' : '#a0a0c8',
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      flex: '1 1 200px',
                      textAlign: 'left',
                    }}
                  >
                    {copied[`lic_${l.id}`] ? '✓ Copied' : l.license_key}
                  </button>

                  {/* customer */}
                  <span style={{ fontSize: 13, color: '#c4c4e0', flex: '1 1 140px' }}>{l.customer_email}</span>

                  {/* seats */}
                  <span style={{ fontSize: 12, color: '#6b6b9a', whiteSpace: 'nowrap' }}>
                    {l.seats_used}/{l.max_seats} seats
                  </span>

                  {/* status badge */}
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '3px 10px',
                      borderRadius: 20,
                      background: l.is_revoked ? 'rgba(248,113,113,0.08)' : 'rgba(74,222,128,0.08)',
                      color: l.is_revoked ? '#f87171' : '#4ade80',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {l.is_revoked ? 'Revoked' : 'Active'}
                  </span>

                  {/* date */}
                  <span style={{ fontSize: 11, color: '#6b6b9a', whiteSpace: 'nowrap' }}>
                    {new Date(l.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ── Issue License Modal ──────────────────────────────────────────────── */}
      {showIssue && (
        <div
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.75)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 50, padding: 16,
          }}
        >
          <div
            style={{
              background: '#0f0f1a',
              border: '1px solid #141428',
              borderRadius: 20,
              width: '100%',
              maxWidth: 440,
              padding: 28,
            }}
          >
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#ffffff', margin: '0 0 4px' }}>Issue a License</h2>
            <p style={{ fontSize: 13, color: '#6b6b9a', margin: '0 0 22px' }}>
              For <strong style={{ color: '#ffffff' }}>{product.name}</strong>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, color: '#6b6b9a', marginBottom: 6, fontWeight: 500 }}>
                  Customer Email
                </label>
                <input
                  type="email"
                  value={issueForm.customer_email}
                  onChange={e => setIssueForm(p => ({ ...p, customer_email: e.target.value }))}
                  placeholder="customer@email.com"
                  style={{
                    width: '100%',
                    background: '#07070f',
                    border: '1px solid #1e1e38',
                    borderRadius: 10,
                    padding: '10px 14px',
                    color: '#ffffff',
                    fontSize: 14,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, color: '#6b6b9a', marginBottom: 6, fontWeight: 500 }}>
                  Customer Name <span style={{ color: '#3a3a5a' }}>(optional)</span>
                </label>
                <input
                  value={issueForm.customer_name}
                  onChange={e => setIssueForm(p => ({ ...p, customer_name: e.target.value }))}
                  placeholder="John Doe"
                  style={{
                    width: '100%',
                    background: '#07070f',
                    border: '1px solid #1e1e38',
                    borderRadius: 10,
                    padding: '10px 14px',
                    color: '#ffffff',
                    fontSize: 14,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {issueError && (
                <div
                  style={{
                    background: 'rgba(248,113,113,0.08)',
                    border: '1px solid rgba(248,113,113,0.25)',
                    borderRadius: 10,
                    padding: '10px 14px',
                    color: '#f87171',
                    fontSize: 13,
                  }}
                >
                  {issueError}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button
                onClick={() => setShowIssue(false)}
                style={{
                  flex: 1,
                  background: '#1a1a2e',
                  border: '1px solid #141428',
                  borderRadius: 10,
                  padding: '11px 0',
                  color: '#a0a0c8',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleIssueLicense}
                disabled={issuing}
                style={{
                  flex: 1,
                  background: issuing ? '#a37418' : '#F5A623',
                  border: 'none',
                  borderRadius: 10,
                  padding: '11px 0',
                  color: '#07070f',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: issuing ? 'not-allowed' : 'pointer',
                  opacity: issuing ? 0.7 : 1,
                }}
              >
                {issuing ? 'Issuing…' : 'Issue License'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
