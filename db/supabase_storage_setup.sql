-- ============================================================
-- Supabase Storage Setup for TESCA Website
-- Run this in your Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Create the tesca-assets storage bucket (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'tesca-assets',
  'tesca-assets',
  true,
  5242880, -- 5 MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

-- 2. Allow public read access (so uploaded images show on the website)
CREATE POLICY "Public read access on tesca-assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'tesca-assets');

-- 3. Allow anyone (anon key) to upload (the server-side code uses the anon key)
--    In production, the server is authenticated via cookie session so this is safe.
CREATE POLICY "Allow uploads to tesca-assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'tesca-assets');

-- 4. Allow deletes (for future admin cleanup)
CREATE POLICY "Allow deletes on tesca-assets"
ON storage.objects FOR DELETE
USING (bucket_id = 'tesca-assets');

-- ============================================================
-- Ensure the gallery_images and carousel_videos tables exist
-- ============================================================

CREATE TABLE IF NOT EXISTS public.gallery_images (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS and allow anon read
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read gallery_images" ON public.gallery_images FOR SELECT USING (true);
CREATE POLICY "Allow all on gallery_images" ON public.gallery_images FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.carousel_videos (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS and allow anon read
ALTER TABLE public.carousel_videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read carousel_videos" ON public.carousel_videos FOR SELECT USING (true);
CREATE POLICY "Allow all on carousel_videos" ON public.carousel_videos FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- Ensure the social_causes table exists for 'Our Social'
-- ============================================================

CREATE TABLE IF NOT EXISTS public.social_causes (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    link_url TEXT NOT NULL,
    platform TEXT NOT NULL, -- 'youtube', 'instagram', 'facebook'
    thumbnail_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS and allow public read and all actions for admins
ALTER TABLE public.social_causes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read social_causes" ON public.social_causes FOR SELECT USING (true);
CREATE POLICY "Allow all on social_causes" ON public.social_causes FOR ALL USING (true) WITH CHECK (true);

