// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBXPbxNcJ-l7AD9D9ymHPrpIycGaYjpUoQ",
  authDomain: "littledresscode-1cd43.firebaseapp.com",
  projectId: "littledresscode-1cd43",
  storageBucket: "littledresscode-1cd43.firebasestorage.app",
  messagingSenderId: "188376730453",
  appId: "1:188376730453:web:593f3e87b0846b17493ddc",
  measurementId: "G-YMV25MY59Z",
  webClientId:
    "188376730453-pqu8qc10oherj7pedlqa58jecqkafd93.apps.googleusercontent.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
