require("dotenv").config();
const mongoose = require("mongoose");
const admin = require("./config/firebaseAdmin");
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

    // Create Admin in Firebase
    let adminUser;
    try {
      adminUser = await admin.auth().getUserByEmail(adminEmail);
      console.log("Admin already exists in Firebase!");
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        adminUser = await admin.auth().createUser({
          email: adminEmail,
          password: adminPassword,
          displayName: "Admin User",
        });
        await admin.auth().setCustomUserClaims(adminUser.uid, { admin: true });
        console.log(
          `Admin created in Firebase! Email: ${adminEmail}, Password: ${adminPassword}`,
        );
      } else {
        throw err;
      }
    }

    // Create Admin in MongoDB
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      await User.create({
        uid: adminUser.uid,
        email: adminEmail,
      });
      console.log("Admin created in MongoDB!");
    }

    // Create Contributor in Firebase
    let contributorUser;
    try {
      contributorUser = await admin.auth().getUserByEmail(contributorEmail);
      console.log("Contributor already exists in Firebase!");
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        contributorUser = await admin.auth().createUser({
          email: contributorEmail,
          password: contributorPassword,
          displayName: "Contributor User",
        });
        console.log(
          `Contributor created in Firebase! Email: ${contributorEmail}, Password: ${contributorPassword}`,
        );
      } else {
        throw err;
      }
    }

    // Create Contributor in MongoDB
    const contributorExists = await User.findOne({ email: contributorEmail });
    if (!contributorExists) {
      await User.create({
        uid: contributorUser.uid,
        email: contributorEmail,
      });
      console.log("Contributor created in MongoDB!");
    }

    console.log("\n✅ Seeding complete!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedAdmin();
