
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import {getFirestore} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZleT8RTho-yDLYOs5txLZ67IdM3py6iE",
  authDomain: "chat-app-93ba2.firebaseapp.com",
  projectId: "chat-app-93ba2",
  storageBucket: "chat-app-93ba2.appspot.com",
  messagingSenderId: "921474048232",
  appId: "1:921474048232:web:73d90117f449ce8614295d"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);  
