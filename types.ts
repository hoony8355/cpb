export interface Author {
  name: string;
  avatarUrl: string;
  bio: string;
}

export interface Post {
  slug: string;
  title: string;
  author: Author;
  publishDate: string; // ISO 8601 format
  excerpt: string;
  content: string; // Markdown content
  tags: string[];
  featuredImageUrl?: string;
}
