-- Cloudflare D1 / SQLite Database Schema Definition

-- 1. Universities Table
DROP TABLE IF EXISTS universities;
CREATE TABLE universities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    code TEXT NOT NULL,
    tuition_fees TEXT NOT NULL,
    intake TEXT NOT NULL,
    ielts_pte_req TEXT, -- optional
    moi_accepted TEXT NOT NULL, -- "Yes" or "No"
    min_cgpa_percent TEXT NOT NULL,
    courses TEXT NOT NULL
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

