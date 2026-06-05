'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth';
import { api } from '@/lib/api';

const GOLD = '#F5A623';
const TEAL = '#29C6D9';
const BG = '#07070f';
const CARD = '#0f0f1a';
const BORDER = '#141428';

interface CreatedProduct {
  id: string;
  name: string;
  slug: string;
  public_key_pem: string;
}

// ─── Copy button ──────────────────────────────────────────────────────────────
function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={copy}
      style={{
        fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6,
        background: copied ? '#29C6D915' : '#F5A62315',
        border: `1px solid ${copied ? '#29C6D940' : '#F5A62340'}`,
        color: copied ? TEAL : GOLD,
        cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
      }}
    >
      {copied ? '✓ Copied' : label}
    </button>
  );
}

// ─── Step 1: Welcome ──────────────────────────────────────────────────────────
function StepWelcome({ firstName, onNext }: { firstName: string; onNext: () => void }) {
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🔐</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', margin: '0 0 10px' }}>
          Welcome to PrimeLock, {firstName}!
        </h1>
        <p style={{ fontSize: 14, color: '#666680', margin: 0 }}>
          Let&apos;s get you set up in 4 quick steps.
        </p>
      </div>

      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '22px 24px', marginBottom: 28 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: '#444460', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 14px' }}>
          Here&apos;s what we&apos;ll do
        </p>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            ['📦', 'Register a product', 'We generate an RSA keypair for it automatically'],
            ['🔑', 'Get your API key', 'Use it to issue licenses from your store webhooks'],
            ['🔗', 'Connect your store', 'Pre-filled webhook URL for Selar, Gumroad, and more'],
            ['⬇', 'Download the C++ SDK', 'Add two files to your JUCE project and you\'re live'],
          ].map(([icon, title, desc]) => (
            <li key={title as string} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <span style={{ fontSize: 18, flexShrink: 0, lineHeight: 1.4 }}>{icon}</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#d8d8e8', margin: '0 0 2px' }}>{title}</p>
                <p style={{ fontSize: 12, color: '#444460', margin: 0 }}>{desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onNext}
        style={{
          width: '100%', padding: '14px', borderRadius: 12, border: 'none', cursor: 'pointer',
          background: `linear-gradient(135deg, ${GOLD}, #e8940f)`,
          color: '#000', fontWeight: 800, fontSize: 15, letterSpacing: '-0.2px',
        }}
      >
        Let&apos;s go →
      </button>
    </div>
  );
}

