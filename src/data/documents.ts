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
    id: 'ielts-speaking-cue-cards',
    slug: 'ielts-speaking-cue-cards',
    title: 'IELTS Speaking Cue Cards Handbook (Latest Topics)',
    description: 'Comprehensive collection of official IELTS speaking Part 2 cue cards, sample answers, and key vocabulary for high band scores.',
    category: 'IELTS & Test Prep',
    pdfUrl: '/material/IELTS-Speaking-Cue-Cards.pdf',
    fileSize: '1.4 MB',
    updatedAt: '2026-08-15',
    tags: ['IELTS', 'Speaking', 'Cue Cards', 'Test Prep'],
    featured: true,
    author: 'TESCA Academic Team',
  },
  {
    id: 'ielts-vocabulary-cheat-sheet',
    slug: 'ielts-vocabulary-cheat-sheet',
    title: 'IELTS Vocabulary Cheat Sheet - Top 100 Words',
    description: 'High-yield 8+ band vocabulary list with synonyms, collocations, and contextual sentence examples for Writing and Speaking.',
    category: 'IELTS & Test Prep',
    pdfUrl: '/material/IELTS-Vocabulary-Cheat-Sheet-Top-100-Words.pdf',
    fileSize: '2.9 MB',
    updatedAt: '2026-08-10',
    tags: ['IELTS', 'Vocabulary', 'Band 8+', 'Cheat Sheet'],
    featured: true,
    author: 'TESCA Academic Team',
  },
  {
    id: 'ielts-writing-task-2-template',
    slug: 'ielts-writing-task-2-template',
    title: 'IELTS Writing Task 2 Master Template & Essay Structures',
    description: 'Proven essay outlines, sentence starters, linkers, and paragraph structures for Opinion, Discussion, and Problem-Solution essays.',
    category: 'IELTS & Test Prep',
    pdfUrl: '/material/task-2-template.pdf',
    fileSize: '1.3 MB',
    updatedAt: '2026-08-01',
    tags: ['IELTS', 'Writing Task 2', 'Templates', 'Essay Guide'],
    featured: false,
    author: 'TESCA Academic Team',
  },
  {
    id: 'tesca-study-abroad-guide',
    slug: 'tesca-study-abroad-guide',
    title: 'TESCA Complete Study Abroad & Visa Guide 2026',
    description: 'Essential guide covering step-by-step application procedures, popular country requirements, financial planning, and visa checklists.',
    category: 'Visa & Immigration',
    pdfUrl: '/material/IELTS-Speaking-Cue-Cards.pdf',
    fileSize: '1.5 MB',
    updatedAt: '2026-08-18',
    tags: ['Study Abroad', 'Visa Guide', 'TESCA Brochure', 'Checklist'],
    featured: true,
    author: 'TESCA Visa Advisory Desk',
  },
];

export function getDocumentBySlug(slug: string): DocumentItem | undefined {
  return documents.find((doc) => doc.slug.toLowerCase() === slug.toLowerCase());
}

export function getAllDocumentSlugs(): string[] {
  return documents.map((doc) => doc.slug);
}
