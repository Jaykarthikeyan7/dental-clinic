import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAuljCWq92Ikiop533j4YMU91It_5Cw28g",
  authDomain: "ram-dental-clinic.firebaseapp.com",
  projectId: "ram-dental-clinic",
  storageBucket: "ram-dental-clinic.firebasestorage.app",
  messagingSenderId: "591336353013",
  appId: "1:591336353013:web:bab5f0e6efd8536a2169bc",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;