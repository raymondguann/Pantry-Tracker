// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC2ZjrgZ1u_gtZMdq1agvd0qZvu9N9K54Q",
  authDomain: "inventory-management-89bb9.firebaseapp.com",
  projectId: "inventory-management-89bb9",
  storageBucket: "inventory-management-89bb9.appspot.com",
  messagingSenderId: "122192200377",
  appId: "1:122192200377:web:a7d1afae5ff7d92ae95168",
  measurementId: "G-MH3VKFDHHG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}
export const storage = getStorage(app);