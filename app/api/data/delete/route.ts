import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/db/client"

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete all user data (GDPR compliance)
    await prisma.task.deleteMany({
      where: { userId: user.id },
    })

    await prisma.habit.deleteMany({
      where: { userId: user.id },
    })

    await prisma.studySession.deleteMany({
      where: { userId: user.id },
    })

    await prisma.workout.deleteMany({
      where: { userId: user.id },
    })

    await prisma.courseProgress.deleteMany({
      where: { userId: user.id },
    })

    await prisma.exam.deleteMany({
      where: { userId: user.id },
    })

    await prisma.flashcard.deleteMany({
      where: { userId: user.id },
    })

    await prisma.reward.deleteMany({
      where: { userId: user.id },
    })

    await prisma.dailyReport.deleteMany({
      where: { userId: user.id },
    })

    // Mark videos as deleted (files will be cleaned up by cron)
    await prisma.video.updateMany({
      where: { userId: user.id },
      data: { deletedAt: new Date() },
    })

    // Delete user account
    await prisma.user.delete({
      where: { id: user.id },
    })

    return NextResponse.json({ message: "All data deleted successfully" })
  } catch (error: any) {
    console.error("Error deleting data:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

