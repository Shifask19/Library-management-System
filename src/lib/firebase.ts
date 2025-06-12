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
  'apiKey', 'authDomain', 'projectId', // storageBucket is not strictly required for auth/firestore
  'messagingSenderId', 'appId'
];
const missingEnvVars = requiredEnvVars.filter(key => !firebaseConfig[key]);
const criticalMissingVars = missingEnvVars.filter(key => key === 'apiKey' || key === 'projectId' || key === 'authDomain');

if (criticalMissingVars.length > 0) {
  const errorMessage = `Firebase config error: Missing critical environment variables: ${criticalMissingVars.join(', ')}. Please check your .env.local file and ensure the Next.js development server was restarted after changes. App cannot initialize Firebase.`;
  console.error(errorMessage);
  // For client-side, this error will be caught by the check in a component or at initialization.
  // For server-side (build time or SSR), throwing an error is appropriate.
  if (typeof window === 'undefined') {
    throw new Error(errorMessage);
  } else {
    // Prevent further Firebase initialization if critical vars are missing client-side.
    // Setting app to a non-functional object or null could be an option,
    // but components using auth/db should check for their existence anyway.
    // For now, we'll log and let subsequent getAuth/getFirestore fail with their own errors.
  }
}


let app: FirebaseApp;
if (!getApps().length) {
  if (firebaseConfig.apiKey && firebaseConfig.projectId) { // Check specifically for apiKey and projectId as they are crucial
    app = initializeApp(firebaseConfig);
  } else {
     const clientErrorMsg = "Firebase API Key or Project ID is missing or not loaded from .env.local. Please check your environment configuration and restart the server. Firebase cannot be initialized.";
     console.error(clientErrorMsg);
     // Potentially show an error to the user or prevent app initialization on client
     if (typeof window !== 'undefined') {
        // alert(clientErrorMsg); // Or a more sophisticated UI notification
        // To prevent getAuth/getFirestore from throwing further errors, we might avoid initializing here
        // or ensure components handle null auth/db gracefully.
        // For now, the error is logged. Code using auth/db should check.
     }
     // Not throwing here to avoid crashing the app if only some Firebase features are used
     // and to rely on the component-level checks for auth/db.
     // However, if app is not initialized, getAuth/getFirestore will fail.
     // A better approach might be to provide a dummy app or ensure auth/db are nullable.
     app = {} as FirebaseApp; // Avoids undefined app, but Firebase services will fail.
  }
} else {
  app = getApps()[0];
}

let auth: Auth;
let db: Firestore;

// Only attempt to getAuth and getFirestore if the app seems minimally configured
if (app && app.options && app.options.apiKey) {
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  console.warn("Firebase app not properly initialized due to missing config. Auth and Firestore services will not be available.");
  // Assign null or a non-functional mock to prevent runtime errors if auth/db are used without checking
  auth = null as any; // Cast to any to satisfy type, but it will be null
  db = null as any;   // Cast to any to satisfy type, but it will be null
}


// const storage: FirebaseStorage = getStorage(app); // Uncomment if you need Firebase Storage
// let analytics: Analytics; // Uncomment if you need Firebase Analytics
// if (typeof window !== 'undefined' && firebaseConfig.measurementId && app && app.options && app.options.apiKey) { // Check for measurementId before initializing analytics
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
