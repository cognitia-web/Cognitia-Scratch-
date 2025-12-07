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

    const tasks = await prisma.task.findMany({
      where: { userId: session.user.id },
      orderBy: { order: "asc" },
    })

    return NextResponse.json(tasks)
  } catch (error: any) {
    console.error("Error fetching tasks:", error)
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
    const { title, description, type, priority, dueDate } = body

    // Get max order for this user
    const maxOrderTask = await prisma.task.findFirst({
      where: { userId: session.user.id },
      orderBy: { order: "desc" },
    })

    const task = await prisma.task.create({
      data: {
        userId: session.user.id,
        title,
        description,
        type,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        order: maxOrderTask ? maxOrderTask.order + 1 : 0,
      },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error: any) {
    console.error("Error creating task:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

