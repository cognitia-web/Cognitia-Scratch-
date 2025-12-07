import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/db/client"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const workouts = await prisma.workout.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    return NextResponse.json(workouts)
  } catch (error: any) {
    console.error("Error fetching workouts:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { type, duration, calories, exercises, verified } = body

    const workout = await prisma.workout.create({
      data: {
        userId: user.id,
        type,
        duration: parseInt(duration),
        calories: calories ? parseInt(calories) : null,
        exercises: exercises || null,
        verified: verified || false,
      },
    })

    return NextResponse.json(workout, { status: 201 })
  } catch (error: any) {
    console.error("Error creating workout:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

