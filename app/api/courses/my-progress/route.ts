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

    const progress = await prisma.courseProgress.findMany({
      where: { userId: user.id },
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

