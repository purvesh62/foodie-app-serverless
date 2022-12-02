import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
import { getFirestore } from'@firebase/firestore'

// const firebaseConfig = {
//     apiKey: "AIzaSyBw6PeciTxdnSkUDy3_mYgSIU8H0EEXwHA",
//     authDomain: "csci5410-a2-925a6.firebaseapp.com",
//     projectId: "csci5410-a2-925a6",
//     storageBucket: "csci5410-a2-925a6.appspot.com",
//     messagingSenderId: "594247462280",
//     appId: "1:594247462280:web:218fc1495cda76cac15e3d",
//     measurementId: "G-RKQEC45488"
//   };
  
  const firebaseConfig = {
    apiKey: "AIzaSyA5V1r2xHnk5fXFbI-r0VtyXONd6RU_sYU",
    authDomain: "chatmodule-feabd.firebaseapp.com",
    projectId: "chatmodule-feabd",
    storageBucket: "chatmodule-feabd.appspot.com",
    messagingSenderId: "821453843849",
    appId: "1:821453843849:web:6f4864fb976abaa75ec558",
    measurementId: "G-B86X3S2129"
  };
  
  const app = initializeApp(firebaseConfig);
  // export const auth=getAuth(app);

  export const db = getFirestore(app);