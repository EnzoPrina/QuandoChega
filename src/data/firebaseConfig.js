// src/data/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { 
  initializeAuth, 
  getReactNativePersistence 
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase (asegúrate de que sea la correcta)
const firebaseConfig = {
  apiKey: "AIzaSyBKLyw75tkmSaBSyizcNUFsgtP37R4G1Xw",
  authDomain: "quandochega-24f2c.firebaseapp.com",
  projectId: "quandochega-24f2c",
  storageBucket: "quandochega-24f2c.firebasestorage.app",
  messagingSenderId: "886722290849",
  appId: "1:886722290849:web:ea80ff1dce008f3d5afce0",
  measurementId: "G-YPXN3PMFBB",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Auth con persistencia en React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Inicializar Analytics (si es compatible)
let analytics;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

// Inicializar Firestore
const db = getFirestore(app);

export { db, auth };
