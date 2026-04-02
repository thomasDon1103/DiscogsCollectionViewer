// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAC5ZECDE5VEhqDq7xJ0WWbEUYM18-amiY",
  authDomain: "discogs-viewer.firebaseapp.com",
  projectId: "discogs-viewer",
  storageBucket: "discogs-viewer.firebasestorage.app",
  messagingSenderId: "490419063322",
  appId: "1:490419063322:web:2e55208c289cfd556e5fa3",
  measurementId: "G-6YVVQ97GR3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
console.log(analytics.app.name);