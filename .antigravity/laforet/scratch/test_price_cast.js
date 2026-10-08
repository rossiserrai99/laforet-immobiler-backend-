const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../backend/.env') });
const mongoose = require(path.resolve(__dirname, '../../../backend/node_modules/mongoose'));
const Property = require(path.resolve(__dirname, '../../../backend/src/models/Property.model'));

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);

  const filter1 = { type: 'Location', price: { $gte: '100000', $lte: '500000' } };
  const filter2 = { type: 'Location', price: { $gte: 100000, $lte: 500000 } };

  console.log('Testing filter1 (string values)...');
  try {
    const res1 = await Property.find(filter1);
    console.log('res1 count:', res1.length);
  } catch (e) {
    console.log('res1 error:', e.message);
  }

  console.log('Testing filter2 (number values)...');
  try {
    const res2 = await Property.find(filter2);
    console.log('res2 count:', res2.length);
  } catch (e) {
    console.log('res2 error:', e.message);
  }

  await mongoose.disconnect();
}

test();
