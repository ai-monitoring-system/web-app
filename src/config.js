import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDW-vTVTDaoaAzCgVCegs2d_JUyaj-g7Js",
  authDomain: "apms-python-server.firebaseapp.com",
  projectId: "apms-python-server",
  storageBucket: "apms-python-server.firebasestorage.app",
  messagingSenderId: "104880636657",
  appId: "1:104880636657:web:b1e4c0524d076c6fbd5f50",
  measurementId: "G-V69FMTBMNG",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};
