'use client';

import { useState } from 'react';

export default function OfflineActivationPage() {
  const [licenseKey, setLicenseKey] = useState('');
  const [challengeCode, setChallengeCode] = useState('');
  const [responseCode, setResponseCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResponseCode(null);
    setLoading(true);

    try {
      const res = await fetch('https://api.primelock.theprimis.org/licenses/offline/response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          license_key: licenseKey.trim().toUpperCase(),
          challenge_code: challengeCode.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.');
      } else {
        setResponseCode(data.response_code);
      }
    } catch {
      setError('Could not reach the server. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!responseCode) return;
    try {
      await navigator.clipboard.writeText(responseCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = responseCode;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  return (
    <div style={{
      background: '#07070f',
      color: '#e8e8f0',
      minHeight: '100vh',
      fontFamily: "'SF Pro Display', 'Inter', system-ui, sans-serif",
    }}>

      {/* ── NAV ── */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '24px 64px', borderBottom: '1px solid #0f0f1e',
      }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <img src="/logo.png" alt="PrimeLock" style={{ width: 36, height: 36, borderRadius: 10 }} />
          <span style={{ fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>PrimeLock</span>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <a href="/#features" style={{ fontSize: 14, color: '#555570', textDecoration: 'none' }}>Features</a>
          <a href="/#pricing" style={{ fontSize: 14, color: '#555570', textDecoration: 'none' }}>Pricing</a>
          <a href="/docs" style={{ fontSize: 14, color: '#555570', textDecoration: 'none' }}>Docs</a>
          <a href="/login" style={{ fontSize: 14, color: '#555570', textDecoration: 'none' }}>Sign in</a>
          <a href="/register" style={{
            background: 'linear-gradient(135deg, #F5A623, #e8940f)',
            color: '#000', fontWeight: 700, fontSize: 14,
            padding: '10px 20px', borderRadius: 10, textDecoration: 'none',
          }}>
            Get Started Free
          </a>
        </div>
      </nav>

      {/* ── MAIN ── */}
      <main style={{
        maxWidth: 560, margin: '0 auto',
        padding: '80px 24px 120px',
      }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#29C6D912', border: '1px solid #29C6D930',
            borderRadius: 20, padding: '6px 16px', marginBottom: 24,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#29C6D9', display: 'inline-block' }} />
            <span style={{ fontSize: 12, color: '#29C6D9', fontWeight: 600 }}>No internet required on the target machine</span>
          </div>

          <h1 style={{ fontSize: 40, fontWeight: 900, color: '#fff', letterSpacing: '-1.5px', margin: '0 0 16px' }}>
            Offline Activation
          </h1>
          <p style={{ fontSize: 16, color: '#555570', lineHeight: 1.7, margin: 0 }}>
            Use this page to activate your software on a machine without internet access.
            Enter your license key and the challenge code shown in the License Manager app.
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: '#0f0f1a', border: '1px solid #141428',
          borderRadius: 24, padding: '40px',
        }}>

          {responseCode ? (
            /* ── Step 2: Show response code ── */
            <div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: '#16a34a20', border: '1px solid #16a34a40',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20,
                }}>
                  ✓
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, color: '#fff', fontSize: 18 }}>Response Code Ready</p>
                  <p style={{ margin: 0, fontSize: 13, color: '#555570', marginTop: 2 }}>Copy and paste this into the License Manager app</p>
                </div>
              </div>

              {/* Response code box */}
              <div style={{
                background: '#0a1a0f', border: '1px solid #16a34a40',
                borderRadius: 16, padding: '24px',
                marginBottom: 20,
              }}>
                <p style={{
                  fontFamily: 'monospace', fontSize: 13,
                  color: '#4ade80', wordBreak: 'break-all',
                  margin: 0, lineHeight: 1.8,
                  userSelect: 'text',
                }}>
                  {responseCode}
                </p>
              </div>

              {/* Copy button */}
              <button
                onClick={handleCopy}
                style={{
                  width: '100%',
                  background: copied
                    ? 'linear-gradient(135deg, #16a34a, #15803d)'
                    : 'linear-gradient(135deg, #F5A623, #e8940f)',
                  color: '#000', fontWeight: 700, fontSize: 15,
                  padding: '14px', borderRadius: 12, border: 'none',
                  cursor: 'pointer', transition: 'background 0.2s',
                  marginBottom: 24,
                }}
              >
                {copied ? '✓ Copied to clipboard!' : 'Copy Response Code'}
              </button>

              {/* Instructions */}
              <div style={{
                background: '#F5A62308', border: '1px solid #F5A62320',
                borderRadius: 12, padding: '16px 20px',
                marginBottom: 16,
              }}>
                <p style={{ margin: 0, fontSize: 13, color: '#888898', lineHeight: 1.7 }}>
                  <strong style={{ color: '#F5A623' }}>How to use:</strong>{' '}
                  Copy the code above and paste it into the "Enter Response Code" field
                  in the License Manager app on your offline machine. Then click Activate.
                </p>
              </div>

              <p style={{ fontSize: 12, color: '#333348', margin: 0, textAlign: 'center' }}>
                This code expires in 48 hours. Each code can only be used once.
              </p>

              {/* Start over */}
              <button
                onClick={() => { setResponseCode(null); setLicenseKey(''); setChallengeCode(''); }}
                style={{
                  display: 'block', width: '100%', marginTop: 20,
                  background: 'transparent', border: '1px solid #1e1e36',
                  color: '#555570', fontWeight: 600, fontSize: 13,
                  padding: '12px', borderRadius: 10, cursor: 'pointer',
                }}
              >
                Activate another machine
              </button>
            </div>
          ) : (
            /* ── Step 1: Enter details ── */
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#888898', marginBottom: 8 }}>
                  License Key
                </label>
                <input
                  type="text"
                  value={licenseKey}
                  onChange={e => setLicenseKey(e.target.value.toUpperCase())}
                  placeholder="PL-XXXX-XXXX-XXXX-XXXX"
                  required
                  spellCheck={false}
                  autoComplete="off"
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    background: '#07070f', border: '1px solid #1e1e36',
                    borderRadius: 10, padding: '13px 16px',
                    fontSize: 15, color: '#F5A623',
                    fontFamily: 'monospace', letterSpacing: '0.05em',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: 32 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#888898', marginBottom: 8 }}>
                  Challenge Code
                </label>
                <textarea
                  value={challengeCode}
                  onChange={e => setChallengeCode(e.target.value)}
                  placeholder="Paste the challenge code from the License Manager app"
                  required
                  rows={4}
                  spellCheck={false}
                  autoComplete="off"
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    background: '#07070f', border: '1px solid #1e1e36',
                    borderRadius: 10, padding: '13px 16px',
                    fontSize: 13, color: '#e8e8f0',
                    fontFamily: 'monospace',
                    outline: 'none', resize: 'vertical',
                    lineHeight: 1.6,
                  }}
                />
              </div>

              {error && (
                <div style={{
                  background: '#7f1d1d20', border: '1px solid #7f1d1d60',
                  borderRadius: 10, padding: '12px 16px',
                  marginBottom: 20,
                }}>
                  <p style={{ margin: 0, fontSize: 13, color: '#fca5a5' }}>{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  background: loading
                    ? '#333348'
                    : 'linear-gradient(135deg, #F5A623, #e8940f)',
                  color: loading ? '#555570' : '#000',
                  fontWeight: 700, fontSize: 15,
                  padding: '14px', borderRadius: 12, border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                {loading ? 'Generating...' : 'Generate Response Code'}
              </button>
            </form>
          )}
        </div>

        {/* Help text */}
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <p style={{ fontSize: 13, color: '#333348', margin: '0 0 8px' }}>
            Need help?{' '}
            <a href="mailto:support@theprimis.org" style={{ color: '#555570', textDecoration: 'none' }}>
              Contact support
            </a>
          </p>
          <p style={{ fontSize: 12, color: '#222234', margin: 0 }}>
            The challenge code is valid for 48 hours from the date it was generated.
          </p>
        </div>
      </main>
    </div>
  );
}
