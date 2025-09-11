import matter from 'gray-matter';
import { Post } from '../types';

export const parseMarkdown = (slug: string, rawContent: string): Post => {
  const { data, content } = matter(rawContent);

  if (!data.title) {
    throw new Error(`Missing title for post with slug: ${slug}`);
  }
  if (!data.date) {
    throw new Error(`Missing date for post with slug: ${slug}`);
  }

  return {
    slug,
    title: data.title,
    description: data.description || '',
    date: new Date(data.date).toISOString(),
    keywords: data.keywords || [],
    author: {
        name: data.author?.name || '',
        image: data.author?.image || '',
        bio: data.author?.bio || '',
        socialLinks: data.author?.socialLinks || [],
    },
    content,
    products: data.products || [],
    faq: data.faq || [],
  };
};
