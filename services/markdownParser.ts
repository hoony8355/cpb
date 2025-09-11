// In a real application, it's highly recommended to use a robust library like 'marked' or 'react-markdown'.
// This is a simplified placeholder to demonstrate the concept.
export const parseMarkdown = (markdown: string): string => {
  let html = markdown
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
    .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
    .replace(/\*(.*)\*/gim, '<i>$1</i>')
    .replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2' />")
    .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2'>$1</a>")
    .replace(/^\s*\n\*/gm, '<ul>\n*')
    .replace(/^(\*.+)\s*\n([^\*])/gm, '$1\n</ul>\n\n$2')
    .replace(/^\* (.*$)/gim, '<li>$1</li>')
    .replace(/\n/g, '<br />');

  // Fix for list brakes
  html = html.replace(/<\/li><br \/>/g, '</li>');
  html = html.replace(/<\/ul><br \/>/g, '</ul>');
    
  return html.trim();
};
