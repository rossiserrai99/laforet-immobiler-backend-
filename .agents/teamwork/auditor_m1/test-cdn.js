const fs = require('fs');
const path = require('path');
const https = require('https');

const manifestPath = path.resolve(__dirname, '../../../.antigravity/laforet/MEDIA_MANIFEST.json');
if (!fs.existsSync(manifestPath)) {
  console.error('FAIL: MEDIA_MANIFEST.json not found at:', manifestPath);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

console.log(`Auditing ${manifest.total_assets} assets from MEDIA_MANIFEST.json...`);

function checkUrl(url, method = 'HEAD') {
  return new Promise((resolve) => {
    try {
      const u = new URL(url);
      const req = https.request(
        {
          hostname: u.hostname,
          path: u.pathname + u.search,
          method: method,
          headers: { 'User-Agent': 'Mozilla/5.0 Auditor/1.0' }
        },
        (res) => {
          resolve({
            url,
            statusCode: res.statusCode,
            contentType: res.headers['content-type'],
            contentLength: res.headers['content-length']
          });
        }
      );
      req.on('error', (err) => resolve({ url, error: err.message }));
      req.setTimeout(10000, () => {
        req.destroy();
        resolve({ url, error: 'TIMEOUT' });
      });
      req.end();
    } catch (e) {
      resolve({ url, error: e.message });
    }
  });
}

async function run() {
  const allAssets = [];
  manifest.properties.forEach((p) => {
    allAssets.push({ type: 'property', ref: p.reference, title: p.title, url: p.imagekit_url });
  });
  manifest.static_assets.forEach((s) => {
    allAssets.push({ type: 'static', name: s.name, url: s.imagekit_url });
  });

  console.log(`Total collected assets to verify: ${allAssets.length}`);
  let failed = 0;

  for (let i = 0; i < allAssets.length; i++) {
    const item = allAssets[i];
    const res = await checkUrl(item.url, 'HEAD');
    if (res.statusCode === 200) {
      console.log(`[PASS 200] #${i + 1} (${item.type}: ${item.ref || item.name}) -> ${res.contentType} (${res.contentLength || 'chunked'} bytes)`);
    } else {
      console.error(`[FAIL ${res.statusCode || 'ERR'}] #${i + 1} (${item.type}: ${item.ref || item.name}) -> ${item.url} : ${res.error || ''}`);
      failed++;
    }
  }

  // Also test live ImageKit transformations on a property image
  const sampleProperty = manifest.properties[0].imagekit_url;
  // Apply transformation tr:w-600,h-400
  const transformedUrl = sampleProperty.replace('/laforet_properties/', '/tr:w-600,h-400,c-maintain_ratio,f-webp,q-80/laforet_properties/');
  console.log(`\nTesting ImageKit transformation endpoint live:\n${transformedUrl}`);
  const trRes = await checkUrl(transformedUrl, 'HEAD');
  if (trRes.statusCode === 200) {
    console.log(`[PASS 200] ImageKit dynamic transformation works: ${trRes.contentType} (${trRes.contentLength} bytes)`);
  } else {
    console.error(`[FAIL] ImageKit transformation returned ${trRes.statusCode}: ${trRes.error}`);
    failed++;
  }

  // Also test thumbnail transformation tr:w-120,h-120
  const thumbUrl = sampleProperty.replace('/laforet_properties/', '/tr:w-120,h-120,c-fill,f-webp,q-80/laforet_properties/');
  const thumbRes = await checkUrl(thumbUrl, 'HEAD');
  if (thumbRes.statusCode === 200) {
    console.log(`[PASS 200] ImageKit micro-thumbnail transformation works: ${thumbRes.contentType} (${thumbRes.contentLength} bytes)`);
  } else {
    console.error(`[FAIL] ImageKit micro-thumbnail returned ${thumbRes.statusCode}: ${thumbRes.error}`);
    failed++;
  }

  console.log(`\nCDN Integrity Verification Completed. Total Failures: ${failed}`);
  if (failed > 0) process.exit(1);
}

run();
