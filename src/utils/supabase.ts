import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getEnv } from './env';

let _supabase: SupabaseClient | null = null;
let _supabaseAdmin: SupabaseClient | null = null;

const DEFAULT_SUPABASE_URL = "https://zlsauoosumpnbyouhdfk.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpsc2F1b29zdW1wbmJ5b3VoZGZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3NjA2MDEsImV4cCI6MjA5NzMzNjYwMX0.JV5mmtfIGmPvA83H-vr173GDcqXoLG13gR7BJlXZ-SY";
const DEFAULT_SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpsc2F1b29zdW1wbmJ5b3VoZGZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTc2MDYwMSwiZXhwIjoyMDk3MzM2NjAxfQ.f2L5m36JHa6Esz5IHDpy1rcu28ck80_yK3ErHEaiDhk";

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const supabaseUrl = getEnv('PUBLIC_SUPABASE_URL') || (typeof import.meta !== 'undefined' ? import.meta.env?.PUBLIC_SUPABASE_URL : undefined) || DEFAULT_SUPABASE_URL;
    const supabaseKey = getEnv('PUBLIC_SUPABASE_ANON_KEY') || (typeof import.meta !== 'undefined' ? import.meta.env?.PUBLIC_SUPABASE_ANON_KEY : undefined) || DEFAULT_SUPABASE_ANON_KEY;

    _supabase = createClient(supabaseUrl, supabaseKey);
  }
  return _supabase;
}

export function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    const serviceKey = getEnv('SUPABASE_SERVICE_ROLE_KEY') || (typeof import.meta !== 'undefined' ? import.meta.env?.SUPABASE_SERVICE_ROLE_KEY : undefined) || DEFAULT_SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = getEnv('PUBLIC_SUPABASE_URL') || (typeof import.meta !== 'undefined' ? import.meta.env?.PUBLIC_SUPABASE_URL : undefined) || DEFAULT_SUPABASE_URL;

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
