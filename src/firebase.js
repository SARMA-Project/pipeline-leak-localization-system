import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// REPLACE THIS WITH YOUR ACTUAL CONFIGURATION FROM FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

let app, database, auth;

// Try to initialize only if we have a real looking config, 
// otherwise we'll use Mock data in our Context.
try {
  if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    auth = getAuth(app);
    console.log("Firebase initialized successfully.");
  } else {
    console.warn("Firebase not initialized: Using Mock Data. Please update src/firebase.js with your config.");
  }
} catch (error) {
  console.error("Firebase initialization error", error);
}

export { app, database, auth };
