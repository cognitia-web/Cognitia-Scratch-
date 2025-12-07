import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/db/client"

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete all user data (GDPR compliance)
    await prisma.task.deleteMany({
      where: { userId: session.user.id },
    })

    await prisma.habit.deleteMany({
      where: { userId: session.user.id },
    })

    await prisma.studySession.deleteMany({
      where: { userId: session.user.id },
    })

    await prisma.workout.deleteMany({
      where: { userId: session.user.id },
    })

    await prisma.courseProgress.deleteMany({
      where: { userId: session.user.id },
    })

    await prisma.exam.deleteMany({
      where: { userId: session.user.id },
    })

    await prisma.flashcard.deleteMany({
      where: { userId: session.user.id },
    })

    await prisma.reward.deleteMany({
      where: { userId: session.user.id },
    })

    await prisma.dailyReport.deleteMany({
      where: { userId: session.user.id },
    })

    // Mark videos as deleted (files will be cleaned up by cron)
    await prisma.video.updateMany({
      where: { userId: session.user.id },
      data: { deletedAt: new Date() },
    })

    // Delete user account
    await prisma.user.delete({
      where: { id: session.user.id },
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

