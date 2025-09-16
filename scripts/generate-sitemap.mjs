import fs from 'node:fs';
import path from 'node:path';

// 레포 구조에 맞게 조정
const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, 'posts');
const PUBLIC_DIR = path.join(ROOT, 'public');
const BASE = 'https://cpb-five.vercel.app';

// slugify는 스크립트에도 동일 규칙으로 복제
const slugify = (s) =>
  s.toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

function listMarkdown() {
  return fs.readdirSync(POSTS_DIR)
    .filter(n => n.toLowerCase().endsWith('.md'));
}

function lastmodOf(filePath) {
  const st = fs.statSync(filePath);
  return new Date(st.mtimeMs || Date.now()).toISOString();
}

function buildUrls() {
  const urls = [{ loc: `${BASE}/`, pri: '1.0', cf: 'weekly', lastmod: new Date().toISOString() }];
  const files = listMarkdown();

  for (const name of files) {
    const raw = name.replace(/\.md$/i, '');
    const slug = slugify(decodeURIComponent(raw));
    const fp = path.join(POSTS_DIR, name);
    urls.push({
      loc: `${BASE}/post/${slug}`,
      pri: '0.8',
      cf: 'weekly',
      lastmod: lastmodOf(fp),
    });
  }
  return urls;
}

function buildXML(urls) {
  const body = urls.map(u =>
    `<url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod><changefreq>${u.cf}</changefreq><priority>${u.pri}</priority></url>`
  ).join('');
  return `<?xml version="1.0" encoding="UTF-8"?>` +
         `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`;
}

fs.mkdirSync(PUBLIC_DIR, { recursive: true });
const xml = buildXML(buildUrls());
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), xml, 'utf8');

// robots.txt 보강(이미 있다면 건너뜀)
const robotsPath = path.join(PUBLIC_DIR, 'robots.txt');
if (!fs.existsSync(robotsPath)) {
  fs.writeFileSync(robotsPath, `User-agent: *
Allow: /

Sitemap: ${BASE}/sitemap.xml
`, 'utf8');
}

console.log('sitemap.xml generated');
