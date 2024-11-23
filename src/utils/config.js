import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDITg40yAhlbAfnqvNdnons7NlmUYwIasQ",
  authDomain: "project-1d564.firebaseapp.com",
  projectId: "project-1d564",
  storageBucket: "project-1d564.firebasestorage.app",
  messagingSenderId: "762574644488",
  appId: "1:762574644488:web:86ee4fe8b62a17386bf8bd"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const auth = getAuth();
export const provider = new GoogleAuthProvider();

export const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};
