const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

// Determine path to service account JSON
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || path.join(__dirname, "../config/serviceAccountKey.json");

if (!fs.existsSync(serviceAccountPath)) {
  console.error(`❌ Service account file not found at ${serviceAccountPath}`);
  console.error("Please download it from Firebase Console -> Project Settings -> Service Accounts, and save it there.");
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Pass the email of the user you want to make an admin as an argument
const emailToMakeAdmin = process.argv[2];

if (!emailToMakeAdmin) {
  console.error("❌ Please provide an email address.");
  console.log("Usage: node setAdmin.js <email>");
  process.exit(1);
}

async function setAdmin() {
  try {
    // 1. Get the user by email
    const userRecord = await admin.auth().getUserByEmail(emailToMakeAdmin);
    
    // 2. Set the custom claim { admin: true }
    await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });
    
    console.log(`✅ Successfully made ${emailToMakeAdmin} an admin!`);
    console.log(`The user may need to log out and log back in for the changes to take effect.`);
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.error(`❌ No user found with the email: ${emailToMakeAdmin}`);
    } else {
      console.error(`❌ Error setting admin claim:`, error);
    }
  } finally {
    process.exit(0);
  }
}

setAdmin();
