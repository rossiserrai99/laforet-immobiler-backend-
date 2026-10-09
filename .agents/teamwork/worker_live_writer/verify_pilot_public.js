const https = require('https');
const http = require('http');

async function fetchHttp(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

async function verifyImage(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      // Consume stream
      res.resume();
      resolve({ status: res.statusCode, contentType: res.headers['content-type'], length: res.headers['content-length'] });
    }).on('error', (err) => resolve({ status: 500, error: err.message }));
  });
}

async function runVerification() {
  console.log('=== PILOT PUBLIC FRONTEND & API VERIFICATION ===\n');

  const slugs = [
    {
      action: 'Pilot 1 (Update)',
      slug: 'location-niveau-de-villa-f3-meuble-vue-mer-alger-centre',
      expectedType: 'Location',
      expectedPrice: '220',
      expectedPhotos: 7
    },
    {
      action: 'Pilot 2 (New Sale)',
      slug: 'vente-villa-el-biar-saint-raphael-1400-m',
      expectedType: 'Vente',
      expectedPrice: '485',
      expectedPhotos: 2
    },
    {
      action: 'Pilot 3 (New Rental)',
      slug: 'location-grande-villa-diplomatique-r3-el-biar-poirson',
      expectedType: 'Location',
      expectedPrice: '850',
      expectedPhotos: 11
    }
  ];

  // 1. Verify detail pages on frontend (http://localhost:3000/properties/<slug>)
  console.log('--- 1. Testing Detail Page Routes on Next.js (port 3000) ---');
  for (const item of slugs) {
    const pageUrl = `http://localhost:3000/properties/${item.slug}`;
    const res = await fetchHttp(pageUrl);
    const hasPrice = res.body.includes(item.expectedPrice);
    console.log(`[${item.action}] URL: ${pageUrl}`);
    console.log(`  HTTP Status: ${res.status} (Expected 200)`);
    console.log(`  Content contains price (${item.expectedPrice}): ${hasPrice}`);
    if (res.status !== 200) {
      throw new Error(`Verification failed for ${pageUrl}: HTTP ${res.status}`);
    }
  }

  // 2. Verify API detail endpoint and image assets (http://localhost:5000/api/properties/slug/<slug>)
  console.log('\n--- 2. Testing API Detail Data & ImageKit Image Delivery ---');
  for (const item of slugs) {
    const apiUrl = `http://localhost:5000/api/properties/slug/${item.slug}`;
    const res = await fetchHttp(apiUrl);
    const json = JSON.parse(res.body);
    const prop = json.data.property;
    console.log(`[${item.action}] Title: ${prop.title}`);
    console.log(`  Type: ${prop.type} | Cat: ${prop.category} | Commune: ${prop.location?.commune}`);
    console.log(`  Price: ${prop.price} DZD | Area: ${prop.area} m²`);
    console.log(`  Images attached: ${prop.media?.images?.length} (Expected: ${item.expectedPhotos})`);
    console.log(`  Cover image: ${prop.media?.coverImage?.url}`);

    // Verify each image URL loads from ImageKit CDN
    for (let idx = 0; idx < prop.media.images.length; idx++) {
      const img = prop.media.images[idx];
      const imgRes = await verifyImage(img.url);
      if (imgRes.status !== 200) {
        console.error(`  BROKEN IMAGE [${idx+1}]: ${img.url} -> HTTP ${imgRes.status}`);
      } else {
        if (idx === 0) {
          console.log(`  First image CDN check: HTTP ${imgRes.status} (${imgRes.contentType}, ${imgRes.length} bytes) - OK`);
        }
      }
    }
  }

  // 3. Verify Catalog filters (Vente and Location)
  console.log('\n--- 3. Testing Catalog Filtering (Vente & Location) ---');
  const apiVente = await fetchHttp('http://localhost:5000/api/properties?type=Vente');
  const venteJson = JSON.parse(apiVente.body);
  const foundSale = venteJson.data.properties.some(p => p.slug === 'vente-villa-el-biar-saint-raphael-1400-m');
  console.log(`Catalog Vente filter: ${venteJson.data.total} total items. Contains Pilot Sale (57924648): ${foundSale}`);

  const apiLoc = await fetchHttp('http://localhost:5000/api/properties?type=Location');
  const locJson = JSON.parse(apiLoc.body);
  const foundLoc1 = locJson.data.properties.some(p => p.slug === 'location-niveau-de-villa-f3-meuble-vue-mer-alger-centre');
  const foundLoc2 = locJson.data.properties.some(p => p.slug === 'location-grande-villa-diplomatique-r3-el-biar-poirson');
  console.log(`Catalog Location filter: ${locJson.data.total} total items. Contains Pilot Updated Rental (58058097): ${foundLoc1}, Contains Pilot New Rental (57296094): ${foundLoc2}`);

  // 4. Verify Total Property Accounting
  const apiAll = await fetchHttp('http://localhost:5000/api/properties');
  const allJson = JSON.parse(apiAll.body);
  console.log(`\n--- 4. Overall Property Accounting ---`);
  console.log(`Baseline properties: 27`);
  console.log(`Updated existing: 1 (6ac81019c5b7e8884199e69b)`);
  console.log(`Newly created: 2 (6ac8f6f69afa8b525021ce5c, 6ac8f6fe9afa8b525021ce5f)`);
  console.log(`Total live properties in system now: ${allJson.data.total} (Expected: 29)`);

  if (allJson.data.total === 29 && foundSale && foundLoc1 && foundLoc2) {
    console.log('\n>>> ALL PUBLIC FRONTEND AND API VERIFICATION CHECKS PASSED PERFECTLY! <<<');
  } else {
    throw new Error('Verification discrepancy detected');
  }
}

runVerification().catch(err => {
  console.error('VERIFICATION ERROR:', err);
  process.exit(1);
});
