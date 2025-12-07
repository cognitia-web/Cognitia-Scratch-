import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/db/client"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const flashcards = await prisma.flashcard.findMany({
      where: { userId: user.id },
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

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
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
        userId: user.id,
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

