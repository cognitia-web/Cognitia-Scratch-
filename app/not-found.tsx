"use client"

import { useRouter } from "next/navigation"
import GlassButton from "@/components/glass/GlassButton"

export default function NotFound() {
  const router = useRouter()
  
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-[#0a0a0a] text-white">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-6xl font-black bg-gradient-to-r from-softBlue to-calmPurple bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-2xl font-bold text-white">Page Not Found</h2>
        <p className="text-white/60">The page you're looking for doesn't exist.</p>
        <GlassButton 
          onClick={() => router.push("/")} 
          variant="gradient" 
          className="w-full"
        >
          Go Home
        </GlassButton>
      </div>
    </div>
  )
}

