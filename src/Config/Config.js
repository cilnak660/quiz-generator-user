// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDhkUt26T9K8wP2Gc_I4BckHNsDGlTlmhs",
    authDomain: "quiz-generator-data.firebaseapp.com",
    projectId: "quiz-generator-data",
    storageBucket: "quiz-generator-data.firebasestorage.app",
    messagingSenderId: "1011980251431",
    appId: "1:1011980251431:web:194778ad7824b49bbff902",
    measurementId: "G-W27573S7HS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);


const provider = new GoogleAuthProvider();

export { db, app, auth, provider };
