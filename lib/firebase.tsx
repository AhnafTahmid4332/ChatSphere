import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  GithubAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBPZMBeHD6u3TBg6dD9MuHevOMzQyC57MM",
  authDomain: "chatsphere-d675b.firebaseapp.com",
  projectId: "chatsphere-d675b",
  storageBucket: "chatsphere-d675b.firebasestorage.app",
  messagingSenderId: "933627465810",
  appId: "1:933627465810:web:a03a2f6021333b97280f8b",
};

// Initialize Firebase only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Set up Google Provider
const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

export const db = getFirestore(app);

export {
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
};
