import matter from 'gray-matter';
import { Post, Author, Product, FaqItem } from '../types';

const stripQuotes = (value: string) => value.trim().replace(/^['"](.*)['"]$/, '$1').trim();

const recoverFrontmatterScalars = (rawContent: string) => {
  if (!rawContent.startsWith('---')) return { data: {}, content: rawContent };

  const secondFence = rawContent.indexOf('\n---', 3);
  if (secondFence === -1) return { data: {}, content: rawContent };

  const frontmatter = rawContent.slice(3, secondFence).trim();
  const content = rawContent.slice(secondFence + 4);
  const data: Record<string, any> = {};

  const pickScalar = (key: string) => {
    const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
    if (!match) return undefined;
    return stripQuotes(match[1]);
  };

  const title = pickScalar('title');
  const description = pickScalar('description');
  const date = pickScalar('date');

  if (title) data.title = title;
  if (description) data.description = description;
  if (date) data.date = date;

  const keywordsMatch = frontmatter.match(/^keywords:\s*([\s\S]*?)(?:\n[a-zA-Z_]+\s*:|$)/m);
  if (keywordsMatch) {
    const keywords = keywordsMatch[1]
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.startsWith('-'))
      .map((line) => stripQuotes(line.replace(/^-+\s*/, '')))
      .filter(Boolean);
    if (keywords.length > 0) data.keywords = keywords;
  }

  return { data, content };
};

/**
 * Parses a raw markdown string with YAML frontmatter into a Post object.
 * @param slug - The slug of the post, derived from the filename.
 * @param rawContent - The full content of the markdown file.
 * @returns A structured Post object.
 */
export const parseMarkdown = (slug: string, rawContent: string): Post => {
  let data: Record<string, any> = {};
  let content = rawContent;

  try {
    const parsed = matter(rawContent);
    data = parsed.data || {};
    content = parsed.content ?? rawContent;
  } catch (error) {
    console.warn(`[markdownParser] frontmatter parse failed for slug="${slug}". Falling back to body-only parse.`, error);
    const recovered = recoverFrontmatterScalars(rawContent);
    data = recovered.data;
    content = recovered.content;
  }

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
