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

console.log('Total Ouedkniss records:', ouedRecords.length);
const eligibilityCounts = {};
ouedRecords.forEach(r => {
  eligibilityCounts[r.eligibility] = (eligibilityCounts[r.eligibility] || 0) + 1;
});
console.log('Eligibility counts:', eligibilityCounts);

const eligible = ouedRecords.filter(r => r.eligibility === 'ELIGIBLE');
console.log('Eligible count:', eligible.length);
const typeCounts = {};
eligible.forEach(r => {
  typeCounts[r.transaction_type] = (typeCounts[r.transaction_type] || 0) + 1;
});
console.log('Eligible transaction types:', typeCounts);

// Now load existing website inventory
const webData = fs.readFileSync('.antigravity/laforet-reconciliation/EXISTING_WEBSITE_INVENTORY.csv', 'utf8');
const webRows = parseCSV(webData).filter(r => r.length > 1);
const webHeader = webRows[0];
const webRecords = webRows.slice(1).map(r => {
  const obj = {};
  webHeader.forEach((h, idx) => obj[h] = r[idx]);
  return obj;
});

console.log('Total Website records:', webRecords.length);
console.log('Web sample match_source_id:', webRecords.slice(0, 5).map(w => ({ id: w.admin_record_id, title: w.title, match_source_id: w.match_source_id })));


const allOuedIds = ouedRecords.map(r => r.source_id);
console.log('All Ouedkniss source_ids (total ' + allOuedIds.length + '):', allOuedIds);

const web15Ids = webRecords.filter(w => w.match_source_id !== 'NONE').map(w => w.match_source_id);
console.log('Web 15 pre-seeded IDs:', web15Ids);

web15Ids.forEach(id => {
  const matchInAll = ouedRecords.find(r => r.source_id === id);
  const matchInEligible = eligible.find(r => r.source_id === id);
  console.log(`ID ${id}: in all? ${!!matchInAll} (eligibility=${matchInAll ? matchInAll.eligibility : 'N/A'}), in eligible? ${!!matchInEligible}`);
});


