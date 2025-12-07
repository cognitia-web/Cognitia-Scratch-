import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/db/client"

// Indian food database (simplified - in production, use a comprehensive database)
const INDIAN_FOODS: Record<string, { calories: number; protein: number; carbs: number; fats: number }> = {
  "roti": { calories: 70, protein: 2, carbs: 15, fats: 0.5 },
  "rice": { calories: 130, protein: 2.7, carbs: 28, fats: 0.3 },
  "dal": { calories: 100, protein: 6, carbs: 18, fats: 1 },
  "chicken curry": { calories: 200, protein: 25, carbs: 5, fats: 8 },
  "vegetable curry": { calories: 80, protein: 2, carbs: 12, fats: 2 },
  "samosa": { calories: 150, protein: 3, carbs: 18, fats: 7 },
  "biryani": { calories: 350, protein: 20, carbs: 45, fats: 10 },
  "paneer": { calories: 100, protein: 7, carbs: 2, fats: 7 },
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const foodLogs = await prisma.foodLog.findMany({
      where: { userId: session.user.id },
      orderBy: { date: "desc" },
      take: 100,
    })

    return NextResponse.json(foodLogs)
  } catch (error: any) {
    console.error("Error fetching food logs:", error)
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
    let { name, calories, protein, carbs, fats } = body

    // Auto-fill from Indian food database if available
    const foodKey = name.toLowerCase()
    if (INDIAN_FOODS[foodKey]) {
      const foodData = INDIAN_FOODS[foodKey]
      calories = calories || foodData.calories
      protein = protein || foodData.protein
      carbs = carbs || foodData.carbs
      fats = fats || foodData.fats
    }

    const foodLog = await prisma.foodLog.create({
      data: {
        userId: session.user.id,
        name,
        calories: parseInt(calories),
        protein: protein ? parseFloat(protein) : null,
        carbs: carbs ? parseFloat(carbs) : null,
        fats: fats ? parseFloat(fats) : null,
      },
    })

    return NextResponse.json(foodLog, { status: 201 })
  } catch (error: any) {
    console.error("Error creating food log:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

