import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/db/client"

const POINTS_PER_VERIFIED_TASK = 10
const KYC_THRESHOLD = 100 // USD

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const rewards = await prisma.reward.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    })

    // Calculate total points
    const totalPoints = rewards
      .filter((r) => r.type === "POINTS" && r.status === "COMPLETED")
      .reduce((sum, r) => sum + r.points, 0)

    return NextResponse.json({
      rewards,
      totalPoints,
    })
  } catch (error: any) {
    console.error("Error fetching rewards:", error)
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
    const { type, points, amount } = body

    // Award points for verified tasks
    if (type === "POINTS") {
      const reward = await prisma.reward.create({
        data: {
          userId: session.user.id,
          points: points || POINTS_PER_VERIFIED_TASK,
          type: "POINTS",
          status: "COMPLETED",
        },
      })

      return NextResponse.json(reward, { status: 201 })
    }

    // Convert points to USD
    if (type === "USD") {
      const pointsToConvert = points || 0
      const usdAmount = pointsToConvert / 100 // 100 points = $1

      // Check if KYC is required
      const kycRequired = usdAmount >= KYC_THRESHOLD

      const reward = await prisma.reward.create({
        data: {
          userId: session.user.id,
          points: pointsToConvert,
          type: "USD",
          amount: usdAmount,
          status: kycRequired ? "PENDING" : "PROCESSING",
          kycRequired,
          kycStatus: kycRequired ? "PENDING" : "NOT_REQUIRED",
        },
      })

      // In production, initiate Stripe payout here
      // For now, just return the reward

      return NextResponse.json(reward, { status: 201 })
    }

    return NextResponse.json(
      { error: "Invalid reward type" },
      { status: 400 }
    )
  } catch (error: any) {
    console.error("Error creating reward:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

