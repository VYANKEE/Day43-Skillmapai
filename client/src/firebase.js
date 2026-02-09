// client/src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Yaha hum Firebase Console se mili keys dalenge
// Abhi ke liye ye structure paste kar do
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtHCPREK1PFW5n5OdGymZcvvN4OAP044M",
  authDomain: "day43-skillai-roadmap.firebaseapp.com",
  projectId: "day43-skillai-roadmap",
  storageBucket: "day43-skillai-roadmap.firebasestorage.app",
  messagingSenderId: "956534469772",
  appId: "1:956534469772:web:c1f33be5bdc5631374b7a9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export tools taaki hum puri app mein use kar sakein
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);