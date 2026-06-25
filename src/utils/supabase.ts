import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getEnv } from './env';

let _supabase: SupabaseClient | null = null;
let _supabaseAdmin: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const supabaseUrl = getEnv('PUBLIC_SUPABASE_URL') || import.meta.env.PUBLIC_SUPABASE_URL;
    const supabaseKey = getEnv('PUBLIC_SUPABASE_ANON_KEY') || import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase environment variables: PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY");
    }

    _supabase = createClient(supabaseUrl, supabaseKey);
  }
  return _supabase;
}

export function getSupabaseAdmin(): SupabaseClient {
  const serviceKey = getEnv('SUPABASE_SERVICE_ROLE_KEY') || import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return getSupabase();
  }

  if (!_supabaseAdmin) {
    const supabaseUrl = getEnv('PUBLIC_SUPABASE_URL') || import.meta.env.PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      throw new Error("Missing Supabase environment variable: PUBLIC_SUPABASE_URL");
    }

    _supabaseAdmin = createClient(supabaseUrl, serviceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return _supabaseAdmin;
}

/** @deprecated Use getSupabase() instead */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const isServer = typeof window === 'undefined';
    const client = isServer ? getSupabaseAdmin() : getSupabase();
    return Reflect.get(client, prop, receiver);
  },
});
