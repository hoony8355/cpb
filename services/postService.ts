
import { Post } from '../types';
import { parseMarkdown } from './markdownParser';

let postsCache: Post[] | null = null;

const defaultAuthor = {
    name: 'Trend Spotter 콘텐츠 팀',
    image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2QxZDVlMCI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgMThjLTQuNDEgMC04LTMuNTktOC04czMuNTktOCA4IDggOCAzLjU5IDggOC0zLjU5IDgtOCA4eiIvPjxwYXRoIGQ9Ik0xMiA2Yy0yLjIyIDAtNC4yNS44Ni01LjgyIDIuMjhsMS40MiAxLjQyQzguNzggOC41MyA5LjgzIDggMTIgOHMyLjIyLjUzIDMuMzkgMS43bDEuNDItMS40MkM4LjI1IDYuODYgNC4yMiA2IDEyIDZ6Ii8+PC9zdmc+',
    bio: '최신 기술 트렌드를 분석하고 소비자의 현명한 선택을 돕는 콘텐츠 전문가입니다.',
    socialLinks: ['https://www.linkedin.com/in/kwang-hoon-kim-13a139277']
};


const extractCoverImage = (content: string): string | undefined => {
  const imageRegex = /!\[.*?\]\((.*?)\)/;
  const match = content.match(imageRegex);
  if (match && match[1]) {
    // Handle comma-separated URLs
    return match[1].split(',')[0].trim();
  }
  return undefined;
};

export const getAllPosts = async (): Promise<Post[]> => {
  if (postsCache) {
    return postsCache;
  }

  const modules = import.meta.glob('/posts/*.md', { as: 'raw', eager: true });
  const posts: Post[] = Object.entries(modules).map(([path, rawContent]) => {
    const slug = path.split('/').pop()!.replace('.md', '');
    const post = parseMarkdown(slug, rawContent);
    post.coverImage = extractCoverImage(post.content);
    
    // Apply default author details if not specified in post
    post.author = {
        name: post.author.name || defaultAuthor.name,
        image: post.author.image || defaultAuthor.image,
        bio: post.author.bio || defaultAuthor.bio,
        socialLinks: post.author.socialLinks && post.author.socialLinks.length > 0 ? post.author.socialLinks : defaultAuthor.socialLinks
    };

    return post;
  });

  // Sort by date, newest first
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  postsCache = posts;
  return posts;
};

export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  const posts = await getAllPosts();
  return posts.find(post => post.slug === slug) || null;
};
