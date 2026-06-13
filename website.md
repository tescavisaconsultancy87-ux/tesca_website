# TESCA Visa Consultancy - Website Guide

A short, simple guide detailing all features, interactive elements, and pages on the website.

---

## 🌟 Key Global Features
* **AI Counselor Floating Chatbot (`AICounsellor.tsx`)**: A floating interactive chat assistant powered by Gemini. Trained dynamically on custom business profile data (e.g. from PDFs dropped in the project root) to guide users through consultancy options.
* **Lead Capturing**: Popup consultation booking form (`CounsellorForm.tsx`) integrated with Google Sheets webhooks and Web3Forms email alerts.

---

## 📄 Pages and Content Summary

### 1. Home Page (`index.astro`)
* **What it contains**: 
  - Main hero introduction of TESCA Visa Consultancy (established in 2005).
  - Quick summary of student visa consulting services.
  - Interactive globe visualization showing global reach.
  - Testimonial highlights and quick link widgets to calculators and destinations.

### 2. Standalone CRM Inquiry Page (`inquiry.astro`)
* **What it contains**: 
  - A dedicated, distraction-free **9-step** multi-step Lead Capture Form card.
  - Real-time `localStorage` autosave so progress isn't lost if the page is refreshed.
  - High-performance input validations (passing year validation ordering, optional mobile/email checks).
  - Direct integration with Google Sheets (GET query params for error-free logging) and Web3Forms email notifications.
  - Centered post-submission WhatsApp Counselor link on the success overlay.

### 3. Services Page (`services.astro`)
* **What it contains**:
  - Detailed overview of the **10 core services** (profile matching, admission filings, SOP audits, blocker account loans, pre/post departure support).
  - An animated marquee showcase of financial and educational loan partners (such as SBI, HDFC, Avanse, Credila).
  - Deep-links to custom subpages (`/services/[slug]`) for each service path.

### 4. Test Preparation (`TestPrep.astro`)
* **What it contains**:
  - Details about coaching classes for exams like IELTS, PTE, and GRE.
  - Class structures, module guidelines, study schedules, and materials.
  - Links to diagnostic tools and mock test guides.

### 5. Calculators Portal (`calculators.astro`)
* **What it contains**:
  - **IELTS Band Calculator**: Interactive band score calculator based on Listening/Reading raw test scores.
  - **Financial block/fee calculator**: Simple block tools to estimate blocker account requirements and university tuition cost splits.

### 6. Country Destinations (`countries.astro`)
* **What it contains**:
  - Overviews of destination regions: United Kingdom, Canada, USA, Germany, Australia, Europe, etc.
  - High-quality visual flag cards and summaries of intake semesters, study costs, and post-study work permits.

### 7. Universities Database (`universities.astro`)
* **What it contains**:
  - A database listing UK partner universities (e.g., Coventry, Hertfordshire, East London).
  - Interactive search search filtering tool and country code highlights.

### 8. Success Gallery (`gallery.astro`)
* **What it contains**:
  - Proof of visa approvals and success stories.
  - Photo grid displaying passport visa stamps of students successfully placed abroad.

### 9. Visa Success SLA (`visa-success-sla.astro`)
* **What it contains**:
  - TESCA's Service Level Agreement commitments regarding visa documentation checks.
  - Predictive checkup tools, refund policies, and procedural standards.

### 10. Security Audit Page (`security-audit.astro`)
* **What it contains**:
  - Explanations of data encryption standards (SSL) and data policy protections for secure lead submissions.

### 11. Utilities Pages
* **Privacy Policy (`privacy-policy.astro`)**: Defines data collection compliance.
* **Terms of Service (`terms-of-service.astro`)**: Governs website rules and service agreements.
* **404 Page (`404.astro`)**: Custom error page guiding lost users back home.
