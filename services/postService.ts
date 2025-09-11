import type { Post } from '../types';
import { parseMarkdown } from './markdownParser';
import type { Frontmatter } from './markdownParser';

let postsCache: Post[] | null = null;

function extractCoverImage(content: string): string | undefined {
  const imageRegex = /!\[.*?\]\((.*?)\)/;
  const match = content.match(imageRegex);
  return match?.[1];
}

export function getAllPosts(): Post[] {
  if (postsCache) {
    return postsCache;
  }

  const modules = import.meta.glob('/posts/*.md', { as: 'raw', eager: true });
  
  const posts: Post[] = Object.entries(modules).map(([path, rawContent]) => {
    const slug = path.split('/').pop()?.replace('.md', '') ?? 'unknown-slug';
    const { frontmatter, content, schemaJson } = parseMarkdown(rawContent);
    const fm = frontmatter as Frontmatter;

    return {
      slug,
      title: (fm.title as string) || 'Untitled Post',
      date: (fm.date as string) || new Date().toISOString(),
      description: (fm.description as string) || '',
      keywords: (fm.keywords as string[]) || [],
      content,
      coverImage: extractCoverImage(content),
      schemaJson,
    };
  });

  // Sort posts by date in descending order (newest first)
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  postsCache = posts;
  return postsCache;
}

export function getPostBySlug(slug: string): Post | undefined {
  const allPosts = getAllPosts();
  return allPosts.find(post => post.slug === slug);
}
