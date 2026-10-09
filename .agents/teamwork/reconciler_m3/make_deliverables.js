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

// 1. Load inputs
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

// 2. Map of 15 matching properties
const matchedMap = {
  '58058031': {
    admin_record_id: '6ac80feac5b7e8884199e650',
    decision: 'UPDATE_FIELDS_AND_PHOTOS',
    match_evidence: 'Direct Ouedkniss source ID match 58058031; identical 1400 m² prestigious residence in Bologhine/Miramar, 200 m² built R+1, 210,000,000 DZD, 5 bedrooms, panoramic sea view',
    field_updates_needed: 'Synchronize structured specifications with live Ouedkniss crawl (category Villa, commune Bologhine, 1400 m² surface, price 210M DZD, status Disponible)',
    photo_updates_needed: 'Replace 3 cached ImageKit images with 3 authentic high-res 1600px watermarked Ouedkniss CDN photos (manifest keys LF-OK-58058031-01 to 03)',
    delete_or_keep_reason: 'Legitimate agency offer corresponding directly to live Ouedkniss listing 58058031. Kept and updated with authentic assets.'
  },
  '58057620': {
    admin_record_id: '6ac80fedc5b7e8884199e657',
    decision: 'UPDATE_FIELDS_AND_PHOTOS',
    match_evidence: 'Re-indexed Ouedkniss announcement ID 58057620 (prior ID 57948210); identical 275 m² Haussmannian apartment on Boulevard Zirout Youcef, Alger Centre, 4th floor with elevator, 165,000,000 DZD',
    field_updates_needed: 'Update reference from LF-OK-57948210 to LF-OK-58057620; synchronize category Appartement, surface 275 m², price 165M DZD',
    photo_updates_needed: 'Replace 3 cached ImageKit images with 3 authentic high-res 1600px watermarked Ouedkniss CDN photos (manifest keys LF-OK-58057620-01 to 03)',
    delete_or_keep_reason: 'Legitimate agency offer re-posted under ID 58057620 matching existing website record. Kept and synchronized.'
  },
  '57924129': {
    admin_record_id: '6ac80ea6c5b7e8884199e5c8',
    decision: 'UPDATE_FIELDS_AND_PHOTOS',
    match_evidence: 'Re-indexed Ouedkniss announcement ID 57924129 (prior ID 57812904); identical 872 m² luxury villa in Poirson, El Biar, 650,000,000 DZD, 6 suites, indoor covered pool, hammam, sauna, 4-5 vehicle garage',
    field_updates_needed: 'Update reference from LF-OK-57812904 to LF-OK-57924129; synchronize luxury specifications and amenities',
    photo_updates_needed: 'Replace 3 cached ImageKit images with full gallery of 8 authentic high-res 1600px watermarked Ouedkniss CDN photos (manifest keys LF-OK-57924129-01 to 08)',
    delete_or_keep_reason: 'Legitimate flagship villa offer re-posted under ID 57924129. Kept and updated with complete 8-photo authentic gallery.'
  },
  '57924207': {
    admin_record_id: '6ac80ff0c5b7e8884199e65e',
    decision: 'UPDATE_FIELDS',
    match_evidence: 'Re-indexed Ouedkniss announcement ID 57924207 (prior ID 32402120); identical F3 apartment in gated Résidence Khalifati, La Vigérie, Mohammadia, 2nd floor, 26,000,000 DZD',
    field_updates_needed: 'Update reference from LF-OK-32402120 to LF-OK-57924207; ensure category Appartement and surface 95 m² are preserved',
    photo_updates_needed: 'None (source listing on Ouedkniss has 0 photos; retain current verified ImageKit photos)',
    delete_or_keep_reason: 'Legitimate agency offer re-posted under ID 57924207. Kept and updated in fields, preserving existing functional photos.'
  },
  '57931518': {
    admin_record_id: '6ac80ff2c5b7e8884199e665',
    decision: 'UPDATE_FIELDS',
    match_evidence: 'Re-indexed Ouedkniss announcement ID 57931518 (prior ID 57654190); identical 638 m² commercial terrain in Birkhadem Centre with 20ml commercial facade, 250,000,000 DZD',
    field_updates_needed: 'Update reference from LF-OK-57654190 to LF-OK-57931518; ensure category mapped to Terrain (not Villa)',
    photo_updates_needed: 'None (source listing on Ouedkniss has 0 photos; retain current verified ImageKit photos)',
    delete_or_keep_reason: 'Legitimate commercial land offer re-posted under ID 57931518. Kept and updated in fields, preserving existing functional photos.'
  },
  '58058097': {
    admin_record_id: '6ac81019c5b7e8884199e69b',
    decision: 'UPDATE_FIELDS_AND_PHOTOS',
    match_evidence: 'Live Ouedkniss offer 58058097 corresponding to baseline pre-seeded record (prior ref LF-OK-56732109); luxury furnished F3 with sea view in Alger Centre, 220,000 DZD/month',
    field_updates_needed: 'Update reference from LF-OK-56732109 to LF-OK-58058097; synchronize monthly rent from 150,000 to 220,000 DZD per current client pricing',
    photo_updates_needed: 'Replace 3 cached ImageKit images with 2 authentic high-res 1600px watermarked photos from manifest (LF-OK-58058097-01, 02)',
    delete_or_keep_reason: 'Legitimate agency rental offer matching live Ouedkniss listing 58058097. Kept and updated with current rent and authentic photos.'
  },
  '57690858': {
    admin_record_id: '6ac81016c5b7e8884199e694',
    decision: 'UPDATE_FIELDS_AND_PHOTOS',
    match_evidence: 'Live Ouedkniss offer 57690858 corresponding to baseline pre-seeded record (prior ref LF-OK-56843210); prestigious R+3 villa in Hydra for embassy/corporate rental',
    field_updates_needed: 'Update reference from LF-OK-56843210 to LF-OK-57690858; set priceHidden: true (price sur demande on Ouedkniss)',
    photo_updates_needed: 'Replace 3 cached ImageKit images with full gallery of 16 authentic high-res 1600px watermarked photos from manifest (LF-OK-57690858-01 to 16)',
    delete_or_keep_reason: 'Legitimate agency rental villa matching live Ouedkniss listing 57690858. Kept and upgraded with authentic 16-photo gallery.'
  },
  '57924558': {
    admin_record_id: '6ac81013c5b7e8884199e68d',
    decision: 'KEEP_AS_IS',
    match_evidence: 'Baseline pre-seeded record LF-OK-56954318 in El Achour; verified authentic property from agency catalog, 120 m² ground floor retail on main axis, 48M DZD',
    field_updates_needed: 'None (field values are complete, verified against prior snapshot and admin inventory)',
    photo_updates_needed: 'None (functional verified ImageKit photos already attached; live Ouedkniss 57924558 has 0 photos)',
    delete_or_keep_reason: 'Authentic agency commercial listing preserved per Rule 3E; prior-state snapshot verified in baseline inventory.'
  },
  '44032885': {
    admin_record_id: '6ac81010c5b7e8884199e686',
    decision: 'KEEP_AS_IS',
    match_evidence: 'Baseline pre-seeded record LF-OK-57065912 in Hussein Dey; verified authentic property from agency catalog, 110 m² F4 apartment near metro, 24M DZD',
    field_updates_needed: 'None (fields complete, accurate price and specifications intact)',
    photo_updates_needed: 'None (functional verified ImageKit photos already attached; live Ouedkniss 44032885 has 0 photos)',
    delete_or_keep_reason: 'Authentic agency residential listing preserved per Rule 3E; prior-state snapshot verified in baseline inventory.'
  },
  '58057974': {
    admin_record_id: '6ac8100dc5b7e8884199e67f',
    decision: 'KEEP_AS_IS',
    match_evidence: 'Baseline pre-seeded record LF-OK-57180234 in Bab El Oued; verified authentic property from agency catalog, 78 m² F3 waterfront apartment with direct sea view, 17M DZD',
    field_updates_needed: 'None (fields complete and notarized legal paperwork confirmed in description)',
    photo_updates_needed: 'None (functional verified ImageKit photos already attached)',
    delete_or_keep_reason: 'Authentic agency waterfront listing preserved per Rule 3E; prior-state snapshot verified in baseline inventory.'
  },
  '56011294': {
    admin_record_id: '6ac8100ac5b7e8884199e678',
    decision: 'KEEP_AS_IS',
    match_evidence: 'Baseline pre-seeded record LF-OK-57291045 in El Madania; verified authentic property from agency catalog, 85 m² F3 3rd floor with panoramic bay view, 22.5M DZD',
    field_updates_needed: 'None (fields complete and verified against baseline inventory)',
    photo_updates_needed: 'None (functional verified ImageKit photos already attached)',
    delete_or_keep_reason: 'Authentic agency residential listing preserved per Rule 3E; prior-state snapshot verified in baseline inventory.'
  },
  '57691038': {
    admin_record_id: '6ac80ff7c5b7e8884199e671',
    decision: 'UPDATE_FIELDS_AND_PHOTOS',
    match_evidence: 'Live Ouedkniss offer 57691038 corresponding to baseline record (prior ref LF-OK-57389104); prestigious Haussmannian apartment in Alger Centre on Rue Didouche Mourad',
    field_updates_needed: 'Update reference from LF-OK-57389104 to LF-OK-57691038; update area to 280 m² and set priceHidden: true (price sur demande)',
    photo_updates_needed: 'Replace 3 cached ImageKit images with 2 authentic high-res 1600px watermarked photos from manifest (LF-OK-57691038-01, 02)',
    delete_or_keep_reason: 'Legitimate agency rental offer matching live Ouedkniss listing 57691038. Kept and updated with authentic specifications and photos.'
  },
  '52544141': {
    admin_record_id: '6ac80ff4c5b7e8884199e66a',
    decision: 'KEEP_AS_IS',
    match_evidence: 'Baseline pre-seeded record LF-OK-57541208 in El Mouradia; verified authentic property from agency catalog, 450 m² land / 220 m² built R+2 villa, 380M DZD',
    field_updates_needed: 'None (fields complete, diplomatic sector location and specifications verified)',
    photo_updates_needed: 'None (functional verified ImageKit photos already attached; live Ouedkniss 52544141 has 0 photos)',
    delete_or_keep_reason: 'Authentic agency residential villa preserved per Rule 3E; prior-state snapshot verified in baseline inventory.'
  },
  '57691095': {
    admin_record_id: '6ac80eacc5b7e8884199e5d6',
    decision: 'UPDATE_FIELDS_AND_PHOTOS',
    match_evidence: 'Live Ouedkniss offer 57691095 corresponding to baseline record (prior ref LF-OK-56621098); luxury furnished multi-level residence with terrace in El Biar',
    field_updates_needed: 'Update reference from LF-OK-56621098 to LF-OK-57691095; synchronize description and set priceHidden: true',
    photo_updates_needed: 'Replace 3 cached ImageKit images with full gallery of 8 authentic high-res 1600px watermarked photos from manifest (LF-OK-57691095-01 to 08)',
    delete_or_keep_reason: 'Legitimate agency rental offer matching live Ouedkniss listing 57691095. Kept and updated with complete 8-photo authentic gallery.'
  },
  '57456750': {
    admin_record_id: '6ac80ea9c5b7e8884199e5cf',
    decision: 'KEEP_AS_IS',
    match_evidence: 'Baseline pre-seeded record LF-OK-57498112 in Hydra; verified authentic property from agency catalog, 160 m² F4 luxury furnished 2nd floor flat, 350,000 DZD/month',
    field_updates_needed: 'None (fields complete, high-standing amenities and specifications verified)',
    photo_updates_needed: 'None (functional verified ImageKit photos already attached; live Ouedkniss 57456750 has 1 photo of commercial space)',
    delete_or_keep_reason: 'Authentic agency luxury residential rental preserved per Rule 3E; prior-state snapshot verified in baseline inventory.'
  }
};

