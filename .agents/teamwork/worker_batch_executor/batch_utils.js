const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '..', 'backend', '.env') });

const changeLogPath = path.join(__dirname, '..', '..', '..', '.antigravity', 'laforet-reconciliation', 'CHANGE_LOG.csv');
const reconPath = path.join(__dirname, '..', '..', '..', '.antigravity', 'laforet-reconciliation', 'RECONCILIATION.csv');

function escapeCSV(val) {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += c;
    }
  }
  result.push(current);
  return result;
}

function parseCSV(content) {
  const lines = content.split('\n');
  const headers = parseCSVLine(lines[0]);
  const rows = [];
  let currentRecord = '';
  let inQuotes = false;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() && !inQuotes) continue;
    currentRecord += (currentRecord ? '\n' : '') + line;
    let quoteCount = 0;
    for (let j = 0; j < currentRecord.length; j++) {
      if (currentRecord[j] === '"') quoteCount++;
    }
    if (quoteCount % 2 === 0) {
      const parsed = parseCSVLine(currentRecord);
      const rowObj = {};
      headers.forEach((h, idx) => {
        rowObj[h.trim()] = (parsed[idx] || '').trim();
      });
      rows.push(rowObj);
      currentRecord = '';
    }
  }
  return { headers, rows };
}

function appendToChangeLog(rowObj) {
  const headers = [
    'timestamp',
    'agent',
    'admin_record_id',
    'source_id',
    'action',
    'previous_values_snapshot',
    'fields_changed',
    'previous_photo_count',
    'new_photo_count',
    'photo_assets_attached',
    'public_url_after_change',
    'result',
    'verification_evidence',
    'rollback_notes'
  ];

  if (!fs.existsSync(changeLogPath)) {
    fs.writeFileSync(changeLogPath, headers.join(',') + '\n', 'utf8');
  }

  const line = headers.map(h => escapeCSV(rowObj[h])).join(',') + '\n';
  fs.appendFileSync(changeLogPath, line, 'utf8');
  console.log(`[CHANGE_LOG] Logged action ${rowObj.action} for source_id: ${rowObj.source_id || 'MOCKUP'}, record_id: ${rowObj.admin_record_id}`);
}

function updateReconciliation(sourceId, adminId, status) {
  const fileContent = fs.readFileSync(reconPath, 'utf8');
  const { headers, rows } = parseCSV(fileContent);

  let updated = false;
  for (const r of rows) {
    if ((sourceId && r.source_id === sourceId) || (r.admin_record_id === adminId && (!sourceId || sourceId === 'NONE'))) {
      if (adminId && adminId !== 'NONE') {
        r.admin_record_id = adminId;
      }
      r.completion_status = status;
      updated = true;
      break;
    }
  }

  if (!updated) {
    console.warn(`[RECONCILIATION] Warning: Record not found to update: sourceId=${sourceId}, adminId=${adminId}`);
  }

  const outLines = [headers.join(',')];
  for (const r of rows) {
    outLines.push(headers.map(h => escapeCSV(r[h])).join(','));
  }
  fs.writeFileSync(reconPath, outLines.join('\n') + '\n', 'utf8');
  console.log(`[RECONCILIATION] Updated row sourceId=${sourceId || 'NONE'}, adminId=${adminId} -> status=${status}`);
}

async function loginAdmin() {
  const email = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('ADMIN_USERNAME or ADMIN_PASSWORD missing from backend/.env');
  }

  const res = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Admin login failed: ${res.status} ${txt}`);
  }

  const cookieHeader = res.headers.get('set-cookie');
  if (!cookieHeader) {
    throw new Error('No set-cookie header received from admin login');
  }

  const match = cookieHeader.match(/laforet_token=([^;]+)/);
  if (!match) {
    throw new Error('laforet_token not found in set-cookie header');
  }
  return `laforet_token=${match[1]}`;
}

async function getDbProperties() {
  const res = await fetch('http://localhost:5000/api/properties?limit=200');
  if (!res.ok) throw new Error(`Failed to fetch properties: ${res.status}`);
  const json = await res.json();
  return json.data.properties;
}

async function verifyPropertyPublic(slug, expectedPhotosCount) {
  const publicUrl = `http://localhost:3000/properties/${slug}`;
  const res = await fetch(publicUrl);
  if (res.status !== 200) {
    throw new Error(`Public page ${publicUrl} returned status ${res.status}`);
  }

  const apiRes = await fetch(`http://localhost:5000/api/properties/slug/${slug}`);
  if (!apiRes.ok) {
    throw new Error(`API fetch for slug ${slug} returned ${apiRes.status}`);
  }
  const prop = (await apiRes.json()).data.property;
  const actualPhotos = prop.media?.images?.length || 0;

  if (expectedPhotosCount !== undefined && actualPhotos !== expectedPhotosCount) {
    throw new Error(`Photo count mismatch for ${slug}: expected ${expectedPhotosCount}, got ${actualPhotos}`);
  }

  // Verify all photos return 200
  if (prop.media?.images && prop.media.images.length > 0) {
    for (const img of prop.media.images) {
      const imgRes = await fetch(img.url, { method: 'HEAD' });
      if (imgRes.status !== 200) {
        throw new Error(`Image ${img.url} returned status ${imgRes.status}`);
      }
    }
  }

  return { publicUrl, property: prop };
}

async function checkDatabaseIntegrity() {
  const props = await getDbProperties();
  const refs = new Set();
  const slugs = new Set();
  const duplicateRefs = [];
  const duplicateSlugs = [];

  for (const p of props) {
    if (refs.has(p.reference)) duplicateRefs.push(p.reference);
    refs.add(p.reference);

    if (slugs.has(p.slug)) duplicateSlugs.push(p.slug);
    slugs.add(p.slug);
  }

  if (duplicateRefs.length > 0) {
    throw new Error(`Duplicate references found: ${duplicateRefs.join(', ')}`);
  }
  if (duplicateSlugs.length > 0) {
    throw new Error(`Duplicate slugs found: ${duplicateSlugs.join(', ')}`);
  }

  const ventes = props.filter(p => p.type === 'Vente').length;
  const locations = props.filter(p => p.type === 'Location').length;

  console.log(`[INTEGRITY] Total Properties: ${props.length} (Vente: ${ventes}, Location: ${locations}), Zero Duplicates verified.`);
  return { total: props.length, ventes, locations };
}

module.exports = {
  escapeCSV,
  parseCSV,
  appendToChangeLog,
  updateReconciliation,
  loginAdmin,
  getDbProperties,
  verifyPropertyPublic,
  checkDatabaseIntegrity
};
