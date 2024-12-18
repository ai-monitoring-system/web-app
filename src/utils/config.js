import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { 
  getAuth, 
  GoogleAuthProvider, 
  GithubAuthProvider,
  browserLocalPersistence,
  setPersistence 
} from "firebase/auth";
import { getStorage } from "firebase/storage";

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
    case 'auth/popup-closed-by-user':
      return 'Sign in was cancelled. Please try again.';
    case 'auth/popup-blocked':
      return 'Sign in popup was blocked. Please allow popups and try again.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email using a different sign in method.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';
    default:
      return error.message || 'An error occurred. Please try again.';
  }
};

export const storage = getStorage(app);
