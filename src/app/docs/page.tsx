import Link from 'next/link';

export default function DocsPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#07070f',
      color: '#e8e8f0',
      fontFamily: "'SF Pro Display', 'Inter', system-ui, sans-serif",
    }}>

      {/* Nav */}
      <nav style={{
        borderBottom: '1px solid #141428',
        padding: '18px 64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/logo.png" alt="PrimeLock" style={{ width: 32, height: 32, borderRadius: 8 }} />
          <span style={{ fontWeight: 800, color: '#fff', fontSize: 16 }}>PrimeLock</span>
          <span style={{ color: '#333348', fontSize: 14 }}>/</span>
          <span style={{ color: '#555570', fontSize: 14 }}>Docs</span>
        </div>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <Link href="/" style={{ fontSize: 13, color: '#555570', textDecoration: 'none' }}>Home</Link>
          <Link href="/register" style={{
            fontSize: 13, color: '#000', fontWeight: 700,
            background: 'linear-gradient(135deg, #F5A623, #e8940f)',
            padding: '8px 16px', borderRadius: 8, textDecoration: 'none',
          }}>Get Started Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '64px 40px 48px' }}>
        <p style={{ fontSize: 12, color: '#444460', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
          Documentation
        </p>
        <h1 style={{ fontSize: 40, fontWeight: 900, color: '#fff', letterSpacing: '-1px', margin: '0 0 16px' }}>
          How PrimeLock works
        </h1>
        <p style={{ fontSize: 16, color: '#555570', margin: '0 auto', maxWidth: 500, lineHeight: 1.7 }}>
          Choose what you need — instructions for customers using the app, or for developers integrating PrimeLock into their software.
        </p>
      </div>

      {/* Tab selector */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 40px 80px' }}>

        {/* ── SECTION: FOR USERS ── */}
        <div style={{ marginBottom: 64 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: '#F5A62315', border: '1px solid #F5A62330',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
            }}>👤</div>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>
                For Customers
              </h2>
              <p style={{ fontSize: 13, color: '#444460', margin: '3px 0 0' }}>
                I bought a plugin or app and need to activate it
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Download */}
            <DocCard step="1" title="Download the License Manager">
              <p style={P}>The PrimeLock License Manager is a free app for Mac and Windows. It manages all your software licenses in one place.</p>
              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <a
                  href="https://github.com/mannymusic000-afk/primelock-portal/releases/download/v1.0.0/PrimeLock.Manager_1.0.0_x64.dmg"
                  style={DownloadBtn}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1V9M4 7L7 10L10 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12H12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                  Download for Mac
                </a>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: '#141428', border: '1px solid #1e1e36',
                  color: '#333348', fontSize: 13, padding: '10px 20px', borderRadius: 10,
                }}>
                  Windows — coming soon
                </div>
              </div>
            </DocCard>

            {/* Sign in */}
            <DocCard step="2" title="Sign in with your email">
              <p style={P}>Open the app and enter the email address you used when purchasing. You'll receive a 6-digit sign-in code — no password needed.</p>
              <Note>Make sure to use the same email you used at checkout. The code expires in 10 minutes.</Note>
            </DocCard>

            {/* Activate */}
            <DocCard step="3" title="Activate your license">
              <p style={P}>After signing in, you'll see all your licenses. Click <strong style={{ color: '#F5A623' }}>+ Activate Here</strong> on any license to activate it on your current machine. That's it — your software is now unlocked.</p>
            </DocCard>

            {/* Transfer */}
            <DocCard step="4" title="Moving to a new machine?">
              <p style={P}>Click <strong style={{ color: '#F5A623' }}>Transfer Machine</strong> on the license you want to move. This deactivates it on your current machine, freeing up the seat. Then open PrimeLock on your new machine, sign in with the same email, and activate again.</p>
              <Note>Each license has a limited number of seats (machines). Transferring frees up one seat immediately.</Note>
            </DocCard>

            {/* Lost key */}
            <DocCard step="5" title="Lost your license key?">
              <p style={P}>No problem. Open the License Manager, sign in with your purchase email, and all your licenses will appear automatically. You don't need to keep track of the key yourself.</p>
            </DocCard>

          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #1e1e36, transparent)', marginBottom: 64 }} />

        {/* ── SECTION: FOR DEVELOPERS ── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: '#29C6D915', border: '1px solid #29C6D930',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
            }}>⚙️</div>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>
                For Developers
              </h2>
              <p style={{ fontSize: 13, color: '#444460', margin: '3px 0 0' }}>
                I want to protect and sell my software using PrimeLock
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <DocCard step="1" title="Create a developer account">
              <p style={P}>Register at <a href="/register" style={{ color: '#F5A623', textDecoration: 'none' }}>portal.primelock.theprimis.org/register</a>. Your free account gives you 1 product and 50 licenses/month.</p>
            </DocCard>

            <DocCard step="2" title="Register your product">
              <p style={P}>Dashboard → + Add Product. Fill in the name, slug, and seat count. PrimeLock generates a dedicated RSA-2048 keypair automatically — the private key never leaves PrimeLock's servers.</p>
              <p style={{ ...P, marginTop: 8 }}>Copy the <strong style={{ color: '#e8e8f0' }}>Product ID</strong> and <strong style={{ color: '#e8e8f0' }}>Public Key</strong> from the product page — you'll embed these in your plugin.</p>
            </DocCard>

            <DocCard step="3" title="Connect your store">
              <p style={P}>In your store's webhook settings, paste your PrimeLock webhook URL. When a sale is confirmed, PrimeLock automatically issues a signed license key and emails it to the buyer.</p>
              <p style={{ ...P, marginTop: 8, fontFamily: 'monospace', fontSize: 12, color: '#888898', background: '#0f0f1a', border: '1px solid #141428', borderRadius: 10, padding: '12px 14px' }}>
                https://api.primelock.theprimis.org/webhooks/selar?api_key=YOUR_API_KEY&product=YOUR_SLUG
              </p>
              <p style={{ ...P, marginTop: 6 }}>Find your API key on your dashboard. Replace <code style={Code}>YOUR_SLUG</code> with your product slug (e.g. <code style={Code}>cue-engine</code>).</p>
            </DocCard>

            <DocCard step="4" title="Embed the C++ SDK">
              <p style={P}>Copy <code style={Code}>PrimeLockLicense.h</code> and <code style={Code}>PrimeLockLicense.cpp</code> from the SDK folder into your JUCE project. Then verify the license at startup:</p>
              <pre style={{
                background: '#0f0f1a', border: '1px solid #141428', borderRadius: 10,
                padding: '16px', fontSize: 12, color: '#c8c8e0', fontFamily: 'monospace',
                margin: '12px 0 0', overflow: 'auto', lineHeight: 1.7,
                whiteSpace: 'pre',
              }}>{`PrimeLockLicense license(PUBLIC_KEY, PRODUCT_ID);

if (license.verify() != PrimeLockLicense::Valid) {
    showLicenseDialog();
}`}</pre>
              <p style={{ ...P, marginTop: 8 }}>The SDK verifies the RSA signature locally — no internet needed after activation.</p>
            </DocCard>

            <DocCard step="5" title="Need help?">
              <p style={P}>Email <a href="mailto:support@theprimis.org" style={{ color: '#F5A623', textDecoration: 'none' }}>support@theprimis.org</a> and we'll get back to you. Also check your <a href="/dashboard" style={{ color: '#F5A623', textDecoration: 'none' }}>developer dashboard</a> for your API key, product IDs, and issued licenses.</p>
            </DocCard>

          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #0f0f18',
        padding: '28px 64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/logo.png" alt="" style={{ width: 24, height: 24, borderRadius: 6 }} />
          <span style={{ fontSize: 13, color: '#333348', fontWeight: 600 }}>PrimeLock</span>
        </div>
        <p style={{ fontSize: 12, color: '#1e1e2e', margin: 0 }}>© 2026 PrimeLock · Powered by PRIMIS</p>
        <a href="mailto:support@theprimis.org" style={{ fontSize: 12, color: '#333348', textDecoration: 'none' }}>support@theprimis.org</a>
      </footer>
    </div>
  );
}

// ── Shared styles ─────────────────────────────────────────────────────────────
const P: React.CSSProperties = {
  fontSize: 14, color: '#888898', lineHeight: 1.75, margin: 0,
};

const Code: React.CSSProperties = {
  background: '#141428', padding: '2px 6px', borderRadius: 5,
  fontSize: 12, fontFamily: 'monospace', color: '#c8c8e0',
};

const DownloadBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 8,
  background: 'linear-gradient(135deg, #F5A623, #e8940f)',
  color: '#000', fontWeight: 700, fontSize: 13,
  padding: '10px 20px', borderRadius: 10, textDecoration: 'none',
};

function DocCard({ step, title, children }: { step: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: '#0f0f1a', border: '1px solid #141428',
      borderRadius: 18, padding: '24px 28px',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8, flexShrink: 0,
          background: 'linear-gradient(135deg, #F5A623, #e8940f)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 800, color: '#000',
        }}>{step}</div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: '0 0 10px', letterSpacing: '-0.2px' }}>
            {title}
          </h3>
          {children}
        </div>
      </div>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: '#F5A62308', border: '1px solid #F5A62320',
      borderRadius: 10, padding: '10px 14px', marginTop: 12,
      fontSize: 12, color: '#888070', lineHeight: 1.6,
    }}>
      💡 {children}
    </div>
  );
}
