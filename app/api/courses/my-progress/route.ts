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

    const progress = await prisma.courseProgress.findMany({
      where: { userId: session.user.id },
      include: {
        course: {
          include: {
            lessons: true,
          },
        },
      },
    })

    const coursesWithProgress = progress.map((p) => ({
      id: p.course.id,
      title: p.course.title,
      description: p.course.description,
      category: p.course.category,
      level: p.course.level,
      duration: p.course.duration,
      progress: {
        progress: p.progress,
        completedLessons: p.completedLessons,
      },
    }))

    return NextResponse.json(coursesWithProgress)
  } catch (error: any) {
    console.error("Error fetching course progress:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

