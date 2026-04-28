const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");
// require("dotenv").config({ path: path.join(__dirname, "../.env") });

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

// The strict list of 40 emails (example list)
const defaultEmails = [
  "admin@codecell.dev",
];

// If emails are passed as arguments (e.g., node createInvites.js me@example.com), use those instead
const emailsToInvite = process.argv.length > 2 ? process.argv.slice(2) : defaultEmails;

// We need the Web API Key to trigger Firebase's built-in emailer
// You can get this from your client/.env file (VITE_FIREBASE_API_KEY)
const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY || "AIzaSyCAD1zPlaLx3sYxRXZyDOjSofLHwmaLH7E";

async function sendFirebaseNoreplyEmail(email) {
  try {
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${FIREBASE_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requestType: 'PASSWORD_RESET',
        email: email
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error.message);
    }
    return true;
  } catch (error) {
    console.error(`❌ Failed to trigger Firebase email for ${email}:`, error.message);
    return false;
  }
}

async function createInvites() {
  console.log("Starting invite generation process...");

  for (const email of emailsToInvite) {
    try {
      // Create user with a dummy random password
      const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
      
      const userRecord = await admin.auth().createUser({
        email: email,
        password: randomPassword,
        emailVerified: false,
      });

      console.log(`✅ Successfully created new user: ${userRecord.uid} (${email})`);

      // Trigger Firebase's native noreply email
      const success = await sendFirebaseNoreplyEmail(email);
      if (success) {
        console.log(`📨 Firebase automatically sent an official noreply invite to ${email}!\n`);
      }

    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        console.log(`⚠️ User ${email} already exists.`);
        const success = await sendFirebaseNoreplyEmail(email);
        if (success) {
          console.log(`📨 Firebase automatically sent a reset link from noreply to ${email}!\n`);
        }
      } else {
        console.error(`❌ Error creating user ${email}:`, error.message);
      }
    }
  }

  console.log("Invite generation process completed.");
  process.exit(0);
}

createInvites();
