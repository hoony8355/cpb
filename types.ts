export interface Author {
  name: string;
  avatar: string;
}

export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  coverImage: string;
  author: Author;
  keywords: string[];
  content: string;
  schemaJson?: string;
}
