import { getAuth as getAdminAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { initializeApp as initializeAdminApp, getApps as getAdminApps, cert, App } from "firebase-admin/app"
import { prisma } from "@/lib/db/client"

// Initialize Firebase Admin (server-side only)
let adminApp: App | null = null

if (typeof window === "undefined") {
  if (!getAdminApps().length) {
    const serviceAccount = {
      projectId: "juatmad-ab436",
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }

    if (serviceAccount.projectId && serviceAccount.privateKey && serviceAccount.clientEmail) {
      adminApp = initializeAdminApp({
        credential: cert(serviceAccount as any),
        projectId: "juatmad-ab436",
      })
    } else {
      // Fallback: Try to initialize without credentials (for development)
      console.warn("Firebase Admin credentials not found. Some server-side features may not work.")
    }
  } else {
    adminApp = getAdminApps()[0]
  }
}

export async function verifyToken(token: string) {
  if (!adminApp) {
    throw new Error("Firebase Admin not initialized")
  }

  try {
    const adminAuth = getAdminAuth(adminApp)
    const decodedToken = await adminAuth.verifyIdToken(token)
    return decodedToken
  } catch (error) {
    console.error("Error verifying token:", error)
    return null
  }
}

export function getAdminFirestoreInstance() {
  if (!adminApp) {
    throw new Error("Firebase Admin not initialized")
  }
  return getFirestore(adminApp)
}

export async function getServerUser(token: string) {
  const decodedToken = await verifyToken(token)
  if (!decodedToken) {
    return null
  }

  // Try Firestore first, fallback to Prisma
  try {
    const firestore = getAdminFirestoreInstance()
    const userDoc = await firestore.collection("users").doc(decodedToken.uid).get()
    
    if (userDoc.exists) {
      const userData = userDoc.data()
      return {
        id: userDoc.id,
        email: userData?.email || decodedToken.email || "",
        name: userData?.name || null,
        role: userData?.role || "STUDENT",
      }
    }
  } catch (error) {
    console.warn("Firestore read failed, falling back to Prisma:", error)
  }

  // Fallback to Prisma
  const user = await prisma.user.findUnique({
    where: { id: decodedToken.uid },
  })

  if (!user) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  }
}

