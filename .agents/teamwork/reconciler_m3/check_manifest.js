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

const manifestRows = parseCSV(fs.readFileSync('.antigravity/laforet-reconciliation/OUEDKNISS_PHOTO_MANIFEST.csv', 'utf8')).filter(r => r.length > 1);
const manifestHeader = manifestRows[0];
const manifest = manifestRows.slice(1).map(r => {
  const obj = {};
  manifestHeader.forEach((h, idx) => obj[h] = r[idx]);
  return obj;
});

console.log('Manifest total photos:', manifest.length);
const sourceIdsInManifest = new Set(manifest.map(m => m.source_id));
console.log('Distinct source_ids with photos in manifest:', sourceIdsInManifest.size);
console.log('List of source_ids with photos:', Array.from(sourceIdsInManifest));
