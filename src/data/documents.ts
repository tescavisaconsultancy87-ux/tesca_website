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
    id: 'doc-ielts-01',
    slug: 'ielts-speaking-cue-cards',
    title: 'IELTS Speaking Cue Cards Handbook 2026',
    description: 'Comprehensive collection of real exam IELTS Speaking Part 2 cue cards, sample answers, band 8+ vocabulary, and structure techniques.',
    category: 'IELTS & Test Prep',
    pdfUrl: '/material/IELTS-Speaking-Cue-Cards.pdf',
    fileSize: '1.4 MB',
    updatedAt: 'August 2026',
    tags: ['IELTS', 'Speaking', 'Cue Cards', 'Band 8+', 'Test Prep'],
    featured: true,
    author: 'TESCA IELTS Faculty'
  },
  {
    id: 'doc-ielts-02',
    slug: 'ielts-vocabulary-cheat-sheet',
    title: 'IELTS Vocabulary Cheat Sheet - Top 100 Words',
    description: 'High-scoring academic vocabulary cheat sheet for IELTS Writing & Speaking with collocations, synonyms, and context sentences.',
    category: 'IELTS & Test Prep',
    pdfUrl: '/material/IELTS-Vocabulary-Cheat-Sheet-Top-100-Words.pdf',
    fileSize: '2.9 MB',
    updatedAt: 'August 2026',
    tags: ['IELTS', 'Vocabulary', 'Writing', 'Speaking', 'Cheat Sheet'],
    featured: false,
    author: 'TESCA IELTS Faculty'
  }
];

export function getDocumentBySlug(slug: string): DocumentItem | undefined {
  return documents.find((doc) => doc.slug.toLowerCase() === slug.toLowerCase());
}

export function getAllDocumentSlugs(): string[] {
  return documents.map((doc) => doc.slug);
}
