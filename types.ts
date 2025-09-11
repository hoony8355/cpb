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

export interface Product {
  name: string;
  link: string;
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
  description: string;
  pros: string[];
  cons: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  keywords: string[];
  author: Author;
  content: string;
  coverImage?: string;
  products: Product[];
  faq: FaqItem[];
}
