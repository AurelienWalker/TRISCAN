import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBtPLl6gHQhHeIV1f56YVC2JrZsAdUlOeA",
  authDomain: "trions-ed905.firebaseapp.com",
  projectId: "trions-ed905",
  storageBucket: "trions-ed905.firebasestorage.app",
  messagingSenderId: "104928592601",
  appId: "1:104928592601:web:1e83b593fb807ae67af4c8",
  measurementId: "G-K8FHLTBCYN"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };