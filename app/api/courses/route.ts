import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/client"

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        lessons: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(courses)
  } catch (error: any) {
    console.error("Error fetching courses:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, category, level, duration, thumbnail } = body

    const course = await prisma.course.create({
      data: {
        title,
        description,
        category,
        level,
        duration: parseInt(duration),
        thumbnail,
      },
    })

    return NextResponse.json(course, { status: 201 })
  } catch (error: any) {
    console.error("Error creating course:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

