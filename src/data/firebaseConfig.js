// src/data/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  // Importa 'getAuth' de Firebase
import { getAnalytics } from "firebase/analytics";  // Importa 'getAnalytics' si usas Analytics
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

// Inicializar Auth
const auth = getAuth(app);

// Inicializar Analytics si es necesario
const analytics = getAnalytics(app);
const db = getFirestore(app);
export { db };

export { auth };  // Exporta 'auth' para usarlo en otros lugares





