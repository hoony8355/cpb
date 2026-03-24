import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, 'posts');
const PUBLIC_DIR = path.join(ROOT, 'public');
const PRERENDER_DIR = path.join(PUBLIC_DIR, 'post');
const BASE_URL = 'https://cpb-five.vercel.app';
const SITE_NAME = 'Trend Spotter';

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const escapeHtml = (value = '') =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const markdownToHtml = (markdown) => {
  const escaped = escapeHtml(markdown);
  return escaped
    .replace(/^###\s+(.*)$/gm, '<h3>$1</h3>')
    .replace(/^##\s+(.*)$/gm, '<h2>$1</h2>')
    .replace(/^#\s+(.*)$/gm, '<h1>$1</h1>')
    .replace(/^\s*[-*]\s+(.*)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (group) => `<ul>${group}</ul>`)
    .replace(/\n\n+/g, '</p><p>')
    .replace(/\n/g, '<br />');
};

const listMarkdown = () =>
  fs.readdirSync(POSTS_DIR).filter((name) => name.toLowerCase().endsWith('.md'));

const detectCoverImage = (content) => {
  const imageRegex = /!\[.*?\]\((.*?)\)/;
  const match = content.match(imageRegex);
  if (match?.[1]) {
    return match[1].split(',')[0].trim();
  }
  return '';
};

const cleanupPrerenderDir = () => {
  fs.rmSync(PRERENDER_DIR, { recursive: true, force: true });
  fs.mkdirSync(PRERENDER_DIR, { recursive: true });
};

const renderPage = ({ slug, title, description, date, authorName, keywords, image, content }) => {
  const canonicalUrl = `${BASE_URL}/post/${slug}`;
  const safeTitle = escapeHtml(title || 'Untitled Post');
  const safeDescription = escapeHtml(description || '');
  const safeAuthorName = escapeHtml(authorName || SITE_NAME);
  const renderedBody = markdownToHtml(content || '');
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title || 'Untitled Post',
    description: description || '',
    datePublished: date,
    dateModified: date,
    author: { '@type': 'Person', name: authorName || SITE_NAME },
    image: image ? [image] : undefined,
    mainEntityOfPage: canonicalUrl,
    publisher: { '@type': 'Organization', name: SITE_NAME },
    keywords: Array.isArray(keywords) ? keywords.join(', ') : '',
  };

  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${safeTitle} | ${SITE_NAME}</title>
  <meta name="description" content="${safeDescription}" />
  <meta name="robots" content="index,follow,max-image-preview:large" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="${SITE_NAME}" />
  <meta property="og:title" content="${safeTitle} | ${SITE_NAME}" />
  <meta property="og:description" content="${safeDescription}" />
  <meta property="og:url" content="${canonicalUrl}" />
  ${image ? `<meta property="og:image" content="${escapeHtml(image)}" />` : ''}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${safeTitle} | ${SITE_NAME}" />
  <meta name="twitter:description" content="${safeDescription}" />
  ${image ? `<meta name="twitter:image" content="${escapeHtml(image)}" />` : ''}
  <script type="application/ld+json">${JSON.stringify(articleSchema)}</script>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; background: #f8fafc; color: #111827; }
    .container { max-width: 760px; margin: 0 auto; padding: 24px 16px 64px; }
    h1 { font-size: 2rem; margin-bottom: 8px; }
    .meta { color: #6b7280; margin-bottom: 20px; }
    article { line-height: 1.75; background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
    ul { padding-left: 20px; }
  </style>
</head>
<body>
  <main class="container">
    <h1>${safeTitle}</h1>
    <p class="meta">${escapeHtml(new Date(date).toLocaleDateString('ko-KR'))} · ${safeAuthorName}</p>
    <article><p>${renderedBody}</p></article>
  </main>
</body>
</html>`;
};

const generatePrerenderPages = () => {
  cleanupPrerenderDir();

  const files = listMarkdown();
  let count = 0;

  for (const file of files) {
    const absolutePath = path.join(POSTS_DIR, file);
    const source = fs.readFileSync(absolutePath, 'utf8');
    const { data, content } = matter(source);

    const rawFileName = file.replace(/\.md$/i, '');
    const slug = slugify(decodeURIComponent(rawFileName));
    if (!slug) continue;

    const title = data.title || 'Untitled Post';
    const description = data.description || '';
    const authorName = data.author?.name || SITE_NAME;
    const keywords = Array.isArray(data.keywords) ? data.keywords : [];
    const image = data.coverImage || detectCoverImage(content);
    const publishedDate = data.date ? new Date(data.date).toISOString() : new Date().toISOString();

    const html = renderPage({
      slug,
      title,
      description,
      date: publishedDate,
      authorName,
      keywords,
      image,
      content,
    });

    const outputDir = path.join(PRERENDER_DIR, slug);
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'index.html'), html, 'utf8');
    count += 1;
  }

  console.log(`prerendered ${count} post pages`);
};

generatePrerenderPages();
