-- ============================================================================
-- TESCA Website — Shared Rate Limiter (M-2)
-- ============================================================================
-- Replaces the per-isolate in-memory rate limiter (which resets constantly on
-- Cloudflare Workers and is trivially bypassed) with a shared counter in
-- Postgres, so limits hold across every isolate and edge location.
--
-- The app calls public.check_rate_limit(...) via RPC using the SERVICE-ROLE key.
-- Execute is granted ONLY to service_role, so the public anon key cannot call it
-- (prevents an attacker from inflating counters to lock out other users).
--
-- HOW TO RUN: Supabase Dashboard > SQL Editor > paste this file > Run. Once.
-- Idempotent: re-running is safe.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. Counter table. One row per (endpoint + client IP) key.
--    RLS is enabled with NO policies => no anon/authenticated access at all.
--    Only the service-role key (which bypasses RLS) can touch it.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.rate_limits (
  key       text PRIMARY KEY,
  count     integer     NOT NULL DEFAULT 0,
  reset_at  timestamptz NOT NULL
);

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
-- (intentionally no CREATE POLICY — table is service-role-only)


-- ----------------------------------------------------------------------------
-- 2. Atomic check-and-increment. Returns TRUE when the caller is OVER the limit.
--    The whole read-modify-write is a single INSERT ... ON CONFLICT statement,
--    so concurrent requests can't race past the limit.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_key             text,
  p_max             integer,
  p_window_seconds  integer
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_now   timestamptz := now();
  v_count integer;
BEGIN
  INSERT INTO public.rate_limits AS rl (key, count, reset_at)
  VALUES (p_key, 1, v_now + make_interval(secs => p_window_seconds))
  ON CONFLICT (key) DO UPDATE
    SET count    = CASE WHEN rl.reset_at < v_now THEN 1
                        ELSE rl.count + 1 END,
        reset_at = CASE WHEN rl.reset_at < v_now THEN v_now + make_interval(secs => p_window_seconds)
                        ELSE rl.reset_at END
  RETURNING rl.count INTO v_count;

  RETURN v_count > p_max;
END;
$$;

-- Only the server (service-role) may call it. Not anon, not authenticated.
REVOKE ALL ON FUNCTION public.check_rate_limit(text, integer, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_rate_limit(text, integer, integer) TO service_role;


-- ----------------------------------------------------------------------------
-- 3. Optional housekeeping. Expired rows are harmless (they get reset in place
--    on the next hit for that key), but if you want to reclaim space you can run
--    this occasionally, or schedule it with pg_cron:
--
--   DELETE FROM public.rate_limits WHERE reset_at < now() - interval '1 day';
--
--   -- with pg_cron (if enabled):
--   -- SELECT cron.schedule('purge-rate-limits', '0 3 * * *',
--   --   $$DELETE FROM public.rate_limits WHERE reset_at < now() - interval '1 day'$$);
-- ----------------------------------------------------------------------------


-- ----------------------------------------------------------------------------
-- 4. Quick test (optional):
--   SELECT public.check_rate_limit('test:1.2.3.4', 2, 60);  -- false (1/2)
--   SELECT public.check_rate_limit('test:1.2.3.4', 2, 60);  -- false (2/2)
--   SELECT public.check_rate_limit('test:1.2.3.4', 2, 60);  -- true  (3 > 2, limited)
--   DELETE FROM public.rate_limits WHERE key = 'test:1.2.3.4';
-- ============================================================================
