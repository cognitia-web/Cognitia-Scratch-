import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/client"
import { userService, guardianService } from "@/lib/firebase/firestore-admin"

export const dynamic = 'force-dynamic'

// This endpoint is called after Firebase user is created on client-side
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, age, guardianEmail, uid, provider } = body

    if (!email || !name || !uid) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const userAge = age ? parseInt(age) : 18
    const userData = {
      email,
      name,
      age: userAge,
      role: "STUDENT",
      provider: provider || "email",
      balance: 0,
      experience: 0,
      stage: "BEGINNER",
    }

    // Create or update user in Firestore
    try {
      const existingUser = await userService().getById(uid)
      if (existingUser) {
        // Update existing user
        await userService().update(uid, {
          email,
          name,
          ...(age && { age: userAge }),
        })
      } else {
        // Create new user
        await userService().create(userData, uid)
      }
    } catch (firestoreError) {
      console.error("Firestore error:", firestoreError)
      // Continue to Prisma fallback
    }

    // Also create/update in Prisma for backward compatibility
    let dbUser
    try {
      dbUser = await prisma.user.upsert({
        where: { id: uid },
        update: {
          email: email,
          name: name,
          ...(age && { age: userAge }),
        },
        create: {
          id: uid,
          email: email,
          name: name,
          age: userAge,
          role: "STUDENT",
          ...(guardianEmail && userAge < 16 && {
            guardian: {
              create: {
                email: guardianEmail,
                name: "Guardian",
              }
            }
          })
        }
      })

      // Create guardian in Firestore if needed
      if (guardianEmail && userAge < 16) {
        try {
          const guardianData = {
            email: guardianEmail,
            name: "Guardian",
            students: [uid],
          }
          // Check if guardian exists
          const guardians = await guardianService().queryByField("email", "==", guardianEmail)
          if (guardians.length === 0) {
            await guardianService().create(guardianData)
          } else {
            // Update existing guardian to add student
            const existingStudents = guardians[0].students || []
            if (!existingStudents.includes(uid)) {
              await guardianService().update(guardians[0].id, {
                students: [...existingStudents, uid],
              })
            }
          }
        } catch (guardianError) {
          console.error("Guardian creation error:", guardianError)
        }
      }
    } catch (prismaError) {
      console.error("Prisma error:", prismaError)
      // If Prisma fails but Firestore succeeded, still return success
      if (!dbUser) {
        return NextResponse.json(
          { error: "Failed to create account in database" },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ 
      user: dbUser || { id: uid, email, name, age: userAge, role: "STUDENT" },
      firestore: true 
    }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating user:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create account" },
      { status: 500 }
    )
  }
}
