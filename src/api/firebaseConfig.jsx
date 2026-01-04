// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNi9TnfwyBqXUAmJ5arkuLww6ZuwP9l2c",
  authDomain: "zero-down-4d3b1.firebaseapp.com",
  databaseURL:
    "https://zero-down-4d3b1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "zero-down-4d3b1",
  storageBucket: "zero-down-4d3b1.firebasestorage.app",
  messagingSenderId: "786379023202",
  appId: "1:786379023202:web:d2c05e8467e108c2ae823b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Realtime Database
export const db = getDatabase(app);
