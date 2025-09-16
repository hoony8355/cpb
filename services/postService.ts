// FIX: Add a triple-slash directive to include Vite's client types. This resolves errors with `import.meta.glob` and ensures module contents are correctly typed as strings.
/// <reference types="vite/client" />

import { Post } from '../types';
import { parseMarkdown } from './markdownParser';

let postsCache: Post[] | null = null;

const defaultAuthor = {
  name: 'Trend Spotter 콘텐츠 팀',
  image:
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2QxZDVlMCI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgMThjLTQuNDEgMC04LTMuNTktOC04czMuNTktOCA4IDggOCAzLjU5IDggOC0zLjU5IDgtOCA4eiIvPjxwYXRoIGQ9Ik0xMiA2Yy0yLjIyIDAtNC4yNS44Ni01LjgyIDIuMjhsMS40MiAxLjQyQzguNzggOC41MyA5LjgzIDggMTIgOHMyLjIyLjUzIDMuMzkgMS43bDEuNDItMS40MkM4LjI1IDYuODYgNC4yMiA2IDEyIDZ6Ii8+PC9zdmc+',
  bio: '최신 기술 트렌드를 분석하고 소비자의 현명한 선택을 돕는 콘텐츠 전문가입니다.',
  socialLinks: ['https://www.linkedin.com/in/kwang-hoon-kim-13a139277'],
};

// ✅ 파일명/요청 slug를 모두 동일 규칙으로 표준화(소문자+하이픈)
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // 공백/특수문자 → 하이픈
    .replace(/-+/g, '-') // 연속 하이픈 정리
    .replace(/^-|-$/g, ''); // 앞뒤 하이픈 제거

const extractCoverImage = (content: string): string | undefined => {
  const imageRegex = /!\[.*?\]\((.*?)\)/;
  const match = content.match(imageRegex);
  if (match && match[1]) {
    return match[1].split(',')[0].trim();
  }
  return undefined;
};

export const getAllPosts = async (): Promise<Post[]> => {
  if (postsCache) return postsCache;

  // ⚠️ Vite 기준: services/ 에서 posts/ 로 상대 경로
  // 기존 '/posts/*.md' 대신 '../posts/*.md'를 권장 (환경 따라 절대경로 슬래시는 깨질 수 있음)
  const modules = import.meta.glob('../posts/*.md', { as: 'raw', eager: true });

  const posts: Post[] = Object.entries(modules).map(([path, rawContent]) => {
    const rawFileName = path.split('/').pop()!.replace(/\.md$/i, '');
    // 파일명을 URL 디코드 후 slugify → 항상 깨끗한 slug로 통일
    const cleanSlug = slugify(decodeURIComponent(rawFileName));

    // parseMarkdown(firstArg=slug)는 기존 시그니처 유지
    const post = parseMarkdown(cleanSlug, rawContent as string);

    // slug를 최종적으로 표준화된 값으로 강제
    post.slug = cleanSlug;

    // 썸네일(첫 이미지) 자동 추출
    post.coverImage = post.coverImage ?? extractCoverImage(post.content);

    // 기본 author 보강
    post.author = {
      name: post.author?.name || defaultAuthor.name,
      image: post.author?.image || defaultAuthor.image,
      bio: post.author?.bio || defaultAuthor.bio,
      socialLinks:
        post.author?.socialLinks && post.author.socialLinks.length > 0
          ? post.author.socialLinks
          : defaultAuthor.socialLinks,
    };

    return post;
  });

  // 최신 정렬(기존 로직 유지)
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  postsCache = posts;
  return posts;
};

export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  // URL 파라미터로 들어온 slug도 동일 규칙으로 정규화해서 비교
  const clean = slugify(decodeURIComponent(slug));
  const posts = await getAllPosts();
  return posts.find((post) => post.slug === clean) || null;
};
