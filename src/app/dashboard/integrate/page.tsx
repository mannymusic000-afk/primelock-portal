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
        <p style={{ fontSize: 15, color: '#555570', margin: '0 0 24px' }}>Your API key and everything you need to go live.</p>

        {/* PDF Guide banner */}
        <a href="/PrimeLock-Developer-Guide.pdf" target="_blank" rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
            background: 'linear-gradient(135deg, #F5A62312, #29C6D912)', border: '1px solid #F5A62330',
            borderRadius: 14, padding: '16px 20px', marginBottom: 40, textDecoration: 'none' }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#F5A623', margin: '0 0 2px' }}>📘 Developer Guide (PDF)</p>
            <p style={{ fontSize: 12, color: '#888070', margin: 0 }}>Complete walkthrough — setup, SDK, webhooks, pricing models, API reference.</p>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#000', background: 'linear-gradient(135deg, #F5A623, #e8940f)', padding: '9px 16px', borderRadius: 10, whiteSpace: 'nowrap' }}>⬇ Download</span>
        </a>

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

        {/* Subscriptions */}
        <ISection title="Subscriptions & Subscribe-to-Own" icon="🔄">
          <p style={P}>When a customer's recurring payment goes through, call the extend endpoint to push their expiry forward. When they've paid enough to own it, upgrade them to perpetual.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <p style={{ fontSize: 11, color: '#444460', textTransform: 'uppercase' as const, letterSpacing: '0.08em', margin: '0 0 6px' }}>Monthly renewal</p>
              <pre style={Pre}>{`POST https://api.primelock.theprimis.org/licenses/:id/extend
Authorization: Bearer YOUR_JWT_TOKEN

{ "days": 30 }`}</pre>
            </div>
            <div>
              <p style={{ fontSize: 11, color: '#444460', textTransform: 'uppercase' as const, letterSpacing: '0.08em', margin: '0 0 6px' }}>Subscribe-to-own threshold reached</p>
              <pre style={Pre}>{`POST https://api.primelock.theprimis.org/licenses/:id/extend
Authorization: Bearer YOUR_JWT_TOKEN

{ "upgrade_to_perpetual": true }`}</pre>
            </div>
          </div>
          <Note>PrimeLock emails the customer automatically on both actions — renewal confirmation or ownership upgrade.</Note>
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
          <p style={P}>Download the SDK and copy <code style={Code}>PrimeLockLicense.h</code> and <code style={Code}>PrimeLockLicense.cpp</code> into your JUCE project. Get your Product ID and Public Key from the product page, then verify at startup:</p>
          <a href="https://github.com/mannymusic000-afk/primelock-sdk" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#141428', border: '1px solid #1e1e36', color: '#e8e8f0', fontSize: 13, fontWeight: 600, padding: '10px 18px', borderRadius: 10, textDecoration: 'none', marginBottom: 14 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1C3.69 1 1 3.69 1 7c0 2.65 1.72 4.9 4.1 5.69.3.06.41-.13.41-.29v-1.02c-1.67.36-2.02-.8-2.02-.8-.27-.69-.67-.87-.67-.87-.55-.37.04-.36.04-.36.6.04.92.62.92.62.54.92 1.41.65 1.75.5.05-.39.21-.65.38-.8-1.33-.15-2.73-.67-2.73-2.96 0-.65.23-1.19.62-1.6-.06-.15-.27-.76.06-1.58 0 0 .51-.16 1.66.62A5.8 5.8 0 0 1 7 4.82c.51 0 1.03.07 1.51.2 1.15-.78 1.66-.62 1.66-.62.33.82.12 1.43.06 1.58.38.41.62.95.62 1.6 0 2.3-1.4 2.8-2.74 2.95.22.19.41.56.41 1.13v1.67c0 .16.11.35.41.29C11.28 11.9 13 9.65 13 7c0-3.31-2.69-6-6-6Z" fill="currentColor"/></svg>
            github.com/mannymusic000-afk/primelock-sdk
          </a>
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
