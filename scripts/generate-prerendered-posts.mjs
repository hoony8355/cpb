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

const headingIdFromText = (text, fallback) => {
  const normalized = String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return normalized || fallback;
};

const extractHeadings = (markdown = '') => {
  const headingRegex = /^(##|###)\s+(.+)$/gm;
  const matches = Array.from(markdown.matchAll(headingRegex));
  return matches.map((match, index) => {
    const level = match[1].length;
    const title = match[2].replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim();
    const id = headingIdFromText(title, `section-${index + 1}`);
    return { level, title, id };
  });
};

const sanitizePrerenderContent = (markdown = '') =>
  markdown
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/```json[\s\S]*?```/gi, '')
    .replace(/```ld\+json[\s\S]*?```/gi, '');

const markdownToHtml = (markdown) => {
  const escaped = escapeHtml(markdown);
  const html = escaped
    .replace(/```([\s\S]*?)```/g, (_, code) => `<pre><code>${code.trim()}</code></pre>`)
    .replace(/^###\s+(.*)$/gm, (_, title) => `<h3 id="${headingIdFromText(title, 'section')}">${title}</h3>`)
    .replace(/^##\s+(.*)$/gm, (_, title) => `<h2 id="${headingIdFromText(title, 'section')}">${title}</h2>`)
    .replace(/^#\s+(.*)$/gm, '<h1>$1</h1>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" />')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/^\s*[-*]\s+(.*)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (group) => `<ul>${group}</ul>`)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n{2,}/g, '</p><p>')
    .replace(/\n/g, '<br />');

  return `<p>${html}</p>`
    .replace(/<p>\s*(<h[1-6][\s\S]*?<\/h[1-6]>)\s*<\/p>/g, '$1')
    .replace(/<p>\s*(<ul>[\s\S]*?<\/ul>)\s*<\/p>/g, '$1')
    .replace(/<p>\s*(<pre>[\s\S]*?<\/pre>)\s*<\/p>/g, '$1')
    .replace(/<p>\s*(<img [^>]+>)\s*<\/p>/g, '$1')
    .replace(/<p>\s*<\/p>/g, '');
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

const renderPage = ({ slug, title, description, date, authorName, keywords, image, content, faq, products }) => {
  const sanitizedContent = sanitizePrerenderContent(content || '');
  const canonicalUrl = `${BASE_URL}/post/${slug}`;
  const safeTitle = escapeHtml(title || 'Untitled Post');
  const safeDescription = escapeHtml(description || '');
  const safeAuthorName = escapeHtml(authorName || SITE_NAME);
  const renderedBody = markdownToHtml(sanitizedContent);
  const tableOfContents = extractHeadings(sanitizedContent);
  const articleSchema = {
    '@type': 'BlogPosting',
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
  const breadcrumbSchema = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: title || 'Untitled Post', item: canonicalUrl },
    ],
  };
  const faqSchema =
    Array.isArray(faq) && faq.length > 0
      ? {
          '@type': 'FAQPage',
          mainEntity: faq.map((item) => ({
            '@type': 'Question',
            name: item?.question || '',
            acceptedAnswer: { '@type': 'Answer', text: item?.answer || '' },
          })),
        }
      : null;
  const productListSchema =
    Array.isArray(products) && products.length > 0
      ? {
          '@type': 'ItemList',
          itemListElement: products.map((product, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Product',
              name: product?.name || '',
              description: product?.description || '',
              url: product?.link || '',
              image: product?.imageUrl || undefined,
              aggregateRating:
                product?.rating && product?.reviewCount
                  ? {
                      '@type': 'AggregateRating',
                      ratingValue: product.rating,
                      reviewCount: product.reviewCount,
                    }
                  : undefined,
            },
          })),
        }
      : null;
  const tableOfContentsSchema =
    tableOfContents.length > 0
      ? {
          '@type': 'ItemList',
          name: `${title || 'Untitled Post'} 목차`,
          itemListElement: tableOfContents.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.title,
            url: `${canonicalUrl}#${item.id}`,
          })),
        }
      : null;
  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [articleSchema, breadcrumbSchema, faqSchema, productListSchema, tableOfContentsSchema].filter(Boolean),
  };
  const tocHtml =
    tableOfContents.length > 0
      ? `<nav aria-label="Table of contents" class="toc"><p class="toc-title">목차</p><ul>${tableOfContents
          .map(
            (item) =>
              `<li class="${item.level === 3 ? 'toc-sub' : ''}"><a href="#${item.id}">${escapeHtml(item.title)}</a></li>`
          )
          .join('')}</ul></nav>`
      : '';

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
  <script type="application/ld+json">${JSON.stringify(schemaGraph)}</script>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; background: #f8fafc; color: #111827; }
    .container { max-width: 760px; margin: 0 auto; padding: 24px 16px 64px; }
    h1 { font-size: 2rem; margin-bottom: 8px; }
    .meta { color: #6b7280; margin-bottom: 20px; }
    article { line-height: 1.75; background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
    ul { padding-left: 20px; }
    img { max-width: 100%; height: auto; border-radius: 12px; margin: 12px 0; }
    pre { overflow-x: auto; background: #0f172a; color: #e2e8f0; padding: 12px; border-radius: 8px; }
    a { color: #0369a1; }
    .toc { margin-bottom: 20px; padding: 14px; border: 1px solid #e2e8f0; border-radius: 10px; background: #f8fafc; }
    .toc-title { margin-top: 0; margin-bottom: 8px; font-weight: 700; }
    .toc-sub { margin-left: 16px; }
  </style>
</head>
<body>
  <main class="container">
    <h1>${safeTitle}</h1>
    <p class="meta">${escapeHtml(new Date(date).toLocaleDateString('ko-KR'))} · ${safeAuthorName}</p>
    <article>${tocHtml}${renderedBody}</article>
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
    const faq = Array.isArray(data.faq) ? data.faq : [];
    const products = Array.isArray(data.products) ? data.products : [];
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
      faq,
      products,
    });

    const outputDir = path.join(PRERENDER_DIR, slug);
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'index.html'), html, 'utf8');
    count += 1;
  }

  console.log(`prerendered ${count} post pages`);
};

generatePrerenderPages();
