// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import * as FireStore from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVDIDSeqcyJ60ZEXBiQXbmGIcaRum4SPA",
  authDomain: "deadsense.firebaseapp.com",
  projectId: "deadsense",
  storageBucket: "deadsense.appspot.com",
  messagingSenderId: "511112759513",
  appId: "1:511112759513:web:2dd5fbd155c19f21e516c8",
};

// Initialize Firebase
const App = initializeApp(firebaseConfig);
export const db = getFirestore(App);

