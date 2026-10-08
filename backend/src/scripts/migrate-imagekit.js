const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const ImageKit = require('imagekit');
const mongoose = require('mongoose');

// ImageKit client
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

function getHash(items) {
  const hash = crypto.createHash('sha256');
  for (let item of items) {
    if (typeof item === 'number') hash.update(String(item));
    else hash.update(item);
  }
  return hash.digest('base64url');
}

const cacheDir = path.resolve(__dirname, '../../../frontend/.next/dev/cache/images');
const existingDirs = new Set(fs.existsSync(cacheDir) ? fs.readdirSync(cacheDir) : []);

const widths = [3840, 2048, 1920, 1200, 1080, 828, 750, 640, 384, 256, 128, 96, 64, 48, 32, 16];
const qualities = [100, 95, 90, 85, 80, 75];
const mimeTypes = ['image/webp', 'image/avif', ''];

function findBestCachedImage(url) {
  let best = null;
  const candidates = [url, url.replace('/upload/', '/upload/q_auto:best/')];
  for (const cand of candidates) {
    for (const w of widths) {
      for (const q of qualities) {
        for (const m of mimeTypes) {
          const key = getHash([4, cand, w, q, m]);
          if (existingDirs.has(key)) {
            const dir = path.join(cacheDir, key);
            const files = fs.readdirSync(dir);
            if (files.length > 0) {
              const filePath = path.join(dir, files[0]);
              const stat = fs.statSync(filePath);
              if (!best || stat.size > best.size) {
                best = { key, filePath, size: stat.size, width: w, quality: q };
              }
            }
          }
        }
      }
    }
  }
  return best;
}

