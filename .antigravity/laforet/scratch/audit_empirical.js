const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../backend/.env') });

const BASE_API = 'http://localhost:5000/api';
const FRONTEND_URL = 'http://localhost:3000';
const INVENTORY_PATH = path.resolve(__dirname, '../OUEDKNISS_INVENTORY.csv');
const MEDIA_MANIFEST_PATH = path.resolve(__dirname, '../MEDIA_MANIFEST.json');
const ASSET_MANIFEST_PATH = path.resolve(__dirname, '../ASSET_MANIFEST.md');
const IMPORT_LOG_PATH = path.resolve(__dirname, '../IMPORT_LOG.csv');

function parseCSVLine(line) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur.trim());
  return result;
}

function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
  const header = parseCSVLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const vals = parseCSVLine(lines[i]);
    if (vals.length >= header.length) {
      const obj = {};
      header.forEach((h, idx) => {
        obj[h] = vals[idx] !== undefined ? vals[idx] : '';
      });
      rows.push(obj);
    }
  }
  return rows;
}

async function checkUrl(url, method = 'HEAD') {
  try {
    const res = await fetch(url, { method });
    return { ok: res.ok, status: res.status, contentType: res.headers.get('content-type'), contentLength: res.headers.get('content-length') };
  } catch (err) {
    return { ok: false, status: 0, error: err.message };
  }
}

