'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function DebugPage() {
  const [info, setInfo] = useState<any>({ testing: true });

  useEffect(() => {
    // Test login using the actual api.ts module
    api.auth.login({ email: 'mannymusic000@gmail.com', password: 'primelock123' })
      .then(data => setInfo({ status: 'LOGIN OK', data }))
      .catch(err => setInfo({ status: 'LOGIN FAILED', error: err.message }));
  }, []);

  return (
    <div style={{padding: 40, fontFamily: 'monospace', background: '#0a0a0d', color: '#00ff88', minHeight: '100vh'}}>
      <h1>PrimeLock Debug</h1>
      <pre>{JSON.stringify(info, null, 2)}</pre>
    </div>
  );
}
