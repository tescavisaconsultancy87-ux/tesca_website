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
  }
];

export function getDocumentBySlug(slug: string): DocumentItem | undefined {
  const norm = slug.toLowerCase().replace(/_/g, '-');
  return documents.find((doc) => {
    const docNorm = doc.slug.toLowerCase().replace(/_/g, '-');
    return (
      docNorm === norm ||
      docNorm.replace(/-guide$/, '') === norm ||
      norm.replace(/-guide$/, '') === docNorm
    );
  });
}

export function getAllDocumentSlugs(): string[] {
  return documents.map((doc) => doc.slug);
}
