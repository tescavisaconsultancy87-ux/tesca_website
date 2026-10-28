export interface DocumentItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: 'IELTS & Test Prep' | 'Visa & Immigration' | 'University Guide' | 'General Brochure';
  pdfUrl: string;
  fileSize?: string;
  updatedAt: string;
  tags: string[];
  featured?: boolean;
  author?: string;
}

export const documents: DocumentItem[] = [
  {
    id: 'doc-ns-pr-01',
    slug: 'nova-scotia-pr-pathway-guide',
    title: 'Nova Scotia PR Pathway Guide (CCA & ECE)',
    description: 'Complete guide for international students on PR pathways in Nova Scotia, Canada for Continuing Care Assistant (CCA) & Early Childhood Educator (ECE) programs. No prior experience required.',
    category: 'Visa & Immigration',
    pdfUrl: '/material/Nova-Scotia-PR-Pathway-Guide.pdf',
    fileSize: '940 KB',
    updatedAt: 'August 2026',
    tags: ['Canada PR', 'Nova Scotia', 'CCA', 'ECE', 'Immigration', 'International Graduates'],
    featured: true,
    author: 'TESCA Immigration Team'
  },
  {
    id: 'doc-uk-pr-stay-01',
    slug: 'uk-pr-stay-guide',
    title: 'UK Stay & PR Options Guide (Graduate Visa, FLR & PR)',
    description: 'Comprehensive guide for international graduates facing a finished Graduate/PSW visa, sponsorship end, or seeking FLR, Fee Waiver, and PR/ILR pathways in the UK.',
    category: 'Visa & Immigration',
    pdfUrl: '/material/UK_PR_Stay.pdf',
    fileSize: '1.21 MB',
    updatedAt: 'September 2026',
    tags: ['UK PR', 'UK Stay', 'ILR', 'Graduate Visa', 'PSW', 'FLR', 'Fee Waiver', 'Immigration'],
    featured: true,
    author: 'TESCA Immigration Team'
  },
  {
    id: 'doc-uk-care-canada-pr-01',
    slug: 'uk-care-home-to-canada-pr-pathway',
    title: 'UK Care Home Experience to Canada PR Pathway Guide',
    description: 'Comprehensive guide for UK care home workers and international healthcare graduates on leveraging UK experience for Canadian Permanent Residency.',
    category: 'Visa & Immigration',
    pdfUrl: '/material/UK_Care_Home_to_Canada_PR_Pathway.pdf',
    fileSize: '1.17 MB',
    updatedAt: 'September 2026',
    tags: ['Canada PR', 'UK Care Home', 'Healthcare PR', 'Express Entry', 'PNP', 'Immigration', 'UK to Canada'],
    featured: true,
    author: 'TESCA Immigration Team'
  },
  {
    id: 'doc-uk-chevening-01',
    slug: 'chevening-scholarship-guide',
    title: 'UK Chevening Scholarship 2027–2028 Guide',
    description: 'Complete application overview for the UK Government Chevening Scholarship 2027–2028 cohort. Covers fully funded Master\'s degrees, eligibility requirements, 2,800-hour work experience rules, selection timeline, and essay criteria.',
    category: 'University Guide',
    pdfUrl: '/material/Chevening_Scholarship_2027-2028.pdf',
    fileSize: '40 KB',
    updatedAt: 'September 2026',
    tags: ['Chevening Scholarship', 'UK Scholarship', 'Study in UK', 'Fully Funded Masters', 'FCDO', 'University Guide'],
    featured: true,
    author: 'TESCA Scholarship Desk'
  },
  {
    id: 'doc-dubai-mibd-01',
    slug: 'study-in-dubai-mibd-guide',
    title: 'Study in Dubai – MIBD University 2026 Admission Guide',
    description: 'Comprehensive admission guide for MIBD University in Dubai. Explore low tuition fees, no IELTS/PTE requirement pathways, study gap acceptance, Level 4 & 5 International Diplomas, and UAE work permits.',
    category: 'University Guide',
    pdfUrl: '/material/study_in_dubai_mibd_guide.pdf',
    fileSize: '68 KB',
    updatedAt: 'September 2026',
    tags: ['Study in Dubai', 'MIBD University', 'Dubai Student Visa', 'No IELTS', 'Study Gap Accepted', 'UAE Education'],
    featured: true,
    author: 'TESCA Study Abroad Team'
  },
  {
    id: 'doc-apaar-id-01',
    slug: 'apaar-id-guide',
    title: 'APAAR ID Master Guide – Digital Academic Passport',
    description: 'Step-by-step blueprint for Indian students on creating and using your APAAR ID (Automated Permanent Academic Account Registry) and DigiLocker ABC linkage for streamlined overseas university credit transfers and verification.',
    category: 'General Brochure',
    pdfUrl: '/material/APAAR_ID_60.pdf',
    fileSize: '29 KB',
    updatedAt: 'September 2026',
    tags: ['APAAR ID', 'One Nation One Student ID', 'Academic Bank of Credits', 'DigiLocker', 'Overseas Education', 'Student Visa Checklist'],
    featured: true,
    author: 'TESCA Advisory Desk'
  },
  {
    id: 'doc-uk-psw-01',
    slug: 'uk-psw-graduate-visa-guide',
    title: 'UK PSW (Graduate Visa) 2026–2027 Rules & Complete Guide',
    description: 'Comprehensive overview of UK Graduate Route (PSW) changes taking effect from 1 January 2027. Explains the 2-year vs 18-month duration rules, university completion reporting deadline (31 December 2026), pre-application checklist, fee breakdown, and step-by-step submission.',
    category: 'Visa & Immigration',
    pdfUrl: '/material/UK_PSW_Information.pdf',
    fileSize: '29 KB',
    updatedAt: 'October 2026',
    tags: ['UK PSW', 'Graduate Visa', 'Post Study Work', 'UKVI', 'UK Student Visa', 'Immigration', 'UK Work Permit'],
    featured: true,
    author: 'TESCA Immigration Team'
  },
  {
    id: 'doc-uk-yps-01',
    slug: 'uk-yps-interview-questions-guide',
    title: 'UK Lottery Visa (India YPS) – Interview Questions & Preparation Guide',
    description: 'Essential interview preparation handbook for candidates selected in the UK India Young Professionals Scheme (YPS / Lottery Visa) ballot. Detailed guide on answering questions regarding degrees, £2,530 funds rule, stay plans, document checklist, and interview tips.',
    category: 'Visa & Immigration',
    pdfUrl: '/material/UK_YPS_Interview_Questions.pdf',
    fileSize: '42 KB',
    updatedAt: 'October 2026',
    tags: ['UK YPS', 'India Young Professionals Scheme', 'UK Lottery Visa', 'Visa Interview Questions', 'Youth Mobility Scheme', 'UK Visa', 'Immigration'],
    featured: true,
    author: 'TESCA Visa Desk'
  },
  {
    id: 'doc-uk-nhs-01',
    slug: 'nhs-hiring-sectors-list-guide',
    title: 'NHS UK Hiring Sectors List – Jobs Beyond Doctors & Nurses',
    description: 'Curated blueprint of 10 key departments hiring international candidates across the UK National Health Service (NHS), including IT & Digital, Data & Analytics, Finance, Healthcare Support (HCA), Admin, and Logistics with visa sponsorship insights.',
    category: 'Visa & Immigration',
    pdfUrl: '/material/NHS_Hiring_Sectors_List.pdf',
    fileSize: '32 KB',
    updatedAt: 'October 2026',
    tags: ['NHS Jobs', 'UK Healthcare Jobs', 'Non Clinical NHS Roles', 'UK Visa Sponsorship', 'Work in UK', 'NHS Hiring Sectors', 'Skilled Worker Visa'],
    featured: true,
    author: 'TESCA Career Advisory'
  }
];

