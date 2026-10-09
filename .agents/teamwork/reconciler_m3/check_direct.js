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
const eligible = oued100.filter(r => r.eligibility === 'ELIGIBLE');

const webRows = parseCSV(fs.readFileSync('.antigravity/laforet-reconciliation/EXISTING_WEBSITE_INVENTORY.csv', 'utf8')).filter(r => r.length > 1);
const webRecords = webRows.slice(1).map(r => {
  const obj = {};
  webRows[0].forEach((h, idx) => obj[h] = r[idx]);
  return obj;
});

const preSeeded = webRecords.filter(w => w.match_source_id !== 'NONE');
const baselineBackup = JSON.parse(fs.readFileSync('.antigravity/laforet-reconciliation/BASELINE_PROPERTIES_BACKUP.json', 'utf8'));

// Check how many of the 43 eligible listings have direct source_id matching match_source_id
console.log('--- Checking direct source_id match ---');
let directMatches = 0;
eligible.forEach(e => {
  const webMatch = preSeeded.find(w => w.match_source_id === e.source_id);
  if (webMatch) {
    directMatches++;
    console.log(`Direct match: Ouedkniss ID ${e.source_id} matches Web [${webMatch.admin_record_id}] (${webMatch.title})`);
  }
});
console.log(`Total direct ID matches: ${directMatches}`);

// Check why 14 did not match by source_id:
console.log('\n--- Checking why other IDs differ ---');
preSeeded.forEach(w => {
  const exact = eligible.find(e => e.source_id === w.match_source_id);
  if (!exact) {
    console.log(`Web ref ${w.match_source_id} (${w.title}) not in eligible.source_id`);
  }
});
