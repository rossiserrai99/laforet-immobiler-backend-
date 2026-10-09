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

const ouedData = fs.readFileSync('.antigravity/laforet-reconciliation/OUEDKNISS_INVENTORY.csv', 'utf8');
const ouedRows = parseCSV(ouedData).filter(r => r.length > 1);
const ouedHeader = ouedRows[0];
const ouedRecords = ouedRows.slice(1).map(r => {
  const obj = {};
  ouedHeader.forEach((h, idx) => obj[h] = r[idx]);
  return obj;
});

const eligible = ouedRecords.filter(r => r.eligibility === 'ELIGIBLE');

const webData = fs.readFileSync('.antigravity/laforet-reconciliation/EXISTING_WEBSITE_INVENTORY.csv', 'utf8');
const webRows = parseCSV(webData).filter(r => r.length > 1);
const webHeader = webRows[0];
const webRecords = webRows.slice(1).map(r => {
  const obj = {};
  webHeader.forEach((h, idx) => obj[h] = r[idx]);
  return obj;
});

const preSeeded = webRecords.filter(w => w.match_source_id !== 'NONE');

console.log('=== PRE-SEEDED (15) ===');
preSeeded.forEach(p => {
  console.log(`ID: ${p.admin_record_id} | ref: ${p.match_source_id} | type: ${p.transaction_type} | cat: ${p.property_category} | commune: ${p.commune} | price: ${p.price} | surface: ${p.surface} | title: ${p.title}`);
});

console.log('\n=== ALL 43 ELIGIBLE OUEDKNISS ===');
eligible.forEach(e => {
  console.log(`source_id: ${e.source_id} | page: ${e.source_page_number} | type: ${e.transaction_type} | cat: ${e.property_category} | commune: ${e.commune} | price: ${e.price} | surface: ${e.surface} | title: ${e.source_title}`);
});
