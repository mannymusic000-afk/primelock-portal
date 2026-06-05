'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/auth';

export default function IntegratePage() {
  const { developer } = useAuth();
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(null), 1800);
  };

  const apiKey     = developer?.api_key ?? 'PL-your-api-key';
  const selarUrl   = `https://api.primelock.theprimis.org/webhooks/selar?api_key=${apiKey}&product=YOUR_PRODUCT_SLUG`;
  const flwUrl     = `https://api.primelock.theprimis.org/webhooks/flutterwave?api_key=${apiKey}&product=YOUR_PRODUCT_SLUG`;
  const genericUrl = `https://api.primelock.theprimis.org/webhooks/generic?api_key=${apiKey}&product=YOUR_PRODUCT_SLUG`;

  return (
    <div style={{ minHeight: '100vh', background: '#07070f', color: '#e8e8f0', fontFamily: "'SF Pro Display', 'Inter', system-ui, sans-serif" }}>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #0f0f1e', padding: '18px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/logo.png" alt="PrimeLock" style={{ width: 32, height: 32, borderRadius: 8 }} />
          <span style={{ fontWeight: 800, color: '#fff', fontSize: 16 }}>PrimeLock</span>
        </div>
        <Link href="/dashboard" style={{ fontSize: 13, color: '#555570', textDecoration: 'none' }}>← Back to dashboard</Link>
      </nav>

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '48px 40px' }}>
        <p style={{ fontSize: 12, color: '#444460', textTransform: 'uppercase' as const, letterSpacing: '0.1em', margin: '0 0 10px' }}>Integration Guide</p>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#fff', letterSpacing: '-1px', margin: '0 0 8px' }}>Set up PrimeLock</h1>
        <p style={{ fontSize: 15, color: '#555570', margin: '0 0 48px' }}>Your API key and everything you need to go live.</p>

        {/* API Key */}
        <ISection title="Your API Key" icon="🔑">
          <p style={P}>Use this key in your webhook URLs so PrimeLock knows which account to issue licenses for.</p>
          <CopyBox label="API Key" value={apiKey} copied={copied === 'api'} onCopy={() => copy('api', apiKey)} />
        </ISection>

        {/* Selar */}
        <ISection title="Selar Webhook" icon="🛒">
          <p style={P}>In your Selar product settings, go to <strong style={{ color: '#e8e8f0' }}>Webhook</strong> and paste this URL. Replace <code style={Code}>YOUR_PRODUCT_SLUG</code> with your product slug (e.g. <code style={Code}>cue-engine</code>).</p>
          <CopyBox label="Selar Webhook URL" value={selarUrl} copied={copied === 'selar'} onCopy={() => copy('selar', selarUrl)} />
          <Note>When a sale is confirmed, Selar pings this URL → PrimeLock issues a signed license key → emails it to the buyer automatically.</Note>
        </ISection>

        {/* Flutterwave */}
        <ISection title="Flutterwave Webhook" icon="💳">
          <p style={P}>In Flutterwave → Settings → Webhooks, paste this URL. Replace <code style={Code}>YOUR_PRODUCT_SLUG</code> with your product slug.</p>
          <CopyBox label="Flutterwave Webhook URL" value={flwUrl} copied={copied === 'flw'} onCopy={() => copy('flw', flwUrl)} />
          <Note>Also copy the Webhook Hash from Flutterwave and add it to your Render environment as <code style={Code}>FLW_WEBHOOK_HASH</code>.</Note>
        </ISection>

        {/* Generic */}
        <ISection title="Any Other Platform" icon="🌐">
          <p style={P}>Using Gumroad, Paystack, Stripe, or anything else? Use the generic webhook. Configure your platform to send a POST request to this URL when a sale is confirmed:</p>
          <CopyBox label="Generic Webhook URL" value={genericUrl} copied={copied === 'generic'} onCopy={() => copy('generic', genericUrl)} />
          <p style={{ ...P, marginTop: 12 }}>Your platform must send a JSON body with at least <code style={Code}>customer_email</code>:</p>
          <pre style={Pre}>{`// Minimum required
{
  "customer_email": "buyer@example.com",
  "customer_name":  "John Doe",    // optional
  "order_id":       "order-123"    // optional, used for dedup
}`}</pre>
          <Note>PrimeLock will issue the license key and email it to the customer automatically — regardless of which platform triggered it.</Note>
        </ISection>

        {/* SDK */}
        <ISection title="C++ / JUCE SDK" icon="🧩">
          <p style={P}>Copy <code style={Code}>PrimeLockLicense.h</code> and <code style={Code}>PrimeLockLicense.cpp</code> from the SDK folder into your JUCE project. Get your Product ID and Public Key from the product page, then verify at startup:</p>
          <pre style={Pre}>{`#include "PrimeLockLicense.h"

const char* PUBLIC_KEY = "-----BEGIN PUBLIC KEY-----\\n...\\n-----END PUBLIC KEY-----";
const char* PRODUCT_ID = "your-product-uuid";

PrimeLockLicense license(PUBLIC_KEY, PRODUCT_ID);

if (license.verify() != PrimeLockLicense::Valid) {
    showLicenseDialog(); // show activation prompt
}`}</pre>
          <Note>The SDK verifies RSA signatures locally — no internet needed after the customer activates.</Note>
        </ISection>

        {/* SDK Status codes */}
        <ISection title="License Status Codes" icon="📋">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { status: 'Valid', color: '#29C6D9', desc: 'License is active on this machine.' },
              { status: 'NotFound', color: '#F5A623', desc: 'No token found — show activation screen.' },
              { status: 'Expired', color: '#f87171', desc: 'Subscription has lapsed.' },
              { status: 'Invalid', color: '#f87171', desc: 'Signature check failed — tampered token.' },
            ].map(s => (
              <div key={s.status} style={{ background: '#080810', border: '1px solid #141420', borderRadius: 12, padding: '14px 16px' }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: `${s.color}15`, border: `1px solid ${s.color}30`, color: s.color }}>
                  {s.status}
                </span>
                <p style={{ fontSize: 12, color: '#555570', margin: '8px 0 0', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </ISection>

        {/* Support */}
        <div style={{ marginTop: 48, textAlign: 'center', background: '#0f0f1a', border: '1px solid #141428', borderRadius: 20, padding: '36px' }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: '0 0 6px' }}>Need help integrating?</p>
          <p style={{ fontSize: 14, color: '#555570', margin: '0 0 16px' }}>We'll walk you through it.</p>
          <a href="mailto:support@theprimis.org" style={{ color: '#F5A623', fontSize: 14, textDecoration: 'none', fontWeight: 600 }}>
            support@theprimis.org
          </a>
        </div>
      </div>
    </div>
  );
}

