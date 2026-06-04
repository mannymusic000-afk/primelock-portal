import Link from 'next/link';

export default function LandingPage() {
  return (
    <div style={{ background: '#07070f', color: '#e8e8f0', minHeight: '100vh', fontFamily: "'SF Pro Display', 'Inter', system-ui, sans-serif" }}>

      {/* ── NAV ── */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 64px', borderBottom: '1px solid #0f0f1e' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/logo.png" alt="PrimeLock" style={{ width: 36, height: 36, borderRadius: 10 }} />
          <span style={{ fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>PrimeLock</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <a href="#features" style={{ fontSize: 14, color: '#555570', textDecoration: 'none' }}>Features</a>
          <a href="#pricing" style={{ fontSize: 14, color: '#555570', textDecoration: 'none' }}>Pricing</a>
          <a href="#docs" style={{ fontSize: 14, color: '#555570', textDecoration: 'none' }}>Docs</a>
          <Link href="/login" style={{
            fontSize: 14, color: '#555570', textDecoration: 'none',
          }}>Sign in</Link>
          <Link href="/register" style={{
            background: 'linear-gradient(135deg, #F5A623, #e8940f)',
            color: '#000', fontWeight: 700, fontSize: 14,
            padding: '10px 20px', borderRadius: 10, textDecoration: 'none',
          }}>
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ textAlign: 'center', padding: '100px 64px 80px', maxWidth: 800, margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: '#F5A62312', border: '1px solid #F5A62330',
          borderRadius: 20, padding: '6px 16px', marginBottom: 32,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F5A623', display: 'inline-block' }} />
          <span style={{ fontSize: 12, color: '#F5A623', fontWeight: 600 }}>Now in public beta</span>
        </div>

        <h1 style={{ fontSize: 60, fontWeight: 900, color: '#fff', letterSpacing: '-2px', lineHeight: 1.05, margin: '0 0 24px' }}>
          Software licensing<br />
          <span style={{ background: 'linear-gradient(135deg, #F5A623, #29C6D9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            built for developers
          </span>
        </h1>

        <p style={{ fontSize: 20, color: '#555570', lineHeight: 1.7, marginBottom: 48, maxWidth: 560, margin: '0 auto 48px' }}>
          RSA-signed license keys, machine activation, automatic delivery — everything you need to protect and sell your software.
        </p>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" style={{
            background: 'linear-gradient(135deg, #F5A623, #e8940f)',
            color: '#000', fontWeight: 700, fontSize: 16,
            padding: '16px 36px', borderRadius: 14, textDecoration: 'none',
            display: 'inline-block',
          }}>
            Start for free →
          </Link>
          <a href="#docs" style={{
            background: '#0f0f1a', border: '1px solid #1e1e36',
            color: '#888898', fontWeight: 600, fontSize: 16,
            padding: '16px 36px', borderRadius: 14, textDecoration: 'none',
            display: 'inline-block',
          }}>
            View the docs
          </a>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: '80px 64px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <p style={{ fontSize: 12, color: '#444460', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>What you get</p>
          <h2 style={{ fontSize: 40, fontWeight: 800, color: '#fff', letterSpacing: '-1px', margin: 0 }}>Everything in one place</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {[
            {
              icon: '🔐',
              title: 'RSA-Signed Licenses',
              desc: 'Every product gets its own RSA-2048 keypair. Tokens are signed server-side and verified locally — no internet needed after activation.',
            },
            {
              icon: '💻',
              title: 'Machine Activation',
              desc: 'Customers activate on up to N machines. Deactivate and move seats any time. Full control from the License Manager app.',
            },
            {
              icon: '📧',
              title: 'Automatic Delivery',
              desc: 'License keys are emailed to customers instantly on purchase. Works with Selar and Flutterwave webhooks out of the box.',
            },
            {
              icon: '🪝',
              title: 'Webhook Integration',
              desc: 'Connect your Selar or Flutterwave store. PrimeLock auto-issues keys the moment a sale is confirmed.',
            },
            {
              icon: '🖥️',
              title: 'License Manager App',
              desc: 'A native Mac and Windows desktop app for your customers. Email sign-in, one-click activation, clean interface.',
            },
            {
              icon: '🧩',
              title: 'C/C++ SDK',
              desc: 'Drop the PrimeLock SDK into your JUCE or native plugin. Verifies the signed token in milliseconds at startup.',
            },
          ].map(f => (
            <div key={f.title} style={{
              background: '#0f0f1a', border: '1px solid #141428',
              borderRadius: 20, padding: '28px 28px',
            }}>
              <div style={{ fontSize: 28, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#fff', margin: '0 0 10px', letterSpacing: '-0.3px' }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: '#444460', lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding: '80px 64px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <p style={{ fontSize: 12, color: '#444460', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Pricing</p>
          <h2 style={{ fontSize: 40, fontWeight: 800, color: '#fff', letterSpacing: '-1px', margin: '0 0 12px' }}>Simple, transparent pricing</h2>
          <p style={{ fontSize: 16, color: '#444460', margin: 0 }}>Start free. Scale as you grow.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            {
              name: 'Free',
              price: '$0',
              per: 'forever',
              features: ['1 product', '50 licenses/mo', 'Email delivery', 'License Manager app'],
              cta: 'Get started',
              highlight: false,
            },
            {
              name: 'Indie',
              price: '$9',
              per: 'per month',
              features: ['3 products', '500 licenses/mo', 'Webhook integration', 'Priority support'],
              cta: 'Start free trial',
              highlight: false,
            },
            {
              name: 'Studio',
              price: '$29',
              per: 'per month',
              features: ['10 products', '2,000 licenses/mo', 'Custom branding', 'API access'],
              cta: 'Start free trial',
              highlight: true,
            },
            {
              name: 'Label',
              price: '$79',
              per: 'per month',
              features: ['Unlimited products', '10,000 licenses/mo', 'White-label SDK', 'Dedicated support'],
              cta: 'Contact us',
              highlight: false,
            },
          ].map(p => (
            <div key={p.name} style={{
              background: p.highlight ? 'linear-gradient(135deg, #F5A62315, #29C6D915)' : '#0f0f1a',
              border: `1px solid ${p.highlight ? '#F5A62340' : '#141428'}`,
              borderRadius: 20, padding: '28px 24px',
              position: 'relative',
            }}>
              {p.highlight && (
                <div style={{
                  position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #F5A623, #e8940f)',
                  color: '#000', fontSize: 11, fontWeight: 700,
                  padding: '4px 14px', borderRadius: 20,
                }}>
                  Most Popular
                </div>
              )}
              <p style={{ fontSize: 13, color: '#555570', margin: '0 0 8px', fontWeight: 600 }}>{p.name}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                <span style={{ fontSize: 36, fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>{p.price}</span>
                <span style={{ fontSize: 12, color: '#444460' }}>{p.per}</span>
              </div>
              <div style={{ height: 1, background: '#141428', margin: '20px 0' }} />
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {p.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#888898' }}>
                    <span style={{ color: '#F5A623', fontWeight: 700 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" style={{
                display: 'block', textAlign: 'center',
                background: p.highlight ? 'linear-gradient(135deg, #F5A623, #e8940f)' : '#141428',
                border: p.highlight ? 'none' : '1px solid #1e1e36',
                color: p.highlight ? '#000' : '#888898',
                fontWeight: 700, fontSize: 13,
                padding: '11px', borderRadius: 10, textDecoration: 'none',
              }}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '80px 64px', textAlign: 'center' }}>
        <div style={{
          maxWidth: 600, margin: '0 auto',
          background: 'linear-gradient(135deg, #F5A62310, #29C6D910)',
          border: '1px solid #F5A62325',
          borderRadius: 28, padding: '60px 48px',
        }}>
          <img src="/logo.png" alt="" style={{ width: 56, height: 56, borderRadius: 14, marginBottom: 24 }} />
          <h2 style={{ fontSize: 36, fontWeight: 900, color: '#fff', letterSpacing: '-1px', margin: '0 0 16px' }}>
            Ready to protect your software?
          </h2>
          <p style={{ fontSize: 16, color: '#555570', margin: '0 0 36px', lineHeight: 1.7 }}>
            Get started in minutes. No credit card required.
          </p>
          <Link href="/register" style={{
            background: 'linear-gradient(135deg, #F5A623, #e8940f)',
            color: '#000', fontWeight: 800, fontSize: 16,
            padding: '16px 40px', borderRadius: 14, textDecoration: 'none',
            display: 'inline-block',
          }}>
            Create your free account →
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid #0f0f1e', padding: '32px 64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/logo.png" alt="" style={{ width: 24, height: 24, borderRadius: 6 }} />
          <span style={{ fontSize: 13, color: '#333348', fontWeight: 600 }}>PrimeLock</span>
        </div>
        <p style={{ fontSize: 12, color: '#222234', margin: 0 }}>
          © 2026 PrimeLock · Powered by PRIMIS
        </p>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link href="/login" style={{ fontSize: 12, color: '#333348', textDecoration: 'none' }}>Developer Portal</Link>
          <a href="mailto:support@theprimis.org" style={{ fontSize: 12, color: '#333348', textDecoration: 'none' }}>Support</a>
        </div>
      </footer>
    </div>
  );
}
