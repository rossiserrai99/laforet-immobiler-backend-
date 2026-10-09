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
const webRecords = webRows.slice(1).map(r => {
  const obj = {};
  webRows[0].forEach((h, idx) => obj[h] = r[idx]);
  return obj;
});

const preSeeded = webRecords.filter(w => w.match_source_id !== 'NONE');
const baselineBackup = JSON.parse(fs.readFileSync('.antigravity/laforet-reconciliation/BASELINE_PROPERTIES_BACKUP.json', 'utf8'));

// Build scoring matrix between 15 preSeeded and 43 eligible
const matrix = [];
preSeeded.forEach(w => {
  const backup = baselineBackup.find(b => b._id === w.admin_record_id);
  const row = [];
  eligible.forEach(e => {
    let score = 0;
    const reasons = [];
    // exact ID match
    if (e.source_id === w.match_source_id) {
      score += 1000;
      reasons.push('exact_id');
    }
    // transaction type
    if (e.transaction_type && w.transaction_type && e.transaction_type.toLowerCase() === w.transaction_type.toLowerCase()) {
      score += 10;
    } else {
      score -= 50; // penalty for mismatched transaction type (Sale vs Rent)
    }
    // category
    if (e.property_category && w.property_category && e.property_category.toLowerCase() === w.property_category.toLowerCase()) {
      score += 15;
    }
    // commune
    if (e.commune && w.commune && e.commune.toLowerCase().trim() === w.commune.toLowerCase().trim()) {
      score += 25;
      reasons.push('commune');
    }
    // price
    if (e.price && w.price && Number(e.price) > 0 && Number(e.price) === Number(w.price)) {
      score += 50;
      reasons.push('price');
    }
    // surface
    if (e.surface && w.surface && Number(e.surface) > 0 && Number(e.surface) === Number(w.surface)) {
      score += 40;
      reasons.push('surface');
    }
    // text keywords in description
    const webText = (backup.title + ' ' + backup.description).toLowerCase();
    const ouedText = (e.source_title + ' ' + (e.description_clean || '')).toLowerCase();
    const keywords = ['miramar', 'zirout', 'haussmannien', 'poirson', 'khalifati', 'vigerie', 'birkhadem', 'didouche', 'telemly', 'krim', 'mouradia', 'hussein', 'madania', 'achour', 'saint-raphaël', 'hydra', 'piscine', 'duplex'];
    keywords.forEach(kw => {
      if (webText.includes(kw) && ouedText.includes(kw)) {
        score += 30;
        reasons.push(kw);
      }
    });

    row.push({ e, score, reasons });
  });
  matrix.push({ w, row });
});

console.log('=== MATCHING MATRIX RESULTS ===');
matrix.forEach((m, idx) => {
  const sorted = m.row.slice().sort((a, b) => b.score - a.score);
  console.log(`\n[Web #${idx+1}] ID: ${m.w.admin_record_id} | ref: ${m.w.match_source_id} | ${m.w.title} (${m.w.transaction_type} ${m.w.property_category}, ${m.w.commune}, ${m.w.price} DZD)`);
  console.log(`Top 3 Candidates:`);
  sorted.slice(0, 3).forEach((c, cIdx) => {
    console.log(`  ${cIdx+1}. Score ${c.score} [${c.reasons.join(', ')}]: Ouedkniss [${c.e.source_id}] (Page ${c.e.source_page_number}) | ${c.e.source_title} (${c.e.transaction_type} ${c.e.property_category}, ${c.e.commune}, ${c.e.price} DZD, ${c.e.surface} m²)`);
  });
});
