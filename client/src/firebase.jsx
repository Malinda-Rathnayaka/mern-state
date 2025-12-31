// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-918da.firebaseapp.com",
  projectId: "mern-estate-918da",
  storageBucket: "mern-estate-918da.firebasestorage.app",
  messagingSenderId: "267272571874",
  appId: "1:267272571874:web:038b51866d4d26ade647bb"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);