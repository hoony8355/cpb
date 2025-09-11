import matter from 'gray-matter';
import { Post, Author, Product, FaqItem } from '../types';

/**
 * Parses a raw markdown string with YAML frontmatter into a Post object.
 * @param slug - The slug of the post, derived from the filename.
 * @param rawContent - The full content of the markdown file.
 * @returns A structured Post object.
 */
export const parseMarkdown = (slug: string, rawContent: string): Post => {
  const { data, content } = matter(rawContent);

  // Coalesce frontmatter data with sensible defaults to ensure type safety.
  const author: Author = {
    name: data.author?.name || '',
    image: data.author?.image,
    bio: data.author?.bio,
    socialLinks: data.author?.socialLinks || [],
  };

  const products: Product[] = data.products || [];
  const faq: FaqItem[] = data.faq || [];

  return {
    slug,
    title: data.title || 'Untitled Post',
    description: data.description || '',
    date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
    keywords: data.keywords || [],
    author,
    content: content.trim(),
    products,
    faq,
  };
};
