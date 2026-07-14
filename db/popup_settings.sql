-- Create the popup_settings table to manage promo popup
CREATE TABLE IF NOT EXISTS public.popup_settings (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    is_active BOOLEAN NOT NULL DEFAULT false,
    image_url TEXT NOT NULL DEFAULT '',
    title TEXT NOT NULL DEFAULT 'Special Update',
    subtitle TEXT NOT NULL DEFAULT 'Sign up to get the latest news and guides.',
    delay_seconds INTEGER NOT NULL DEFAULT 5,
    button_text TEXT NOT NULL DEFAULT 'Get Details',
    link_url TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed with a default row if empty
INSERT INTO public.popup_settings (is_active, image_url, title, subtitle, delay_seconds, button_text, link_url)
SELECT false, '', 'Special Update', 'Sign up to get the latest news and guides.', 5, 'Get Details', ''
WHERE NOT EXISTS (SELECT 1 FROM public.popup_settings);

-- Enable Row Level Security (RLS)
ALTER TABLE public.popup_settings ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access
CREATE POLICY "Allow public select for popup_settings" ON public.popup_settings 
    FOR SELECT USING (true);

-- Allow authenticated admin users full control
CREATE POLICY "Allow authenticated full control for popup_settings" ON public.popup_settings 
    FOR ALL TO authenticated USING (true);
