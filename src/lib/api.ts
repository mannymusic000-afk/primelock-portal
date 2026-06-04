const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function request<T>(
  path: string,
  options?: RequestInit & { token?: string }
): Promise<T> {
  const { token, ...rest } = options || {};
  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(rest.headers || {}),
    },
  });

  const data = await res.json();
  if (!res.ok || !data.ok) {
    throw new Error(data.error || `Request failed: ${res.status}`);
  }
  return data;
}

export const api = {
  auth: {
    register: (body: { email: string; password: string; name: string; company?: string }) =>
      request<{ token: string; developer: Developer }>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),

    login: (body: { email: string; password: string }) =>
      request<{ token: string; developer: Developer }>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),

    me: (token: string) =>
      request<{ developer: Developer }>('/auth/me', { token }),

    rotateApiKey: (token: string) =>
      request<{ api_key: string }>('/auth/rotate-api-key', { method: 'POST', token }),
  },

  products: {
    list: (token: string) =>
      request<{ products: Product[] }>('/products', { token }),

    create: (token: string, body: Partial<Product>) =>
      request<{ product: Product; public_key_pem: string }>('/products', { method: 'POST', body: JSON.stringify(body), token }),

    get: (token: string, id: string) =>
      request<{ product: Product }>(`/products/${id}`, { token }),

    update: (token: string, id: string, body: Partial<Product>) =>
      request<{ product: Product }>(`/products/${id}`, { method: 'PATCH', body: JSON.stringify(body), token }),
  },

  licenses: {
    list: (token: string, params?: { product_id?: string; page?: number }) => {
      const qs = new URLSearchParams(params as Record<string, string>).toString();
      return request<{ licenses: License[]; total: number }>(`/licenses${qs ? '?' + qs : ''}`, { token });
    },

    issue: (token: string, body: Partial<License>) =>
      request<{ license: License }>('/licenses', { method: 'POST', body: JSON.stringify(body), token }),

    get: (token: string, id: string) =>
      request<{ license: License }>(`/licenses/${id}`, { token }),

    revoke: (token: string, id: string, reason?: string) =>
      request<{ license: License }>(`/licenses/${id}/revoke`, { method: 'POST', body: JSON.stringify({ reason }), token }),
  },
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Developer {
  id: string;
  email: string;
  name: string;
  company?: string;
  country?: string;
  plan: string;
  api_key: string;
  is_verified: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  developer_id: string;
  name: string;
  slug: string;
  description?: string;
  version: string;
  product_type: 'plugin' | 'desktop' | 'web' | 'game';
  max_seats: number;
  trial_days: number;
  public_key_pem: string;
  is_active: boolean;
  created_at: string;
  licenses?: { count: number }[];
}

export interface License {
  id: string;
  product_id: string;
  license_key: string;
  customer_email: string;
  customer_name?: string;
  max_seats: number;
  seats_used: number;
  license_type: 'perpetual' | 'subscription' | 'trial';
  expires_at?: string | null;
  is_revoked: boolean;
  source: string;
  created_at: string;
  products?: { name: string; slug: string };
  activations?: Activation[];
}

export interface Activation {
  id: string;
  machine_id: string;
  machine_label?: string;
  os?: string;
  is_active: boolean;
  activated_at: string;
  last_validated_at: string;
}
