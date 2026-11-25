-- ============================================================================
-- TESCA Website — Auto-Blog & Real-Time Views Migration
-- ============================================================================
-- Adds:
--   1. `views` counter on public.blog_posts (atomic server-side increment)
--   2. `source` ('manual' | 'auto'), `topic_key`, `source_url` for zero-repeat
--      daily auto-blogging without any AI API key
--   3. `increment_blog_views(p_slug)` RPC for atomic view counting
--
-- HOW TO RUN: Supabase Dashboard -> SQL Editor -> Paste & Run.
-- Idempotent: safe to re-run anytime.
-- ============================================================================

ALTER TABLE IF EXISTS public.blog_posts
  ADD COLUMN IF NOT EXISTS views INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS topic_key TEXT,
  ADD COLUMN IF NOT EXISTS source_url TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_blog_posts_topic_key_unique
  ON public.blog_posts (topic_key)
  WHERE topic_key IS NOT NULL AND deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_blog_posts_source
  ON public.blog_posts (source);

CREATE OR REPLACE FUNCTION public.increment_blog_views(p_slug TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_views INTEGER;
BEGIN
  UPDATE public.blog_posts
  SET views = COALESCE(views, 0) + 1
  WHERE slug = p_slug
    AND is_published = true
    AND deleted_at IS NULL
  RETURNING views INTO new_views;

  RETURN COALESCE(new_views, 0);
END;
$$;

REVOKE ALL ON FUNCTION public.increment_blog_views(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_blog_views(TEXT) TO anon, authenticated, service_role;
