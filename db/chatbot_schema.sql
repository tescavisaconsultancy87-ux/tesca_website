-- Chatbot & CRM PostgreSQL Schema for Supabase

-- 1. Users Table
CREATE TABLE IF NOT EXISTS public.cb_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK (role IN ('admin', 'manager', 'counsellor', 'receptionist')) NOT NULL,
    status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for cb_users
ALTER TABLE public.cb_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select for cb_users" ON public.cb_users FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full control for cb_users" ON public.cb_users FOR ALL TO authenticated USING (true);

-- 2. Leads Table
CREATE TABLE IF NOT EXISTS public.cb_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    interested_country TEXT,
    interested_course TEXT,
    education TEXT,
    ielts_score TEXT,
    budget TEXT,
    preferred_intake TEXT,
    notes TEXT,
    assigned_counsellor UUID REFERENCES public.cb_users(id) ON DELETE SET NULL,
    status TEXT CHECK (status IN ('new', 'contacted', 'in_progress', 'converted', 'lost')) DEFAULT 'new' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.cb_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert and select for cb_leads" ON public.cb_leads FOR SELECT USING (true);
CREATE POLICY "Allow anon insert for cb_leads" ON public.cb_leads FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow authenticated full control for cb_leads" ON public.cb_leads FOR ALL TO authenticated USING (true);

-- 3. Conversations Table
CREATE TABLE IF NOT EXISTS public.cb_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone TEXT UNIQUE NOT NULL,
    lead_id UUID REFERENCES public.cb_leads(id) ON DELETE SET NULL,
    mode TEXT CHECK (mode IN ('ai', 'human')) DEFAULT 'ai' NOT NULL,
    last_message_timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    unread_count INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.cb_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated full control for cb_conversations" ON public.cb_conversations FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow anon insert and select for cb_conversations" ON public.cb_conversations FOR ALL TO anon USING (true);

-- 4. Messages Table
CREATE TABLE IF NOT EXISTS public.cb_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.cb_conversations(id) ON DELETE CASCADE,
    sender TEXT CHECK (sender IN ('incoming', 'outgoing', 'ai', 'human')) NOT NULL,
    sender_name TEXT,
    text TEXT,
    status TEXT CHECK (status IN ('sent', 'delivered', 'read', 'failed')) DEFAULT 'sent' NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    message_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.cb_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated full control for cb_messages" ON public.cb_messages FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow anon full control for cb_messages" ON public.cb_messages FOR ALL TO anon USING (true);

-- 5. Countries Table
CREATE TABLE IF NOT EXISTS public.cb_countries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    eligibility TEXT NOT NULL,
    required_documents TEXT[] DEFAULT '{}'::text[],
    fees TEXT NOT NULL,
    processing_time TEXT NOT NULL,
    faqs JSONB DEFAULT '[]'::jsonb,
    visa_types UUID[] DEFAULT '{}'::uuid[],
    status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.cb_countries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select for cb_countries" ON public.cb_countries FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full control for cb_countries" ON public.cb_countries FOR ALL TO authenticated USING (true);

-- 6. Visa Types Table
CREATE TABLE IF NOT EXISTS public.cb_visa_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT[] DEFAULT '{}'::text[],
    processing_time TEXT NOT NULL,
    fees NUMERIC NOT NULL,
    eligibility TEXT NOT NULL,
    documents TEXT[] DEFAULT '{}'::text[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.cb_visa_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select for cb_visa_types" ON public.cb_visa_types FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full control for cb_visa_types" ON public.cb_visa_types FOR ALL TO authenticated USING (true);

-- 7. Courses Table
CREATE TABLE IF NOT EXISTS public.cb_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    duration TEXT NOT NULL,
    fees NUMERIC NOT NULL,
    faculty TEXT NOT NULL,
    timings TEXT NOT NULL,
    mode TEXT CHECK (mode IN ('online', 'offline', 'hybrid')) DEFAULT 'offline' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.cb_courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select for cb_courses" ON public.cb_courses FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full control for cb_courses" ON public.cb_courses FOR ALL TO authenticated USING (true);

-- 8. FAQs Table
CREATE TABLE IF NOT EXISTS public.cb_faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT NOT NULL,
    priority INT DEFAULT 0 NOT NULL,
    language TEXT CHECK (language IN ('en', 'hi', 'gu')) DEFAULT 'en' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.cb_faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select for cb_faqs" ON public.cb_faqs FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full control for cb_faqs" ON public.cb_faqs FOR ALL TO authenticated USING (true);

-- 9. Knowledge Bases Table
CREATE TABLE IF NOT EXISTS public.cb_knowledgebases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    source_type TEXT NOT NULL,
    source_id UUID,
    status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.cb_knowledgebases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select for cb_knowledgebases" ON public.cb_knowledgebases FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full control for cb_knowledgebases" ON public.cb_knowledgebases FOR ALL TO authenticated USING (true);

-- 10. Appointments Table
CREATE TABLE IF NOT EXISTS public.cb_appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.cb_leads(id) ON DELETE CASCADE,
    consultant_id UUID REFERENCES public.cb_users(id) ON DELETE CASCADE,
    date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    notes TEXT,
    status TEXT CHECK (status IN ('booked', 'rescheduled', 'cancelled', 'completed')) DEFAULT 'booked' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.cb_appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated full control for cb_appointments" ON public.cb_appointments FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow anon insert and select for cb_appointments" ON public.cb_appointments FOR ALL TO anon USING (true);

-- 11. Settings Table
CREATE TABLE IF NOT EXISTS public.cb_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name TEXT DEFAULT 'Tesca Visa Consultancy' NOT NULL,
    business_email TEXT DEFAULT 'tescavisaconsultancy87@gmail.com' NOT NULL,
    business_phone TEXT DEFAULT '+919876543210' NOT NULL,
    office_hours_start TEXT DEFAULT '09:00' NOT NULL,
    office_hours_end TEXT DEFAULT '18:00' NOT NULL,
    holiday_calendar TIMESTAMP WITH TIME ZONE[] DEFAULT '{}'::timestamp with time zone[],
    languages TEXT[] DEFAULT '{"en"}'::text[],
    ai_provider TEXT DEFAULT 'gemini' NOT NULL,
    ai_settings_model TEXT DEFAULT 'gemini-1.5-flash' NOT NULL,
    ai_settings_temperature NUMERIC DEFAULT 0.3 NOT NULL,
    ai_settings_top_p NUMERIC DEFAULT 0.95 NOT NULL,
    ai_settings_max_tokens INT DEFAULT 800 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.cb_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select for cb_settings" ON public.cb_settings FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full control for cb_settings" ON public.cb_settings FOR ALL TO authenticated USING (true);

-- 12. Prompts Table
CREATE TABLE IF NOT EXISTS public.cb_prompts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE DEFAULT 'default_whatsapp' NOT NULL,
    content TEXT NOT NULL,
    version INT DEFAULT 1 NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.cb_prompts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select for cb_prompts" ON public.cb_prompts FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full control for cb_prompts" ON public.cb_prompts FOR ALL TO authenticated USING (true);
