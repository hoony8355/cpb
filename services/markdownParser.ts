import { marked } from 'marked';

export const markdownParser = {
  parse: (markdown: string): string => {
    // Configure marked to be more lenient with line breaks and enable GitHub Flavored Markdown.
    marked.setOptions({
      gfm: true,
      breaks: true,
      // For production apps, use a dedicated sanitizer like DOMPurify instead of the deprecated `sanitize` option.
      sanitize: true, 
    });
    const html = marked.parse(markdown);
    
    // marked.parse can return a Promise in some configurations, ensure a string is returned.
    return typeof html === 'string' ? html : '';
  },
};
