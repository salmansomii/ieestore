import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAK5yc6X3xiq_NtzMeRzV7Jp7qGEoHqXGs",
  authDomain: "coffee-spark-ai-barista-96112.firebaseapp.com",
  projectId: "coffee-spark-ai-barista-96112",
  storageBucket: "coffee-spark-ai-barista-96112.firebasestorage.app",
  messagingSenderId: "906816676574",
  appId: "1:906816676574:web:c54139782077e08d08984f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
