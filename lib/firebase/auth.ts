"use client"

import { auth } from "./config"
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
  User,
  UserCredential
} from "firebase/auth"

export async function signUp(email: string, password: string, name: string, age: number, guardianEmail?: string) {
  try {
    // Create user in Firebase
    const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Update display name
    await updateProfile(user, { displayName: name })

    // Create user in database via API
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, age, guardianEmail, uid: user.uid }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to create account")
    }

    return user
  } catch (error: any) {
    throw new Error(error.message || "Failed to create account")
  }
}

export async function signIn(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error: any) {
    throw new Error(error.message || "Failed to sign in")
  }
}

export async function signOut() {
  try {
    await firebaseSignOut(auth)
  } catch (error: any) {
    throw new Error(error.message || "Failed to sign out")
  }
}

export async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email)
  } catch (error: any) {
    throw new Error(error.message || "Failed to send password reset email")
  }
}

export async function getCurrentUser(): Promise<User | null> {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe()
      resolve(user)
    })
  })
}

// OAuth Providers
const googleProvider = new GoogleAuthProvider()
const githubProvider = new GithubAuthProvider()
const microsoftProvider = new OAuthProvider('microsoft.com')

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user
    
    // Create or update user in database
    await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        email: user.email, 
        name: user.displayName || user.email?.split("@")[0] || "User",
        age: 18, // Default age for OAuth users
        uid: user.uid,
        provider: "google"
      }),
    })
    
    return user
  } catch (error: any) {
    throw new Error(error.message || "Failed to sign in with Google")
  }
}

export async function signInWithGitHub() {
  try {
    const result = await signInWithPopup(auth, githubProvider)
    const user = result.user
    
    // Create or update user in database
    await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        email: user.email, 
        name: user.displayName || user.email?.split("@")[0] || "User",
        age: 18, // Default age for OAuth users
        uid: user.uid,
        provider: "github"
      }),
    })
    
    return user
  } catch (error: any) {
    throw new Error(error.message || "Failed to sign in with GitHub")
  }
}

export async function signInWithMicrosoft() {
  try {
    const result = await signInWithPopup(auth, microsoftProvider)
    const user = result.user
    
    // Create or update user in database
    await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        email: user.email, 
        name: user.displayName || user.email?.split("@")[0] || "User",
        age: 18, // Default age for OAuth users
        uid: user.uid,
        provider: "microsoft"
      }),
    })
    
    return user
  } catch (error: any) {
    throw new Error(error.message || "Failed to sign in with Microsoft")
  }
}

