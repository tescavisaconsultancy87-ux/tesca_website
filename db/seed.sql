-- Seed Data for Cloudflare D1 / SQLite

-- Seed Universities
INSERT INTO universities (name, country, code, tuition_fees, intake, ielts_pte_req, moi_accepted, min_cgpa_percent, courses) VALUES
('Coventry University', 'United Kingdom', 'uk', '£15,000 - £20,000 / year', 'Sept, Jan, May', '6.0 overall (5.5 min) / PTE 50', 'Yes', '55% or 6.0 CGPA', 'MBA, MSc Data Science, CS, BBA'),
('University of Waterloo', 'Canada', 'ca', 'CAD $30,000 - $45,000 / year', 'Sept, Jan', '6.5 overall / PTE 60', 'No', '75% or 8.0 CGPA', 'MEng IT, MS Computer Science, Civil Engineering'),
('Boston University', 'USA', 'us', 'USD $55,000 - $65,000 / year', 'Sept, Jan', '7.0 overall / PTE 65', 'No', '3.0 GPA or 70%', 'MS Bioinformatics, MBA, Finance'),
('Technical University of Munich', 'Germany', 'de', '€0 - €3,000 / year (Public)', 'Oct, Apr', '6.5 overall / PTE 58', 'No', '70% or 2.5 German Grade', 'MS Informatics, Automotive Engineering'),
('University of Melbourne', 'Australia', 'au', 'AUD $35,000 - $48,000 / year', 'Feb, July', '6.5 overall / PTE 58', 'No', '65% or 7.0 GPA', 'MS Data Science, Bachelor of Commerce'),
('Northeastern University', 'USA', 'us', 'USD $48,000 - $55,000 / year', 'Sept, Jan', '6.5 overall / PTE 58', 'Yes', '65% or 3.0 GPA', 'MS Information Systems, MS Project Management');

-- Seed Success Stories
INSERT INTO success_stories (name, photo, type, score, country) VALUES
('Aarav Patel', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop', 'IELTS', '8.0', NULL),
('Sneha Reddy', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop', 'PTE', '84', NULL),
('Vikram Malhotra', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop', 'Visa Success', NULL, 'United Kingdom'),
('Meera Krishnan', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop', 'IELTS', '7.5', NULL),
('Kabir Mehra', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop', 'PTE', '79', NULL),
('Jaspreet Kaur', 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=400&auto=format&fit=crop', 'Visa Success', NULL, 'Canada');

-- Seed Announcements
INSERT INTO announcements (text) VALUES
('Canada Sept 2025 Intake: Deadlines are approaching fast — book your free file audit today.');
