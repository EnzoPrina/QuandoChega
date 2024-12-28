// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  // Asegúrate de importar 'getAuth' de Firebase
import { getAnalytics } from "firebase/analytics";  // Si deseas usar Analytics

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

export { auth };  // Exportamos el auth para que se pueda usar en el ViewModel
