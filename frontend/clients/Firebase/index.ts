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

export const addDoc = async (
  collection: string,
  document: Record<string, any>
) => {
  return await FireStore.addDoc(FireStore.collection(db, collection), document);
};

export const getDocs = async (collection: string) => {
  const res = await FireStore.getDocs(FireStore.collection(db, collection));
  return res.docs as Array<FireStore.DocumentSnapshot>;
};

export const IMPRESSION_COUNT_COLLECTION = "impressionCount";

export const getImpressionCount = async (
  campaignId: string,
  referrerId: string
) => {
  const docs = await getDocs(IMPRESSION_COUNT_COLLECTION);
  const doc = docs.find(
    (doc) =>
      doc.data()?.campaignId === campaignId &&
      doc.data()?.referrerId === referrerId
  );
  return doc?.data()?.count ?? 0;
};

export const IncImpressionCount = async (
  campaignId: string,
  referrerId: string
) => {
  const docs = await getDocs(IMPRESSION_COUNT_COLLECTION);
  const doc = docs.find(
    (doc) =>
      doc.data()?.campaignId === campaignId &&
      doc.data()?.referrerId === referrerId
  );
  if (doc == null) {
    await addDoc(IMPRESSION_COUNT_COLLECTION, {
      campaignId,
      referrerId,
      count: 1,
    });
  } else {
    console.log("need to increment");
    // Increment count on existing doc
  }
};