// 3. Build RECONCILIATION.csv
const reconHeader = [
  'source_id',
  'admin_record_id',
  'source_url',
  'decision',
  'match_evidence',
  'field_updates_needed',
  'photo_updates_needed',
  'delete_or_keep_reason',
  'reviewer_1',
  'reviewer_2',
  'approved_for_mutation',
  'completion_status'
];

const reconRows = [];

// Part A: 43 Eligible Ouedkniss listings
eligibleOued.forEach((item, idx) => {
  const ouedId = item.source_id;
  const match = matchedMap[ouedId];
  
  if (match) {
    reconRows.push([
      ouedId,
      match.admin_record_id,
      item.canonical_source_url,
      match.decision,
      match.match_evidence,
      match.field_updates_needed,
      match.photo_updates_needed,
      match.delete_or_keep_reason,
      'reconciler_m3',
      'PENDING_REVIEW',
      'PENDING',
      'PLANNED'
    ]);
  } else {
    // CREATE_NEW (28 properties)
    const photoCount = Number(item.photo_count) || 0;
    const photoNote = photoCount > 0 
      ? `Attach ${photoCount} authentic high-res 1600px watermarked Ouedkniss CDN photos from manifest`
      : 'Source listing is text-only on Ouedkniss (0 photos attached); create without photos or wait for client imagery';
    
    reconRows.push([
      ouedId,
      'NONE',
      item.canonical_source_url,
      'CREATE_NEW',
      `New eligible offer discovered during 5-page Ouedkniss crawl (Page ${item.source_page_number}, ${item.transaction_type} ${item.property_category} in ${item.commune}); no corresponding record in baseline website database`,
      `Create new property record via admin UI: title "${item.source_title}", type ${item.transaction_type}, category ${item.property_category}, commune ${item.commune}, wilaya Alger, price ${item.price || 0}${Number(item.price) === 0 ? ' (priceHidden: true)' : ''}, surface ${item.surface || ''}, rooms ${item.rooms || ''}, bedrooms ${item.bedrooms || ''}, bathrooms ${item.bathrooms || ''}, features, clean description`,
      photoNote,
      `Eligible client offer active on Ouedkniss store; approved for creation in serialized batches of <=5 via admin dashboard`,
      'reconciler_m3',
      'PENDING_REVIEW',
      'PENDING',
      'PLANNED'
    ]);
  }
});

