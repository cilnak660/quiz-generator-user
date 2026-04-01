// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBIf58_xv0mm0ZzCDqTylG18dvKO4yetGw",
    authDomain: "quiz-generator-8cd15.firebaseapp.com",
    projectId: "quiz-generator-8cd15",
    storageBucket: "quiz-generator-8cd15.firebasestorage.app",
    messagingSenderId: "386588837803",
    appId: "1:386588837803:web:ee773ffc1c189a5dd534ee",
    measurementId: "G-85NFQP1VR5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);