async function runAudit() {
  const results = {
    timestamp: new Date().toISOString(),
    tests: {},
    summary: { total: 0, passed: 0, failed: 0 }
  };

  function record(category, testName, pass, details) {
    if (!results.tests[category]) results.tests[category] = [];
    results.tests[category].push({ testName, pass, details });
    results.summary.total++;
    if (pass) results.summary.passed++;
    else results.summary.failed++;
  }

  console.log('=== STARTING EMPIRICAL AUDIT ===');

  // --- 1. M0: Backend & Database Baseline ---
  console.log('\n--- 1. Testing Baseline API & Database ---');
  try {
    const resAll = await fetch(`${BASE_API}/properties?limit=100`);
    const dataAll = await resAll.json();
    const props = dataAll.data?.properties || [];
    record('M0_Baseline', 'Total properties count equals 27', props.length === 27, `Found ${props.length} (expected 27)`);
    
    const importedProps = props.filter(p => p.reference && p.reference.startsWith('LF-OK-'));
    const preExistingProps = props.filter(p => !p.reference || !p.reference.startsWith('LF-OK-'));
    record('M0_Baseline', 'Imported properties count equals 15', importedProps.length === 15, `Found ${importedProps.length}`);
    record('M0_Baseline', 'Pre-existing properties count equals 12', preExistingProps.length === 12, `Found ${preExistingProps.length}`);
  } catch (e) {
    record('M0_Baseline', 'Fetch properties failed', false, e.message);
  }

  // --- 2. M1: Media Migration & ImageKit Delivery ---
  console.log('\n--- 2. Testing Milestone 1 ImageKit Migration (18 Assets) ---');
  const mediaManifest = JSON.parse(fs.readFileSync(MEDIA_MANIFEST_PATH, 'utf8'));
  const m1Assets = [...(mediaManifest.properties || []), ...(mediaManifest.static_assets || [])];
  record('M1_Media', 'Media Manifest contains 18 assets', m1Assets.length === 18, `Count: ${m1Assets.length}`);

  let m1LiveOk = 0;
  for (const asset of m1Assets) {
    const url = asset.imagekit_url;
    const probe = await checkUrl(url, 'HEAD');
    if (probe.ok) m1LiveOk++;
    else console.log(`[M1 FAIL] ${asset.reference || asset.name}: ${url} -> ${probe.status}`);
  }
  record('M1_Media', 'All 18 Migrated Assets return HTTP 200 on ImageKit CDN', m1LiveOk === m1Assets.length, `${m1LiveOk}/${m1Assets.length} 200 OK`);

  // Test ImageKit URL transformations
  const testImgUrl = m1Assets[0].imagekit_url;
  const transformedCard = testImgUrl.replace('/laforet_properties/', '/tr:w-600,h-400,c-maintain_ratio,f-auto,q-80/laforet_properties/');
  const transformedThumb = testImgUrl.replace('/laforet_properties/', '/tr:w-150,h-150,c-fill,f-auto,q-80/laforet_properties/');
  const transformedHero = testImgUrl.replace('/laforet_properties/', '/tr:w-1600,c-at_max,q-85,f-auto/laforet_properties/');
  const probeCard = await checkUrl(transformedCard, 'HEAD');
  const probeThumb = await checkUrl(transformedThumb, 'HEAD');
  const probeHero = await checkUrl(transformedHero, 'HEAD');
  record('M1_Media', 'Card Thumbnail Transformation (w-600,h-400) returns 200', probeCard.ok, `Status: ${probeCard.status}, Type: ${probeCard.contentType}`);
  record('M1_Media', 'Detail Thumbnail Transformation (w-150,h-150) returns 200', probeThumb.ok, `Status: ${probeThumb.status}, Type: ${probeThumb.contentType}`);
  record('M1_Media', 'Detail Hero Transformation (w-1600) returns 200', probeHero.ok, `Status: ${probeHero.status}, Type: ${probeHero.contentType}`);

  // --- 3. M2: Hero Video & Banners ---
  console.log('\n--- 3. Testing Milestone 2 Assets Configuration ---');
  const siteAssets = [
    { name: 'Hero Video Desktop MP4', url: 'https://ik.imagekit.io/8jggj5dcd7/laforet_assets/hero_video.mp4', expectedType: 'video/mp4' },
    { name: 'Hero Video Poster PNG', url: 'https://ik.imagekit.io/8jggj5dcd7/laforet_assets/hero_video_poster.png', expectedType: 'image/png' },
    { name: 'Banner 1 Acheter Local', url: `${FRONTEND_URL}/luxury_house_buy.png`, expectedType: 'image/png' },
    { name: 'Banner 2 Louer Unsplash', url: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?q=80&w=1170&auto=format&fit=crop', expectedType: 'image/jpeg' },
    { name: 'Banner 3 Vendre ImageKit', url: 'https://ik.imagekit.io/8jggj5dcd7/laforet_assets/advisor_vendre.webp', expectedType: 'image/webp' },
    { name: 'Banner 4 Fallback ImageKit', url: 'https://ik.imagekit.io/8jggj5dcd7/laforet_assets/agency_fallback.webp', expectedType: 'image/webp' },
    { name: 'Parallax Background ImageKit', url: 'https://ik.imagekit.io/8jggj5dcd7/laforet_assets/parallax_expertise_bg.jpg', expectedType: 'image/jpeg' },
    { name: 'Admin Login BG Local', url: `${FRONTEND_URL}/admin-login-bg.png`, expectedType: 'image/png' },
    { name: 'Brand Logo SVG Local', url: `${FRONTEND_URL}/logo.svg`, expectedType: 'image/svg+xml' }
  ];

  for (const asset of siteAssets) {
    const probe = await checkUrl(asset.url, 'HEAD');
    record('M2_Assets', `${asset.name} returns HTTP 200`, probe.ok, `Status: ${probe.status}, Type: ${probe.contentType}`);
  }

  // --- 4. M3: Ouedkniss Extraction Fidelity ---
  console.log('\n--- 4. Testing Milestone 3 Content Fidelity ---');
  const inventory = parseCSV(INVENTORY_PATH);
  record('M3_Content', 'Inventory row count equals 15', inventory.length === 15, `Count: ${inventory.length}`);

  const demandKeywords = ['cherche', 'recherche', 'demande', 'échange', 'echange'];
  let demandViolations = 0;
  for (const row of inventory) {
    const titleLower = (row.title || '').toLowerCase();
    const typeLower = (row.transaction_type || '').toLowerCase();
    if (demandKeywords.some(k => titleLower.includes(k))) {
      demandViolations++;
      console.log(`[DEMAND VIOLATION] ${row.source_id}: ${row.title}`);
    }
    if (typeLower !== 'vente' && typeLower !== 'location') {
      demandViolations++;
      console.log(`[TYPE VIOLATION] ${row.source_id}: ${row.transaction_type}`);
    }
  }
  record('M3_Content', 'Zero demands/requests in inventory (100% Vente/Location)', demandViolations === 0, `Violations: ${demandViolations}`);

  // Deduplication check
  const sourceIds = inventory.map(r => r.source_id);
  const uniqueIds = new Set(sourceIds);
  record('M3_Content', 'Zero duplicate source_ids in inventory', uniqueIds.size === sourceIds.length, `Unique: ${uniqueIds.size}/${sourceIds.length}`);

  // Commune verification against canonical 57 Algiers communes
  const valid57Communes = new Set([
    'Alger Centre', 'Sidi M\'Hamed', 'El Madania', 'Belouizdad', 'Bab El Oued', 'Bologhine', 'Casbah',
    'Oued Koriche', 'Bir Mourad Raïs', 'El Biar', 'Bouzareah', 'Ben Aknoun', 'Hydra', 'El Mouradia',
    'Birtouta', 'Ouled Chebel', 'Tessala El Merdja', 'Birkhadem', 'Djasr Kasentina', 'Saoula',
    'Bordj El Kiffan', 'Bab Ezzouar', 'Bordj El Bahri', 'El Marsa', 'Mohammadia', 'Dar El Beïda',
    'Rouïba', 'Reghaïa', 'H\'raoua', 'Zeralda', 'Staoueli', 'Souidania', 'Cheraga', 'Ouled Fayet',
    'El Achour', 'Draria', 'Douera', 'Baba Hassen', 'Khraicia', 'Baraki', 'Les Eucalyptus', 'Sidi Moussa',
    'Hussein Dey', 'Kouba', 'Bourouba', 'El Magharia', 'Bachdjerrah', 'Oued Smar', 'Aïn Taya',
    'El Harrach', 'Dely Ibrahim', 'Beni Messous', 'Mahelma', 'Rahmania', 'Souidania', 'Ain Benian'
  ].map(c => c.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')));

  let invalidCommunes = 0;
  for (const r of inventory) {
    const norm = (r.commune || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (!valid57Communes.has(norm)) {
      invalidCommunes++;
      console.log(`[COMMUNE VIOLATION] ${r.source_id}: ${r.commune}`);
    }
  }
  record('M3_Content', 'All 15 communes match canonical Algiers communes', invalidCommunes === 0, `Invalid: ${invalidCommunes}`);

  // --- 5. M4: Admin Population & Traceability ---
  console.log('\n--- 5. Testing Milestone 4 Admin Import & Database Records ---');
  const importLog = parseCSV(IMPORT_LOG_PATH);
  record('M4_Admin', 'IMPORT_LOG.csv contains entries', importLog.length >= 15, `Count: ${importLog.length}`);

  const resAllProps = await fetch(`${BASE_API}/properties?limit=100`);
  const dataProps = await resAllProps.json();
  const dbProps = dataProps.data?.properties || [];

  let importedFound = 0;
  let photoUrlsChecked = 0;
  let photoUrlsOk = 0;
  let slugsChecked = 0;
  let slugsOk = 0;

  for (const invRow of inventory) {
    const ref = `LF-OK-${invRow.source_id}`;
    const match = dbProps.find(p => p.reference === ref);
    if (match) {
      importedFound++;
      // Check slug
      const slugRes = await checkUrl(`${BASE_API}/properties/slug/${match.slug}`, 'GET');
      slugsChecked++;
      if (slugRes.ok) slugsOk++;
      else console.log(`[SLUG FAIL] ${match.slug} -> ${slugRes.status}`);

      // Check photos
      const images = match.media?.images || [];
      for (const img of images) {
        photoUrlsChecked++;
        const pProbe = await checkUrl(img.url, 'HEAD');
        if (pProbe.ok) photoUrlsOk++;
        else console.log(`[PHOTO FAIL] ${match.slug}: ${img.url} -> ${pProbe.status}`);
      }
    } else {
      console.log(`[MISSING DB PROPERTY] ${ref} not in MongoDB`);
    }
  }

  record('M4_Admin', 'All 15 inventory properties found in MongoDB', importedFound === 15, `Found: ${importedFound}/15`);
  record('M4_Admin', 'All 15 property public slugs return 200 OK', slugsOk === 15, `${slugsOk}/${slugsChecked} 200 OK`);
  record('M4_Admin', `All property images return 200 on ImageKit CDN`, photoUrlsOk === photoUrlsChecked && photoUrlsChecked > 0, `${photoUrlsOk}/${photoUrlsChecked} 200 OK`);

  // Pilot Properties Check
  const pilotIds = ['57812904', '57498112', '56621098'];
  const pilotsInDb = dbProps.filter(p => pilotIds.some(pid => p.reference === `LF-OK-${pid}`));
  record('M4_Admin', 'All 3 pilot properties exist and verified in DB', pilotsInDb.length === 3, `Pilots found: ${pilotsInDb.length}/3`);

  // --- 6. M5: Functional Filtering, Search, Admin Auth & Frontend SSR ---
  console.log('\n--- 6. Testing System Verification: Filtering, Search & Admin Auth ---');

  // Test Type Filters
  const resVente = await (await fetch(`${BASE_API}/properties?type=Vente&limit=100`)).json();
  const resLocation = await (await fetch(`${BASE_API}/properties?type=Location&limit=100`)).json();
  const totalVente = resVente.data?.total || 0;
  const totalLocation = resLocation.data?.total || 0;
  record('M5_Functional', 'Filter type=Vente returns results', totalVente > 0, `Total Vente: ${totalVente}`);
  record('M5_Functional', 'Filter type=Location returns results', totalLocation > 0, `Total Location: ${totalLocation}`);
  record('M5_Functional', 'Vente + Location covers entire inventory', totalVente + totalLocation === 27, `Sum: ${totalVente + totalLocation} (Total 27)`);

  // Test Category Filters
  const resVilla = await (await fetch(`${BASE_API}/properties?category=Villa&limit=100`)).json();
  const resAppart = await (await fetch(`${BASE_API}/properties?category=Appartement&limit=100`)).json();
  const resTerrain = await (await fetch(`${BASE_API}/properties?category=Terrain&limit=100`)).json();
  record('M5_Functional', 'Filter category=Villa works', resVilla.data?.total > 0, `Total Villa: ${resVilla.data?.total}`);
  record('M5_Functional', 'Filter category=Appartement works', resAppart.data?.total > 0, `Total Appartement: ${resAppart.data?.total}`);
  record('M5_Functional', 'Filter category=Terrain works', resTerrain.data?.total > 0, `Total Terrain: ${resTerrain.data?.total}`);

  // Test Commune Filters
  const resHydra = await (await fetch(`${BASE_API}/properties?commune=Hydra`)).json();
  const resElBiar = await (await fetch(`${BASE_API}/properties?commune=El+Biar`)).json();
  record('M5_Functional', 'Filter commune=Hydra works', resHydra.data?.total > 0, `Total Hydra: ${resHydra.data?.total}`);
  record('M5_Functional', 'Filter commune=El Biar works', resElBiar.data?.total > 0, `Total El Biar: ${resElBiar.data?.total}`);

  // Test Price Boundaries
  const resPrice = await (await fetch(`${BASE_API}/properties?price[gte]=100000000`)).json();
  record('M5_Functional', 'Filter price[gte]=100M DZD works', resPrice.data?.total > 0, `Count: ${resPrice.data?.total}`);

  // Test Admin Authentication
  try {
    const adminLoginRes = await fetch(`${BASE_API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: process.env.ADMIN_USERNAME, password: process.env.ADMIN_PASSWORD })
    });
    const loginJson = await adminLoginRes.json();
    const token = loginJson.data?.token;
    record('M5_Security', 'Admin authentication returns valid JWT token', Boolean(token), `Status: ${adminLoginRes.status}`);

    if (token) {
      const authParamRes = await fetch(`${BASE_API}/media/auth`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const authParamJson = await authParamRes.json();
      const hasSignature = Boolean(authParamJson.data?.signature && authParamJson.data?.token);
      record('M5_Security', 'Protected media/auth endpoint generates valid signature', hasSignature, `Status: ${authParamRes.status}`);
    }
  } catch (err) {
    record('M5_Security', 'Admin login test failed', false, err.message);
  }

  // --- 7. Frontend SSR Rendering ---
  console.log('\n--- 7. Testing Frontend Next.js SSR Pages ---');
  const pagesToTest = [
    { name: 'Homepage (/)', url: `${FRONTEND_URL}/` },
    { name: 'Catalog (/properties)', url: `${FRONTEND_URL}/properties` },
    { name: 'Detail Page Pilot 1', url: `${FRONTEND_URL}/properties/vente-villa-de-maitre-872-m-avec-piscine-quartier-poirson-el-biar` },
    { name: 'Detail Page Pilot 2', url: `${FRONTEND_URL}/properties/location-appartement-haut-standing-f4-meuble-hydra` },
    { name: 'Admin Login (/admin/login)', url: `${FRONTEND_URL}/admin/login` }
  ];

  for (const page of pagesToTest) {
    const pCheck = await checkUrl(page.url, 'GET');
    record('M5_Frontend', `${page.name} returns HTTP 200`, pCheck.ok, `Status: ${pCheck.status}, Type: ${pCheck.contentType}`);
  }

  console.log('\n=== AUDIT COMPLETE ===');
  console.log(`Total Checks: ${results.summary.total}`);
  console.log(`Passed: ${results.summary.passed}`);
  console.log(`Failed: ${results.summary.failed}`);

  fs.writeFileSync(path.resolve(__dirname, 'audit_results.json'), JSON.stringify(results, null, 2), 'utf8');
  console.log('Results saved to audit_results.json');
}

runAudit().catch(err => {
  console.error('Fatal audit error:', err);
  process.exit(1);
});
