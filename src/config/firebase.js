import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAgb8E-bo4PhpZcJGJqL015-Q6OPyi3pk0",
  authDomain: "smart-home-af0e2.firebaseapp.com",
  projectId: "smart-home-af0e2",
  storageBucket: "smart-home-af0e2.appspot.com",
  messagingSenderId: "1037475652270",
  appId: "1:1037475652270:web:f0f8b83af4ed7bf5b8833f",
  measurementId: "G-DXSZKBZJET",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
