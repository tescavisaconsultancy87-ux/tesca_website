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

export const documents: DocumentItem[] = [];

export function getDocumentBySlug(slug: string): DocumentItem | undefined {
  return documents.find((doc) => doc.slug.toLowerCase() === slug.toLowerCase());
}

export function getAllDocumentSlugs(): string[] {
  return documents.map((doc) => doc.slug);
}
