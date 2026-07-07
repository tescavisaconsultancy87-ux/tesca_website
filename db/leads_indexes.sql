-- Indexes to optimize performance on public.leads queries
-- Run this SQL script in your Supabase SQL Editor to apply these optimizations.

-- 1. Optimize filtering by lead type (e.g. separating student leads from partner applications)
CREATE INDEX IF NOT EXISTS idx_leads_lead_type ON public.leads (lead_type);

-- 2. Optimize sorting by registration timestamps (newest leads first)
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads (created_at DESC);

-- 3. Composite index for filtering and sorting combined (standard query pattern in admin dashboard)
CREATE INDEX IF NOT EXISTS idx_leads_type_created ON public.leads (lead_type, created_at DESC);
