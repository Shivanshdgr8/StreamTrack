'use client';

import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const firebaseKeyEntries = [
  ["NEXT_PUBLIC_FIREBASE_API_KEY", firebaseConfig.apiKey],
  ["NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", firebaseConfig.authDomain],
  ["NEXT_PUBLIC_FIREBASE_PROJECT_ID", firebaseConfig.projectId],
  ["NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET", firebaseConfig.storageBucket],
  [
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    firebaseConfig.messagingSenderId,
  ],
  ["NEXT_PUBLIC_FIREBASE_APP_ID", firebaseConfig.appId],
];

const missingKeys = firebaseKeyEntries
  .filter(([, value]) => !value || value.length === 0)
  .map(([key]) => key);

export const firebaseEnabled = missingKeys.length === 0;

if (!firebaseEnabled && process.env.NODE_ENV !== "production") {
  console.warn(
    "[firebase] Missing Firebase config keys:",
    missingKeys.join(", "),
    "\nAuth features will be disabled until these environment variables are set.",
  );
}

const firebaseApp = firebaseEnabled
  ? getApps().length
    ? getApps()[0]
    : initializeApp(firebaseConfig)
  : null;

const auth = firebaseEnabled && firebaseApp ? getAuth(firebaseApp) : null;
const firestore =
  firebaseEnabled && firebaseApp ? getFirestore(firebaseApp) : null;
const googleProvider = firebaseEnabled ? new GoogleAuthProvider() : null;

const assertFirebase = () => {
  if (!firebaseEnabled || !auth || !firestore) {
    throw new Error(
      "Firebase is not configured. Set the NEXT_PUBLIC_FIREBASE_* environment variables in .env.local.",
    );
  }
};

const loginWithEmail = (email, password) => {
  assertFirebase();
  return signInWithEmailAndPassword(auth, email, password);
};

const signupWithEmail = (email, password) => {
  assertFirebase();
  return createUserWithEmailAndPassword(auth, email, password);
};

const logoutUser = () => {
  assertFirebase();
  return signOut(auth);
};

const loginWithGoogle = () => {
  assertFirebase();
  return signInWithPopup(auth, googleProvider);
};

export {
  firebaseApp,
  auth,
  firestore,
  loginWithEmail,
  signupWithEmail,
  logoutUser,
  loginWithGoogle,
  googleProvider,
};

