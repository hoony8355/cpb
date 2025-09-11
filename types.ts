
export interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
  keywords: string[];
  coverImage?: string;
  schemaJson?: string;
  author: Author;
  // Structured content
  intro: string;
  products: Product[];
  conclusion: string;
  faq: FaqItem[];
  // FIX: Add 'content' property to store the raw markdown body.
  // This resolves type errors in markdownParser.ts and postService.ts where this property was being assigned or accessed.
  content: string;
}

export interface Product {
  name: string;
  imageUrl?: string;
  rating?: string;
  reviewCount?: string;
  description: string;
  pros: string[];
  cons: string[];
  link: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Author {
  name: string;
  image?: string;
  bio?: string;
  socialLinks?: string[];
}

export interface YouTubeVideo {
  id: string;
  reason: string;
}

export interface Breadcrumb {
  name:string;
  path: string;
}