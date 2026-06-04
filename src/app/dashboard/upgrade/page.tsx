'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth';

const PLANS = [
  {
    key: 'indie',
    name: 'Indie',
    price: 9,
    products: 3,
    licenses: 500,
    features: ['3 products', '500 licenses/month', 'Webhook integration', 'Email delivery', 'Priority support'],
  },
  {
    key: 'studio',
    name: 'Studio',
    price: 29,
    products: 10,
    licenses: 2000,
    highlight: true,
    features: ['10 products', '2,000 licenses/month', 'Webhook integration', 'Email delivery', 'API access', 'Custom branding'],
  },
  {
    key: 'label',
    name: 'Label',
    price: 79,
    products: 999,
    licenses: 10000,
    features: ['Unlimited products', '10,000 licenses/month', 'Webhook integration', 'White-label SDK', 'Dedicated support'],
  },
];

declare global {
  interface Window {
    FlutterwaveCheckout: (config: Record<string, unknown>) => void;
  }
}

export default function UpgradePage() {
  const { developer, token, loading } = useAuth();
  const router = useRouter();
  const [paying, setPaying] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !developer) router.replace('/login');
    // Load Flutterwave inline script
    const script = document.createElement('script');
    script.src = 'https://checkout.flutterwave.com/v3.js';
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, [developer, loading]);

  const handleUpgrade = (planKey: string, price: number, planName: string) => {
    if (!developer) return;
    setPaying(planKey);

    window.FlutterwaveCheckout({
      public_key: process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY ?? '',
      tx_ref:     `primelock_${planKey}_${developer.id}_${Date.now()}`,
      amount:     price,
      currency:   'USD',
      payment_options: 'card',
      customer: {
        email: developer.email,
        name:  developer.name,
      },
      customizations: {
        title:       'PrimeLock',
        description: `${planName} Plan — Monthly Subscription`,
        logo:        'https://primelock.theprimis.org/logo.png',
      },
      callback: (response: { status: string }) => {
        if (response.status === 'successful') {
          // Reload page to reflect new plan (webhook will have updated it)
          setTimeout(() => { window.location.href = '/dashboard?upgraded=1'; }, 1500);
        }
        setPaying(null);
      },
      onclose: () => setPaying(null),
    });
  };

  const currentPlan = developer?.plan ?? 'free';

  return (
    <div style={{ minHeight: '100vh', background: '#07070f', color: '#e8e8f0', fontFamily: "'SF Pro Display', 'Inter', system-ui, sans-serif" }}>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #0f0f1e', padding: '18px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/logo.png" alt="PrimeLock" style={{ width: 32, height: 32, borderRadius: 8 }} />
          <span style={{ fontWeight: 800, color: '#fff', fontSize: 16 }}>PrimeLock</span>
        </div>
        <Link href="/dashboard" style={{ fontSize: 13, color: '#444460', textDecoration: 'none' }}>
          ← Back to dashboard
        </Link>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: '#fff', letterSpacing: '-1px', margin: '0 0 12px' }}>
            Upgrade your plan
          </h1>
          <p style={{ fontSize: 16, color: '#444460', margin: 0 }}>
            You're currently on the <strong style={{ color: '#F5A623' }}>
              {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
            </strong> plan.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {PLANS.map(plan => {
            const isCurrent = currentPlan === plan.key;
            return (
              <div key={plan.key} style={{
                background: plan.highlight ? 'linear-gradient(135deg, #F5A62310, #29C6D910)' : '#0f0f1a',
                border: `1px solid ${plan.highlight ? '#F5A62340' : '#141428'}`,
                borderRadius: 20, padding: '28px 24px',
                position: 'relative',
              }}>
                {plan.highlight && (
                  <div style={{
                    position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #F5A623, #e8940f)',
                    color: '#000', fontSize: 11, fontWeight: 700,
                    padding: '4px 14px', borderRadius: 20, whiteSpace: 'nowrap',
                  }}>
                    Most Popular
                  </div>
                )}

                <p style={{ fontSize: 14, fontWeight: 700, color: '#888898', margin: '0 0 6px' }}>{plan.name}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 20 }}>
                  <span style={{ fontSize: 40, fontWeight: 900, color: '#fff', letterSpacing: '-2px' }}>${plan.price}</span>
                  <span style={{ fontSize: 13, color: '#444460' }}>/month</span>
                </div>

                <div style={{ height: 1, background: '#141428', marginBottom: 20 }} />

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#888898' }}>
                      <span style={{ color: '#F5A623', fontWeight: 700, flexShrink: 0 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <div style={{
                    textAlign: 'center', padding: '11px', borderRadius: 10,
                    background: '#141428', border: '1px solid #1e1e36',
                    fontSize: 13, color: '#444460', fontWeight: 600,
                  }}>
                    Current plan
                  </div>
                ) : (
                  <button
                    onClick={() => handleUpgrade(plan.key, plan.price, plan.name)}
                    disabled={paying === plan.key}
                    style={{
                      width: '100%', padding: '12px', borderRadius: 10, border: 'none',
                      background: plan.highlight ? 'linear-gradient(135deg, #F5A623, #e8940f)' : '#141428',
                      color: plan.highlight ? '#000' : '#888898',
                      fontWeight: 700, fontSize: 13, cursor: paying ? 'wait' : 'pointer',
                      opacity: paying && paying !== plan.key ? 0.5 : 1,
                    }}
                  >
                    {paying === plan.key ? 'Opening checkout…' : `Upgrade to ${plan.name}`}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#2a2a3a', marginTop: 32 }}>
          Payments processed securely. Cancel anytime by contacting{' '}
          <a href="mailto:support@theprimis.org" style={{ color: '#444460' }}>support@theprimis.org</a>
        </p>
      </div>
    </div>
  );
}
