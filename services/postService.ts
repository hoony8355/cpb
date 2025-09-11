import type { Post, Author } from '../types';
import { parseMarkdown, Frontmatter } from './markdownParser';

let postsCache: Post[] | null = null;

const defaultAuthor: Author = {
  name: "Trend Spotter 콘텐츠 팀",
  image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='50' fill='%23e0f2fe'%3E%3C/rect%3E%3Cpath d='M30 70 L50 30 L70 70 Z' fill='%2338bdf8' /%3E%3Cpath d='M45 60 L60 40 L75 60 Z' fill='%230ea5e9' fill-opacity='0.8'/%3E%3C/svg%3E",
  bio: "최신 기술 트렌드를 분석하고 소비자의 현명한 선택을 돕는 콘텐츠 전문가입니다.",
  socialLinks: ["https://www.linkedin.com/in/kwang-hoon-kim-13a139277"]
};

function extractCoverImage(content: string): string {
    const imageRegex = /!\[.*?\]\((.*?)\)/;
    const match = content.match(imageRegex);
    if (match && match[1]) {
        // Handle comma-separated URLs by taking the first one
        return match[1].split(',')[0].trim();
    }
    // Return a default placeholder if no image is found
    return 'https://via.placeholder.com/800x400.png?text=No+Image+Found';
}

function getAuthorFromFrontmatter(frontmatter: Frontmatter): Author {
  if (typeof frontmatter.author === 'string' && frontmatter.author) {
    return {
      name: frontmatter.author,
      image: (frontmatter.authorImage as string) || defaultAuthor.image,
      bio: (frontmatter.authorBio as string) || `Latest trends and reviews by ${frontmatter.author}.`,
      socialLinks: (frontmatter.authorSocialLinks as string[]) || [],
    };
  }
  return defaultAuthor;
}

export function getAllPosts(): Post[] {
  if (postsCache) {
    return postsCache;
  }

  const modules = import.meta.glob('/posts/*.md', { as: 'raw', eager: true });
  
  const posts: Post[] = Object.entries(modules).map(([path, rawContent]) => {
    const slug = path.split('/').pop()?.replace('.md', '') || '';
    const { frontmatter, content, schemaJson } = parseMarkdown(rawContent);

    return {
      slug,
      title: (frontmatter.title as string) || 'Untitled Post',
      date: (frontmatter.date as string) || new Date().toISOString(),
      description: (frontmatter.description as string) || '',
      keywords: (frontmatter.keywords as string[]) || [],
      coverImage: (frontmatter.coverImage as string) || extractCoverImage(content),
      author: getAuthorFromFrontmatter(frontmatter),
      content,
      schemaJson,
    };
  });

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  postsCache = posts;
  return postsCache;
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find(post => post.slug === slug);
}
