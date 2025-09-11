export interface Post {
  id: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  content: string; // Markdown content
  tags: string[];
  relatedPosts?: Post[];
  seo?: SeoData;
}

export interface SeoData {
  title: string;
  description: string;
  keywords: string;
}

export interface Author {
    name: string;
    bio: string;
    avatarUrl: string;
}
