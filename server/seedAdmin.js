require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const seedAdmin = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/codecellblogs",
    );
    console.log("DB Connected");

    // Hardcoded credentials for admin
    const adminEmail = "admin@codecell.dev";
    const adminPassword = "Admin@123456";

    // Hardcoded credentials for contributor
    const contributorEmail = "contributor@codecell.dev";
    const contributorPassword = "Contributor@123456";

    const adminExists = await User.findOne({ email: adminEmail });
    if (adminExists) {
      console.log("Admin already exists!");
    } else {
      await User.create({
        name: "Admin User",
        email: adminEmail,
        password: adminPassword,
        role: "admin",
      });
      console.log(
        `Admin created successfully! Email: ${adminEmail}, Password: ${adminPassword}`,
      );
    }

    const contributorExists = await User.findOne({ email: contributorEmail });
    if (contributorExists) {
      console.log("Contributor already exists!");
    } else {
      await User.create({
        name: "Contributor User",
        email: contributorEmail,
        password: contributorPassword,
        role: "contributor",
      });
      console.log(
        `Contributor created successfully! Email: ${contributorEmail}, Password: ${contributorPassword}`,
      );
    }

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedAdmin();
