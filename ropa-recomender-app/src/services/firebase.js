// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCR2hryoH6x3ciYWh_GA9jsVIKTQcmgQb4",
  authDomain: "proyectogradoropa.firebaseapp.com",
  projectId: "proyectogradoropa",
  storageBucket: "proyectogradoropa.firebasestorage.app",
  messagingSenderId: "277592636735",
  appId: "1:277592636735:web:1ef22715ceedac615da78a",
  measurementId: "G-1J1GWY3BPX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const analytics = getAnalytics(app);