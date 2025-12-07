import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db/client"

// This endpoint is called after Firebase user is created on client-side
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, age, guardianEmail, uid } = body

    if (!email || !name || !age || !uid) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Create user in database (Firebase user already created on client)
    const dbUser = await prisma.user.create({
      data: {
        id: uid,
        email: email,
        name: name,
        age: parseInt(age),
        role: "STUDENT",
        ...(guardianEmail && parseInt(age) < 16 && {
          guardian: {
            create: {
              email: guardianEmail,
              name: "Guardian",
            }
          }
        })
      }
    })

    return NextResponse.json({ user: dbUser }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating user:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create account" },
      { status: 500 }
    )
  }
}
