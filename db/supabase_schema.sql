-- Supabase PostgreSQL Schema Definition

-- 1. Create Admins Allowlist Table
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Allow public read of admins (so authentication check can query it without admin privileges)
CREATE POLICY "Allow public read access to admins table" 
ON public.admins 
FOR SELECT 
USING (true);

-- Allow authenticated admins to insert/delete/update entries (we can restrict this later or use service role, but for simplicity we allow anyone in the table to manage it)
CREATE POLICY "Allow all actions for allowlisted admins"
ON public.admins
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admins a 
    WHERE a.email = auth.jwt()->>'email'
  )
);

-- 2. Seed Initial Admin Account
INSERT INTO public.admins (email)
VALUES ('tescavisaconsultancy87@gmail.com')
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.admins (email)
VALUES ('admin@tesca.com')
ON CONFLICT (email) DO NOTHING;


-- 3. Create Gallery Images Table
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    category TEXT NOT NULL, -- 'classroom' or 'campus'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Carousel Videos Table
CREATE TABLE IF NOT EXISTS public.carousel_videos (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
