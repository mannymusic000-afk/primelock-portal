import Link from 'next/link';

const S = {
  page: {
    minHeight: '100vh', background: '#07070f', color: '#e8e8f0',
    fontFamily: "'SF Pro Display', 'Inter', system-ui, sans-serif",
  } as React.CSSProperties,
  nav: {
    borderBottom: '1px solid #0f0f1e', padding: '18px 40px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  } as React.CSSProperties,
  layout: {
    display: 'grid', gridTemplateColumns: '220px 1fr',
    maxWidth: 1100, margin: '0 auto', padding: '48px 40px', gap: 56,
  } as React.CSSProperties,
  sidebar: { position: 'sticky', top: 32, alignSelf: 'start' } as React.CSSProperties,
  sideSection: { marginBottom: 28 } as React.CSSProperties,
  sideLabel: { fontSize: 10, color: '#333348', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: 10, fontWeight: 700 },
  sideLink: { display: 'block', fontSize: 13, color: '#555570', textDecoration: 'none', padding: '5px 0', lineHeight: 1.5 },
  h1: { fontSize: 36, fontWeight: 900, color: '#fff', letterSpacing: '-1px', margin: '0 0 12px' } as React.CSSProperties,
  h2: { fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', margin: '48px 0 16px', paddingTop: 48, borderTop: '1px solid #0f0f18' } as React.CSSProperties,
  h3: { fontSize: 15, fontWeight: 700, color: '#e8e8f0', margin: '24px 0 8px' } as React.CSSProperties,
  p: { fontSize: 14, color: '#888898', lineHeight: 1.8, margin: '0 0 16px' } as React.CSSProperties,
  code: { background: '#0f0f1a', border: '1px solid #141428', borderRadius: 16, padding: '20px 24px', margin: '12px 0 20px', overflow: 'auto' } as React.CSSProperties,
  pre: { fontSize: 12, color: '#c8c8e0', fontFamily: 'monospace', margin: 0, whiteSpace: 'pre' as const, lineHeight: 1.7 },
  badge: (color: string) => ({
    display: 'inline-block', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
    background: `${color}20`, border: `1px solid ${color}40`, color, marginRight: 6,
  }) as React.CSSProperties,
  note: { background: '#F5A62308', border: '1px solid #F5A62325', borderRadius: 12, padding: '14px 18px', margin: '16px 0' } as React.CSSProperties,
};

export default function DocsPage() {
  return (
    <div style={S.page}>

      {/* Nav */}
      <nav style={S.nav}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/logo.png" alt="PrimeLock" style={{ width: 32, height: 32, borderRadius: 8 }} />
          <span style={{ fontWeight: 800, color: '#fff', fontSize: 16 }}>PrimeLock</span>
          <span style={{ fontSize: 13, color: '#333348', marginLeft: 4 }}>/ Docs</span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link href="/" style={{ fontSize: 13, color: '#555570', textDecoration: 'none' }}>Home</Link>
          <Link href="/register" style={{ fontSize: 13, color: '#F5A623', textDecoration: 'none', fontWeight: 600 }}>Get started free</Link>
        </div>
      </nav>

      <div style={S.layout}>

        {/* Sidebar */}
        <aside style={S.sidebar}>
          {[
            { label: 'Getting Started', links: [
              { href: '#overview', text: 'Overview' },
              { href: '#quickstart', text: 'Quickstart' },
            ]},
            { label: 'Developer Portal', links: [
              { href: '#products', text: 'Registering Products' },
              { href: '#issuing', text: 'Issuing Licenses' },
              { href: '#api-key', text: 'Your API Key' },
            ]},
            { label: 'Webhooks', links: [
              { href: '#selar', text: 'Selar' },
              { href: '#flutterwave', text: 'Flutterwave' },
            ]},
            { label: 'SDK Integration', links: [
              { href: '#sdk-setup', text: 'C++ / JUCE Setup' },
              { href: '#sdk-verify', text: 'Verifying Tokens' },
            ]},
            { label: 'License Manager', links: [
              { href: '#app-download', text: 'Download' },
              { href: '#app-flow', text: 'Customer Flow' },
            ]},
            { label: 'API Reference', links: [
              { href: '#api-activate', text: 'Activate' },
              { href: '#api-validate', text: 'Validate' },
              { href: '#api-deactivate', text: 'Deactivate' },
            ]},
          ].map(section => (
            <div key={section.label} style={S.sideSection}>
              <p style={S.sideLabel}>{section.label}</p>
              {section.links.map(link => (
                <a key={link.href} href={link.href} style={S.sideLink}>{link.text}</a>
              ))}
            </div>
          ))}
        </aside>

        {/* Content */}
        <main>
          <p style={{ fontSize: 12, color: '#333348', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Documentation</p>
          <h1 style={S.h1}>PrimeLock Docs</h1>
          <p style={{ ...S.p, fontSize: 16, color: '#555570' }}>
            Everything you need to protect and license your software.
          </p>

          {/* ── OVERVIEW ── */}
          <h2 id="overview" style={S.h2}>Overview</h2>
          <p style={S.p}>
            PrimeLock is a software licensing platform. When a customer buys your plugin or app,
            PrimeLock issues them a signed license key. They activate it on their machine using the
            PrimeLock License Manager app. Your plugin verifies the signature locally at startup —
            no internet required after the first activation.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, margin: '20px 0' }}>
            {[
              { icon: '🔐', title: 'RSA-2048 Signing', desc: 'Each product gets its own keypair. Private key never leaves PrimeLock.' },
              { icon: '📧', title: 'Auto Delivery', desc: 'License keys emailed instantly on purchase via Selar or Flutterwave.' },
              { icon: '💻', title: 'Machine Activation', desc: 'Customers activate on N machines. Deactivate and move seats any time.' },
            ].map(c => (
              <div key={c.title} style={{ background: '#0f0f1a', border: '1px solid #141428', borderRadius: 14, padding: '18px 18px' }}>
                <div style={{ fontSize: 22, marginBottom: 8 }}>{c.icon}</div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: '0 0 6px' }}>{c.title}</p>
                <p style={{ fontSize: 12, color: '#444460', margin: 0, lineHeight: 1.6 }}>{c.desc}</p>
              </div>
            ))}
          </div>

          {/* ── QUICKSTART ── */}
          <h2 id="quickstart" style={S.h2}>Quickstart</h2>
          <p style={S.p}>Get up and running in 5 minutes:</p>
          {[
            { n: '1', title: 'Create your account', desc: <>Register at <a href="/register" style={{ color: '#F5A623' }}>portal.primelock.theprimis.org/register</a></> },
            { n: '2', title: 'Register a product', desc: 'Dashboard → + Add Product. PrimeLock generates an RSA keypair automatically.' },
            { n: '3', title: 'Copy your Product ID', desc: 'Found on the product page. Embed this in your plugin alongside the public key.' },
            { n: '4', title: 'Connect your store', desc: 'Add a Selar or Flutterwave webhook — PrimeLock auto-issues keys on every sale.' },
            { n: '5', title: 'Embed the SDK', desc: 'Drop the C++ SDK into your JUCE project. It verifies the signed token at startup.' },
          ].map(step => (
            <div key={step.n} style={{ display: 'flex', gap: 16, marginBottom: 16, alignItems: 'flex-start' }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                background: 'linear-gradient(135deg, #F5A623, #e8940f)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 800, color: '#000',
              }}>{step.n}</div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#e8e8f0', margin: '0 0 3px' }}>{step.title}</p>
                <p style={{ fontSize: 13, color: '#555570', margin: 0 }}>{step.desc}</p>
              </div>
            </div>
          ))}

          {/* ── PRODUCTS ── */}
          <h2 id="products" style={S.h2}>Registering Products</h2>
          <p style={S.p}>
            Each piece of software you sell is a <strong style={{ color: '#e8e8f0' }}>Product</strong> in PrimeLock.
            When you create a product, PrimeLock generates a dedicated RSA-2048 keypair. The public key
            is embedded in your plugin. The private key never leaves PrimeLock's servers.
          </p>
          <h3 style={S.h3}>Fields</h3>
          <div style={S.code}>
            <pre style={S.pre}>{`Name         — Display name (e.g. "Cue Engine")
Slug         — URL-safe identifier (e.g. "cue-engine")
Product Type — plugin | desktop | web | game
Max Seats    — How many machines one license can activate (default: 2)
Version      — Current version string (e.g. "1.0.0")`}</pre>
          </div>

          {/* ── ISSUING ── */}
          <h2 id="issuing" style={S.h2}>Issuing Licenses</h2>
          <p style={S.p}>You can issue licenses manually from the dashboard or automatically via webhook.</p>
          <h3 style={S.h3}>Manual (Dashboard)</h3>
          <p style={S.p}>Dashboard → click your product → + Issue License → enter customer email → Issue. The key is emailed instantly.</p>
          <h3 style={S.h3}>Automatic (API)</h3>
          <div style={S.code}>
            <pre style={S.pre}>{`POST https://api.primelock.theprimis.org/licenses
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "product_id":     "uuid-of-your-product",
  "customer_email": "buyer@example.com",
  "customer_name":  "John Doe",
  "license_type":   "perpetual"
}`}</pre>
          </div>

          {/* ── API KEY ── */}
          <h2 id="api-key" style={S.h2}>Your API Key</h2>
          <p style={S.p}>
            Your API key is shown on your dashboard. It looks like <code style={{ background: '#141428', padding: '2px 6px', borderRadius: 4, fontSize: 12, fontFamily: 'monospace', color: '#F5A623' }}>PL-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</code>.
            Use it in webhook URLs so PrimeLock knows which developer's products to issue licenses for.
          </p>

          {/* ── SELAR ── */}
          <h2 id="selar" style={S.h2}>Selar Webhook</h2>
          <p style={S.p}>
            In your Selar product settings, set the webhook URL to:
          </p>
          <div style={S.code}>
            <pre style={S.pre}>{`https://api.primelock.theprimis.org/webhooks/selar?api_key=YOUR_API_KEY&product=YOUR_PRODUCT_SLUG`}</pre>
          </div>
          <p style={S.p}>Replace <code style={{ background: '#141428', padding: '2px 6px', borderRadius: 4, fontSize: 12, fontFamily: 'monospace', color: '#c8c8e0' }}>YOUR_API_KEY</code> with your PrimeLock API key and <code style={{ background: '#141428', padding: '2px 6px', borderRadius: 4, fontSize: 12, fontFamily: 'monospace', color: '#c8c8e0' }}>YOUR_PRODUCT_SLUG</code> with your product slug (e.g. <code style={{ background: '#141428', padding: '2px 6px', borderRadius: 4, fontSize: 12, fontFamily: 'monospace', color: '#c8c8e0' }}>cue-engine</code>).</p>
          <div style={S.note}>
            <p style={{ fontSize: 13, color: '#F5A623', margin: '0 0 4px', fontWeight: 700 }}>⚡ What happens</p>
            <p style={{ fontSize: 13, color: '#888898', margin: 0 }}>
              When a sale is confirmed, Selar pings PrimeLock → a license key is generated → emailed to the buyer automatically. No manual work needed.
            </p>
          </div>

          {/* ── FLUTTERWAVE ── */}
          <h2 id="flutterwave" style={S.h2}>Flutterwave Webhook</h2>
          <p style={S.p}>In your Flutterwave dashboard → Settings → Webhooks, set the URL to:</p>
          <div style={S.code}>
            <pre style={S.pre}>{`https://api.primelock.theprimis.org/webhooks/flutterwave?api_key=YOUR_API_KEY&product=YOUR_PRODUCT_SLUG`}</pre>
          </div>
          <p style={S.p}>Also copy the <strong style={{ color: '#e8e8f0' }}>Webhook Hash</strong> from Flutterwave and add it to your Render environment as <code style={{ background: '#141428', padding: '2px 6px', borderRadius: 4, fontSize: 12, fontFamily: 'monospace', color: '#c8c8e0' }}>FLW_WEBHOOK_HASH</code>.</p>

          {/* ── SDK SETUP ── */}
          <h2 id="sdk-setup" style={S.h2}>C++ / JUCE SDK Setup</h2>
          <p style={S.p}>Add the PrimeLock SDK to your JUCE project in 3 steps:</p>
          <h3 style={S.h3}>1. Copy the SDK files</h3>
          <div style={S.code}>
            <pre style={S.pre}>{`primelock/
  sdk/
    PrimeLockLicense.h
    PrimeLockLicense.cpp`}</pre>
          </div>
          <p style={S.p}>Copy these two files into your plugin's source directory and add them to your JUCE project.</p>

          <h3 style={S.h3}>2. Get your public key and Product ID</h3>
          <p style={S.p}>From your product page in the portal, copy the RSA public key and the Product ID (UUID). These are safe to embed in your binary.</p>

          <h3 style={S.h3}>3. Verify at startup</h3>
          <div style={S.code}>
            <pre style={S.pre}>{`#include "PrimeLockLicense.h"

// In your plugin constructor or prepareToPlay:
const char* PUBLIC_KEY = "-----BEGIN PUBLIC KEY-----\\n"
    "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A...\\n"
    "-----END PUBLIC KEY-----";

const char* PRODUCT_ID = "your-product-uuid-here";

PrimeLockLicense license(PUBLIC_KEY, PRODUCT_ID);
PrimeLockLicense::Status status = license.verify();

if (status != PrimeLockLicense::Status::Valid) {
    // Show license prompt or disable processing
    showLicenseDialog();
}`}</pre>
          </div>

          {/* ── SDK VERIFY ── */}
          <h2 id="sdk-verify" style={S.h2}>Verifying Tokens</h2>
          <p style={S.p}>The SDK verifies the license token entirely offline using RSA signature verification. No network call is made during verification. The token is loaded from the system keychain where the License Manager stores it.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: '16px 0' }}>
            {[
              { status: 'Valid', color: '#29C6D9', desc: 'License is active on this machine.' },
              { status: 'NotFound', color: '#F5A623', desc: 'No token found — show activation screen.' },
              { status: 'Expired', color: '#f87171', desc: 'Subscription has lapsed.' },
              { status: 'Invalid', color: '#f87171', desc: 'Signature check failed — tampered token.' },
            ].map(s => (
              <div key={s.status} style={{ background: '#0f0f1a', border: '1px solid #141428', borderRadius: 12, padding: '14px 16px' }}>
                <span style={S.badge(s.color)}>{s.status}</span>
                <p style={{ fontSize: 12, color: '#555570', margin: '8px 0 0' }}>{s.desc}</p>
              </div>
            ))}
          </div>

          {/* ── APP DOWNLOAD ── */}
          <h2 id="app-download" style={S.h2}>License Manager — Download</h2>
          <p style={S.p}>
            The PrimeLock License Manager is a native desktop app for Mac and Windows. Your customers use it to activate and manage their licenses.
          </p>
          <div style={{ display: 'flex', gap: 12, margin: '20px 0' }}>
            <a href="https://github.com/mannymusic000-afk/primelock-portal/releases/download/v1.0.0/PrimeLock.Manager_1.0.0_x64.dmg"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                background: 'linear-gradient(135deg, #F5A623, #e8940f)',
                color: '#000', fontWeight: 700, fontSize: 14,
                padding: '14px 24px', borderRadius: 12, textDecoration: 'none',
              }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1V11M4 8L8 12L12 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 14H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Download for Mac
            </a>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: '#141428', border: '1px solid #1e1e36',
              color: '#444460', fontSize: 14, padding: '14px 24px', borderRadius: 12,
            }}>
              Windows — coming soon
            </div>
          </div>

          {/* ── APP FLOW ── */}
          <h2 id="app-flow" style={S.h2}>Customer Flow</h2>
          <p style={S.p}>Here's what your customers experience:</p>
          {[
            'Buy your plugin → receive a license key email from PrimeLock',
            'Download and open the PrimeLock License Manager',
            'Sign in with their purchase email — receive a 6-digit code',
            'Enter the code → see all their licenses automatically',
            'Click "+ Activate Here" on any license → plugin is activated',
            'Plugin verifies the signed token locally at every startup',
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 11, color: '#333348', fontWeight: 700, minWidth: 20, marginTop: 2 }}>{i + 1}.</span>
              <p style={{ fontSize: 14, color: '#888898', margin: 0, lineHeight: 1.7 }}>{step}</p>
            </div>
          ))}

          {/* ── API REFERENCE ── */}
          <h2 id="api-activate" style={S.h2}>API — Activate</h2>
          <p style={S.p}><span style={S.badge('#29C6D9')}>POST</span><code style={{ fontSize: 13, color: '#e8e8f0', fontFamily: 'monospace' }}>/licenses/activate</code></p>
          <p style={S.p}>Called by the License Manager app when a customer activates on a new machine. No authentication required.</p>
          <div style={S.code}>
            <pre style={S.pre}>{`{
  "license_key":          "PL-XXXX-XXXX-XXXX-XXXX",
  "product_id":           "uuid-of-product",
  "machine_fingerprint":  "sha256-of-machine-id",
  "machine_label":        "MacBook Pro (M1)",
  "os":                   "darwin",
  "os_version":           "14.0"
}`}</pre>
          </div>
          <p style={S.p}>Returns a signed JWT token on success. Store this in the system keychain.</p>

          <h2 id="api-validate" style={S.h2}>API — Validate</h2>
          <p style={S.p}><span style={S.badge('#29C6D9')}>POST</span><code style={{ fontSize: 13, color: '#e8e8f0', fontFamily: 'monospace' }}>/licenses/validate</code></p>
          <p style={S.p}>Periodic background check. Call this once on startup if online. If offline, the plugin should trust the stored token.</p>
          <div style={S.code}>
            <pre style={S.pre}>{`{
  "license_key":         "PL-XXXX-XXXX-XXXX-XXXX",
  "product_id":          "uuid-of-product",
  "machine_fingerprint": "sha256-of-machine-id"
}`}</pre>
          </div>

          <h2 id="api-deactivate" style={S.h2}>API — Deactivate</h2>
          <p style={S.p}><span style={S.badge('#F5A623')}>POST</span><code style={{ fontSize: 13, color: '#e8e8f0', fontFamily: 'monospace' }}>/licenses/deactivate</code></p>
          <p style={S.p}>Frees up a seat so the customer can activate on a different machine.</p>
          <div style={S.code}>
            <pre style={S.pre}>{`{
  "license_key":         "PL-XXXX-XXXX-XXXX-XXXX",
  "product_id":          "uuid-of-product",
  "machine_fingerprint": "sha256-of-machine-id"
}`}</pre>
          </div>

          {/* Footer */}
          <div style={{ marginTop: 64, paddingTop: 32, borderTop: '1px solid #0f0f18' }}>
            <p style={{ fontSize: 13, color: '#2a2a3a' }}>
              Questions? Email <a href="mailto:support@theprimis.org" style={{ color: '#444460' }}>support@theprimis.org</a>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
