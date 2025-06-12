
// src/lib/firebase.ts
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
// import { getStorage, type FirebaseStorage } from "firebase/storage"; // Uncomment if you need Firebase Storage
// import { getAnalytics, type Analytics } from "firebase/analytics"; // Uncomment if you need Firebase Analytics

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Check if all required environment variables are present
const requiredEnvVars: (keyof typeof firebaseConfig)[] = [
  'apiKey', 'authDomain', 'projectId', 
  'messagingSenderId', 'appId'
  // storageBucket and measurementId are not always critical for core functionality
];
const missingEnvVars = requiredEnvVars.filter(key => !firebaseConfig[key]);

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (missingEnvVars.length > 0) {
  const errorMessage = `Firebase config error: Missing critical environment variables: ${missingEnvVars.join(', ')}. Please check your .env.local file and ensure the Next.js development server was restarted after changes. App cannot initialize Firebase.`;
  console.error(errorMessage);
  if (typeof window === 'undefined') {
    // For server-side, it's better to throw to prevent a broken build/start
    throw new Error(errorMessage);
  }
  // Assign null or a non-functional mock to prevent runtime errors if auth/db are used without checking
  app = {} as FirebaseApp; // Avoids undefined app, but Firebase services will fail.
  auth = null as any; // Cast to any to satisfy type, but it will be null
  db = null as any;   // Cast to any to satisfy type, but it will be null
} else {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  // Only attempt to getAuth and getFirestore if the app seems minimally configured
  if (app && app.options && app.options.apiKey) {
    auth = getAuth(app);
    db = getFirestore(app);
  } else {
    console.warn("Firebase app not properly initialized despite environment variables appearing set. Auth and Firestore services will not be available.");
    auth = null as any; 
    db = null as any;   
  }
}

// const storage: FirebaseStorage = getStorage(app); // Uncomment if you need Firebase Storage
// let analytics: Analytics; // Uncomment if you need Firebase Analytics
// if (typeof window !== 'undefined' && firebaseConfig.measurementId && app && app.options && app.options.apiKey && app.name) { // Check for measurementId before initializing analytics
//   analytics = getAnalytics(app);
// }

export { app, auth, db /*, storage, analytics */ };

/*
Troubleshooting "auth/configuration-not-found":
This error usually means the Identity Toolkit API is not enabled for your project in Google Cloud.
Firebase Auth relies on this API. To enable it:
1. Go to the Google Cloud Console: https://console.cloud.google.com/
2. Make sure you have selected the correct Google Cloud project that is associated with your Firebase project (Project ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID).
3. In the navigation menu (hamburger icon), go to "APIs & Services" > "Library".
4. Search for "Identity Toolkit API".
5. Click on "Identity Toolkit API" in the search results.
6. If it's not already enabled, click the "Enable" button.
7. After enabling, it might take a few minutes for the changes to propagate. Restart your Next.js app.
If the API is enabled and you still see the error, double-check your firebaseConfig details in .env.local.
*/
