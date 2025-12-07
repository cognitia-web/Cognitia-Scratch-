import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/db/client"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const authUser = await getCurrentUser(request)
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is a guardian
    const guardian = await prisma.guardian.findUnique({
      where: { email: authUser.email! },
    })

    if (!guardian) {
      return NextResponse.json(
        { error: "Not a guardian" },
        { status: 403 }
      )
    }

    // Get all linked students
    const students = await prisma.user.findMany({
      where: { guardianId: guardian.id },
    })

    // Get daily reports for all students
    const reports = await prisma.dailyReport.findMany({
      where: {
        guardianId: guardian.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { date: "desc" },
      take: 30,
    })

    return NextResponse.json({
      students,
      reports,
    })
  } catch (error: any) {
    console.error("Error fetching guardian reports:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

