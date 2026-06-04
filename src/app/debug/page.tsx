'use client';
import { useEffect, useState } from 'react';

export default function DebugPage() {
  const [info, setInfo] = useState<any>({});
  useEffect(() => {
    fetch('https://primelock-api.onrender.com/health')
      .then(r => r.json())
      .then(data => setInfo({ status: 'ok', data, url: 'https://primelock-api.onrender.com' }))
      .catch(err => setInfo({ status: 'error', error: err.message, url: 'https://primelock-api.onrender.com' }));
  }, []);
  return (
    <div style={{padding: 40, fontFamily: 'monospace', background: '#0a0a0d', color: '#00ff88', minHeight: '100vh'}}>
      <h1>PrimeLock Debug</h1>
      <pre>{JSON.stringify(info, null, 2)}</pre>
    </div>
  );
}
