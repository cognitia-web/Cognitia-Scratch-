import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/db/client"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const workouts = await prisma.workout.findMany({
      where: { userId: session.user.id },
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

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { type, duration, calories, exercises, verified } = body

    const workout = await prisma.workout.create({
      data: {
        userId: session.user.id,
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

