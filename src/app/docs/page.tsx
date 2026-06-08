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
        <p style={{ fontSize: 12, color: '#444460', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: 12 }}>
          Documentation
        </p>
        <h1 style={{ fontSize: 40, fontWeight: 900, color: '#fff', letterSpacing: '-1px', margin: '0 0 16px' }}>
          How PrimeLock works
        </h1>
        <p style={{ fontSize: 16, color: '#555570', margin: '0 auto', maxWidth: 480, lineHeight: 1.7 }}>
          Whether you're a customer activating your software or a developer protecting yours — we've got you covered.
        </p>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 40px 80px' }}>

        {/* ── FOR CUSTOMERS ── */}
        <Section icon="👤" title="For Customers" subtitle="I bought a plugin or app and need to activate it">

          <DocCard step="1" title="Download the License Manager">
            <p style={P}>The PrimeLock License Manager is a free desktop app. It holds all your software licenses in one place — no license keys to keep track of.</p>
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <a href="https://github.com/mannymusic000-afk/primelock-portal/releases/download/v1.0.0/PrimeLock.Manager_1.0.0_x64.dmg"
                style={DownloadBtn}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1V9M4 7L7 10L10 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12H12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                Download for Mac
              </a>
              <div style={{ display: 'inline-flex', alignItems: 'center', background: '#141428', border: '1px solid #1e1e36', color: '#333348', fontSize: 13, padding: '10px 20px', borderRadius: 10 }}>
                Windows — coming soon
              </div>
            </div>
          </DocCard>

          <DocCard step="2" title="Sign in with your purchase email">
            <p style={P}>Open the app and enter the email you used at checkout. You'll receive a 6-digit code — enter it to see all your licenses instantly.</p>
            <Note>The code expires in 10 minutes. Check your spam folder if you don't see it.</Note>
          </DocCard>

          <DocCard step="3" title="Activate on this machine">
            <p style={P}>Click <strong style={{ color: '#F5A623' }}>+ Activate Here</strong> on any license. Your software is immediately unlocked on this machine.</p>
          </DocCard>

          <DocCard step="4" title="Moving to a new machine?">
            <p style={P}>Click <strong style={{ color: '#F5A623' }}>Transfer Machine</strong> on your license. This frees up your seat so you can activate on a different machine.</p>
            <Note>You can always sign in on any machine and reactivate — as long as you have available seats.</Note>
          </DocCard>

        </Section>

        {/* Divider */}
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #1e1e36, transparent)', margin: '56px 0' }} />

        {/* ── FOR DEVELOPERS ── */}
        <Section icon="⚙️" title="For Developers" subtitle="I want to protect and sell my software using PrimeLock">

          <DocCard step="1" title="Create a free account">
            <p style={P}>
              Sign up at{' '}
              <Link href="/register" style={{ color: '#F5A623', textDecoration: 'none' }}>
                portal.primelock.theprimis.org/register
              </Link>
              . Free accounts include 1 product and 50 licenses per month — enough to get started.
            </p>
          </DocCard>

          <DocCard step="2" title="Register your product">
            <p style={P}>From your dashboard, click <strong style={{ color: '#e8e8f0' }}>+ Add Product</strong>. PrimeLock automatically generates a unique RSA keypair for your product. The private key never leaves our servers.</p>
          </DocCard>

          <DocCard step="3" title="Connect your store & go live">
            <p style={P}>Everything you need to connect your store, embed the SDK, and go live is inside your <Link href="/dashboard" style={{ color: '#F5A623', textDecoration: 'none' }}>developer dashboard</Link> — including your webhook URLs, API key, and integration guide.</p>
            <div style={{ marginTop: 16 }}>
              <Link href="/login" style={DownloadBtn}>
                Go to Dashboard →
              </Link>
            </div>
          </DocCard>

          <DocCard step="4" title="Full Developer Guide (PDF)">
            <p style={P}>Prefer a complete walkthrough? Download the detailed developer guide — covering setup, the SDK, webhooks, pricing models, and the full API reference.</p>
            <div style={{ marginTop: 16 }}>
              <a href="/PrimeLock-Developer-Guide.pdf" target="_blank" rel="noopener noreferrer" style={{ ...DownloadBtn, background: '#141428', border: '1px solid #1e1e36', color: '#e8e8f0' }}>
                ⬇ Download PDF Guide
              </a>
            </div>
          </DocCard>

        </Section>

        {/* Support */}
        <div style={{
          marginTop: 56, textAlign: 'center',
          background: '#0f0f1a', border: '1px solid #141428',
          borderRadius: 20, padding: '40px 32px',
        }}>
          <p style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>Need help?</p>
          <p style={{ fontSize: 14, color: '#555570', margin: '0 0 20px' }}>
            Our team is available to help you get set up.
          </p>
          <a href="mailto:support@theprimis.org" style={{
            ...DownloadBtn,
            background: '#141428',
            border: '1px solid #1e1e36',
            color: '#888898',
          }}>
            support@theprimis.org
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #0f0f18', padding: '28px 64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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

// ── Helpers ───────────────────────────────────────────────────────────────────
function Section({ icon, title, subtitle, children }: { icon: string; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12, flexShrink: 0,
          background: '#F5A62315', border: '1px solid #F5A62330',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
        }}>{icon}</div>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>{title}</h2>
          <p style={{ fontSize: 13, color: '#444460', margin: '3px 0 0' }}>{subtitle}</p>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {children}
      </div>
    </div>
  );
}

function DocCard({ step, title, children }: { step: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#0f0f1a', border: '1px solid #141428', borderRadius: 18, padding: '24px 28px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8, flexShrink: 0,
          background: 'linear-gradient(135deg, #F5A623, #e8940f)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 800, color: '#000',
        }}>{step}</div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: '0 0 10px', letterSpacing: '-0.2px' }}>{title}</h3>
          {children}
        </div>
      </div>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#F5A62308', border: '1px solid #F5A62320', borderRadius: 10, padding: '10px 14px', marginTop: 12, fontSize: 12, color: '#888070', lineHeight: 1.6 }}>
      💡 {children}
    </div>
  );
}

const P: React.CSSProperties = { fontSize: 14, color: '#888898', lineHeight: 1.75, margin: 0 };

const DownloadBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 8,
  background: 'linear-gradient(135deg, #F5A623, #e8940f)',
  color: '#000', fontWeight: 700, fontSize: 13,
  padding: '10px 20px', borderRadius: 10, textDecoration: 'none',
};
