export interface Post {
  slug: string;
  title: string;
  author: string;
  publishDate: string;
  excerpt: string;
  content: string; // Markdown content
  tags: string[];
  imageUrl?: string;
  relatedContent?: RelatedItem[];
}

export interface Author {
    name: string;
    bio: string;
    avatarUrl: string;
}

export interface RelatedItem {
    title: string;
    url: string;
}

export interface YouTubeVideo {
    videoId: string;
    title: string;
}
