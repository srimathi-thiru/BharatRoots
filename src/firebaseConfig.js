import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCGcbqyHXw8m4p16YyjeMhHp0-ZQBLTCYc",
    authDomain: "bharatroots-9723f.firebaseapp.com",
    databaseURL: "https://bharatroots-9723f-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "bharatroots-9723f",
    storageBucket: "bharatroots-9723f.firebasestorage.app",
    messagingSenderId: "75819867825",
    appId: "1:75819867825:web:8e67a61627ec7eabdbcc90",
    measurementId: "G-RCY9FEB7EE"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
