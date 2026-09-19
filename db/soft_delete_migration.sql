-- ==============================================================================
-- 🛡️ TESCA DATABASE: NON-DESTRUCTIVE STEALTH SOFT DELETE MIGRATION
-- ==============================================================================
-- ⚠️ SAFETY GUARANTEE:
--   - This script DOES NOT delete, drop, or truncate ANY existing data.
--   - All ADD COLUMN statements use IF NOT EXISTS with DEFAULT NULL.
--   - All existing rows remain 100% active, visible, and untouched.
--   - Once run, future DELETE commands are automatically intercepted and 
--     converted to soft-deletes (deleted_at = NOW()) silently in the background.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- STEP 1: Add 'deleted_at' column to all deletable tables (Safe & Non-Destructive)
-- ------------------------------------------------------------------------------

-- 1. Blog Posts
ALTER TABLE IF EXISTS public.blog_posts 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- 2. Student Leads & Partner Inquiries
ALTER TABLE IF EXISTS public.leads 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- 3. Universities
ALTER TABLE IF EXISTS public.universities 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- 4. Visa Updates & Bulletins
ALTER TABLE IF EXISTS public.visa_updates 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- 5. Success Stories
ALTER TABLE IF EXISTS public.success_stories 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- 6. Social Causes
ALTER TABLE IF EXISTS public.social_causes 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- 7. Announcements
ALTER TABLE IF EXISTS public.announcements 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- 8. Promo Popups
ALTER TABLE IF EXISTS public.popup_settings 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- 9. Admins
ALTER TABLE IF EXISTS public.admins 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- 10. Carousel Videos
ALTER TABLE IF EXISTS public.carousel_videos 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- 11. Gallery Images
ALTER TABLE IF EXISTS public.gallery_images 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;


