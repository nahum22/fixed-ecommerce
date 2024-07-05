// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

import firebase from "firebase/compat/app";
import "firebase/compat/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCGclymkZWOaAwLf6_WoFwGe3lW-CbHyw",
  authDomain: "ecommerce-9b39f.firebaseapp.com",
  projectId: "ecommerce-9b39f",
  storageBucket: "ecommerce-9b39f.appspot.com",
  messagingSenderId: "498730616349",
  appId: "1:498730616349:web:6b16fac086b9656026a8f4",
  measurementId: "G-LXLK7S3V6G",
  databaseURL:
    "https://ecommerce-9b39f-default-rtdb.europe-west1.firebasedatabase.app",
};

const handleGoogleSignIn = async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    await firebase.auth().signInWithPopup(provider);
  } catch (error) {
    console.error("Error signing in with Google:", error);
  }
};

const handleSignOut = async () => {
  try {
    await firebase.auth().signOut();
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Use getFirestore to initialize Firestore
const analytics = getAnalytics(app);

// No need for the following lines as the app is already initialized above
// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// } else {
//   firebase.app(); // If already initialized, use that one
// }

// Correct way to export the Firestore instance
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // If already initialized, use that one
}
export { db, handleGoogleSignIn };
