// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1ttVVdnyO_xm-YvxM11EvwcUNQ2z9jPk",
  authDomain: "realtor-react-8b799.firebaseapp.com",
  projectId: "realtor-react-8b799",
  storageBucket: "realtor-react-8b799.appspot.com",
  messagingSenderId: "45039705074",
  appId: "1:45039705074:web:fe1ee84dd3dbf441a0e96b"
};

// Initialize Firebase
initializeApp(firebaseConfig);

export const db= getFirestore() 