// ─── Step 2: Create product ───────────────────────────────────────────────────
function StepCreateProduct({ token, onNext }: { token: string; onNext: (p: CreatedProduct) => void }) {
  const [form, setForm] = useState({ name: '', slug: '', product_type: 'plugin' as 'plugin' | 'desktop' | 'web' | 'game' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [created, setCreated] = useState<CreatedProduct | null>(null);

  const slugify = (s: string) =>
    s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const setName = (val: string) =>
    setForm(prev => ({ ...prev, name: val, slug: slugify(val) }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.products.create(token, {
        name: form.name,
        slug: form.slug,
        product_type: form.product_type,
      });
      setCreated({
        id: res.product.id,
        name: res.product.name,
        slug: res.product.slug,
        public_key_pem: res.public_key_pem ?? res.product.public_key_pem ?? '',
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', background: '#080814', border: `1px solid ${BORDER}`,
    borderRadius: 10, padding: '10px 14px', color: '#e8e8f0', fontSize: 13,
    outline: 'none', boxSizing: 'border-box' as const,
  };
  const labelStyle = { fontSize: 12, color: '#555570', marginBottom: 6, display: 'block' as const };

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.3px' }}>
        Register your first product
      </h2>
      <p style={{ fontSize: 13, color: '#555570', margin: '0 0 24px', lineHeight: 1.6 }}>
        Every piece of software you sell needs a product in PrimeLock. We&apos;ll generate an RSA keypair for it automatically.
      </p>

      {!created ? (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={labelStyle}>Product name</label>
            <input
              type="text" required value={form.name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Reverb Pro"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Slug (auto-filled)</label>
            <input
              type="text" required value={form.slug}
              onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))}
              placeholder="reverb-pro"
              style={{ ...inputStyle, fontFamily: 'monospace', color: GOLD }}
            />
          </div>

          <div>
            <label style={labelStyle}>Product type</label>
            <select
              value={form.product_type}
              onChange={e => setForm(prev => ({ ...prev, product_type: e.target.value as typeof form.product_type }))}
              style={{ ...inputStyle, appearance: 'none' as const, cursor: 'pointer' }}
            >
              <option value="plugin">Plugin (VST / AU / AAX)</option>
              <option value="desktop">Desktop app</option>
              <option value="web">Web app</option>
              <option value="game">Game</option>
            </select>
          </div>

          {error && (
            <div style={{ background: '#f8717112', border: '1px solid #f8717130', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#f87171' }}>
              {error}
            </div>
          )}

          <button
            type="submit" disabled={loading}
            style={{
              padding: '12px', borderRadius: 10, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              background: `linear-gradient(135deg, ${GOLD}, #e8940f)`,
              color: '#000', fontWeight: 800, fontSize: 14, opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Creating…' : 'Create Product'}
          </button>
        </form>
      ) : (
        <div>
          {/* Success state */}
          <div style={{ background: '#29C6D910', border: '1px solid #29C6D930', borderRadius: 14, padding: '18px 20px', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 20 }}>✅</span>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>{created.name}</p>
            </div>

            <div style={{ marginBottom: 12 }}>
              <p style={{ fontSize: 11, color: '#444460', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Product ID</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <code style={{ flex: 1, fontSize: 12, fontFamily: 'monospace', color: TEAL, background: '#080814', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '8px 12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {created.id}
                </code>
                <CopyButton text={created.id} />
              </div>
            </div>

            <div>
              <p style={{ fontSize: 11, color: '#444460', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Public Key (preview)</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <code style={{ flex: 1, fontSize: 11, fontFamily: 'monospace', color: '#777790', background: '#080814', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '8px 12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {created.public_key_pem.slice(0, 50)}…
                </code>
                <CopyButton text={created.public_key_pem} label="Copy Full Key" />
              </div>
            </div>
          </div>

          <button
            onClick={() => onNext(created)}
            style={{
              width: '100%', padding: '13px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: `linear-gradient(135deg, ${GOLD}, #e8940f)`,
              color: '#000', fontWeight: 800, fontSize: 14,
            }}
          >
            Continue →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Step 3: API key ──────────────────────────────────────────────────────────
function StepApiKey({ apiKey, productSlug, onNext }: { apiKey: string; productSlug: string; onNext: () => void }) {
  const webhookUrl = `https://api.primelock.theprimis.org/webhooks/selar?api_key=${apiKey}&product=${productSlug}`;

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.3px' }}>
        Your API Key
      </h2>
      <p style={{ fontSize: 13, color: '#555570', margin: '0 0 24px', lineHeight: 1.6 }}>
        Use this in your webhook URLs so PrimeLock knows which account to issue licenses for.
      </p>

      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 11, color: '#444460', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>API Key</p>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <code style={{
            flex: 1, fontFamily: 'monospace', fontSize: 13, color: GOLD,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            letterSpacing: '0.04em',
          }}>
            {apiKey}
          </code>
          <CopyButton text={apiKey} />
        </div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <p style={{ fontSize: 11, color: '#444460', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Selar Webhook URL
        </p>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '14px 16px' }}>
          <code style={{
            display: 'block', fontFamily: 'monospace', fontSize: 11, color: TEAL,
            wordBreak: 'break-all', lineHeight: 1.7, marginBottom: 10,
          }}>
            {webhookUrl}
          </code>
          <CopyButton text={webhookUrl} label="Copy URL" />
        </div>
        <p style={{ fontSize: 11, color: '#333348', margin: '8px 0 0', lineHeight: 1.6 }}>
          Paste this URL into your Selar product webhook settings. PrimeLock will issue a license automatically on every sale.
        </p>
      </div>

      <button
        onClick={onNext}
        style={{
          width: '100%', padding: '13px', borderRadius: 10, border: 'none', cursor: 'pointer',
          background: `linear-gradient(135deg, ${GOLD}, #e8940f)`,
          color: '#000', fontWeight: 800, fontSize: 14,
        }}
      >
        Continue →
      </button>
    </div>
  );
}

// ─── Step 4: SDK ──────────────────────────────────────────────────────────────
function StepSdk({ productId, publicKey, onFinish }: { productId: string; publicKey: string; onFinish: () => void }) {
  const snippet = `PrimeLock::Client license(PRODUCT_ID, PUBLIC_KEY, API_URL);
if (!license.isActivated())
    showActivationDialog();`;

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.3px' }}>
        Download the C++ SDK
      </h2>
      <p style={{ fontSize: 13, color: '#555570', margin: '0 0 24px', lineHeight: 1.6 }}>
        Add these two files to your JUCE project to verify licenses locally.
      </p>

      <a
        href="https://github.com/mannymusic000-afk/primelock-sdk"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12,
          padding: '14px 20px', textDecoration: 'none', marginBottom: 20,
          transition: 'border-color 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = GOLD)}
        onMouseLeave={e => (e.currentTarget.style.borderColor = BORDER)}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#e8e8f0">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
        </svg>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#e8e8f0' }}>Download SDK from GitHub</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ marginLeft: 2 }}>
          <path d="M2 10L10 2M10 2H4M10 2V8" stroke="#666680" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </a>

      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 11, color: '#444460', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Usage example
        </p>
        <div style={{ background: '#050510', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '16px 18px', position: 'relative' }}>
          <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: 12, color: '#aaaacc', lineHeight: 1.7, overflow: 'auto' }}>
            <span style={{ color: '#29C6D9' }}>PrimeLock::Client</span>{' '}
            <span style={{ color: '#e8e8f0' }}>license</span>
            <span style={{ color: '#666680' }}>(PRODUCT_ID, PUBLIC_KEY, API_URL);</span>{'\n'}
            <span style={{ color: '#F5A623' }}>if</span>{' '}
            <span style={{ color: '#666680' }}>(!license.</span>
            <span style={{ color: '#29C6D9' }}>isActivated</span>
            <span style={{ color: '#666680' }}>())</span>{'\n'}
            {'    '}
            <span style={{ color: '#e8e8f0' }}>showActivationDialog</span>
            <span style={{ color: '#666680' }}>();</span>
          </pre>
          <div style={{ position: 'absolute', top: 12, right: 14 }}>
            <CopyButton text={snippet} label="Copy" />
          </div>
        </div>
      </div>

      <div style={{ background: '#F5A62308', border: `1px solid #F5A62320`, borderRadius: 12, padding: '14px 16px', marginBottom: 24 }}>
        <p style={{ fontSize: 12, color: '#888070', margin: 0, lineHeight: 1.6 }}>
          Replace <code style={{ color: GOLD, fontFamily: 'monospace' }}>PRODUCT_ID</code> with{' '}
          <code style={{ color: TEAL, fontFamily: 'monospace', fontSize: 11 }}>{productId}</code> and{' '}
          <code style={{ color: GOLD, fontFamily: 'monospace' }}>PUBLIC_KEY</code> with your product&apos;s PEM string.
        </p>
      </div>

      <button
        onClick={onFinish}
        style={{
          width: '100%', padding: '13px', borderRadius: 10, border: 'none', cursor: 'pointer',
          background: `linear-gradient(135deg, ${GOLD}, #e8940f)`,
          color: '#000', fontWeight: 800, fontSize: 14,
        }}
      >
        Go to Dashboard →
      </button>
    </div>
  );
}

// ─── Main wizard ──────────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const { developer, token, loading } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [product, setProduct] = useState<CreatedProduct | null>(null);

  const TOTAL_STEPS = 4;

  useEffect(() => {
    if (!loading && !developer) router.replace('/login');
  }, [developer, loading, router]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: BG }}>
        <div style={{ width: 24, height: 24, border: `2px solid ${GOLD}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  if (!developer || !token) return null;

  const firstName = developer.name?.split(' ')[0] ?? 'Developer';
  const progressPct = ((step - 1) / (TOTAL_STEPS - 1)) * 100;

  const stepLabels = ['Welcome', 'Product', 'API Key', 'SDK'];

  return (
    <div style={{ minHeight: '100vh', background: BG, color: '#e8e8f0', fontFamily: "'SF Pro Display', 'Inter', system-ui, sans-serif" }}>

      {/* Minimal header */}
      <div style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${BORDER}` }}>
        <img src="/logo.png" alt="PrimeLock" style={{ width: 28, height: 28, borderRadius: 7 }}
          onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
        <span style={{ fontWeight: 800, fontSize: 15, color: '#fff' }}>PrimeLock</span>
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: BORDER }}>
        <div style={{
          height: '100%',
          width: `${progressPct}%`,
          background: `linear-gradient(90deg, ${GOLD}, #e8940f)`,
          transition: 'width 0.4s ease',
        }} />
      </div>

      {/* Step indicator */}
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '24px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <p style={{ fontSize: 12, color: '#444460', margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Step {step} of {TOTAL_STEPS}
          </p>
          <div style={{ display: 'flex', gap: 6 }}>
            {stepLabels.map((label, i) => {
              const n = i + 1;
              const isDone = n < step;
              const isCurrent = n === step;
              return (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 700,
                    background: isDone ? GOLD : isCurrent ? '#F5A62320' : 'transparent',
                    border: `1.5px solid ${isDone ? GOLD : isCurrent ? GOLD : BORDER}`,
                    color: isDone ? '#000' : isCurrent ? GOLD : '#333348',
                  }}>
                    {isDone ? '✓' : n}
                  </div>
                  {i < stepLabels.length - 1 && (
                    <div style={{ width: 16, height: 1.5, background: isDone ? GOLD : BORDER }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step card */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: '28px 28px 32px' }}>
          {step === 1 && (
            <StepWelcome firstName={firstName} onNext={() => setStep(2)} />
          )}
          {step === 2 && (
            <StepCreateProduct
              token={token}
              onNext={(p) => { setProduct(p); setStep(3); }}
            />
          )}
          {step === 3 && product && (
            <StepApiKey
              apiKey={developer.api_key}
              productSlug={product.slug}
              onNext={() => setStep(4)}
            />
          )}
          {step === 4 && product && (
            <StepSdk
              productId={product.id}
              publicKey={product.public_key_pem}
              onFinish={() => router.replace('/dashboard')}
            />
          )}
        </div>

        {/* Skip link */}
        {step > 1 && (
          <p style={{ textAlign: 'center', marginTop: 16 }}>
            <button
              onClick={() => router.replace('/dashboard')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#333348', fontSize: 12 }}
            >
              Skip setup, go to dashboard
            </button>
          </p>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
