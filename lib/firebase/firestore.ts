"use client"

import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  QueryConstraint,
  DocumentData,
  QueryDocumentSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "./config"

// Type helpers
export type FirestoreTimestamp = Timestamp | Date | string
export type FirestoreData = { [key: string]: any }

// Convert Firestore Timestamp to Date
export function timestampToDate(timestamp: FirestoreTimestamp): Date {
  if (timestamp instanceof Date) return timestamp
  if (typeof timestamp === "string") return new Date(timestamp)
  if (timestamp && typeof timestamp === "object" && "toDate" in timestamp) {
    return (timestamp as Timestamp).toDate()
  }
  return new Date()
}

// Convert Date to Firestore Timestamp
export function dateToTimestamp(date: Date | string): Timestamp {
  if (typeof date === "string") {
    return Timestamp.fromDate(new Date(date))
  }
  return Timestamp.fromDate(date)
}

// Generic CRUD operations
export class FirestoreService<T extends FirestoreData> {
  constructor(private collectionName: string) {}

  // Create
  async create(data: Omit<T, "id" | "createdAt" | "updatedAt">, id?: string): Promise<string> {
    const docRef = id 
      ? doc(db, this.collectionName, id)
      : doc(collection(db, this.collectionName))
    
    const docData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    } as any

    await setDoc(docRef, docData)
    return docRef.id
  }

  // Read
  async getById(id: string): Promise<T | null> {
    const docRef = doc(db, this.collectionName, id)
    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists()) {
      return null
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as unknown as T
  }

  // Read all with filters
  async getAll(
    filters?: Array<[string, any, any]>,
    orderByField?: string,
    orderDirection: "asc" | "desc" = "desc",
    limitCount?: number
  ): Promise<T[]> {
    let q = query(collection(db, this.collectionName))

    // Apply filters
    if (filters) {
      filters.forEach(([field, operator, value]) => {
        q = query(q, where(field, operator, value))
      })
    }

    // Apply ordering
    if (orderByField) {
      q = query(q, orderBy(orderByField, orderDirection))
    }

    // Apply limit
    if (limitCount) {
      q = query(q, limit(limitCount))
    }

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as unknown as T[]
  }

  // Update
  async update(id: string, data: Partial<T>): Promise<void> {
    const docRef = doc(db, this.collectionName, id)
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    } as any)
  }

  // Delete
  async delete(id: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id)
    await deleteDoc(docRef)
  }

  // Query by field
  async queryByField(field: string, operator: any, value: any): Promise<T[]> {
    const q = query(collection(db, this.collectionName), where(field, operator, value))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as unknown as T[]
  }
}

// Server-side Firestore operations
export class FirestoreAdminService<T extends FirestoreData> {
  constructor(
    private collectionName: string,
    private firestore: any // FirebaseFirestore.Firestore from firebase-admin
  ) {}

  async create(data: Omit<T, "id" | "createdAt" | "updatedAt">, id?: string): Promise<string> {
    const docRef = id
      ? this.firestore.collection(this.collectionName).doc(id)
      : this.firestore.collection(this.collectionName).doc()

    await docRef.set({
      ...data,
      createdAt: this.firestore.FieldValue.serverTimestamp(),
      updatedAt: this.firestore.FieldValue.serverTimestamp(),
    })

    return docRef.id
  }

  async getById(id: string): Promise<T | null> {
    const docRef = this.firestore.collection(this.collectionName).doc(id)
    const docSnap = await docRef.get()

    if (!docSnap.exists) {
      return null
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as unknown as T
  }

  async getAll(
    filters?: Array<[string, any, any]>,
    orderByField?: string,
    orderDirection: "asc" | "desc" = "desc",
    limitCount?: number
  ): Promise<T[]> {
    let q: any = this.firestore.collection(this.collectionName)

    if (filters) {
      filters.forEach(([field, operator, value]) => {
        q = q.where(field, operator, value)
      })
    }

    if (orderByField) {
      q = q.orderBy(orderByField, orderDirection)
    }

    if (limitCount) {
      q = q.limit(limitCount)
    }

    const querySnapshot = await q.get()
    return querySnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    })) as unknown as T[]
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    const docRef = this.firestore.collection(this.collectionName).doc(id)
    await docRef.update({
      ...data,
      updatedAt: this.firestore.FieldValue.serverTimestamp(),
    } as any)
  }

  async delete(id: string): Promise<void> {
    const docRef = this.firestore.collection(this.collectionName).doc(id)
    await docRef.delete()
  }

  async queryByField(field: string, operator: any, value: any): Promise<T[]> {
    const q = this.firestore.collection(this.collectionName).where(field, operator, value)
    const querySnapshot = await q.get()
    return querySnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    })) as unknown as T[]
  }
}

