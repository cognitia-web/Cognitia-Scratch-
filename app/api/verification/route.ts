import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/db/client"
import { encrypt } from "@/lib/encryption/encrypt"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const videoFile = formData.get("video") as File
    const taskId = formData.get("taskId") as string
    const videoHash = formData.get("hash") as string
    const poseData = formData.get("poseData") as string

    if (!videoFile) {
      return NextResponse.json(
        { error: "Video file required" },
        { status: 400 }
      )
    }

    // Check for duplicate videos
    const existingVideo = await prisma.video.findFirst({
      where: { hash: videoHash },
    })

    if (existingVideo) {
      return NextResponse.json(
        { error: "Duplicate video detected" },
        { status: 400 }
      )
    }

    // Validate video duration (max 30 seconds)
    // Note: In production, you'd need to check actual video duration
    const fileSize = videoFile.size
    if (fileSize > 10 * 1024 * 1024) {
      // 10MB limit
      return NextResponse.json(
        { error: "Video file too large" },
        { status: 400 }
      )
    }

    // Generate encryption key for this file
    const fileKey = crypto.randomBytes(32).toString("hex")

    // Encrypt video data
    const videoBuffer = Buffer.from(await videoFile.arrayBuffer())
    const encryptedBuffer = Buffer.from(
      encrypt(videoBuffer.toString("base64"))
    )

    // Store encrypted video
    const uploadDir = join(process.cwd(), "uploads", "videos")
    await mkdir(uploadDir, { recursive: true })

    const filename = `${crypto.randomUUID()}.encrypted`
    const filepath = join(uploadDir, filename)

    await writeFile(filepath, encryptedBuffer)

    // Calculate expiration date (30 days from now)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    // Create video record
    const video = await prisma.video.create({
      data: {
        userId: user.id,
        filename,
        encryptedPath: filepath,
        hash: videoHash,
        duration: 30, // In production, extract from video metadata
        size: fileSize,
        encryptionKey: fileKey,
        expiresAt,
      },
    })

    // Create verification record
    const verification = await prisma.verification.create({
      data: {
        taskId: taskId || null,
        videoId: video.id,
        type: "VIDEO",
        status: "VERIFIED",
        videoHash,
        poseData: poseData ? JSON.parse(poseData) : null,
        verifiedAt: new Date(),
      },
    })

    return NextResponse.json({
      verificationId: verification.id,
      videoId: video.id,
      message: "Verification successful",
    })
  } catch (error: any) {
    console.error("Error processing verification:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

