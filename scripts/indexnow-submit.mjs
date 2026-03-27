import process from 'node:process';

const endpoint = 'https://searchadvisor.naver.com/indexnow';
const key = process.env.INDEXNOW_KEY;
const keyLocation = process.env.INDEXNOW_KEY_LOCATION;
const urls = process.argv.slice(2).filter(Boolean);

if (!key) {
  console.error('INDEXNOW_KEY 환경변수가 필요합니다.');
  process.exit(1);
}

if (urls.length === 0) {
  console.error('전송할 URL을 1개 이상 전달하세요. 예: node scripts/indexnow-submit.mjs https://cpb-five.vercel.app/post/slug');
  process.exit(1);
}

const sendSingle = async (url) => {
  const requestUrl = new URL(endpoint);
  requestUrl.searchParams.set('url', url);
  requestUrl.searchParams.set('key', key);
  if (keyLocation) requestUrl.searchParams.set('keyLocation', keyLocation);

  const response = await fetch(requestUrl);
  const body = await response.text();
  return { url, status: response.status, body };
};

const sendBatch = async (urlList) => {
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
  if (urls.length === 1) {
    const result = await sendSingle(urls[0]);
    console.log(JSON.stringify(result, null, 2));
  } else {
    const result = await sendBatch(urls);
    console.log(JSON.stringify(result, null, 2));
  }
} catch (error) {
  console.error('IndexNow 요청 실패:', error);
  process.exit(1);
}
