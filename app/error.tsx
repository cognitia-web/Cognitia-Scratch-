"use client"

import { useEffect } from "react"
import GlassButton from "@/components/glass/GlassButton"
import { AlertCircle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-[#0a0a0a] text-white">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <AlertCircle className="w-16 h-16 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-white">Something went wrong!</h1>
        <p className="text-white/60">{error.message || "An unexpected error occurred"}</p>
        <GlassButton onClick={reset} variant="gradient" className="w-full">
          Try again
        </GlassButton>
      </div>
    </div>
  )
}

