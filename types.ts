
export interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
  keywords: string[];
  content: string;
  coverImage?: string;
  schemaJson?: string;
  author: Author;
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
  name: string;
  path: string;
}
