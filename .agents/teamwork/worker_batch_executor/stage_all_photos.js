const fs = require('fs');
const path = require('path');
const https = require('https');

const manifestPath = path.join(__dirname, '..', '..', '..', '.antigravity', 'laforet-reconciliation', 'OUEDKNISS_PHOTO_MANIFEST.csv');
const reconPath = path.join(__dirname, '..', '..', '..', '.antigravity', 'laforet-reconciliation', 'RECONCILIATION.csv');
const stagingBaseDir = path.join(__dirname, 'staging');

function parseLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += c;
    }
  }
  result.push(current);
  return result;
}

function parseCSV(content) {
  const lines = content.split('\n');
  const headers = parseLine(lines[0]);
  const rows = [];
  let currentRecord = '';
  let inQuotes = false;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() && !inQuotes) continue;
    currentRecord += (currentRecord ? '\n' : '') + line;
    let quoteCount = 0;
    for (let j = 0; j < currentRecord.length; j++) {
      if (currentRecord[j] === '"') quoteCount++;
    }
    if (quoteCount % 2 === 0) {
      const parsed = parseLine(currentRecord);
      const rowObj = {};
      headers.forEach((h, idx) => {
        rowObj[h.trim()] = (parsed[idx] || '').trim();
      });
      rows.push(rowObj);
      currentRecord = '';
    }
  }
  return { headers, rows };
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode !== 200) {
        file.close();
        if (fs.existsSync(dest)) fs.unlinkSync(dest);
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve());
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(err);
    });
  });
}

async function main() {
  if (!fs.existsSync(stagingBaseDir)) {
    fs.mkdirSync(stagingBaseDir, { recursive: true });
  }

  const reconCsv = fs.readFileSync(reconPath, 'utf8');
  const reconRows = parseCSV(reconCsv).rows;
  const plannedSources = new Set(
    reconRows
      .filter(r => r.completion_status === 'PLANNED' && ['UPDATE_FIELDS_AND_PHOTOS', 'CREATE_NEW'].includes(r.decision))
      .map(r => r.source_id)
  );

  const manifestCsv = fs.readFileSync(manifestPath, 'utf8');
  const manifestRows = parseCSV(manifestCsv).rows;

  const targetPhotos = manifestRows.filter(r => plannedSources.has(r.source_id));
  console.log(`Found ${targetPhotos.length} photos to stage across ${plannedSources.size} planned listings.`);

  let downloadedCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < targetPhotos.length; i++) {
    const photo = targetPhotos[i];
    const sourceDir = path.join(stagingBaseDir, photo.source_id);
    if (!fs.existsSync(sourceDir)) {
      fs.mkdirSync(sourceDir, { recursive: true });
    }

    const destPath = path.join(sourceDir, photo.filename);
    const url = photo.source_image_url_or_reference;

    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
      skippedCount++;
    } else {
      let retries = 3;
      let success = false;
      while (retries > 0 && !success) {
        try {
          process.stdout.write(`[${i + 1}/${targetPhotos.length}] Downloading ${photo.source_id}/${photo.filename}... `);
          await downloadFile(url, destPath);
          const buf = fs.readFileSync(destPath);
          if (buf[0] !== 0xFF || buf[1] !== 0xD8) {
            throw new Error('Invalid JPEG magic bytes');
          }
          downloadedCount++;
          success = true;
          console.log(`OK (${buf.length} bytes)`);
        } catch (err) {
          retries--;
          console.log(`FAILED (${err.message}). Retries left: ${retries}`);
          if (retries === 0) throw err;
          await new Promise(r => setTimeout(r, 1000));
        }
      }
    }
  }

  console.log(`\nStaging complete! Newly downloaded: ${downloadedCount}, Already cached: ${skippedCount}, Total verified: ${targetPhotos.length}`);
}

main().catch(err => {
  console.error('Photo staging failed:', err);
  process.exit(1);
});
