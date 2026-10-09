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

console.log('Inspecting match_status and admin_record_id in OUEDKNISS_INVENTORY.csv:');
eligible.forEach((e, idx) => {
  console.log(`[${idx+1}] ID: ${e.source_id} | match_status: "${e.match_status}" | admin_record_id: "${e.admin_record_id}" | title: ${e.source_title}`);
});
