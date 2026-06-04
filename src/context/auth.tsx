'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api, Developer } from '@/lib/api';

interface AuthCtx {
  developer: Developer | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('pl_token');
    if (!stored) { setLoading(false); return; }
    api.auth.me(stored)
      .then(({ developer }) => { setDeveloper(developer); setToken(stored); })
      .catch(() => localStorage.removeItem('pl_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const { token: t, developer: d } = await api.auth.login({ email, password });
    localStorage.setItem('pl_token', t);
    setToken(t);
    setDeveloper(d);
  };

  const logout = () => {
    localStorage.removeItem('pl_token');
    setToken(null);
    setDeveloper(null);
  };

  return (
    <AuthContext.Provider value={{ developer, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
