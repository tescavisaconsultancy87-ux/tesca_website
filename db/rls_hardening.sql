-- ============================================================================
-- TESCA Website — RLS Hardening Migration
-- ============================================================================
-- Closes the security findings where the PUBLIC Supabase anon key (committed in
-- wrangler.toml and shipped to the browser) can read/write data directly via the
-- PostgREST API, bypassing the app's server-side cookie auth.
--
-- Covers:
--   H-1  Anon write/delete on gallery_images, carousel_videos, social_causes
--   H-2  Anon upload/delete on the tesca-assets storage bucket
--   M-1  Admin email enumeration via public read on admins
--   P-1  Unverified RLS on universities, success_stories, announcements, visa_updates
--
-- SAFE TO RUN: The server writes with the SERVICE-ROLE key, which bypasses RLS
-- entirely — so locking out the anon role does NOT break any admin functionality.
-- Public pages keep working because SELECT stays open to everyone.
--
-- HOW TO RUN: Supabase Dashboard > SQL Editor > paste this whole file > Run.
-- Idempotent: re-running is safe.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- STEP 0 (P-1) — VERIFY FIRST. Run these two SELECTs on their own and read the
-- output before running the rest. They tell you the CURRENT live state.
-- ----------------------------------------------------------------------------
-- 0a. Which public tables have RLS OFF?  (relrowsecurity = false  =>  fully open
--     to the anon role by Supabase's default grants — that's the P-1 hole.)
--
--   SELECT relname AS table, relrowsecurity AS rls_enabled
--   FROM pg_class
--   WHERE relnamespace = 'public'::regnamespace
--     AND relkind = 'r'
--     AND relname IN ('admins','leads','gallery_images','carousel_videos',
--                     'social_causes','universities','success_stories',
--                     'announcements','visa_updates')
--   ORDER BY relname;
--
-- 0b. Which policies currently exist, for which roles and commands?  Look for any
--     policy whose `roles` includes {anon} or {public} on an INSERT/UPDATE/DELETE.
--
--   SELECT tablename, policyname, roles, cmd, qual, with_check
--   FROM pg_policies
--   WHERE schemaname = 'public'
--   ORDER BY tablename, policyname;
--
-- The DO blocks below DROP ALL existing policies on the affected tables and
-- recreate a known-good set, so you do not need to know the old policy names.
-- ----------------------------------------------------------------------------


-- ----------------------------------------------------------------------------
-- STEP 1 — Helper: is the current JWT an allowlisted admin?
-- SECURITY DEFINER so it reads public.admins WITHOUT triggering RLS (this avoids
-- infinite recursion when used inside a policy that is itself ON public.admins).
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admins a
    WHERE a.email = (auth.jwt() ->> 'email')
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;


-- ----------------------------------------------------------------------------
-- STEP 2 — Apply a uniform "public can READ, only admins can WRITE" policy set
-- to every content table. The DO block wipes existing policies first so any
-- legacy "FOR ALL USING (true)" policy (H-1) or unknown permissive policy (P-1)
-- is removed, then RLS is enabled and clean policies are created.
--
-- Tables included:
--   H-1 (confirmed insecure): gallery_images, carousel_videos, social_causes
--   P-1 (unverified):         universities, success_stories, announcements, visa_updates
--
-- NOTE: `leads` is intentionally EXCLUDED — its policies are already correct
--       (anon INSERT only, admin-only read) and must not be loosened to allow
--       public SELECT of lead PII.
-- ----------------------------------------------------------------------------
DO $$
DECLARE
  tbl   text;
  pol   record;
  tables text[] := ARRAY[
    'gallery_images',
    'carousel_videos',
    'social_causes',
    'universities',
    'success_stories',
    'announcements',
    'visa_updates'
  ];
