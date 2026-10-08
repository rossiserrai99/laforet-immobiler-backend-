const path = require('path');
const backendDir = path.resolve(__dirname, '../../../backend');
require(path.join(backendDir, 'node_modules/dotenv')).config({ path: path.join(backendDir, '.env') });
const mongoose = require(path.join(backendDir, 'node_modules/mongoose'));

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const Property = mongoose.model('Property', new mongoose.Schema({}, { strict: false }));
    const count = await Property.countDocuments();
    const properties = await Property.find({}, 'title reference media').lean();
    console.log('Total properties in DB:', count);
    properties.forEach((p, i) => {
      console.log('--- Property ' + (i+1) + ': [' + p.reference + '] ' + p.title);
      console.log('  Cover URL:', p.media?.coverImage?.url);
      console.log('  Cover PublicID:', p.media?.coverImage?.publicId);
      console.log('  Images count:', p.media?.images?.length || 0);
      if (p.media?.images) {
        p.media.images.forEach((img, j) => {
          console.log('    [' + (j+1) + '] ' + img.url + ' (publicId: ' + img.publicId + ')');
        });
      }
    });
    await mongoose.disconnect();
  } catch(e) {
    console.error('Error:', e.message);
  }
}
check();