async function listAllImageKitFiles() {
  return new Promise((resolve, reject) => {
    imagekit.listFiles({ limit: 100 }, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

async function uploadToImageKit({ file, fileName, folder }) {
  return new Promise((resolve, reject) => {
    imagekit.upload({
      file,
      fileName,
      folder,
      useUniqueFileName: false
    }, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

// 13 property images
const propertyAssetDefs = [
  {
    ref: 'villa',
    title: 'villa a alger',
    index: 0,
    publicId: 'laforet_properties/fjudyrta5bwvmvqtrauv',
    oldUrl: 'https://res.cloudinary.com/zt28qj9l/image/upload/v1784128157/laforet_properties/fjudyrta5bwvmvqtrauv.jpg',
    targetName: 'fjudyrta5bwvmvqtrauv.webp',
    folder: '/laforet_properties'
  },
  {
    ref: 'villa',
    title: 'villa a alger',
    index: 1,
    publicId: 'laforet_properties/wrgsxxke7iryvgqcfjh3',
    oldUrl: 'https://res.cloudinary.com/zt28qj9l/image/upload/v1784128156/laforet_properties/wrgsxxke7iryvgqcfjh3.jpg',
    targetName: 'wrgsxxke7iryvgqcfjh3.webp',
    folder: '/laforet_properties'
  },
  {
    ref: 'maison de metre',
    title: 'maison de metre a el biar',
    index: 0,
    publicId: 'laforet_properties/acwvxzw7u7qyuyatx38s',
    oldUrl: 'https://res.cloudinary.com/zt28qj9l/image/upload/v1784949574/laforet_properties/acwvxzw7u7qyuyatx38s.jpg',
    targetName: 'acwvxzw7u7qyuyatx38s.webp',
    folder: '/laforet_properties'
  },
  {
    ref: 'sdfkbjn',
    title: 'appartement a delybrahim',
    index: 0,
    publicId: 'laforet_properties/hftb4l2hdkc1cnadek45',
    oldUrl: 'https://res.cloudinary.com/zt28qj9l/image/upload/v1784952346/laforet_properties/hftb4l2hdkc1cnadek45.jpg',
    targetName: 'hftb4l2hdkc1cnadek45.webp',
    folder: '/laforet_properties'
  },
  {
    ref: 'villa sidi yahya',
    title: 'villa a sidi yahya',
    index: 0,
    publicId: 'laforet_properties/izqpylvqlheip9cobwyz',
    oldUrl: 'https://res.cloudinary.com/zt28qj9l/image/upload/v1784953110/laforet_properties/izqpylvqlheip9cobwyz.jpg',
    targetName: 'izqpylvqlheip9cobwyz.webp',
    folder: '/laforet_properties'
  },
  {
    ref: 'villa-1',
    title: 'villa a birkhadem',
    index: 0,
    publicId: 'laforet_properties/a5dyeugcf3gzhfpwjtqz',
    oldUrl: 'https://res.cloudinary.com/zt28qj9l/image/upload/v1784957373/laforet_properties/a5dyeugcf3gzhfpwjtqz.jpg',
    targetName: 'a5dyeugcf3gzhfpwjtqz.webp',
    folder: '/laforet_properties'
  },
  {
    ref: 'apprtmn 1',
    title: 'appartement a draria',
    index: 0,
    publicId: 'laforet_properties/bpqsvustybf48paymojb',
    oldUrl: 'https://res.cloudinary.com/zt28qj9l/image/upload/v1784957444/laforet_properties/bpqsvustybf48paymojb.jpg',
    targetName: 'bpqsvustybf48paymojb.webp',
    folder: '/laforet_properties'
  },
  {
    ref: 'dely 2',
    title: 'appartement a dely brahim',
    index: 0,
    publicId: 'laforet_properties/fxynqhobrao7sdatlowk',
    oldUrl: 'https://res.cloudinary.com/zt28qj9l/image/upload/v1784966806/laforet_properties/fxynqhobrao7sdatlowk.jpg',
    targetName: 'fxynqhobrao7sdatlowk.webp',
    folder: '/laforet_properties'
  },
  {
    ref: 'sou1',
    title: 'appartement a souidania',
    index: 0,
    publicId: 'laforet_properties/ahj0fvcifg7kaqmbfksk',
    oldUrl: 'https://res.cloudinary.com/zt28qj9l/image/upload/v1784966887/laforet_properties/ahj0fvcifg7kaqmbfksk.jpg',
    targetName: 'ahj0fvcifg7kaqmbfksk.webp',
    folder: '/laforet_properties'
  },
  {
    ref: 'hg5',
    title: 'appartement de luxe',
    index: 0,
    publicId: 'laforet_properties/jbl2cv0q83i4sxkpn2up',
    oldUrl: 'https://res.cloudinary.com/zt28qj9l/image/upload/v1784966962/laforet_properties/jbl2cv0q83i4sxkpn2up.jpg',
    targetName: 'jbl2cv0q83i4sxkpn2up.webp',
    folder: '/laforet_properties'
  },
  {
    ref: 'rgh6',
    title: 'appartement a reghaia',
    index: 0,
    publicId: 'laforet_properties/gtqlr3bi1dhzwqbcihy7',
    oldUrl: 'https://res.cloudinary.com/zt28qj9l/image/upload/v1784969333/laforet_properties/gtqlr3bi1dhzwqbcihy7.jpg',
    targetName: 'gtqlr3bi1dhzwqbcihy7.webp',
    folder: '/laforet_properties'
  },
  {
    ref: 'aprtmd5',
    title: 'appartement moderne',
    index: 0,
    publicId: 'laforet_properties/rqfdoly82fljjlb2wy3r',
    oldUrl: 'https://res.cloudinary.com/zt28qj9l/image/upload/v1784969409/laforet_properties/rqfdoly82fljjlb2wy3r.jpg',
    targetName: 'rqfdoly82fljjlb2wy3r.webp',
    folder: '/laforet_properties'
  },
  {
    ref: 'bn4',
    title: 'appartement a benaknoun',
    index: 0,
    publicId: 'laforet_properties/hdyi1iiavab5hwztusfm',
    oldUrl: 'https://res.cloudinary.com/zt28qj9l/image/upload/v1784969473/laforet_properties/hdyi1iiavab5hwztusfm.jpg',
    targetName: 'hdyi1iiavab5hwztusfm.webp',
    folder: '/laforet_properties'
  }
];

// Helper to find downloads recreate file
function getRecreateFilePath() {
  const downloads = 'C:/Users/pc/Downloads';
  const found = fs.readdirSync(downloads).find(f => f.includes('recreate') && (f.endsWith('.jpeg') || f.endsWith('.jpg')));
  if (!found) throw new Error('recreate file not found in Downloads');
  return path.join(downloads, found);
}

// 5 static assets
const staticAssetDefs = [
  {
    name: 'hero_video',
    type: 'video',
    publicId: 'Video_Project_5_nkmuyt',
    oldUrl: 'https://res.cloudinary.com/zt28qj9l/video/upload/v1784947742/Video_Project_5_nkmuyt.mp4',
    localSource: 'C:\\Users\\pc\\Desktop\\Video Project.mp4',
    targetName: 'hero_video.mp4',
    folder: '/laforet_assets'
  },
  {
    name: 'hero_video_poster',
    type: 'image',
    publicId: 'Video_Project_5_nkmuyt_poster',
    oldUrl: 'https://res.cloudinary.com/zt28qj9l/video/upload/v1784947742/Video_Project_5_nkmuyt.jpg',
    localSource: path.resolve(__dirname, 'hero_video_poster.png'),
    targetName: 'hero_video_poster.png',
    folder: '/laforet_assets'
  },
  {
    name: 'advisor_vendre',
    type: 'image',
    publicId: 'stock-photo-real-estate-agent-insurance-sales-representative-young-asian-businessman-handing_qyjsni',
    oldUrl: 'https://res.cloudinary.com/zt28qj9l/image/upload/v1784965315/stock-photo-real-estate-agent-insurance-sales-representative-young-asian-businessman-handing_qyjsni.webp',
    cachedFrom: 'https://res.cloudinary.com/zt28qj9l/image/upload/v1784965315/stock-photo-real-estate-agent-insurance-sales-representative-young-asian-businessman-handing_qyjsni.webp',
    targetName: 'advisor_vendre.webp',
    folder: '/laforet_assets'
  },
  {
    name: 'agency_fallback',
    type: 'image',
    publicId: 'make_picture_high_definition_res__202607250849_msbqp4',
    oldUrl: 'https://res.cloudinary.com/zt28qj9l/image/upload/v1784965809/make_picture_high_definition_res__202607250849_msbqp4.jpg',
    cachedFrom: 'https://res.cloudinary.com/zt28qj9l/image/upload/v1784965809/make_picture_high_definition_res__202607250849_msbqp4.jpg',
    targetName: 'agency_fallback.webp',
    folder: '/laforet_assets'
  },
  {
    name: 'parallax_expertise_bg',
    type: 'image',
    publicId: 'recreate_picture_high_quality_de__202607260438_tmgxak',
    oldUrl: 'https://res.cloudinary.com/zt28qj9l/image/upload/v1785037176/recreate_picture_high_quality_de__202607260438_tmgxak.jpg',
    get dynamicSource() { return getRecreateFilePath(); },
    targetName: 'parallax_expertise_bg.jpg',
    folder: '/laforet_assets'
  }
];

async function main() {
  console.log('=== ImageKit Migration & Sync Started ===');

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB Atlas');

  const Property = mongoose.model('Property', new mongoose.Schema({}, { strict: false }));

  // List existing files in ImageKit
  const existingIkFiles = await listAllImageKitFiles();
  const ikFileMap = new Map();
  existingIkFiles.forEach(f => {
    ikFileMap.set(f.filePath, f);
  });
  console.log(`Found ${existingIkFiles.length} existing files in ImageKit.`);

  const manifest = {
    generated_at: new Date().toISOString(),
    imagekit_url_endpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    total_assets: 18,
    migrated_assets: 0,
    properties: [],
    static_assets: []
  };

  const propertyUploadResults = new Map();

  // 1. Process 13 Property Images
  console.log('\n--- Processing 13 Property Images ---');
  for (const item of propertyAssetDefs) {
    const targetPath = `${item.folder}/${item.targetName}`;
    let res = ikFileMap.get(targetPath);

    if (res) {
      console.log(`[ALREADY UPLOADED] ${item.ref} -> ${res.url}`);
    } else {
      const cached = findBestCachedImage(item.oldUrl);
      if (!cached) throw new Error(`Cached source not found for ${item.oldUrl}`);
      console.log(`Uploading property image [${item.ref}] ${item.targetName}...`);
      const buffer = fs.readFileSync(cached.filePath);
      res = await uploadToImageKit({
        file: buffer,
        fileName: item.targetName,
        folder: item.folder
      });
      console.log(`  -> Uploaded successfully: ${res.url} (fileId: ${res.fileId})`);
    }

    propertyUploadResults.set(item.publicId, {
      ...item,
      imagekit: {
        fileId: res.fileId,
        url: res.url,
        filePath: res.filePath,
        width: res.width,
        height: res.height,
        size: res.size
      }
    });

    manifest.properties.push({
      reference: item.ref,
      title: item.title,
      old_cloudinary_url: item.oldUrl,
      old_public_id: item.publicId,
      imagekit_url: res.url,
      imagekit_file_id: res.fileId,
      imagekit_file_path: res.filePath,
      dimensions: { width: res.width, height: res.height },
      size_bytes: res.size,
      status: 'MIGRATED'
    });
    manifest.migrated_assets++;
  }

  // 2. Process 5 Static Assets
  console.log('\n--- Processing 5 Static Assets ---');
  const staticUploadResults = {};
  for (const item of staticAssetDefs) {
    const targetPath = `${item.folder}/${item.targetName}`;
    let res = ikFileMap.get(targetPath);

    if (res) {
      console.log(`[ALREADY UPLOADED] ${item.name} -> ${res.url}`);
    } else {
      let buffer;
      const src = item.dynamicSource || item.localSource;
      if (src) {
        if (!fs.existsSync(src)) throw new Error(`Local file not found: ${src}`);
        buffer = fs.readFileSync(src);
      } else if (item.cachedFrom) {
        const cached = findBestCachedImage(item.cachedFrom);
        if (!cached) throw new Error(`Cached file not found for ${item.cachedFrom}`);
        buffer = fs.readFileSync(cached.filePath);
      }

      console.log(`Uploading static asset [${item.name}] ${item.targetName}... (bytes: ${buffer.length})`);
      res = await uploadToImageKit({
        file: buffer,
        fileName: item.targetName,
        folder: item.folder
      });
      console.log(`  -> Uploaded successfully: ${res.url} (fileId: ${res.fileId})`);
    }

    staticUploadResults[item.name] = res;

    manifest.static_assets.push({
      name: item.name,
      type: item.type,
      old_cloudinary_url: item.oldUrl,
      old_public_id: item.publicId,
      imagekit_url: res.url,
      imagekit_file_id: res.fileId,
      imagekit_file_path: res.filePath,
      dimensions: { width: res.width, height: res.height },
      size_bytes: res.size,
      status: 'MIGRATED'
    });
    manifest.migrated_assets++;
  }

  // 3. Update MongoDB Atlas Properties
  console.log('\n--- Updating MongoDB Atlas Property Records ---');
  const dbProperties = await Property.find({});
  console.log(`Found ${dbProperties.length} properties in database`);

  let updatedCount = 0;
  for (const prop of dbProperties) {
    let modified = false;
    const media = prop.media || {};
    const images = media.images || [];

    // Map each image
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const match = propertyUploadResults.get(img.publicId);
      if (match) {
        console.log(`Property [${prop.reference}]: Updating image #${i} (${img.publicId} -> ${match.imagekit.fileId})`);
        img.url = match.imagekit.url;
        img.publicId = match.imagekit.fileId;
        modified = true;
      }
    }

    // Cover image
    if (media.coverImage && media.coverImage.publicId) {
      const match = propertyUploadResults.get(media.coverImage.publicId);
      if (match) {
        console.log(`Property [${prop.reference}]: Updating coverImage (${media.coverImage.publicId} -> ${match.imagekit.fileId})`);
        media.coverImage.url = match.imagekit.url;
        media.coverImage.publicId = match.imagekit.fileId;
        modified = true;
      }
    } else if (images.length > 0 && (!media.coverImage || !media.coverImage.url)) {
      // If cover image was missing (e.g. villa), assign first image
      const first = images[0];
      media.coverImage = {
        url: first.url,
        publicId: first.publicId
      };
      modified = true;
      console.log(`Property [${prop.reference}]: Setting default coverImage from first photo`);
    }

    if (modified) {
      prop.media = media;
      prop.markModified('media');
      await prop.save();
      updatedCount++;
    }
  }

  console.log(`Successfully updated ${updatedCount} properties in MongoDB Atlas`);

  // 4. Save MEDIA_MANIFEST.json
  const manifestPath = path.resolve(__dirname, '../../../.antigravity/laforet/MEDIA_MANIFEST.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`\nMEDIA_MANIFEST.json written to: ${manifestPath}`);

  // 5. Verify URLs via HTTP HEAD
  console.log('\n--- Verifying All 18 Uploaded ImageKit URLs ---');
  const allUrls = [
    ...manifest.properties.map(p => ({ label: p.reference, url: p.imagekit_url })),
    ...manifest.static_assets.map(s => ({ label: s.name, url: s.imagekit_url }))
  ];

  for (const item of allUrls) {
    try {
      const res = await fetch(item.url, { method: 'HEAD' });
      console.log(`[VERIFIED ${res.status}] ${item.label} -> ${item.url}`);
      if (res.status !== 200) {
        console.warn(`WARNING: non-200 status for ${item.url}: ${res.status}`);
      }
    } catch (e) {
      console.error(`ERROR verifying ${item.url}:`, e.message);
    }
  }

  await mongoose.disconnect();
  console.log('\n=== ImageKit Migration & Sync Complete ===');
}

main().catch(err => {
  console.error('Fatal Migration Error:', err);
  process.exit(1);
});
