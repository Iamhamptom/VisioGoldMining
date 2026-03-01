'use client';

import { useAuth } from '@/context/auth-provider';
import { useCallback } from 'react';

export function useApi() {
  const { token } = useAuth();

  const apiFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      const headers: Record<string, string> = {
        ...(options.headers as Record<string, string> || {}),
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Don't set Content-Type for FormData (browser sets it with boundary)
      if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = headers['Content-Type'] || 'application/json';
      }

      const res = await fetch(url, { ...options, headers });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(data.error || `Request failed with status ${res.status}`);
      }

      return res.json();
    },
    [token]
  );

  return { apiFetch };
}
