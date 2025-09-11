export const parseMarkdown = (
  content: string
): { metadata: any; body: string; schemaJson?: string } => {
  const metadata: any = {};
  
  const scriptRegex = /<script type="application\/ld\+json">(.*?)<\/script>/s;
  const scriptMatch = content.match(scriptRegex);
  const schemaJson = scriptMatch ? scriptMatch[1] : undefined;
  
  const contentWithoutSchema = content.replace(scriptRegex, '').trim();
  
  const metadataRegex = /^---([\s\S]*?)---/;
  const match = contentWithoutSchema.match(metadataRegex);

  if (!match) {
    return { metadata: {}, body: contentWithoutSchema, schemaJson };
  }
  
  const metadataStr = match[1].trim();
  const body = contentWithoutSchema.substring(match[0].length).trim();
  
  metadataStr.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    const value = valueParts.join(':').trim();
    const cleanKey = key.trim();
    
    if (value.startsWith('[') && value.endsWith(']')) {
      metadata[cleanKey] = value.substring(1, value.length - 1).split(',').map(s => s.trim().replace(/"/g, ''));
    } else {
      metadata[cleanKey] = value.replace(/^['"]|['"]$/g, '');
    }
  });

  return { metadata, body, schemaJson };
};
