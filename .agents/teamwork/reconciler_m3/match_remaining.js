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

// Find best 1-to-1 matching using greedy or Hungarian algorithm
// First, the definitive 5 matches:
const pairs = [
  { webId: '6ac80feac5b7e8884199e650', ouedId: '58058031', reason: 'Exact Ouedkniss ID 58058031, identical property 1400m² Miramar villa 210M DA' },
  { webId: '6ac80fedc5b7e8884199e657', ouedId: '58057620', reason: 'Re-indexed on Ouedkniss as 58057620, identical property 275m² Zirout Youcef haussmannien 165M DA' },
  { webId: '6ac80ea6c5b7e8884199e5c8', ouedId: '57924129', reason: 'Re-indexed on Ouedkniss as 57924129, identical property 872m² Poirson El Biar villa with pool 650M DA' },
  { webId: '6ac80ff0c5b7e8884199e65e', ouedId: '57924207', reason: 'Re-indexed on Ouedkniss as 57924207, identical property Résidence Khalifati La Vigérie Mohammadia 26M DA' },
  { webId: '6ac80ff2c5b7e8884199e665', ouedId: '57931518', reason: 'Re-indexed on Ouedkniss as 57931518, identical property 638m² Birkhadem commercial land 250M DA' }
];

const usedWeb = new Set(pairs.map(p => p.webId));
const usedOued = new Set(pairs.map(p => p.ouedId));

console.log('5 definitive matches established.');
console.log('Remaining pre-seeded web properties to match: ' + (preSeeded.length - usedWeb.size));
console.log('Remaining eligible Ouedkniss listings: ' + (eligible.length - usedOued.size));

// Remaining 10 pre-seeded web properties:
const remainingWeb = preSeeded.filter(w => !usedWeb.has(w.admin_record_id));
const remainingOued = eligible.filter(e => !usedOued.has(e.source_id));

// For each remaining web property, find best candidate in remainingOued
remainingWeb.forEach(w => {
  const backup = baselineBackup.find(b => b._id === w.admin_record_id);
  const webText = (backup.title + ' ' + backup.description).toLowerCase();

  const candidates = remainingOued.map(e => {
    let score = 0;
    const reasons = [];
    if (e.transaction_type && w.transaction_type && e.transaction_type.toLowerCase() === w.transaction_type.toLowerCase()) {
      score += 20;
    } else {
      score -= 50;
    }
    if (e.property_category && w.property_category && e.property_category.toLowerCase() === w.property_category.toLowerCase()) {
      score += 15;
    }
    if (e.commune && w.commune && e.commune.toLowerCase().trim() === w.commune.toLowerCase().trim()) {
      score += 30;
      reasons.push('commune');
    }
    if (e.price && w.price && Number(e.price) > 0 && Number(e.price) === Number(w.price)) {
      score += 50;
      reasons.push('price');
    }
    if (e.surface && w.surface && Number(e.surface) > 0 && Number(e.surface) === Number(w.surface)) {
      score += 40;
      reasons.push('surface');
    }
    const ouedText = (e.source_title + ' ' + (e.description_clean || '')).toLowerCase();
    const wordsW = webText.split(/\W+/).filter(x => x.length > 4);
    const wordsO = ouedText.split(/\W+/).filter(x => x.length > 4);
    const common = wordsW.filter(x => wordsO.includes(x));
    if (common.length > 3) {
      score += 25;
      reasons.push('words:' + common.slice(0, 3).join(','));
    }
    return { e, score, reasons };
  }).sort((a, b) => b.score - a.score);

  console.log(`\nWeb [${w.admin_record_id}] ref=${w.match_source_id} | ${w.title} (${w.transaction_type} ${w.property_category}, ${w.commune}, ${w.price} DZD)`);
  candidates.slice(0, 2).forEach(c => {
    console.log(`  Candidate [${c.e.source_id}] score=${c.score} [${c.reasons.join(', ')}]: ${c.e.source_title} (${c.e.transaction_type} ${c.e.property_category}, ${c.e.commune}, ${c.e.price} DZD, ${c.e.surface} m²)`);
  });
});
