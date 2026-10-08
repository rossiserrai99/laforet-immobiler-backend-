const path = require('path');
const backendDir = path.resolve(__dirname, '../../../backend');
require('dotenv').config({ path: path.join(backendDir, '.env') });
const mongoose = require(path.join(backendDir, 'node_modules/mongoose'));

async function checkDatabase() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB Atlas successfully.');

  const Property = mongoose.model(
    'Property',
    new mongoose.Schema({
      title: String,
      reference: String,
      media: Object
    }, { strict: false })
  );

  const properties = await Property.find({});
  console.log(`Total properties found: ${properties.length}`);

  let totalImages = 0;
  let ikImages = 0;
  let cldImages = 0;
  let coverCount = 0;
  let missingCover = 0;

  for (const p of properties) {
    const images = p.media?.images || [];
    totalImages += images.length;
    for (const img of images) {
      if (img.url?.includes('ik.imagekit.io')) {
        ikImages++;
      } else if (img.url?.includes('cloudinary.com')) {
        cldImages++;
      }
    }

    if (p.media?.coverImage?.url) {
      coverCount++;
      if (!p.media.coverImage.url.includes('ik.imagekit.io')) {
        console.warn(`[WARN] Property ${p.reference} has non-ImageKit coverImage: ${p.media.coverImage.url}`);
      }
    } else {
      missingCover++;
      console.warn(`[WARN] Property ${p.reference} has no coverImage`);
    }
  }

  console.log(`Results:`);
  console.log(`- Total Property Records: ${properties.length}`);
  console.log(`- Total Images in media.images: ${totalImages}`);
  console.log(`- ImageKit Images: ${ikImages}`);
  console.log(`- Cloudinary Images: ${cldImages}`);
  console.log(`- Properties with valid coverImage: ${coverCount}`);
  console.log(`- Properties missing coverImage: ${missingCover}`);

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB Atlas.');

  if (cldImages > 0 || ikImages !== totalImages || properties.length === 0) {
    console.error('FAIL: Database contains non-ImageKit URLs or no properties.');
    process.exit(1);
  } else {
    console.log('PASS: 100% of property media records are synchronized with ImageKit.');
  }
}

checkDatabase().catch((err) => {
  console.error('Database check error:', err);
  process.exit(1);
});
