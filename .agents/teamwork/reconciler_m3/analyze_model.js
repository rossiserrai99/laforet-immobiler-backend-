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

console.log('Web total:', webRecords.length);
console.log('Eligible Ouedkniss total:', eligible.length);

// Let's examine:
// If each of the 43 eligible listings is listed in RECONCILIATION.csv
// PLUS the 12 mockup properties (which have source_id = NONE)
// Total rows = 43 + 12 = 55!
// In that 55-row table:
// 12 rows are DELETE_CONFIRMED_MOCKUP (source_id = NONE, admin_record_id = 6a...)
// What about the 43 eligible listings?
// If 15 match the 15 website properties:
// Then 15 rows have admin_record_id = 6ac... (decisions: UPDATE_FIELDS_AND_PHOTOS, UPDATE_FIELDS, REPLACE_PHOTOS, KEEP_AS_IS)
// And 28 rows have admin_record_id = NONE (decision: CREATE_NEW)
// Let's see if 15 + 28 = 43!
// 15 + 28 is EXACTLY 43!
// And 15 + 12 is EXACTLY 27!
