/// <reference types="astro/client" />

interface Env {
  DB: any; // Using any for local database operations to bypass wrangler types dependency
  tesca_db: any;
  PUBLIC_GOOGLE_SHEET_URL?: string;
  WEB3FORMS_ACCESS_KEY?: string;
  PUBLIC_SUPABASE_URL?: string;
  PUBLIC_SUPABASE_ANON_KEY?: string;
}

declare module "cloudflare:workers" {
  const env: Env;
  export { env };
}
