import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Configuração do Firebase com todos os campos necessários
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VVITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

console.log('Inicializando Firebase com configuração completa');

// Inicializar Firebase e Auth
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
console.log('Firebase e Auth inicializados com sucesso');

// Exportar auth
export { auth };