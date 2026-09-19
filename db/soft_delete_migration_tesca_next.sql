-- ==============================================================================
-- 🛡️ TESCA-NEXT DATABASE: NON-DESTRUCTIVE STEALTH SOFT DELETE MIGRATION
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

-- 1. Courses
ALTER TABLE IF EXISTS public.courses 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- 2. Live Classes
ALTER TABLE IF EXISTS public.live_classes 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- 3. Batches
ALTER TABLE IF EXISTS public.batches 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- 4. Study Materials
ALTER TABLE IF EXISTS public.study_materials 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- 5. Testimonials
ALTER TABLE IF EXISTS public.testimonials 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- 6. User Profiles (Students, Tutors, Admins)
ALTER TABLE IF EXISTS public.profiles 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- 7. Trainers
ALTER TABLE IF EXISTS public.trainers 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- 8. Blog Posts
ALTER TABLE IF EXISTS public.blog_posts 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- 9. Lessons
ALTER TABLE IF EXISTS public.lessons 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- 10. Course Modules
ALTER TABLE IF EXISTS public.course_modules 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- 11. Leads & Inquiries
ALTER TABLE IF EXISTS public.leads 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- 12. Promo Popup Settings
ALTER TABLE IF EXISTS public.popup_settings 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- 13. Payments & Transactions
ALTER TABLE IF EXISTS public.payments 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- 14. Notifications
ALTER TABLE IF EXISTS public.notifications 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- 15. Student Enrollments
ALTER TABLE IF EXISTS public.enrollments 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;


