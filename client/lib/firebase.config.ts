// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCSN1G51dIWPd3UOrMnpSmf5u45WzK14tk",
  authDomain: "skipe-cc9c3.firebaseapp.com",
  projectId: "skipe-cc9c3",
  storageBucket: "skipe-cc9c3.appspot.com",
  messagingSenderId: "891400992412",
  appId: "1:891400992412:web:32464a1418451ff0975f59",
  measurementId: "G-24CYK0VBYF",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
