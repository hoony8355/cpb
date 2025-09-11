
export interface Frontmatter {
  [key: string]: string | string[];
}

export interface ParsedMarkdown {
  frontmatter: Frontmatter;
  content: string;
}

export function parseMarkdown(rawContent: string): ParsedMarkdown {
  const frontmatterRegex = /^---\n([\s\S]+?)\n---/;
  const match = frontmatterRegex.exec(rawContent);

  if (!match) {
    return { frontmatter: {}, content: rawContent };
  }

  const frontmatterRaw = match[1];
  const content = rawContent.slice(match[0].length).trim();
  const frontmatter: Frontmatter = {};

  frontmatterRaw.split('\n').forEach(line => {
    const parts = line.split(':');
    const key = parts[0]?.trim();
    const value = parts.slice(1).join(':').trim();

    if (key && value) {
      // Handle keywords array specifically
      if (key === 'keywords' && value.startsWith('[') && value.endsWith(']')) {
        frontmatter[key] = value.slice(1, -1).split(',').map(k => k.trim().replace(/^"|"$/g, ''));
      } else {
        // Remove quotes from string values
        frontmatter[key] = value.replace(/^['"]|['"]$/g, '');
      }
    }
  });

  return { frontmatter, content };
}
