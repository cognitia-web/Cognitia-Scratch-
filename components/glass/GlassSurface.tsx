"use client"

import { cn } from "@/lib/utils"

interface GlassSurfaceProps {
  children: React.ReactNode
  className?: string
  opacity?: number
  blur?: number
}

export default function GlassSurface({ 
  children, 
  className,
  opacity = 0.25,
  blur = 12
}: GlassSurfaceProps) {
  return (
    <div
      className={cn(
        "bg-gray-800 border border-gray-700 shadow-lg rounded-2xl",
        className
      )}
    >
      {children}
    </div>
  )
}


