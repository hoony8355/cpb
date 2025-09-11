export interface Frontmatter {
  [key: string]: string | string[];
}

export interface ParsedMarkdown {
  frontmatter: Frontmatter;
  content: string;
  schemaJson?: string;
}

export function parseMarkdown(rawContent: string): ParsedMarkdown {
  const frontmatterRegex = /^---\n([\s\S]+?)\n---/;
  const match = frontmatterRegex.exec(rawContent);

  let contentAfterFrontmatter = rawContent;
  const frontmatter: Frontmatter = {};

  if (match) {
    const frontmatterRaw = match[1];
    contentAfterFrontmatter = rawContent.slice(match[0].length).trim();
    
    frontmatterRaw.split('\n').forEach(line => {
      const delimiterIndex = line.indexOf(':');
      if (delimiterIndex > -1) {
        const key = line.slice(0, delimiterIndex).trim();
        const value = line.slice(delimiterIndex + 1).trim();

        if (key && value) {
          if (key === 'keywords' && value.startsWith('[') && value.endsWith(']')) {
            frontmatter[key] = value.slice(1, -1).split(',').map(k => k.trim().replace(/^"|"$/g, ''));
          } else {
            frontmatter[key] = value.replace(/^['"]|['"]$/g, '');
          }
        }
      }
    });
  }

  // Extract JSON-LD schema script
  const schemaRegex = /<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/;
  const schemaMatch = contentAfterFrontmatter.match(schemaRegex);
  
  let content = contentAfterFrontmatter;
  let schemaJson: string | undefined;

  if (schemaMatch) {
    schemaJson = schemaMatch[1];
    // Remove the script tag from the content that will be rendered
    content = contentAfterFrontmatter.replace(schemaRegex, '').trim();
  }

  return { frontmatter, content, schemaJson };
}
