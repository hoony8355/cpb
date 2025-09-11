// In a real application, you would use a library like 'marked' and 'dompurify'
// to safely convert Markdown to HTML.

export const parseMarkdownToHTML = (markdown: string): string => {
    // This is a placeholder. A real implementation would be more robust and secure.
    // For example, using `marked` library:
    // import { marked } from 'marked';
    // import DOMPurify from 'dompurify';
    // return DOMPurify.sanitize(marked.parse(markdown));

    // A simple conversion for demonstration purposes
    if (!markdown) return '';
    
    // Simple replacements (not exhaustive or perfectly safe)
    let html = markdown
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        .replace(/`(.*?)`/gim, '<code>$1</code>')
        .replace(/\n/gim, '<br />');

    return html;
};
