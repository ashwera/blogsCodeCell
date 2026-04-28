require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/codecellblogs');
    console.log('DB Connected');

    const adminExists = await User.findOne({ email: 'admin@codecell.dev' });
    if (adminExists) {
      console.log('Admin already exists!');
      process.exit();
    }

    const adminPassword = process.env.ADMIN_PASSWORD || 'codecell123';
    if (adminPassword === 'codecell123') {
      console.warn('WARNING: Using default password for admin account.');
    }

    await User.create({
      name: 'Admin User',
      email: 'admin@codecell.dev',
      password: adminPassword,
      role: 'admin'
    });

    console.log(`Admin created successfully! Email: admin@codecell.dev, Password: ${adminPassword === 'codecell123' ? 'codecell123' : '[HIDDEN]'}`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedAdmin();