-- ------------------------------------------------------------------------------
-- STEP 2: Create Partial Indexes for Lightning-Fast Queries
-- (Indexes only active rows where deleted_at IS NULL for maximum performance)
-- ------------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_blog_posts_deleted_at ON public.blog_posts(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_leads_deleted_at ON public.leads(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_universities_deleted_at ON public.universities(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_visa_updates_deleted_at ON public.visa_updates(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_success_stories_deleted_at ON public.success_stories(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_social_causes_deleted_at ON public.social_causes(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_announcements_deleted_at ON public.announcements(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_popup_settings_deleted_at ON public.popup_settings(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_admins_deleted_at ON public.admins(deleted_at) WHERE deleted_at IS NULL;


-- ------------------------------------------------------------------------------
-- STEP 3: Create The Universal Soft-Delete Trigger Function
-- Intercepts any physical DELETE call and converts it into an UPDATE (deleted_at = NOW())
-- The client/user receives a 200 Success response and sees the item vanish,
-- but the row is never removed from the database disk.
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_soft_delete()
RETURNS TRIGGER AS $$
BEGIN
    -- Allow hard delete only if an explicit super-admin session override is active
    IF current_setting('app.hard_delete', true) = 'true' THEN
        RETURN OLD;
    END IF;

    -- Intercept the DELETE and stamp deleted_at with current timestamp
    EXECUTE format('UPDATE %I.%I SET deleted_at = COALESCE(deleted_at, NOW()) WHERE id = $1', TG_TABLE_SCHEMA, TG_TABLE_NAME) 
    USING OLD.id;
    
    -- Returning NULL cancels the physical DELETE from the database table!
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ------------------------------------------------------------------------------
-- STEP 4: Attach Before-Delete Triggers to All Tables
-- ------------------------------------------------------------------------------

-- Blog Posts
DROP TRIGGER IF EXISTS trg_soft_delete_blogs ON public.blog_posts;
CREATE TRIGGER trg_soft_delete_blogs
BEFORE DELETE ON public.blog_posts
FOR EACH ROW EXECUTE FUNCTION public.handle_soft_delete();

-- Leads
DROP TRIGGER IF EXISTS trg_soft_delete_leads ON public.leads;
CREATE TRIGGER trg_soft_delete_leads
BEFORE DELETE ON public.leads
FOR EACH ROW EXECUTE FUNCTION public.handle_soft_delete();

-- Universities
DROP TRIGGER IF EXISTS trg_soft_delete_universities ON public.universities;
CREATE TRIGGER trg_soft_delete_universities
BEFORE DELETE ON public.universities
FOR EACH ROW EXECUTE FUNCTION public.handle_soft_delete();

-- Visa Updates
DROP TRIGGER IF EXISTS trg_soft_delete_visa_updates ON public.visa_updates;
CREATE TRIGGER trg_soft_delete_visa_updates
BEFORE DELETE ON public.visa_updates
FOR EACH ROW EXECUTE FUNCTION public.handle_soft_delete();

-- Success Stories
DROP TRIGGER IF EXISTS trg_soft_delete_success_stories ON public.success_stories;
CREATE TRIGGER trg_soft_delete_success_stories
BEFORE DELETE ON public.success_stories
FOR EACH ROW EXECUTE FUNCTION public.handle_soft_delete();

-- Social Causes
DROP TRIGGER IF EXISTS trg_soft_delete_social_causes ON public.social_causes;
CREATE TRIGGER trg_soft_delete_social_causes
BEFORE DELETE ON public.social_causes
FOR EACH ROW EXECUTE FUNCTION public.handle_soft_delete();

-- Announcements
DROP TRIGGER IF EXISTS trg_soft_delete_announcements ON public.announcements;
CREATE TRIGGER trg_soft_delete_announcements
BEFORE DELETE ON public.announcements
FOR EACH ROW EXECUTE FUNCTION public.handle_soft_delete();

-- Promo Popups
DROP TRIGGER IF EXISTS trg_soft_delete_popup_settings ON public.popup_settings;
CREATE TRIGGER trg_soft_delete_popup_settings
BEFORE DELETE ON public.popup_settings
FOR EACH ROW EXECUTE FUNCTION public.handle_soft_delete();

-- Carousel Videos
DROP TRIGGER IF EXISTS trg_soft_delete_carousel_videos ON public.carousel_videos;
CREATE TRIGGER trg_soft_delete_carousel_videos
BEFORE DELETE ON public.carousel_videos
FOR EACH ROW EXECUTE FUNCTION public.handle_soft_delete();

-- Gallery Images
DROP TRIGGER IF EXISTS trg_soft_delete_gallery_images ON public.gallery_images;
CREATE TRIGGER trg_soft_delete_gallery_images
BEFORE DELETE ON public.gallery_images
FOR EACH ROW EXECUTE FUNCTION public.handle_soft_delete();


-- ==============================================================================
-- 💡 SUPER-ADMIN EMERGENCY RECOVERY CHEATSHEET
-- (Save these queries for your own private use - never expose to users)
-- ==============================================================================
--
-- 1. View all soft-deleted records:
--    SELECT * FROM public.blog_posts WHERE deleted_at IS NOT NULL;
--    SELECT * FROM public.leads WHERE deleted_at IS NOT NULL;
--    SELECT * FROM public.universities WHERE deleted_at IS NOT NULL;
--
-- 2. Instantly restore a single deleted item by ID:
--    UPDATE public.blog_posts SET deleted_at = NULL WHERE id = 123;
--    UPDATE public.leads SET deleted_at = NULL WHERE id = 'lead-uuid';
--    UPDATE public.universities SET deleted_at = NULL WHERE id = 45;
--
-- 3. Instantly restore ALL accidentally deleted items:
--    UPDATE public.blog_posts SET deleted_at = NULL WHERE deleted_at IS NOT NULL;
--    UPDATE public.leads SET deleted_at = NULL WHERE deleted_at IS NOT NULL;
--    UPDATE public.universities SET deleted_at = NULL WHERE deleted_at IS NOT NULL;
--    UPDATE public.visa_updates SET deleted_at = NULL WHERE deleted_at IS NOT NULL;
--    UPDATE public.success_stories SET deleted_at = NULL WHERE deleted_at IS NOT NULL;
--
-- 4. If you EVER truly want to permanently hard-delete a row:
--    SET LOCAL app.hard_delete = 'true';
--    DELETE FROM public.blog_posts WHERE id = 123;
-- ==============================================================================
