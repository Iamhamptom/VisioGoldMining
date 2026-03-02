const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xquzbgaenmohruluyhgv.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxdXpiZ2Flbm1vaHJ1bHV5aGd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExODYzMTgsImV4cCI6MjA4Njc2MjMxOH0.vZEgz1TKUQWhMuV238zBKY0XfEsRXAyy9nUPa4QOXqQ';

/**
 * Call a Supabase RPC function via PostgREST (HTTPS).
 * Bypasses IPv6/pooler issues by using the REST API.
 */
export async function supabaseRpc<T>(fnName: string, params: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fnName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `Supabase RPC error: ${res.status}`);
  }

  return res.json();
}
