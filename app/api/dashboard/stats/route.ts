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

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Get current streak (longest active habit streak)
    const habits = await prisma.habit.findMany({
      where: { userId: user.id },
    })
    const maxStreak = habits.length > 0 
      ? Math.max(...habits.map(h => h.streak), 0)
      : 0

    // Get tasks completed today
    const tasksCompleted = await prisma.task.count({
      where: {
        userId: user.id,
        status: "COMPLETED",
        completedAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    })

    // Get study time today (in minutes)
    const studySessions = await prisma.studySession.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    })
    const studyTime = studySessions.reduce((sum, s) => sum + s.duration, 0)

    // Get total points
    const rewards = await prisma.reward.findMany({
      where: { userId: user.id },
    })
    const points = rewards
      .filter((r) => r.type === "POINTS" && r.status === "COMPLETED")
      .reduce((sum, r) => sum + r.points, 0)

    // Get today's tasks - only show tasks due today (not yesterday's tasks)
    const tasks = await prisma.task.findMany({
      where: {
        userId: user.id,
        dueDate: {
          gte: today,
          lt: tomorrow,
        },
        status: "PENDING", // Only show pending tasks for today
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    })

    // Get upcoming exams (next 30 days)
    const upcomingExams = await prisma.exam.findMany({
      where: {
        userId: user.id,
        date: {
          gte: today,
          lte: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000),
        },
      },
      orderBy: { date: "asc" },
      take: 5,
    })

    return NextResponse.json({
      streak: maxStreak,
      tasksCompleted,
      studyTime,
      points,
      tasks: tasks.map(t => ({
        id: t.id,
        title: t.title,
        status: t.status,
      })),
      todaysTasks: tasks.map(t => ({
        id: t.id,
        title: t.title,
        status: t.status,
      })),
      upcomingExams: upcomingExams.map(e => ({
        id: e.id,
        name: e.title, // Map title to name for frontend
        title: e.title,
        subject: e.subject,
        date: e.date,
      })),
    })
  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

