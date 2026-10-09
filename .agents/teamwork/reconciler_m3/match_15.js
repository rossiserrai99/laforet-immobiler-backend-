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

// 1. Current crawl (Milestone 1)
const ouedM1 = fs.readFileSync('.antigravity/laforet-reconciliation/OUEDKNISS_INVENTORY.csv', 'utf8');
const ouedM1Rows = parseCSV(ouedM1).filter(r => r.length > 1);
const ouedM1Header = ouedM1Rows[0];
const ouedM1Records = ouedM1Rows.slice(1).map(r => {
  const obj = {};
  ouedM1Header.forEach((h, idx) => obj[h] = r[idx]);
  return obj;
});

// 2. Existing website inventory
const webData = fs.readFileSync('.antigravity/laforet-reconciliation/EXISTING_WEBSITE_INVENTORY.csv', 'utf8');
const webRows = parseCSV(webData).filter(r => r.length > 1);
const webHeader = webRows[0];
const webRecords = webRows.slice(1).map(r => {
  const obj = {};
  webHeader.forEach((h, idx) => obj[h] = r[idx]);
  return obj;
});

// 3. Pre-seeded 15 records in prior .antigravity/laforet/OUEDKNISS_INVENTORY.csv
const oldOued = fs.readFileSync('.antigravity/laforet/OUEDKNISS_INVENTORY.csv', 'utf8');
const oldOuedRows = parseCSV(oldOued).filter(r => r.length > 1);
const oldOuedHeader = oldOuedRows[0];
const oldOuedRecords = oldOuedRows.slice(1).map(r => {
  const obj = {};
  oldOuedHeader.forEach((h, idx) => obj[h] = r[idx]);
  return obj;
});

console.log('Comparing the 15 pre-seeded records against the 100 listings in OUEDKNISS_INVENTORY.csv:');

const preSeededWeb = webRecords.filter(w => w.match_source_id !== 'NONE');

preSeededWeb.forEach((w, idx) => {
  const oldRef = w.match_source_id;
  const oldRec = oldOuedRecords.find(o => o.source_id === oldRef);
  
  // Find candidates in ouedM1Records
  const candidates = ouedM1Records.map(m => {
    let score = 0;
    const reasons = [];
    if (m.source_id === oldRef) {
      score += 100;
      reasons.push('exact_id');
    }
    // Transaction type
    if (m.transaction_type && w.transaction_type && m.transaction_type.toLowerCase() === w.transaction_type.toLowerCase()) {
      score += 10;
    }
    // Commune
    if (m.commune && w.commune && m.commune.toLowerCase().trim() === w.commune.toLowerCase().trim()) {
      score += 15;
      reasons.push('commune_match');
    }
    // Price
    if (m.price && w.price && Number(m.price) === Number(w.price)) {
      score += 30;
      reasons.push('exact_price');
    }
    // Surface
    if (m.surface && w.surface && Number(m.surface) === Number(w.surface)) {
      score += 25;
      reasons.push('exact_surface');
    }
    // Title similarity
    return { record: m, score, reasons };
  }).sort((a, b) => b.score - a.score);

  console.log(`\n--- Web Record #${idx+1}: [${w.admin_record_id}] ref=${oldRef} ---`);
  console.log(`Title: ${w.title} | ${w.transaction_type} ${w.property_category} | ${w.commune} | ${w.price} DZD | ${w.surface} m²`);
  console.log('Top match candidates:');
  candidates.slice(0, 3).forEach((c, cIdx) => {
    const m = c.record;
    console.log(`  Candidate ${cIdx+1} (score ${c.score}, ${c.reasons.join(',')}): [${m.source_id}] page ${m.source_page_number} | ${m.transaction_type} ${m.property_category} | ${m.commune} | ${m.price} DZD | ${m.surface} m² | ${m.source_title} | eligibility=${m.eligibility}`);
  });
});
