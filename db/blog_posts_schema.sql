-- Blog Posts Table for Supabase
-- Run this SQL in your Supabase SQL Editor to create the table

CREATE TABLE IF NOT EXISTS public.blog_posts (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    date TEXT NOT NULL,
    tag TEXT NOT NULL,
    tag_bg TEXT NOT NULL,
    content TEXT NOT NULL,
    faq JSONB DEFAULT '[]'::jsonb,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access for published posts (anon users can view blog)
CREATE POLICY "Allow public read access to published blog posts"
ON public.blog_posts
FOR SELECT
USING (is_published = true);

-- Allow authenticated admins full CRUD access
CREATE POLICY "Allow all actions for allowlisted admins on blog_posts"
ON public.blog_posts
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admins a
    WHERE a.email = auth.jwt()->>'email'
  )
);

-- Create index on slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts (slug);

-- Create index on is_published for filtering
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts (is_published);
