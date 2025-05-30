// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC7fUcChqGEsbR1sWJKtcD1Bj6fYNxv_GU",
  authDomain: "univarsity-event.firebaseapp.com",
  projectId: "univarsity-event",
  storageBucket: "univarsity-event.firebasestorage.app",
  messagingSenderId: "4653185490",
  appId: "1:4653185490:web:15813250b1d22bde90b00b",
  measurementId: "G-GQ6CQKPHJ1"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);