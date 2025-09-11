export interface Post {
  slug: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  content: string; // Markdown content
  tags: string[];
  imageUrl?: string;
}

export interface Author {
    name: string;
    avatarUrl: string;
    bio: string;
}