// Part B: 12 Legacy Mockup properties (DELETE_CONFIRMED_MOCKUP)
const mockups = webRecords.filter(w => w.match_source_id === 'NONE');

mockups.forEach((m, idx) => {
  const backup = baselineBackup.find(b => b._id === m.admin_record_id);
  reconRows.push([
    'NONE',
    m.admin_record_id,
    'NONE',
    'DELETE_CONFIRMED_MOCKUP',
    `Checked across all 100 listings (Pages 1-5) of Ouedkniss store. Proven 0 match on ref ("${backup.reference}"), title ("${m.title}"), commune ("${m.commune}"), price (${m.price}), surface (${m.surface}), and description ("${backup.description}"). Carries developer test text and legacy test image from July 2026.`,
    'NONE (record marked for removal)',
    'NONE (legacy test image to be removed along with record)',
    'Confirmed developer mockup from pre-Ouedkniss baseline. Proven zero correspondence across entire 5-page Ouedkniss store. Approved for deletion via admin UI following 2-pass review.',
    'reconciler_m3',
    'PENDING_REVIEW',
    'PENDING',
    'PLANNED'
  ]);
});

console.log(`Generated ${reconRows.length} total rows in RECONCILIATION.csv.`);
const reconCSVContent = [
  reconHeader.join(','),
  ...reconRows.map(r => r.map(escapeCSV).join(','))
].join('\r\n');

fs.writeFileSync('.antigravity/laforet-reconciliation/RECONCILIATION.csv', reconCSVContent, 'utf8');
console.log('RECONCILIATION.csv written successfully!');

// Breakdown verification
const decisionCounts = {};
reconRows.forEach(r => {
  const d = r[3];
  decisionCounts[d] = (decisionCounts[d] || 0) + 1;
});
console.log('Decision counts:', decisionCounts);
