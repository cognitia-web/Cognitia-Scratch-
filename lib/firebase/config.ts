import { initializeApp, getApps, FirebaseApp } from "firebase/app"
import { getAuth, Auth } from "firebase/auth"
import { getAnalytics, Analytics } from "firebase/analytics"

const firebaseConfig = {
  apiKey: "AIzaSyCeT27qr0wNL8oIJ03RDJrcIhFybWK7SXg",
  authDomain: "juatmad-ab436.firebaseapp.com",
  projectId: "juatmad-ab436",
  storageBucket: "juatmad-ab436.firebasestorage.app",
  messagingSenderId: "202349324004",
  appId: "1:202349324004:web:12b9e4beffa3cf3fdaaef1",
  measurementId: "G-7XMJWZY0CY"
}

let app: FirebaseApp
let auth: Auth
let analytics: Analytics | null = null

if (typeof window !== "undefined") {
  // Client-side
  if (!getApps().length) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApps()[0]
  }
  auth = getAuth(app)
  // Initialize analytics only on client-side
  try {
    analytics = getAnalytics(app)
  } catch (e) {
    console.warn("Analytics initialization failed:", e)
  }
} else {
  // Server-side - initialize without auth for now
  if (!getApps().length) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApps()[0]
  }
}

export { auth, app, analytics }

