// scripts/generate-sitemap.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, 'posts');
const PUBLIC_DIR = path.join(ROOT, 'public');
const BASE = 'https://cpb-five.vercel.app';

// ✅ 반드시 동일 규칙(소문자-하이픈)으로 강제
const slugify = (s) =>
  s.toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

function listMarkdown() {
  return fs.readdirSync(POSTS_DIR).filter(n => n.toLowerCase().endsWith('.md'));
}

function lastmodOf(fp) {
  const st = fs.statSync(fp);
  return new Date(st.mtimeMs || Date.now()).toISOString();
}

function buildUrls() {
  const urls = [
    { loc: `${BASE}/`, lastmod: new Date().toISOString(), cf: 'weekly', pri: '1.0' }
  ];

  for (const name of listMarkdown()) {
    const raw = name.replace(/\.md$/i, '');
    // ✅ 파일명에서만 slug 생성 (decode → slugify). 제목/프론트매터 무시!
    const slug = slugify(decodeURIComponent(raw));
    const fp = path.join(POSTS_DIR, name);
    urls.push({
      loc: `${BASE}/post/${slug}`,
      lastmod: lastmodOf(fp),
      cf: 'weekly',
      pri: '0.8'
    });
  }
  return urls;
}

function buildXML(urls) {
  const body = urls.map(u =>
    `<url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod><changefreq>${u.cf}</changefreq><priority>${u.pri}</priority></url>`
  ).join('');
  return `<?xml version="1.0" encoding="UTF-8"?>` +
         `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
         body +
         `</urlset>`;
}

fs.mkdirSync(PUBLIC_DIR, { recursive: true });
const xml = buildXML(buildUrls());
fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), xml, 'utf8');

console.log('sitemap.xml generated');
