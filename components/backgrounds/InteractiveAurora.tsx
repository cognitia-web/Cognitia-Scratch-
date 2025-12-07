"use client"

import { useEffect, useRef } from "react"

export default function InteractiveAurora() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || typeof window === "undefined") return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number | undefined
    let time = 0

    const resize = () => {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const draw = () => {
      if (!canvas || !ctx) return
      time += 0.01
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Create animated gradient
      const gradient1 = ctx.createRadialGradient(
        canvas.width * 0.3 + Math.sin(time) * 100,
        canvas.height * 0.3 + Math.cos(time * 0.7) * 100,
        0,
        canvas.width * 0.3 + Math.sin(time) * 100,
        canvas.height * 0.3 + Math.cos(time * 0.7) * 100,
        canvas.width * 0.8
      )
      gradient1.addColorStop(0, "rgba(110, 205, 254, 0.3)")
      gradient1.addColorStop(0.5, "rgba(110, 205, 254, 0.1)")
      gradient1.addColorStop(1, "transparent")

      const gradient2 = ctx.createRadialGradient(
        canvas.width * 0.7 + Math.cos(time * 0.5) * 150,
        canvas.height * 0.7 + Math.sin(time * 0.9) * 150,
        0,
        canvas.width * 0.7 + Math.cos(time * 0.5) * 150,
        canvas.height * 0.7 + Math.sin(time * 0.9) * 150,
        canvas.width * 0.9
      )
      gradient2.addColorStop(0, "rgba(161, 136, 255, 0.3)")
      gradient2.addColorStop(0.5, "rgba(161, 136, 255, 0.1)")
      gradient2.addColorStop(1, "transparent")

      ctx.fillStyle = gradient1
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = gradient2
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener("resize", resize)
      if (animationFrameId !== undefined) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 w-full h-full"
      style={{ mixBlendMode: "screen" }}
    />
  )
}

