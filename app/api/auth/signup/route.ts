import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/client"
import bcrypt from "bcryptjs"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password, age, guardianEmail } = body

    if (age < 13) {
      return NextResponse.json(
        { error: "Users must be at least 13 years old" },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const userData: any = {
      name,
      email,
      age: parseInt(age),
      password: hashedPassword, // Store hashed password
    }

    // Handle guardian linking for users under 16
    if (age < 16 && guardianEmail) {
      let guardian = await prisma.guardian.findUnique({
        where: { email: guardianEmail },
      })

      if (!guardian) {
        // Generate OTP
        const otpCode = crypto.randomInt(100000, 999999).toString()
        const otpExpires = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

        guardian = await prisma.guardian.create({
          data: {
            email: guardianEmail,
            otpCode,
            otpExpires,
          },
        })

        // In production, send OTP email
        console.log(`OTP for ${guardianEmail}: ${otpCode}`)
      }

      userData.guardianId = guardian.id
    }

    const user = await prisma.user.create({
      data: userData,
    })

    return NextResponse.json(
      { message: "User created successfully", userId: user.id },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

