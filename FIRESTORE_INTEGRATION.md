# Firestore Database Integration

Firestore has been successfully integrated into the Cognitia application. The app now uses Firestore as the primary database alongside PostgreSQL (for backward compatibility).

## What's Been Integrated

### 1. **Firebase Configuration**
- **Client-side**: `lib/firebase/config.ts` - Added Firestore client initialization
- **Server-side**: `lib/firebase/server-auth.ts` - Added Firestore Admin SDK initialization

### 2. **Firestore Service Layer**
- **Client Service**: `lib/firebase/firestore.ts` - `FirestoreService` class for client-side operations
- **Admin Service**: `lib/firebase/firestore.ts` - `FirestoreAdminService` class for server-side operations
- **Service Helpers**: `lib/firebase/firestore-admin.ts` - Pre-configured services for all collections

### 3. **Collections Available**
The following Firestore collections are set up:
- `users` - User profiles and authentication data
- `tasks` - User tasks
- `habits` - User habits
- `workouts` - Workout logs
- `exams` - Exam schedules
- `flashcards` - Study flashcards
- `studySessions` - Study session logs
- `courseProgress` - Course progress tracking
- `rewards` - Reward points and conversions
- `foodLogs` - Food logging
- `dailyReports` - Daily activity reports
- `guardians` - Guardian accounts

### 4. **Updated Routes**
- **Signup Route** (`app/api/auth/signup/route.ts`): Now writes user data to both Firestore and PostgreSQL

## How to Use Firestore

### Server-Side (API Routes)

```typescript
import { taskService, userService } from "@/lib/firebase/firestore-admin"
import { getCurrentUser } from "@/lib/auth"

// Create a task
const taskId = await taskService().create({
  userId: user.id,
  title: "Complete assignment",
  description: "Finish math homework",
  type: "STUDY",
  priority: "HIGH",
  status: "PENDING",
  dueDate: new Date("2024-12-31"),
})

// Get user tasks
const tasks = await taskService().getAll(
  [["userId", "==", user.id]], // filters
  "createdAt", // orderBy
  "desc", // direction
  10 // limit
)

// Update a task
await taskService().update(taskId, {
  status: "COMPLETED",
})

// Delete a task
await taskService().delete(taskId)
```

### Client-Side (React Components)

```typescript
"use client"

import { FirestoreService } from "@/lib/firebase/firestore"

const taskService = new FirestoreService("tasks")

// Create a task
const taskId = await taskService.create({
  userId: currentUser.id,
  title: "New Task",
  // ... other fields
})

// Get tasks
const tasks = await taskService.getAll(
  [["userId", "==", currentUser.id]],
  "createdAt",
  "desc"
)
```

## Data Structure

### User Document
```typescript
{
  id: string // Firebase UID
  email: string
  name: string
  age: number
  role: "STUDENT" | "GUARDIAN" | "ADMIN"
  provider: string // "email", "google.com", "github.com", "microsoft.com"
  balance: number // Reward balance
  experience: number // User XP
  stage: string // User stage/level
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

## Migration Strategy

The app currently uses a **dual-write strategy**:
1. New data is written to both Firestore and PostgreSQL
2. Reads prefer Firestore, with Prisma as fallback
3. This ensures backward compatibility during migration

### Next Steps (Optional)
1. Migrate existing Prisma data to Firestore
2. Update all API routes to use Firestore
3. Remove Prisma dependency once migration is complete

## Environment Variables

Make sure these are set in your `.env` file:
```env
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
```

## Benefits of Firestore

1. **Real-time Updates**: Firestore supports real-time listeners for live data
2. **Scalability**: Automatically scales with your user base
3. **Offline Support**: Built-in offline persistence
4. **Security**: Firestore Security Rules for fine-grained access control
5. **NoSQL Flexibility**: Schema-less design for rapid iteration

## Security Rules

Remember to set up Firestore Security Rules in the Firebase Console to protect your data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    // Add more rules for other collections...
  }
}
```

