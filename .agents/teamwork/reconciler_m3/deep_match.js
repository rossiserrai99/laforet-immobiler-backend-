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

const oued100 = parseCSV(fs.readFileSync('.antigravity/laforet-reconciliation/OUEDKNISS_INVENTORY.csv', 'utf8')).slice(1);
const oued15 = parseCSV(fs.readFileSync('.antigravity/laforet/OUEDKNISS_INVENTORY.csv', 'utf8')).slice(1);
const web27 = parseCSV(fs.readFileSync('.antigravity/laforet-reconciliation/EXISTING_WEBSITE_INVENTORY.csv', 'utf8')).slice(1);

console.log('15 pre-seeded listings from .antigravity/laforet/OUEDKNISS_INVENTORY.csv:');
oued15.forEach(r => {
  console.log(`id: ${r[0]} | title: ${r[5]} | price: ${r[6]} | commune: ${r[10]} | surface: ${r[12]}`);
});

console.log('\nLet check if any of the URLs or descriptions or titles match between oued15 and oued100:');
oued15.forEach(o15 => {
  const match = oued100.find(o100 => {
    // Check if o100[1] (url) contains o15[0]
    return (o100[0] === o15[0]) || (o100[1] && o100[1].includes(o15[0])) || (o100[3] && o100[3].includes(o15[5]));
  });
  console.log(`Old ID ${o15[0]} (${o15[5]}): match in 100? ${match ? match[0] + ' (' + match[3] + ')' : 'NO'}`);
});
