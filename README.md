# CodeCell Blogs

A serverless blog platform for CodeCell. No backend — all content lives in Firebase Firestore with Google Auth for admin access.

## Tech Stack

- **Frontend:** Vite + React
- **Database:** Firebase Firestore
- **Auth:** Firebase Google OAuth
- **Hosting:** Firebase Hosting (or any static host)

## Project Structure

```
src/
├── firebase.js              # Firebase app init (Auth + Firestore)
├── lib/
│   ├── AuthContext.jsx      # Google Auth provider
│   └── blogs.js             # Firestore read/write helpers
├── components/              # UI components (Nav, Hero, BlogCard, etc.)
└── pages/
    ├── Home.jsx
    ├── Blogs.jsx
    ├── BlogDetail.jsx
    └── admin/
        └── AdminPage.jsx    # Admin dashboard (auth-gated)
```

## Setup

### 1. Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com) and create a project.
2. Enable **Firestore Database** (start in production mode).
3. Enable **Authentication → Google** sign-in provider.
4. Register a **Web app** and copy the config.

### 2. Environment variables

```bash
cp .env.example .env
```

Fill in your Firebase config values in `.env`.

### 3. Firestore — approved emails allowlist

In the Firebase console, create this document manually:

- **Collection:** `settings`
- **Document ID:** `allowlist`
- **Field:** `emails` (Array of strings)

Add the email addresses that should have admin write access.

Example:
```
settings/allowlist
  emails: ["admin@example.com", "editor@example.com"]
```

### 4. Firestore Security Rules

Go to Firestore → Rules and paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /blogs/{blogId} {
      // Public: read published blogs. Authenticated: read all (admin dashboard needs unpublished too)
      allow read: if resource.data.published == true || request.auth != null;
      allow write: if request.auth != null;
    }
    // Allowlist: signed-in users can read, nobody can write via SDK (manage in console)
    match /settings/allowlist {
      allow read: if request.auth != null;
      allow write: if false;
    }
  }
}
```

### 5. Install & run locally

```bash
npm install
npm run dev
```

## Deploy to Firebase Hosting

### First-time setup

```bash
npm install -g firebase-tools
firebase login
```

Update `.firebaserc` with your actual project ID.

### Deploy

```bash
npm run deploy
# equivalent to: npm run build && firebase deploy
```

## Admin Access

Navigate to `/admin`. Sign in with Google. If your email is in the `settings/allowlist` document, you'll land on the dashboard where you can publish and delete blog posts.
