import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/db/client"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const exams = await prisma.exam.findMany({
      where: { userId: user.id },
      orderBy: { date: "asc" },
    })

    return NextResponse.json(exams)
  } catch (error: any) {
    console.error("Error fetching exams:", error)
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
    const { name, title, subject, date, notes } = body

    // Support both 'name' (from UI) and 'title' (from schema)
    const examTitle = title || name
    const examSubject = subject || notes || "General"

    if (!examTitle || !date) {
      return NextResponse.json(
        { error: "Title and date are required" },
        { status: 400 }
      )
    }

    const exam = await prisma.exam.create({
      data: {
        userId: user.id,
        title: examTitle,
        subject: examSubject,
        date: new Date(date),
        notes: notes || null,
      },
    })

    return NextResponse.json(exam, { status: 201 })
  } catch (error: any) {
    console.error("Error creating exam:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

