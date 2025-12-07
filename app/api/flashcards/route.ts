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

    const flashcards = await prisma.flashcard.findMany({
      where: { userId: session.user.id },
      orderBy: { nextReview: "asc" },
    })

    return NextResponse.json(flashcards)
  } catch (error: any) {
    console.error("Error fetching flashcards:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { question, answer } = body

    if (!question || !answer) {
      return NextResponse.json(
        { error: "Question and answer are required" },
        { status: 400 }
      )
    }

    const flashcard = await prisma.flashcard.create({
      data: {
        userId: session.user.id,
        front: question, // Schema uses front/back
        back: answer,
        nextReview: new Date(), // Spaced repetition: review immediately
      },
    })

    return NextResponse.json(flashcard, { status: 201 })
  } catch (error: any) {
    console.error("Error creating flashcard:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

