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

const usedWeb = new Set(['6ac80feac5b7e8884199e650', '6ac80fedc5b7e8884199e657', '6ac80ea6c5b7e8884199e5c8', '6ac80ff0c5b7e8884199e65e', '6ac80ff2c5b7e8884199e665']);
const usedOued = new Set(['58058031', '58057620', '57924129', '57924207', '57931518']);

const remainingWeb = preSeeded.filter(w => !usedWeb.has(w.admin_record_id));
const page1Remaining = eligible.filter(e => e.source_page_number === '1' && !usedOued.has(e.source_id));

console.log('Remaining Web (10):', remainingWeb.map(w => ({ id: w.admin_record_id, ref: w.match_source_id, title: w.title, type: w.transaction_type, cat: w.property_category, commune: w.commune })));
console.log('\nPage 1 Remaining Eligible (14):', page1Remaining.map(e => ({ id: e.source_id, title: e.source_title, type: e.transaction_type, cat: e.property_category, commune: e.commune, price: e.price, surface: e.surface })));
