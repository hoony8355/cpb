// A simple markdown to HTML converter. For a production app, use a robust library like 'marked' or 'react-markdown'.
export const parseMarkdown = (markdown: string): string => {
    return markdown
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>')
        .replace(/\n/g, '<br />');
};
