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
 
];

export function getDocumentBySlug(slug: string): DocumentItem | undefined {
  return documents.find((doc) => doc.slug.toLowerCase() === slug.toLowerCase());
}

export function getAllDocumentSlugs(): string[] {
  return documents.map((doc) => doc.slug);
}