export function getDocumentBySlug(slug: string): DocumentItem | undefined {
  const norm = slug.toLowerCase().replace(/_/g, '-');
  return documents.find((doc) => {
    const docNorm = doc.slug.toLowerCase().replace(/_/g, '-');
    if (
      docNorm === norm ||
      docNorm.replace(/-guide$/, '') === norm ||
      norm.replace(/-guide$/, '') === docNorm
    ) {
      return true;
    }
    if (doc.slug.includes('chevening') && norm.includes('chevening')) {
      return true;
    }
    if (
      (doc.slug.includes('dubai-mibd') || doc.slug.includes('study-in-dubai')) &&
      norm.includes('dubai') &&
      (norm.includes('mibd') || norm.includes('study-in-dubai'))
    ) {
      return true;
    }
    if (doc.slug.includes('apaar') && norm.includes('apaar')) {
      return true;
    }
    if (doc.slug.includes('uk-care-home') && norm.includes('care-home')) {
      return true;
    }
    if (doc.slug.includes('uk-pr-stay') && norm.includes('uk-pr-stay')) {
      return true;
    }
    if (doc.slug.includes('uk-psw') && (norm.includes('psw') || norm.includes('uk-psw'))) {
      return true;
    }
    if (doc.slug.includes('uk-yps') && (norm.includes('yps') || norm.includes('lottery-visa'))) {
      return true;
    }
    if (doc.slug.includes('nhs-hiring') && (norm.includes('nhs') || norm.includes('hiring-sectors'))) {
      return true;
    }
    return false;
  });
}

export function getAllDocumentSlugs(): string[] {
  return documents.map((doc) => doc.slug);
}
