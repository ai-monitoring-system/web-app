// config.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  browserLocalPersistence,
  setPersistence,
} from "firebase/auth";
import { getStorage } from "firebase/storage";
// 1) Import getMessaging, etc.
import { getMessaging } from "firebase/messaging";

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

export const auth = getAuth();
setPersistence(auth, browserLocalPersistence);

export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

export const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

export const getAuthErrorMessage = (error) => {
  switch (error.code) {
    // ...
    default:
      return error.message || 'An error occurred. Please try again.';
  }
};

export const storage = getStorage(app);

// 2) Export the messaging instance. 
// You’ll supply your *public VAPID key* below. 
// Go to Firebase Console > Project Settings > Cloud Messaging 
// to generate or locate your Web Push certificate key pair.
export const messaging = getMessaging(app);
