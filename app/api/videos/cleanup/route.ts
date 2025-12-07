import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/client"
import { unlink } from "fs/promises"
import { join } from "path"

// This endpoint should be called by a cron job to auto-delete videos after 30 days
export async function POST(request: Request) {
  try {
    // Verify this is called from a cron job or admin
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const expiredVideos = await prisma.video.findMany({
      where: {
        expiresAt: {
          lte: new Date(),
        },
        deletedAt: null,
      },
    })

    let deletedCount = 0

    for (const video of expiredVideos) {
      try {
        // Delete encrypted file
        await unlink(video.encryptedPath).catch(() => {
          // File might already be deleted
        })

        // Mark as deleted in database
        await prisma.video.update({
          where: { id: video.id },
          data: { deletedAt: new Date() },
        })

        deletedCount++
      } catch (error) {
        console.error(`Failed to delete video ${video.id}:`, error)
      }
    }

    return NextResponse.json({
      message: `Deleted ${deletedCount} expired videos`,
      deletedCount,
    })
  } catch (error: any) {
    console.error("Error cleaning up videos:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

