import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getAnalytics } from "firebase/analytics"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDMEX7hL_F0gZka0YqM0jxhb64X5fMhZzk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "policerpg.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "policerpg",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "policerpg.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "808784317915",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:808784317915:web:aa927f53781ddd18486bfe",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-D10VM0SBSE",
}

const missing = Object.entries(firebaseConfig)
  .filter(([, v]) => !v)
  .map(([k]) => k)

if (missing.length) {
  throw new Error(
    `Firebase nao configurado. Preencha seu .env. Faltando: ${missing.join(", ")}`,
  )
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

export const analytics = (() => {
  try {
    return getAnalytics(app)
  } catch {
    return null
  }
})()