import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAK5yc6X3xiq_NtzMeRzV7Jp7qGEoHqXGs",
  authDomain: "coffee-spark-ai-barista-96112.firebaseapp.com",
  projectId: "coffee-spark-ai-barista-96112",
  storageBucket: "coffee-spark-ai-barista-96112.firebasestorage.app",
  messagingSenderId: "906816676574",
  appId: "1:906816676574:web:c54139782077e08d08984f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkOrders() {
  try {
    const querySnapshot = await getDocs(collection(db, 'orders'));
    console.log("Total orders:", querySnapshot.size);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data().userId, doc.data().date);
    });
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

checkOrders();
