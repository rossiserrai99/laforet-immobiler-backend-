const fs = require('fs');

function parseCSV(content) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let insideQuotes = false;
  
  for (let i = 0; i < content.length; i++) {
    const c = content[i];
    const next = content[i+1];
    
    if (insideQuotes) {
      if (c === '"' && next === '"') {
        currentField += '"';
        i++;
      } else if (c === '"') {
        insideQuotes = false;
      } else {
        currentField += c;
      }
    } else {
      if (c === '"') {
        insideQuotes = true;
      } else if (c === ',') {
        currentRow.push(currentField);
        currentField = '';
      } else if (c === '\r' && next === '\n') {
        currentRow.push(currentField);
        currentField = '';
        rows.push(currentRow);
        currentRow = [];
        i++;
      } else if (c === '\n' || c === '\r') {
        currentRow.push(currentField);
        currentField = '';
        rows.push(currentRow);
        currentRow = [];
      } else {
        currentField += c;
      }
    }
  }
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }
  return rows;
}

const oued100Rows = parseCSV(fs.readFileSync('.antigravity/laforet-reconciliation/OUEDKNISS_INVENTORY.csv', 'utf8')).filter(r => r.length > 1);
const oued100 = oued100Rows.slice(1).map(r => {
  const obj = {};
  oued100Rows[0].forEach((h, idx) => obj[h] = r[idx]);
  return obj;
});

const web27Rows = parseCSV(fs.readFileSync('.antigravity/laforet-reconciliation/EXISTING_WEBSITE_INVENTORY.csv', 'utf8')).filter(r => r.length > 1);
const web27 = web27Rows.slice(1).map(r => {
  const obj = {};
  web27Rows[0].forEach((h, idx) => obj[h] = r[idx]);
  return obj;
});

const photosRows = parseCSV(fs.readFileSync('.antigravity/laforet-reconciliation/OUEDKNISS_PHOTO_MANIFEST.csv', 'utf8')).filter(r => r.length > 1);
const photoManifest = photosRows.slice(1).map(r => {
  const obj = {};
  photosRows[0].forEach((h, idx) => obj[h] = r[idx]);
  return obj;
});

const baselineBackup = JSON.parse(fs.readFileSync('.antigravity/laforet-reconciliation/BASELINE_PROPERTIES_BACKUP.json', 'utf8'));

console.log('=== PART 1: AUDIT OF THE 12 LEGACY MOCKUP PROPERTIES ===');
const mockups = web27.filter(w => w.match_source_id === 'NONE');

mockups.forEach((m, idx) => {
  const backup = baselineBackup.find(b => b._id === m.admin_record_id);
  console.log(`\nMockup #${idx+1}: [${m.admin_record_id}] ref=${backup.reference} title="${m.title}"`);
  console.log(`  Type: ${m.transaction_type} | Category: ${m.property_category} | Commune: ${m.commune} | Price: ${m.price} | Surface: ${m.surface}`);
  console.log(`  Description: "${backup.description}"`);
  console.log(`  Photos count: ${backup.media.images.length} refs: ${backup.media.images.map(img => img.url).join(', ')}`);

  // Search in all 100 ouedkniss for possible candidates
  const possible = oued100.filter(o => {
    // Check if commune matches or title matches
    const communeMatch = o.commune && m.commune && o.commune.toLowerCase().trim() === m.commune.toLowerCase().trim();
    const typeMatch = o.transaction_type && m.transaction_type && o.transaction_type.toLowerCase() === m.transaction_type.toLowerCase();
    const surfaceMatch = o.surface && m.surface && Number(o.surface) === Number(m.surface);
    return communeMatch && typeMatch;
  });

  console.log(`  Plausible Ouedkniss matches in same commune & transaction type: ${possible.length}`);
  possible.forEach(p => {
    console.log(`    Candidate [${p.source_id}]: "${p.source_title}" | Cat: ${p.property_category} | Price: ${p.price} | Surface: ${p.surface} | Elig: ${p.eligibility}`);
  });
});
