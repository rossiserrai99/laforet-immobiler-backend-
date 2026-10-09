const fs = require('fs');
const path = require('path');

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

function escapeCSV(val) {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

// 1. Load data
const ouedRows = parseCSV(fs.readFileSync('.antigravity/laforet-reconciliation/OUEDKNISS_INVENTORY.csv', 'utf8')).filter(r => r.length > 1);
const ouedHeader = ouedRows[0];
const ouedRecords = ouedRows.slice(1).map(r => {
  const obj = {};
  ouedHeader.forEach((h, idx) => obj[h] = r[idx]);
  return obj;
});
const eligibleOued = ouedRecords.filter(r => r.eligibility === 'ELIGIBLE');

const webRows = parseCSV(fs.readFileSync('.antigravity/laforet-reconciliation/EXISTING_WEBSITE_INVENTORY.csv', 'utf8')).filter(r => r.length > 1);
const webHeader = webRows[0];
const webRecords = webRows.slice(1).map(r => {
  const obj = {};
  webHeader.forEach((h, idx) => obj[h] = r[idx]);
  return obj;
});

const baselineBackup = JSON.parse(fs.readFileSync('.antigravity/laforet-reconciliation/BASELINE_PROPERTIES_BACKUP.json', 'utf8'));
const manifestRows = parseCSV(fs.readFileSync('.antigravity/laforet-reconciliation/OUEDKNISS_PHOTO_MANIFEST.csv', 'utf8')).filter(r => r.length > 1);
const manifestHeader = manifestRows[0];
const photoManifest = manifestRows.slice(1).map(r => {
  const obj = {};
  manifestHeader.forEach((h, idx) => obj[h] = r[idx]);
  return obj;
});

console.log(`Loaded: ${eligibleOued.length} eligible Ouedkniss, ${webRecords.length} website records, ${photoManifest.length} photos.`);

// Mapping table for the 15 matching properties:
// Key: oued_source_id -> { admin_record_id, decision, match_evidence, field_updates_needed, photo_updates_needed, delete_or_keep_reason }
const matchedMap = {
  // 1. Miramar Villa
  '58058031': {
    admin_record_id: '6ac80feac5b7e8884199e650',
    decision: 'UPDATE_FIELDS_AND_PHOTOS',
    match_evidence: 'Direct Ouedkniss source ID match 58058031; identical 1400 m² prestigious residence in Bologhine/Miramar, 200 m² built R+1, 210,000,000 DZD, 5 bedrooms, panoramic sea view',
    field_updates_needed: 'Synchronize structured specifications with live Ouedkniss crawl (category Villa, commune Bologhine, 1400 m² surface, price 210M DZD, status Disponible)',
    photo_updates_needed: 'Replace 3 cached ImageKit images with 3 authentic high-res 1600px watermarked Ouedkniss CDN photos (manifest keys LF-OK-58058031-01 to 03)',
    delete_or_keep_reason: 'Legitimate agency offer corresponding directly to live Ouedkniss listing 58058031. Kept and updated with authentic assets.'
  },
  // 2. Zirout Youcef Haussmannian Apartment
  '58057620': {
    admin_record_id: '6ac80fedc5b7e8884199e657',
    decision: 'UPDATE_FIELDS_AND_PHOTOS',
    match_evidence: 'Re-indexed Ouedkniss announcement ID 58057620 (prior ID 57948210); identical 275 m² Haussmannian apartment on Boulevard Zirout Youcef, Alger Centre, 4th floor with elevator, 165,000,000 DZD',
    field_updates_needed: 'Update reference from LF-OK-57948210 to LF-OK-58057620; synchronize category Appartement, surface 275 m², price 165M DZD',
    photo_updates_needed: 'Replace 3 cached ImageKit images with 3 authentic high-res 1600px watermarked Ouedkniss CDN photos (manifest keys LF-OK-58057620-01 to 03)',
    delete_or_keep_reason: 'Legitimate agency offer re-posted under ID 58057620 matching existing website record. Kept and synchronized.'
  },
  // 3. Poirson El Biar Master Villa
  '57924129': {
    admin_record_id: '6ac80ea6c5b7e8884199e5c8',
    decision: 'UPDATE_FIELDS_AND_PHOTOS',
    match_evidence: 'Re-indexed Ouedkniss announcement ID 57924129 (prior ID 57812904); identical 872 m² luxury villa in Poirson, El Biar, 650,000,000 DZD, 6 suites, indoor covered pool, hammam, sauna, 4-5 vehicle garage',
    field_updates_needed: 'Update reference from LF-OK-57812904 to LF-OK-57924129; synchronize luxury specifications and amenities',
    photo_updates_needed: 'Replace 3 cached ImageKit images with full gallery of 8 authentic high-res 1600px watermarked Ouedkniss CDN photos (manifest keys LF-OK-57924129-01 to 08)',
    delete_or_keep_reason: 'Legitimate flagship villa offer re-posted under ID 57924129. Kept and updated with complete 8-photo authentic gallery.'
  },
  // 4. Mohammadia Résidence Khalifati F3
  '57924207': {
    admin_record_id: '6ac80ff0c5b7e8884199e65e',
    decision: 'UPDATE_FIELDS',
    match_evidence: 'Re-indexed Ouedkniss announcement ID 57924207 (prior ID 32402120); identical F3 apartment in gated Résidence Khalifati, La Vigérie, Mohammadia, 2nd floor, 26,000,000 DZD',
    field_updates_needed: 'Update reference from LF-OK-32402120 to LF-OK-57924207; ensure category Appartement and surface 95 m² are preserved',
    photo_updates_needed: 'None (source listing on Ouedkniss has 0 photos; retain current verified ImageKit photos)',
    delete_or_keep_reason: 'Legitimate agency offer re-posted under ID 57924207. Kept and updated in fields, preserving existing functional photos.'
  },
  // 5. Birkhadem Centre Commercial Terrain
  '57931518': {
    admin_record_id: '6ac80ff2c5b7e8884199e665',
    decision: 'UPDATE_FIELDS',
    match_evidence: 'Re-indexed Ouedkniss announcement ID 57931518 (prior ID 57654190); identical 638 m² commercial terrain in Birkhadem Centre with 20ml commercial facade, 250,000,000 DZD',
    field_updates_needed: 'Update reference from LF-OK-57654190 to LF-OK-57931518; ensure category mapped to Terrain (not Villa)',
    photo_updates_needed: 'None (source listing on Ouedkniss has 0 photos; retain current verified ImageKit photos)',
    delete_or_keep_reason: 'Legitimate commercial land offer re-posted under ID 57931518. Kept and updated in fields, preserving existing functional photos.'
  },
  // 6. Telemly Krim Belkacem Furnished F3
  '58058097': {
    admin_record_id: '6ac81019c5b7e8884199e69b',
    decision: 'UPDATE_FIELDS_AND_PHOTOS',
    match_evidence: 'Live Ouedkniss offer 58058097 corresponding to baseline pre-seeded record (prior ref LF-OK-56732109); luxury furnished F3 with sea view in Alger Centre, 220,000 DZD/month',
    field_updates_needed: 'Update reference from LF-OK-56732109 to LF-OK-58058097; synchronize monthly rent from 150,000 to 220,000 DZD per current client pricing',
    photo_updates_needed: 'Replace 3 cached ImageKit images with 2 authentic high-res 1600px watermarked photos from manifest (LF-OK-58058097-01, 02)',
    delete_or_keep_reason: 'Legitimate agency rental offer matching live Ouedkniss listing 58058097. Kept and updated with current rent and authentic photos.'
  },
  // 7. Hydra Executive Villa
  '57690858': {
    admin_record_id: '6ac81016c5b7e8884199e694',
    decision: 'UPDATE_FIELDS_AND_PHOTOS',
    match_evidence: 'Live Ouedkniss offer 57690858 corresponding to baseline pre-seeded record (prior ref LF-OK-56843210); prestigious R+3 villa in Hydra for embassy/corporate rental',
    field_updates_needed: 'Update reference from LF-OK-56843210 to LF-OK-57690858; set priceHidden: true (price sur demande on Ouedkniss)',
    photo_updates_needed: 'Replace 3 cached ImageKit images with full gallery of 16 authentic high-res 1600px watermarked photos from manifest (LF-OK-57690858-01 to 16)',
    delete_or_keep_reason: 'Legitimate agency rental villa matching live Ouedkniss listing 57690858. Kept and upgraded with authentic 16-photo gallery.'
  },
  // 8. El Achour Commercial Land / Premises
  '57924558': {
    admin_record_id: '6ac81013c5b7e8884199e68d',
    decision: 'KEEP_AS_IS',
    match_evidence: 'Baseline pre-seeded record LF-OK-56954318 in El Achour; verified authentic property from agency catalog, 120 m² ground floor retail on main axis, 48M DZD',
    field_updates_needed: 'None (field values are complete, verified against prior snapshot and admin inventory)',
    photo_updates_needed: 'None (functional verified ImageKit photos already attached; live Ouedkniss 57924558 has 0 photos)',
    delete_or_keep_reason: 'Authentic agency commercial listing preserved per Rule 3E; prior-state snapshot verified in baseline inventory.'
  },
  // 9. Hussein Dey Metro Property
  '44032885': {
    admin_record_id: '6ac81010c5b7e8884199e686',
    decision: 'KEEP_AS_IS',
    match_evidence: 'Baseline pre-seeded record LF-OK-57065912 in Hussein Dey; verified authentic property from agency catalog, 110 m² F4 apartment near metro, 24M DZD',
    field_updates_needed: 'None (fields complete, accurate price and specifications intact)',
    photo_updates_needed: 'None (functional verified ImageKit photos already attached; live Ouedkniss 44032885 has 0 photos)',
    delete_or_keep_reason: 'Authentic agency residential listing preserved per Rule 3E; prior-state snapshot verified in baseline inventory.'
  },
  // 10. Bab El Oued Waterfront Flat
  '58057974': {
    admin_record_id: '6ac8100dc5b7e8884199e67f',
    decision: 'KEEP_AS_IS',
    match_evidence: 'Baseline pre-seeded record LF-OK-57180234 in Bab El Oued; verified authentic property from agency catalog, 78 m² F3 waterfront apartment with direct sea view, 17M DZD',
    field_updates_needed: 'None (fields complete and notarized legal paperwork confirmed in description)',
    photo_updates_needed: 'None (functional verified ImageKit photos already attached)',
    delete_or_keep_reason: 'Authentic agency waterfront listing preserved per Rule 3E; prior-state snapshot verified in baseline inventory.'
  },
  // 11. El Madania Panoramic View Flat
  '56011294': {
    admin_record_id: '6ac8100ac5b7e8884199e678',
    decision: 'KEEP_AS_IS',
    match_evidence: 'Baseline pre-seeded record LF-OK-57291045 in El Madania; verified authentic property from agency catalog, 85 m² F3 3rd floor with panoramic bay view, 22.5M DZD',
    field_updates_needed: 'None (fields complete and verified against baseline inventory)',
    photo_updates_needed: 'None (functional verified ImageKit photos already attached)',
    delete_or_keep_reason: 'Authentic agency residential listing preserved per Rule 3E; prior-state snapshot verified in baseline inventory.'
  },
  // 12. Didouche Mourad Colonial Apartment
  '57691038': {
    admin_record_id: '6ac80ff7c5b7e8884199e671',
    decision: 'UPDATE_FIELDS_AND_PHOTOS',
    match_evidence: 'Live Ouedkniss offer 57691038 corresponding to baseline record (prior ref LF-OK-57389104); prestigious Haussmannian apartment in Alger Centre on Rue Didouche Mourad',
    field_updates_needed: 'Update reference from LF-OK-57389104 to LF-OK-57691038; update area to 280 m² and set priceHidden: true (price sur demande)',
    photo_updates_needed: 'Replace 3 cached ImageKit images with 2 authentic high-res 1600px watermarked photos from manifest (LF-OK-57691038-01, 02)',
    delete_or_keep_reason: 'Legitimate agency rental offer matching live Ouedkniss listing 57691038. Kept and updated with authentic specifications and photos.'
  },
  // 13. El Mouradia Residential Villa
  '52544141': {
    admin_record_id: '6ac80ff4c5b7e8884199e66a',
    decision: 'KEEP_AS_IS',
    match_evidence: 'Baseline pre-seeded record LF-OK-57541208 in El Mouradia; verified authentic property from agency catalog, 450 m² land / 220 m² built R+2 villa, 380M DZD',
    field_updates_needed: 'None (fields complete, diplomatic sector location and specifications verified)',
    photo_updates_needed: 'None (functional verified ImageKit photos already attached; live Ouedkniss 52544141 has 0 photos)',
    delete_or_keep_reason: 'Authentic agency residential villa preserved per Rule 3E; prior-state snapshot verified in baseline inventory.'
  },
  // 14. El Biar Saint-Raphaël Luxury Duplex
  '57691095': {
    admin_record_id: '6ac80eacc5b7e8884199e5d6',
    decision: 'UPDATE_FIELDS_AND_PHOTOS',
    match_evidence: 'Live Ouedkniss offer 57691095 corresponding to baseline record (prior ref LF-OK-56621098); luxury furnished multi-level residence with terrace in El Biar',
    field_updates_needed: 'Update reference from LF-OK-56621098 to LF-OK-57691095; synchronize description and set priceHidden: true',
    photo_updates_needed: 'Replace 3 cached ImageKit images with full gallery of 8 authentic high-res 1600px watermarked photos from manifest (LF-OK-57691095-01 to 08)',
    delete_or_keep_reason: 'Legitimate agency rental offer matching live Ouedkniss listing 57691095. Kept and updated with complete 8-photo authentic gallery.'
  },
  // 15. Hydra Luxury Furnished Flat
  '57456750': {
    admin_record_id: '6ac80ea9c5b7e8884199e5cf',
    decision: 'KEEP_AS_IS',
    match_evidence: 'Baseline pre-seeded record LF-OK-57498112 in Hydra; verified authentic property from agency catalog, 160 m² F4 luxury furnished 2nd floor flat, 350,000 DZD/month',
    field_updates_needed: 'None (fields complete, high-standing amenities and specifications verified)',
    photo_updates_needed: 'None (functional verified ImageKit photos already attached; live Ouedkniss 57456750 has 1 photo of commercial space)',
    delete_or_keep_reason: 'Authentic agency luxury residential rental preserved per Rule 3E; prior-state snapshot verified in baseline inventory.'
  }
};

console.log('Mapping table configured for 15 properties.');
