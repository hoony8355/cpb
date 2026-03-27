import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, 'posts');
const PUBLIC_DIR = path.join(ROOT, 'public');
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

const escapeXml = (s = '') =>
  s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const markdownToPlainText = (markdown = '') =>
  markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[.*?\]\(.*?\)/g, ' ')
    .replace(/\[([^\]]+)\]\((.*?)\)/g, '$1')
    .replace(/<[^>]*>/g, ' ')
    .replace(/[#>*`~_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const cdataSafe = (s = '') => s.replaceAll(']]>', ']]]]><![CDATA[>');

const posts = fs
  .readdirSync(POSTS_DIR)
  .filter((name) => name.toLowerCase().endsWith('.md'))
  .map((file) => {
    const fullPath = path.join(POSTS_DIR, file);
    const source = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(source);
    const slug = slugify(decodeURIComponent(file.replace(/\.md$/i, '')));
    const title = data.title || slug;
    const description = data.description || '';
    const date = data.date ? new Date(data.date) : fs.statSync(fullPath).mtime;

    return {
      slug,
      title,
      description,
      fullText: markdownToPlainText(content),
      date,
      loc: `${BASE_URL}/post/${slug}`,
    };
  })
  .sort((a, b) => b.date.getTime() - a.date.getTime());

const html = `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>전체 게시글 목록 | ${SITE_NAME}</title>
  <meta name="description" content="${SITE_NAME} 전체 게시글 아카이브" />
  <meta name="robots" content="index,follow" />
  <link rel="canonical" href="${BASE_URL}/all-posts.html" />
</head>
<body>
  <main style="max-width:900px;margin:0 auto;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;">
    <h1>전체 게시글 목록</h1>
    <p>검색엔진과 사용자 모두를 위한 정적 아카이브 페이지입니다.</p>
    <ul>
      ${posts
        .map(
          (post) =>
            `<li><a href="${post.loc}">${escapeXml(post.title)}</a> <small>(${post.date.toISOString().slice(0, 10)})</small></li>`
        )
        .join('\n      ')}
    </ul>
  </main>
</body>
</html>`;

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${BASE_URL}</link>
    <description>${escapeXml(SITE_NAME)} 최신 게시글 피드</description>
    <language>ko-KR</language>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    ${posts
      .slice(0, 100)
      .map(
        (post) => `<item>
      <title>${escapeXml(post.title)}</title>
      <link>${post.loc}</link>
      <guid isPermaLink="true">${post.loc}</guid>
      <pubDate>${post.date.toUTCString()}</pubDate>
      <description>${escapeXml(post.fullText || post.description)}</description>
      <content:encoded><![CDATA[${cdataSafe(post.fullText || post.description)}]]></content:encoded>
    </item>`
      )
      .join('\n    ')}
  </channel>
</rss>`;

fs.mkdirSync(PUBLIC_DIR, { recursive: true });
fs.writeFileSync(path.join(PUBLIC_DIR, 'all-posts.html'), html, 'utf8');
fs.writeFileSync(path.join(PUBLIC_DIR, 'rss.xml'), rss, 'utf8');

console.log(`generated discovery pages for ${posts.length} posts`);
