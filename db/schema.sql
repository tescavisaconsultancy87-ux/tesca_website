-- Cloudflare D1 / SQLite Database Schema Definition

-- 1. Universities Table
DROP TABLE IF EXISTS universities;
CREATE TABLE universities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    code TEXT NOT NULL,
    tuition_fees TEXT, -- old field
    intake TEXT, -- old field
    ielts_pte_req TEXT, -- old field
    moi_accepted TEXT, -- old field
    min_cgpa_percent TEXT NOT NULL,
    courses TEXT, -- old field
    photo TEXT, -- old intermediate field
    image_url TEXT, -- new field
    ug_fees TEXT, -- old intermediate field
    pg_fees TEXT, -- old intermediate field
    ug_ielts_pte_req TEXT, -- old intermediate field
    pg_ielts_pte_req TEXT, -- old intermediate field
    ug_moi_accepted TEXT, -- old intermediate field
    pg_moi_accepted TEXT, -- old intermediate field
    ug_intake TEXT, -- old intermediate field
    pg_intake TEXT, -- old intermediate field
    ug_courses TEXT, -- new/old intermediate field
    pg_courses TEXT, -- new/old intermediate field
    ug_tuition_fees TEXT, -- new field
    ug_intakes TEXT, -- new field
    ug_ielts_pte TEXT, -- new field
    ug_moi TEXT, -- new field
    pg_tuition_fees TEXT, -- new field
    pg_intakes TEXT, -- new field
    pg_ielts_pte TEXT, -- new field
    pg_moi TEXT -- new field
);

-- 2. Success Stories Table
DROP TABLE IF EXISTS success_stories;
CREATE TABLE success_stories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    photo TEXT NOT NULL,
    type TEXT NOT NULL, -- "Visa Success", "IELTS", "PTE"
    score TEXT,         -- optional score
    country TEXT        -- optional country
);

-- 3. Leads Table
DROP TABLE IF EXISTS leads;
CREATE TABLE leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_type TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    details TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Announcements Table
DROP TABLE IF EXISTS announcements;
CREATE TABLE announcements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL
);

-- 5. Visa Updates Table
DROP TABLE IF EXISTS visa_updates;
CREATE TABLE visa_updates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    tag TEXT NOT NULL,
    tag_bg TEXT NOT NULL,
    title TEXT NOT NULL,
    link TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

