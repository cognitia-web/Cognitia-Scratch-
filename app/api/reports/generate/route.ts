import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/db/client"

// This endpoint generates daily reports for students with guardians
export async function POST(request: NextRequest) {
  try {
    const authUser = await getCurrentUser(request)
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      include: {
        guardian: true,
      },
    })

    if (!user || !user.guardianId) {
      return NextResponse.json(
        { error: "No guardian linked" },
        { status: 400 }
      )
    }

    // Get today's data
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Calculate study time (today's sessions)
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

    // Count completed tasks
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

    // Count active streaks
    const habits = await prisma.habit.findMany({
      where: { userId: user.id },
    })
    const streaks = habits.filter((h) => h.streak > 0).length

    // Get upcoming exams (next 30 days)
    const upcomingExams = await prisma.exam.findMany({
      where: {
        userId: user.id,
        date: {
          gte: today,
          lte: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000),
        },
      },
      select: {
        title: true,
        subject: true,
        date: true,
      },
      orderBy: { date: "asc" },
      take: 5,
    })

    // Create or update daily report
    const report = await prisma.dailyReport.upsert({
      where: {
        userId_date: {
          userId: user.id,
          date: today,
        },
      },
      update: {
        studyTime,
        tasksCompleted,
        streaks,
        upcomingExams: upcomingExams as any,
      },
      create: {
        userId: user.id,
        guardianId: user.guardianId,
        date: today,
        studyTime,
        tasksCompleted,
        streaks,
        upcomingExams: upcomingExams as any,
        note: "Good progress today!",
      },
    })

    return NextResponse.json(report)
  } catch (error: any) {
    console.error("Error generating report:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