function ISection({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.3px' }}>{title}</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {children}
      </div>
    </div>
  );
}

function CopyBox({ label, value, copied, onCopy }: { label: string; value: string; copied: boolean; onCopy: () => void }) {
  return (
    <div style={{ background: '#0f0f1a', border: '1px solid #141428', borderRadius: 12, padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 10, color: '#444460', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>{label}</span>
        <button onClick={onCopy} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: copied ? '#29C6D9' : '#444460', fontWeight: 600 }}>
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <p style={{ fontSize: 12, color: '#c8c8e0', fontFamily: 'monospace', margin: 0, wordBreak: 'break-all', lineHeight: 1.6 }}>{value}</p>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#F5A62308', border: '1px solid #F5A62320', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#888070', lineHeight: 1.6 }}>
      💡 {children}
    </div>
  );
}

const P: React.CSSProperties = { fontSize: 14, color: '#888898', lineHeight: 1.75, margin: 0 };
const Code: React.CSSProperties = { background: '#141428', padding: '2px 6px', borderRadius: 5, fontSize: 12, fontFamily: 'monospace', color: '#c8c8e0' };
const Pre: React.CSSProperties = { background: '#0f0f1a', border: '1px solid #141428', borderRadius: 10, padding: '16px', fontSize: 12, color: '#c8c8e0', fontFamily: 'monospace', margin: 0, overflow: 'auto', lineHeight: 1.7, whiteSpace: 'pre' };
