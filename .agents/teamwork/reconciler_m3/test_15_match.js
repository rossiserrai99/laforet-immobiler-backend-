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
const ouedHeader = oued100Rows[0];
const oued100 = oued100Rows.slice(1).map(r => {
  const obj = {};
  ouedHeader.forEach((h, idx) => obj[h] = r[idx]);
  return obj;
});
const eligible = oued100.filter(r => r.eligibility === 'ELIGIBLE');

const webRows = parseCSV(fs.readFileSync('.antigravity/laforet-reconciliation/EXISTING_WEBSITE_INVENTORY.csv', 'utf8')).filter(r => r.length > 1);
const webHeader = webRows[0];
const webRecords = webRows.slice(1).map(r => {
  const obj = {};
  webHeader.forEach((h, idx) => obj[h] = r[idx]);
  return obj;
});

const preSeeded = webRecords.filter(w => w.match_source_id !== 'NONE');

// Also load baseline backup to get full description of web properties
const baselineBackup = JSON.parse(fs.readFileSync('.antigravity/laforet-reconciliation/BASELINE_PROPERTIES_BACKUP.json', 'utf8'));

console.log('Detailed comparison for all 15 pre-seeded properties:');

preSeeded.forEach((w, idx) => {
  const backup = baselineBackup.find(b => b._id === w.admin_record_id);
  const webDesc = backup ? backup.description : w.description_summary;
  
  console.log(`\n================================================================================`);
  console.log(`[Web #${idx+1}] ID: ${w.admin_record_id} | ref: ${backup ? backup.reference : w.match_source_id}`);
  console.log(`Title: ${w.title}`);
  console.log(`Type: ${w.transaction_type} | Cat: ${w.property_category} | Commune: ${w.commune} | Price: ${w.price} | Surface: ${w.surface}`);
  console.log(`Web Description: ${webDesc.slice(0, 200)}...`);

  // Search among all 43 eligible for similarity
  const matches = eligible.map(e => {
    let score = 0;
    const reasons = [];
    if (e.transaction_type && w.transaction_type && e.transaction_type.toLowerCase() === w.transaction_type.toLowerCase()) {
      score += 10;
      reasons.push('type_match');
    }
    if (e.commune && w.commune && e.commune.toLowerCase().trim() === w.commune.toLowerCase().trim()) {
      score += 20;
      reasons.push('commune_match');
    }
    if (e.price && w.price && Number(e.price) === Number(w.price)) {
      score += 40;
      reasons.push('price_match');
    }
    if (e.surface && w.surface && Number(e.surface) === Number(w.surface)) {
      score += 30;
      reasons.push('surface_match');
    }
    // Check keyword overlap in description
    const wordsW = webDesc.toLowerCase().split(/\W+/).filter(w => w.length > 4);
    const wordsE = (e.description_clean || '').toLowerCase().split(/\W+/).filter(w => w.length > 4);
    const commonWords = wordsW.filter(w => wordsE.includes(w));
    if (commonWords.length > 5) {
      score += 25;
      reasons.push(`keywords(${commonWords.slice(0, 5).join(',')})`);
    }

    return { e, score, reasons };
  }).sort((a, b) => b.score - a.score);

  console.log('Top match in 43 eligible:');
  matches.slice(0, 2).forEach(m => {
    console.log(`  -> Score: ${m.score} [${m.reasons.join(', ')}]`);
    console.log(`     Oued ID: ${m.e.source_id} (Page ${m.e.source_page_number}) | ${m.e.transaction_type} ${m.e.property_category} | ${m.e.commune} | ${m.e.price} DZD | ${m.e.surface} m²`);
    console.log(`     Title: ${m.e.source_title}`);
    console.log(`     Desc: ${(m.e.description_clean || '').slice(0, 150)}...`);
  });
});
