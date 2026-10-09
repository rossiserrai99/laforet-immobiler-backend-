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

// Let's examine:
// Did the orchestrator mean:
// The 15 pre-seeded properties on the website have Ouedkniss IDs (LF-OK-*).
// And in OUEDKNISS_INVENTORY.csv, are there 43 eligible listings?
// If the 15 pre-seeded properties are the 15 matching properties:
// How do we match them to the 43 eligible listings?
console.log('Pre-seeded website properties count:', preSeeded.length);
console.log('Eligible Ouedkniss listings count:', eligible.length);