-- ------------------------------------------------------------------------------
-- STEP 2: Create Partial Indexes for Lightning-Fast Queries
-- (Indexes only active rows where deleted_at IS NULL for maximum performance)
-- ------------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_courses_deleted_at ON public.courses(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_live_classes_deleted_at ON public.live_classes(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_batches_deleted_at ON public.batches(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_study_materials_deleted_at ON public.study_materials(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_testimonials_deleted_at ON public.testimonials(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_deleted_at ON public.profiles(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_trainers_deleted_at ON public.trainers(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_blog_posts_deleted_at ON public.blog_posts(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_lessons_deleted_at ON public.lessons(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_course_modules_deleted_at ON public.course_modules(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_leads_deleted_at ON public.leads(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_popup_settings_deleted_at ON public.popup_settings(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_payments_deleted_at ON public.payments(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_notifications_deleted_at ON public.notifications(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_enrollments_deleted_at ON public.enrollments(deleted_at) WHERE deleted_at IS NULL;


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

-- 1. Courses
DROP TRIGGER IF EXISTS trg_soft_delete_courses ON public.courses;
CREATE TRIGGER trg_soft_delete_courses
BEFORE DELETE ON public.courses
FOR EACH ROW EXECUTE FUNCTION public.handle_soft_delete();

-- 2. Live Classes
DROP TRIGGER IF EXISTS trg_soft_delete_live_classes ON public.live_classes;
CREATE TRIGGER trg_soft_delete_live_classes
BEFORE DELETE ON public.live_classes
FOR EACH ROW EXECUTE FUNCTION public.handle_soft_delete();

-- 3. Batches
DROP TRIGGER IF EXISTS trg_soft_delete_batches ON public.batches;
CREATE TRIGGER trg_soft_delete_batches
BEFORE DELETE ON public.batches
FOR EACH ROW EXECUTE FUNCTION public.handle_soft_delete();

-- 4. Study Materials
DROP TRIGGER IF EXISTS trg_soft_delete_study_materials ON public.study_materials;
CREATE TRIGGER trg_soft_delete_study_materials
BEFORE DELETE ON public.study_materials
FOR EACH ROW EXECUTE FUNCTION public.handle_soft_delete();

-- 5. Testimonials
DROP TRIGGER IF EXISTS trg_soft_delete_testimonials ON public.testimonials;
CREATE TRIGGER trg_soft_delete_testimonials
BEFORE DELETE ON public.testimonials
FOR EACH ROW EXECUTE FUNCTION public.handle_soft_delete();

-- 6. Profiles
DROP TRIGGER IF EXISTS trg_soft_delete_profiles ON public.profiles;
CREATE TRIGGER trg_soft_delete_profiles
BEFORE DELETE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_soft_delete();

-- 7. Trainers
DROP TRIGGER IF EXISTS trg_soft_delete_trainers ON public.trainers;
CREATE TRIGGER trg_soft_delete_trainers
BEFORE DELETE ON public.trainers
FOR EACH ROW EXECUTE FUNCTION public.handle_soft_delete();

-- 8. Blog Posts
DROP TRIGGER IF EXISTS trg_soft_delete_blog_posts ON public.blog_posts;
CREATE TRIGGER trg_soft_delete_blog_posts
BEFORE DELETE ON public.blog_posts
FOR EACH ROW EXECUTE FUNCTION public.handle_soft_delete();

-- 9. Lessons
DROP TRIGGER IF EXISTS trg_soft_delete_lessons ON public.lessons;
CREATE TRIGGER trg_soft_delete_lessons
BEFORE DELETE ON public.lessons
FOR EACH ROW EXECUTE FUNCTION public.handle_soft_delete();

-- 10. Course Modules
DROP TRIGGER IF EXISTS trg_soft_delete_course_modules ON public.course_modules;
CREATE TRIGGER trg_soft_delete_course_modules
BEFORE DELETE ON public.course_modules
FOR EACH ROW EXECUTE FUNCTION public.handle_soft_delete();

-- 11. Leads
DROP TRIGGER IF EXISTS trg_soft_delete_leads ON public.leads;
CREATE TRIGGER trg_soft_delete_leads
BEFORE DELETE ON public.leads
FOR EACH ROW EXECUTE FUNCTION public.handle_soft_delete();

-- 12. Popup Settings
DROP TRIGGER IF EXISTS trg_soft_delete_popup_settings ON public.popup_settings;
CREATE TRIGGER trg_soft_delete_popup_settings
BEFORE DELETE ON public.popup_settings
FOR EACH ROW EXECUTE FUNCTION public.handle_soft_delete();

-- 13. Payments
DROP TRIGGER IF EXISTS trg_soft_delete_payments ON public.payments;
CREATE TRIGGER trg_soft_delete_payments
BEFORE DELETE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.handle_soft_delete();

-- 14. Notifications
DROP TRIGGER IF EXISTS trg_soft_delete_notifications ON public.notifications;
CREATE TRIGGER trg_soft_delete_notifications
BEFORE DELETE ON public.notifications
FOR EACH ROW EXECUTE FUNCTION public.handle_soft_delete();

-- 15. Enrollments
DROP TRIGGER IF EXISTS trg_soft_delete_enrollments ON public.enrollments;
CREATE TRIGGER trg_soft_delete_enrollments
BEFORE DELETE ON public.enrollments
FOR EACH ROW EXECUTE FUNCTION public.handle_soft_delete();


-- ==============================================================================
-- 🚑 SUPER-ADMIN EMERGENCY DATA RECOVERY CHEATSHEET
-- ==============================================================================
-- If any user or admin ever accidentally deletes records, run these in Supabase:
--
-- 1. Check all soft-deleted records across any table:
--    SELECT id, title, deleted_at FROM public.courses WHERE deleted_at IS NOT NULL;
--    SELECT id, name, email, deleted_at FROM public.leads WHERE deleted_at IS NOT NULL;
--    SELECT id, title, slug, deleted_at FROM public.blog_posts WHERE deleted_at IS NOT NULL;
--    SELECT id, name, email, deleted_at FROM public.profiles WHERE deleted_at IS NOT NULL;
--
-- 2. Restore an entire table with 1 command:
--    UPDATE public.courses SET deleted_at = NULL WHERE deleted_at IS NOT NULL;
--    UPDATE public.blog_posts SET deleted_at = NULL WHERE deleted_at IS NOT NULL;
--    UPDATE public.leads SET deleted_at = NULL WHERE deleted_at IS NOT NULL;
--    UPDATE public.live_classes SET deleted_at = NULL WHERE deleted_at IS NOT NULL;
--    UPDATE public.study_materials SET deleted_at = NULL WHERE deleted_at IS NOT NULL;
--    UPDATE public.profiles SET deleted_at = NULL WHERE deleted_at IS NOT NULL;
--
-- 3. Restore a specific item by ID:
--    UPDATE public.blog_posts SET deleted_at = NULL WHERE id = 'YOUR-UUID-HERE';
--
-- 4. Restore everything deleted within the last 24 hours:
--    UPDATE public.blog_posts SET deleted_at = NULL WHERE deleted_at >= NOW() - INTERVAL '24 HOURS';
--    UPDATE public.leads SET deleted_at = NULL WHERE deleted_at >= NOW() - INTERVAL '24 HOURS';
--    UPDATE public.courses SET deleted_at = NULL WHERE deleted_at >= NOW() - INTERVAL '24 HOURS';
--
-- 5. Force a REAL permanent hard-delete (super-admin only):
--    SET LOCAL app.hard_delete = 'true';
--    DELETE FROM public.blog_posts WHERE id = 'SPECIFIC-ID';
-- ==============================================================================
