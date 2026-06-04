'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth';

export default function DebugPage() {
  const { login, loading } = useAuth();
  const [info, setInfo] = useState<any>({ loading });

  useEffect(() => {
    login('mannymusic000@gmail.com', 'primelock123')
      .then(() => setInfo({ status: 'AUTH LOGIN OK' }))
      .catch(err => setInfo({ status: 'AUTH LOGIN FAILED', error: err.message }));
  }, []);

  return (
    <div style={{padding: 40, fontFamily: 'monospace', background: '#0a0a0d', color: '#00ff88', minHeight: '100vh'}}>
      <h1>PrimeLock Debug</h1>
      <pre>{JSON.stringify(info, null, 2)}</pre>
    </div>
  );
}
