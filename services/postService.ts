import { Post, Author } from '../types';
import { parseMarkdown } from './markdownParser';

let postsCache: Post[] | null = null;

const defaultAuthor: Author = {
  name: 'Trend Spotter 콘텐츠 팀',
  image: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2QxZDVlMCI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgM2MxLjY2IDAgMyAxLjM0IDMgMyAwIDEuMjktLjc4IDIuNC0xLjg3IDIuODMuNDYuNTIgLjc3IDEuMiAuNzcgMS45OHYxLjJoLS4wMWMwIC42OS0uNTYgMS4yNS0xLjI1IDEuMjVoLTMuMzVjLS42OSAwLTEuMjUtLjU2LTEuMjUtMS4yNVYxMi44YzAtLjc4LjMxLTEuNDYuNzctMS45OEM4LjM0IDkuOSA3LjU2IDguNzkgNy41NiA3LjVjMC0xLjY2IDEuMzQtMyAzLTN6bTAgOWM0LjQxIDAgOCAzLjU5IDggOHMwLTggLTggLTggLTgtMy41OS04LThzMy41OS04IDgtOHoiLz48L3N2Zz4=`,
  bio: '최신 기술 트렌드를 분석하고 소비자의 현명한 선택을 돕는 콘텐츠 전문가입니다.',
  socialLinks: ['https://www.linkedin.com/in/kwang-hoon-kim-13a139277'],
};

const extractCoverImage = (content: string): string | undefined => {
  const imageRegex = /!\[.*?\]\((.*?)\)/;
  const match = content.match(imageRegex);
  if (match && match[1]) {
    return match[1].split(',')[0].trim();
  }
  return undefined;
};

export const getAllPosts = async (): Promise<Post[]> => {
  if (postsCache) {
    return postsCache;
  }

  const modules = import.meta.glob('/posts/*.md', { as: 'raw', eager: true });
  const posts = Object.entries(modules)
    // Fix: Explicitly type the return value of map to help TypeScript's inference.
    .map(([path, rawContent]): Post | null => {
      try {
        const slug = path.split('/').pop()?.replace('.md', '') ?? '';
        const { metadata, body, schemaJson } = parseMarkdown(rawContent);
        
        const author: Author = {
            name: metadata.author || defaultAuthor.name,
            image: metadata.authorImage || defaultAuthor.image,
            bio: metadata.authorBio || defaultAuthor.bio,
            socialLinks: metadata.authorSocialLinks || defaultAuthor.socialLinks
        };

        return {
          slug,
          title: metadata.title || 'Untitled Post',
          date: metadata.date,
          description: metadata.description,
          keywords: metadata.keywords || [],
          content: body,
          coverImage: extractCoverImage(body),
          author: author,
          schemaJson: schemaJson,
        };
      } catch (error) {
        console.error(`Error parsing markdown file ${path}:`, error);
        return null;
      }
    })
    .filter((post): post is Post => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  postsCache = posts;
  return posts;
};

export const getPostBySlug = async (slug: string): Promise<Post | undefined> => {
  const posts = await getAllPosts();
  return posts.find(post => post.slug === slug);
};