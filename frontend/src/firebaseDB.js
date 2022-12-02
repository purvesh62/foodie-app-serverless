import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5V1r2xHnk5fXFbI-r0VtyXONd6RU_sYU",
  authDomain: "chatmodule-feabd.firebaseapp.com",
  projectId: "chatmodule-feabd",
  storageBucket: "chatmodule-feabd.appspot.com",
  messagingSenderId: "821453843849",
  appId: "1:821453843849:web:6f4864fb976abaa75ec558",
  measurementId: "G-B86X3S2129"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//export firestore DB
const db = getFirestore(app)
export default db
