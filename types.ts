export interface Author {
  name: string;
  image: string;
  bio: string;
  socialLinks?: string[];
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
  keywords: string[];
  coverImage: string;
  author: Author;
  content: string;
  schemaJson?: string;
}

export interface YouTubeVideo {
  videoId: string;
  reason: string;
}

export interface Breadcrumb {
  name: string;
  path: string;
}
