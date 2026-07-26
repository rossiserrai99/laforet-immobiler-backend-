require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin.model');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/laforet';

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected for seeding.');

    const email = 'admin@laforet.dz';
    const password = 'Password123!';

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log('Admin user already exists. Seed skipped.');
      process.exit(0);
    }

    await Admin.create({
      email,
      password,
      role: 'superadmin'
    });

    console.log(`Successfully created admin account: ${email} / ${password}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
