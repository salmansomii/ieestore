import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

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

async function addDummyOrder() {
  try {
    const docRef = await addDoc(collection(db, "orders"), {
      userId: "guest",
      date: new Date().toISOString(),
      contact: {
        email: "guest@example.com",
        phone: "123-456-7890"
      },
      shipping: {
        firstName: "Guest",
        lastName: "User",
        address: "123 Main St",
        city: "Anytown",
        state: "CA",
        zip: "12345"
      },
      payment: {
        CardName: "Guest User",
        funCardNumber: "1234",
        dobMonthYear: "12/26"
      },
      items: [
        {
          product: { name: "Dummy Product", price: 19.99, image: "" },
          quantity: 2
        }
      ],
      summary: {
        subtotal: 39.98,
        shipping: 0,
        tax: 2.00,
        total: 41.98
      },
      status: "pending"
    });
    console.log("Document written with ID: ", docRef.id);
    process.exit(0);
  } catch (e) {
    console.error("Error adding document: ", e);
    process.exit(1);
  }
}

addDummyOrder();
