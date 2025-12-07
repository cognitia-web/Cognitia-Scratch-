import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/db/client"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const habits = await prisma.habit.findMany({
      where: { userId: user.id },
      include: {
        completions: {
          orderBy: { date: "desc" },
          take: 1,
        },
      },
    })

    return NextResponse.json(habits)
  } catch (error: any) {
    console.error("Error fetching habits:", error)
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
    const { name, description } = body

    const habit = await prisma.habit.create({
      data: {
        userId: user.id,
        name,
        description,
      },
    })

    return NextResponse.json(habit, { status: 201 })
  } catch (error: any) {
    console.error("Error creating habit:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

