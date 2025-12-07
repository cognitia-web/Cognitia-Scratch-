import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import { prisma } from "@/lib/db/client"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16" as const,
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { points, rewardId } = body

    if (!points || points < 100) {
      return NextResponse.json(
        { error: "Minimum 100 points required" },
        { status: 400 }
      )
    }

    const usdAmount = points / 100 // 100 points = $1

    // Get user's Stripe account or create one
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check KYC requirement
    const kycRequired = usdAmount >= 100

    if (kycRequired) {
      // In production, check KYC status
      // For now, return pending status
      return NextResponse.json({
        message: "KYC verification required for amounts over $100",
        kycRequired: true,
      })
    }

    // Create Stripe payout (in production)
    // For MVP, we'll just update the reward status
    if (rewardId) {
      const reward = await prisma.reward.update({
        where: { id: rewardId },
        data: {
          status: "PROCESSING",
        },
      })

      // In production: Create Stripe transfer
      // await stripe.transfers.create({
      //   amount: Math.round(usdAmount * 100), // Convert to cents
      //   currency: "usd",
      //   destination: user.stripeAccountId,
      // })

      return NextResponse.json({
        message: "Payout initiated",
        reward,
      })
    }

    return NextResponse.json(
      { error: "Reward ID required" },
      { status: 400 }
    )
  } catch (error: any) {
    console.error("Error converting points:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

