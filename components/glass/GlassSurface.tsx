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
        "backdrop-blur-xl border border-white/30 shadow-lg rounded-2xl",
        className
      )}
      style={{
        backgroundColor: `rgba(255, 255, 255, ${opacity})`,
        backdropFilter: `blur(${blur}px)`,
      }}
    >
      {children}
    </div>
  )
}


