import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, 'public');
const key = process.env.INDEXNOW_KEY;

if (!key) {
  console.error('INDEXNOW_KEY 환경변수가 필요합니다.');
  process.exit(1);
}

if (!/^[A-Fa-f0-9-]{8,128}$/.test(key)) {
  console.error('INDEXNOW_KEY 형식이 유효하지 않습니다. (8~128자, a-f/A-F/0-9/-)');
  process.exit(1);
}

fs.mkdirSync(PUBLIC_DIR, { recursive: true });
const keyFilePath = path.join(PUBLIC_DIR, `${key}.txt`);
fs.writeFileSync(keyFilePath, key, 'utf8');

console.log(`IndexNow key file generated: ${keyFilePath}`);
