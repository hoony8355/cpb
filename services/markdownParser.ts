
import { Post } from '../types';

interface ParsedMarkdown {
  metadata: Omit<Post, 'slug' | 'content' | 'schemaJson'>;
  content: string;
  schemaJson: string | undefined;
}

export const parseMarkdown = (slug: string, rawContent: string): Post => {
  const parts = rawContent.split('---');
  const frontmatter = parts[1];
  let body = parts.slice(2).join('---').trim();

  const metadata: any = {};
  frontmatter.split('\n').forEach(line => {
    if (line.trim()) {
      const firstColonIndex = line.indexOf(':');
      if (firstColonIndex !== -1) {
        const key = line.slice(0, firstColonIndex).trim();
        const value = line.slice(firstColonIndex + 1).trim().replace(/^['"]|['"]$/g, '');
        metadata[key] = value;
      }
    }
  });
  
  // Parse keywords from string to array
  if (metadata.keywords && typeof metadata.keywords === 'string') {
      metadata.keywords = JSON.parse(metadata.keywords);
  } else {
      metadata.keywords = [];
  }

  // Extract schema script
  let schemaJson: string | undefined = undefined;
  const schemaRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/;
  const match = body.match(schemaRegex);
  if (match && match[1]) {
    schemaJson = match[1].trim();
    body = body.replace(schemaRegex, '').trim();
  }

  return {
    slug,
    title: metadata.title || 'Untitled Post',
    date: metadata.date || new Date().toISOString().split('T')[0],
    description: metadata.description || '',
    keywords: metadata.keywords || [],
    author: {
        name: metadata.author || 'Trend Spotter 콘텐츠 팀',
        image: metadata.authorImage,
        bio: metadata.authorBio,
        socialLinks: metadata.authorSocialLinks ? JSON.parse(metadata.authorSocialLinks) : []
    },
    content: body,
    schemaJson,
  };
};
