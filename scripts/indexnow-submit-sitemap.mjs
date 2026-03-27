import process from 'node:process';

const endpoint = 'https://searchadvisor.naver.com/indexnow';
const key = process.env.INDEXNOW_KEY;
const keyLocation = process.env.INDEXNOW_KEY_LOCATION;
const sitemapUrl = process.env.SITEMAP_URL || 'https://cpb-five.vercel.app/sitemap.xml';
const maxUrls = Number(process.env.INDEXNOW_MAX_URLS || 500);

if (!key) {
  console.error('INDEXNOW_KEY 환경변수가 필요합니다.');
  process.exit(1);
}

const chunk = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

const parseLocs = (xml = '') => [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]).filter(Boolean);

const submitBatch = async (urlList) => {
  const host = new URL(urlList[0]).host;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host,
      key,
      ...(keyLocation ? { keyLocation } : {}),
      urlList,
    }),
  });
  const body = await response.text();
  return { status: response.status, body };
};

try {
  const sitemapRes = await fetch(sitemapUrl);
  if (!sitemapRes.ok) {
    throw new Error(`sitemap fetch failed: ${sitemapRes.status}`);
  }

  const xml = await sitemapRes.text();
  const allUrls = parseLocs(xml);
  const urls = allUrls.slice(0, Math.max(1, maxUrls));
  const batches = chunk(urls, 1000);

  console.log(`IndexNow 대상 URL: ${urls.length}개, 배치: ${batches.length}개`);

  for (const [index, batch] of batches.entries()) {
    const result = await submitBatch(batch);
    console.log(`batch ${index + 1}/${batches.length} -> ${result.status}`);
    if (result.status >= 400) {
      console.log(result.body);
      process.exit(1);
    }
  }

  console.log('IndexNow sitemap submission done');
} catch (error) {
  console.error('IndexNow sitemap submission failed:', error);
  process.exit(1);
}
