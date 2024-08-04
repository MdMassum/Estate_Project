// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "estate-proj-6c2c2.firebaseapp.com",
  projectId: "estate-proj-6c2c2",
  storageBucket: "estate-proj-6c2c2.appspot.com",
  messagingSenderId: "726392598593",
  appId: "1:726392598593:web:8405ae6d5f6f2dfa4a96c0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);