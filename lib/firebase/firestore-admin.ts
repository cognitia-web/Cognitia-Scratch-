import { getAdminFirestoreInstance } from "./server-auth"
import { FirestoreAdminService, FirestoreData } from "./firestore"

// Server-side Firestore services for each collection
export const userService = () => new FirestoreAdminService<FirestoreData>("users", getAdminFirestoreInstance())
export const taskService = () => new FirestoreAdminService<FirestoreData>("tasks", getAdminFirestoreInstance())
export const habitService = () => new FirestoreAdminService<FirestoreData>("habits", getAdminFirestoreInstance())
export const workoutService = () => new FirestoreAdminService<FirestoreData>("workouts", getAdminFirestoreInstance())
export const examService = () => new FirestoreAdminService<FirestoreData>("exams", getAdminFirestoreInstance())
export const flashcardService = () => new FirestoreAdminService<FirestoreData>("flashcards", getAdminFirestoreInstance())
export const studySessionService = () => new FirestoreAdminService<FirestoreData>("studySessions", getAdminFirestoreInstance())
export const courseProgressService = () => new FirestoreAdminService<FirestoreData>("courseProgress", getAdminFirestoreInstance())
export const rewardService = () => new FirestoreAdminService<FirestoreData>("rewards", getAdminFirestoreInstance())
export const foodLogService = () => new FirestoreAdminService<FirestoreData>("foodLogs", getAdminFirestoreInstance())
export const dailyReportService = () => new FirestoreAdminService<FirestoreData>("dailyReports", getAdminFirestoreInstance())
export const guardianService = () => new FirestoreAdminService<FirestoreData>("guardians", getAdminFirestoreInstance())

