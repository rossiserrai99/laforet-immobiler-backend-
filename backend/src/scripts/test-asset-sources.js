const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
// no adm-zip needed

function getHash(items) {
  const hash = crypto.createHash('sha256');
  for (let item of items) {
    if (typeof item === 'number') hash.update(String(item));
    else hash.update(item);
  }
  return hash.digest('base64url');
}

const cacheDir = path.resolve(__dirname, '../../../frontend/.next/dev/cache/images');
const existingDirs = new Set(fs.existsSync(cacheDir) ? fs.readdirSync(cacheDir) : []);

const widths = [3840, 2048, 1920, 1200, 1080, 828, 750, 640, 384, 256, 128, 96, 64, 48, 32, 16];
const qualities = [100, 95, 90, 85, 80, 75];
const mimeTypes = ['image/webp', 'image/avif', ''];

function findBestCachedImage(url) {
  let best = null;
  const candidates = [url, url.replace('/upload/', '/upload/q_auto:best/')];
  for (const cand of candidates) {
    for (const w of widths) {
      for (const q of qualities) {
        for (const m of mimeTypes) {
          const key = getHash([4, cand, w, q, m]);
          if (existingDirs.has(key)) {
            const dir = path.join(cacheDir, key);
            const files = fs.readdirSync(dir);
            if (files.length > 0) {
              const filePath = path.join(dir, files[0]);
              const stat = fs.statSync(filePath);
              if (!best || stat.size > best.size) {
                best = { key, filePath, size: stat.size, width: w, quality: q };
              }
            }
          }
        }
      }
    }
  }
  return best;
}

const properties = [
  { ref: 'villa (1)', url: 'https://res.cloudinary.com/zt28qj9l/image/upload/v1784128157/laforet_properties/fjudyrta5bwvmvqtrauv.jpg' },
  { ref: 'villa (2)', url: 'https://res.cloudinary.com/zt28qj9l/image/upload/v1784128156/laforet_properties/wrgsxxke7iryvgqcfjh3.jpg' },
  { ref: 'maison de metre', url: 'https://res.cloudinary.com/zt28qj9l/image/upload/v1784949574/laforet_properties/acwvxzw7u7qyuyatx38s.jpg' },
  { ref: 'sdfkbjn', url: 'https://res.cloudinary.com/zt28qj9l/image/upload/v1784952346/laforet_properties/hftb4l2hdkc1cnadek45.jpg' },
  { ref: 'villa sidi yahya', url: 'https://res.cloudinary.com/zt28qj9l/image/upload/v1784953110/laforet_properties/izqpylvqlheip9cobwyz.jpg' },
  { ref: 'villa-1', url: 'https://res.cloudinary.com/zt28qj9l/image/upload/v1784957373/laforet_properties/a5dyeugcf3gzhfpwjtqz.jpg' },
  { ref: 'apprtmn 1', url: 'https://res.cloudinary.com/zt28qj9l/image/upload/v1784957444/laforet_properties/bpqsvustybf48paymojb.jpg' },
  { ref: 'dely 2', url: 'https://res.cloudinary.com/zt28qj9l/image/upload/v1784966806/laforet_properties/fxynqhobrao7sdatlowk.jpg' },
  { ref: 'sou1', url: 'https://res.cloudinary.com/zt28qj9l/image/upload/v1784966887/laforet_properties/ahj0fvcifg7kaqmbfksk.jpg' },
  { ref: 'hg5', url: 'https://res.cloudinary.com/zt28qj9l/image/upload/v1784966962/laforet_properties/jbl2cv0q83i4sxkpn2up.jpg' },
  { ref: 'rgh6', url: 'https://res.cloudinary.com/zt28qj9l/image/upload/v1784969333/laforet_properties/gtqlr3bi1dhzwqbcihy7.jpg' },
  { ref: 'aprtmd5', url: 'https://res.cloudinary.com/zt28qj9l/image/upload/v1784969409/laforet_properties/rqfdoly82fljjlb2wy3r.jpg' },
  { ref: 'bn4', url: 'https://res.cloudinary.com/zt28qj9l/image/upload/v1784969473/laforet_properties/hdyi1iiavab5hwztusfm.jpg' },
  { ref: 'static: advisor', url: 'https://res.cloudinary.com/zt28qj9l/image/upload/v1784965315/stock-photo-real-estate-agent-insurance-sales-representative-young-asian-businessman-handing_qyjsni.webp' },
  { ref: 'static: agency/fallback', url: 'https://res.cloudinary.com/zt28qj9l/image/upload/v1784965809/make_picture_high_definition_res__202607250849_msbqp4.jpg' }
];

console.log('--- Checking 15 Cached Assets ---');
for (const item of properties) {
  const match = findBestCachedImage(item.url);
  if (match) {
    console.log(`[OK] ${item.ref}: width=${match.width}, size=${match.size} bytes (${match.filePath})`);
  } else {
    console.error(`[FAIL] ${item.ref}: Not found in cache`);
  }
}