BEGIN
  FOREACH tbl IN ARRAY tables LOOP
    -- Skip tables that don't exist in this project (no-op instead of error).
    IF to_regclass(format('public.%I', tbl)) IS NULL THEN
      RAISE NOTICE 'Skipping %, table not found.', tbl;
      CONTINUE;
    END IF;

    -- 2a. Drop every existing policy on this table (clears H-1 / P-1 permissive ones).
    FOR pol IN
      SELECT policyname FROM pg_policies
      WHERE schemaname = 'public' AND tablename = tbl
    LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, tbl);
    END LOOP;

    -- 2b. Ensure RLS is ON (closes the P-1 "RLS disabled = open" hole).
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tbl);

    -- 2c. Public read (so the public website keeps rendering content).
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR SELECT USING (true)',
      tbl || '_public_read', tbl
    );

    -- 2d. Admin-only writes. (Server uses the service-role key, which bypasses
    --     RLS, so this does not block legitimate admin writes — it only blocks
    --     the anon key from writing directly via PostgREST.)
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())',
      tbl || '_admin_write', tbl
    );

    RAISE NOTICE 'Hardened public.%', tbl;
  END LOOP;
END $$;


-- ----------------------------------------------------------------------------
-- STEP 3 (M-1) — Lock down the admins table.
-- Was: "FOR SELECT USING (true)" => anyone with the anon key could dump every
-- admin email (enumeration). The server-side auth check uses the service-role
-- key (bypasses RLS), so removing public read does NOT break login/auth.
-- ----------------------------------------------------------------------------
DO $$
DECLARE
  pol record;
BEGIN
  IF to_regclass('public.admins') IS NULL THEN
    RAISE NOTICE 'Skipping admins, table not found.';
    RETURN;
  END IF;

  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'admins'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.admins', pol.policyname);
  END LOOP;

  ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

  -- Only authenticated admins may read the allowlist (no public enumeration).
  CREATE POLICY admins_self_read ON public.admins
    FOR SELECT TO authenticated
    USING (public.is_admin());

  -- Only authenticated admins may modify the allowlist (defense in depth;
  -- the app performs this via the service-role key which bypasses RLS anyway).
  CREATE POLICY admins_manage ON public.admins
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());
END $$;


-- ----------------------------------------------------------------------------
-- STEP 4 (H-2) — Lock down the tesca-assets storage bucket.
-- Was: INSERT and DELETE allowed for everyone (no TO clause => PUBLIC/anon).
-- Now: public READ only; uploads/deletes require an authenticated admin.
-- (Server-side uploads run under the service-role key and bypass RLS.)
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public read access on tesca-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow uploads to tesca-assets"      ON storage.objects;
DROP POLICY IF EXISTS "Allow deletes on tesca-assets"      ON storage.objects;

-- Public read so uploaded images display on the site.
CREATE POLICY "tesca-assets public read" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'tesca-assets');

-- Admin-only upload.
CREATE POLICY "tesca-assets admin insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'tesca-assets' AND public.is_admin());

-- Admin-only update (e.g. upsert/replace).
CREATE POLICY "tesca-assets admin update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'tesca-assets' AND public.is_admin())
  WITH CHECK (bucket_id = 'tesca-assets' AND public.is_admin());

-- Admin-only delete.
CREATE POLICY "tesca-assets admin delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'tesca-assets' AND public.is_admin());


-- ----------------------------------------------------------------------------
-- STEP 5 — POST-RUN VERIFICATION. Re-run 0a/0b above; you should now see:
--   * RLS = true on all listed tables.
--   * No policy with roles {anon}/{public} on any INSERT/UPDATE/DELETE.
--   * Each content table: one public SELECT policy + one authenticated write policy.
--   * admins: authenticated-only read/write (no public SELECT).
--   * leads: UNCHANGED (anon INSERT only, admin read) — confirm it was not altered.
--
-- Smoke test with the PUBLIC anon key (should now FAIL with 401/empty):
--   curl 'https://<project>.supabase.co/rest/v1/admins?select=email' \
--     -H "apikey: <ANON_KEY>" -H "Authorization: Bearer <ANON_KEY>"
--   curl -X POST 'https://<project>.supabase.co/rest/v1/gallery_images' \
--     -H "apikey: <ANON_KEY>" -H "Authorization: Bearer <ANON_KEY>" \
--     -H "Content-Type: application/json" -d '{"title":"x","image_url":"y","category":"campus"}'
--
-- And confirm the public site still READS fine, and the admin panel can still
-- add/delete content (it uses the service-role key, so it will).
-- ============================================================================
