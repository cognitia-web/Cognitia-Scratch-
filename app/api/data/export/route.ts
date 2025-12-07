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

    // Export all user data (GDPR compliance)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        tasks: true,
        habits: true,
        studySessions: true,
        workouts: true,
        courseProgress: {
          include: {
            course: true,
          },
        },
        exams: true,
        flashcards: true,
        rewards: true,
        // Exclude videos and sensitive data
      },
    })

    // Remove sensitive fields
    const exportData = {
      user: {
        id: user?.id,
        email: user?.email,
        name: user?.name,
        age: user?.age,
        createdAt: user?.createdAt,
      },
      tasks: user?.tasks,
      habits: user?.habits,
      studySessions: user?.studySessions,
      workouts: user?.workouts,
      courseProgress: user?.courseProgress,
      exams: user?.exams,
      flashcards: user?.flashcards,
      rewards: user?.rewards,
    }

    return NextResponse.json(exportData, {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="cognitia-data-${Date.now()}.json"`,
      },
    })
  } catch (error: any) {
    console.error("Error exporting data:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

