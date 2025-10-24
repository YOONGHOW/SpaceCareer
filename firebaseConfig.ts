// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { Auth, initializeAuth, getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
// @ts-ignore
import { getReactNativePersistence } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBXE2v9URY-tzbgSh7CPmfnbFJ_f3srnCM",
  authDomain: "careerguildancesystem.firebaseapp.com",
  projectId: "careerguildancesystem",
  storageBucket: "careerguildancesystem.appspot.com",
  messagingSenderId: "617860895059",
  appId: "1:617860895059:web:ec250a75eb51a2280151a6",
  measurementId: "G-M59BE059RE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Firebase Auth for React Native
let auth: Auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  auth = getAuth(app); // fallback if already initialized
}

// Initialize Firestore
const db: Firestore = getFirestore(app);

export { app, auth, db };
