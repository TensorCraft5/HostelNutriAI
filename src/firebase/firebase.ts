import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    
  apiKey: "AIzaSyCfHfalTqOZ8qKXCV5qa_SL33Mmp11HOHE",
  authDomain: "hostelnutriai.firebaseapp.com",
  projectId: "hostelnutriai",
  storageBucket: "hostelnutriai.firebasestorage.app",
  messagingSenderId: "771787599608",
  appId: "1:771787599608:web:0e555cced98cb96ccc150d"
};
  // Paste your Firebase configuration here


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);