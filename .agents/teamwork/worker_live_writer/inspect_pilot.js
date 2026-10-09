const fs = require('fs');
const path = require('path');

function parseCSV(content) {
  const lines = content.split('\n');
  const headers = parseLine(lines[0]);
  const rows = [];
  let currentRecord = '';
  let inQuotes = false;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() && !inQuotes) continue;
    
    currentRecord += (currentRecord ? '\n' : '') + line;
    // count unescaped quotes
    let quoteCount = 0;
    for (let j = 0; j < currentRecord.length; j++) {
      if (currentRecord[j] === '"') {
        quoteCount++;
      }
    }
    if (quoteCount % 2 === 0) {
      const parsed = parseLine(currentRecord);
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

function parseLine(line) {
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

const dir = path.join(__dirname, '..', '..', '..', '.antigravity', 'laforet-reconciliation');

const rec = parseCSV(fs.readFileSync(path.join(dir, 'RECONCILIATION.csv'), 'utf8'));
const oued = parseCSV(fs.readFileSync(path.join(dir, 'OUEDKNISS_INVENTORY.csv'), 'utf8'));
const photo = parseCSV(fs.readFileSync(path.join(dir, 'OUEDKNISS_PHOTO_MANIFEST.csv'), 'utf8'));
const exist = parseCSV(fs.readFileSync(path.join(dir, 'EXISTING_WEBSITE_INVENTORY.csv'), 'utf8'));

const pilotIds = ['58058097', '57924648', '57296094'];

console.log('=== PILOT RECONCILIATION ROWS ===');
pilotIds.forEach(id => {
  const r = rec.rows.find(x => x.source_id === id);
  console.log(`\n--- Source ID: ${id} ---`);
  console.log(JSON.stringify(r, null, 2));
});

console.log('\n=== PILOT OUEDKNISS INVENTORY ROWS ===');
pilotIds.forEach(id => {
  const o = oued.rows.find(x => x.source_id === id);
  console.log(`\n--- Source ID: ${id} ---`);
  console.log(JSON.stringify(o, null, 2));
});

console.log('\n=== PILOT PHOTOS ===');
pilotIds.forEach(id => {
  const p = photo.rows.filter(x => x.source_id === id);
  console.log(`\n--- Source ID: ${id} (${p.length} photos) ---`);
  p.forEach(item => {
    console.log(`  [order ${item.source_photo_order}] filename: ${item.filename} | url: ${item.source_image_url_or_reference} | local: ${item.local_asset_path_if_downloaded} | imagekit: ${item.imagekit_asset_or_url}`);
  });
});

console.log('\n=== PILOT EXISTING WEBSITE INVENTORY (for matched) ===');
const matchedExist = exist.rows.filter(x => x.source_listing_id === '58058097' || x.admin_record_id === '6ac81019c5b7e8884199e69b');
console.log(JSON.stringify(matchedExist, null, 2));
