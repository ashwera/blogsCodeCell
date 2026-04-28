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

    await User.create({
      name: 'Admin User',
      email: 'admin@codecell.dev',
      password: 'codecell123',
      role: 'admin'
    });

    console.log('Admin created successfully! Email: admin@codecell.dev, Password: codecell123');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedAdmin();
