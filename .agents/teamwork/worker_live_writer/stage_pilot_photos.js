const fs = require('fs');
const path = require('path');
const https = require('https');

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
        fs.unlinkSync(dest);
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

// Function to extract dimensions from JPEG buffer
function getJpegDimensions(buffer) {
  let i = 0;
  if (buffer[i] !== 0xFF || buffer[i + 1] !== 0xD8) {
    return null; // Not a JPEG
  }
  i += 2;
  while (i < buffer.length) {
    if (buffer[i] !== 0xFF) return null;
    const marker = buffer[i + 1];
    i += 2;
    // SOF markers: SOF0 (0xC0) to SOF15 (0xCF) except DHT (0xC4), JPG (0xC8), DAC (0xCC)
    if (
      (marker >= 0xC0 && marker <= 0xC3) ||
      (marker >= 0xC5 && marker <= 0xC7) ||
      (marker >= 0xC9 && marker <= 0xCB) ||
      (marker >= 0xCD && marker <= 0xCF)
    ) {
      const h = buffer.readUInt16BE(i + 3);
      const w = buffer.readUInt16BE(i + 5);
      return { width: w, height: h };
    } else {
      const length = buffer.readUInt16BE(i);
      i += length;
    }
  }
  return null;
}

async function run() {
  const dir = path.join(__dirname, '..', '..', '..', '.antigravity', 'laforet-reconciliation');
  const manifestPath = path.join(dir, 'OUEDKNISS_PHOTO_MANIFEST.csv');
  const manifest = parseCSV(fs.readFileSync(manifestPath, 'utf8'));

  const pilotIds = ['58058097', '57924648', '57296094'];
  const stagingDir = path.join(__dirname, 'staging');

  if (!fs.existsSync(stagingDir)) {
    fs.mkdirSync(stagingDir, { recursive: true });
  }

  const results = [];

  for (const id of pilotIds) {
    const idDir = path.join(stagingDir, id);
    if (!fs.existsSync(idDir)) {
      fs.mkdirSync(idDir, { recursive: true });
    }

    const photos = manifest.rows.filter(x => x.source_id === id);
    console.log(`\n=== STAGING PHOTOS FOR LISTING ${id} (${photos.length} photos) ===`);

    for (const p of photos) {
      const filename = p.filename || `${id}_${p.source_photo_order}.jpg`;
      const localPath = path.join(idDir, filename);
      const url = p.source_image_url_or_reference;

      console.log(`Downloading [${p.source_photo_order}/${photos.length}] ${filename} from ${url}...`);
      await downloadFile(url, localPath);

      const stats = fs.statSync(localPath);
      const buf = fs.readFileSync(localPath);
      const dims = getJpegDimensions(buf) || { width: 0, height: 0 };

      const info = {
        source_id: id,
        photo_order: p.source_photo_order,
        filename: filename,
        localPath: localPath,
        sizeBytes: stats.size,
        dimensions: `${dims.width}x${dims.height}`,
        isJpeg: buf[0] === 0xFF && buf[1] === 0xD8,
        sourceUrl: url
      };
      results.push(info);
      console.log(`  -> Saved: ${filename} (${(stats.size / 1024).toFixed(1)} KB, ${info.dimensions}, Valid JPEG: ${info.isJpeg})`);
    }
  }

  const summaryPath = path.join(__dirname, 'staged_photos_manifest.json');
  fs.writeFileSync(summaryPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`\nAll ${results.length} pilot photos staged and verified! Manifest saved to: ${summaryPath}`);
}

run().catch(console.error);
