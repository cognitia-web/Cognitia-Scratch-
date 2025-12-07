"use client"

import { useScrollAnimation } from "@/hooks/useScrollAnimation"
import { ReactNode } from "react"

interface ScrollAnimatedProps {
  children: ReactNode
  delay?: number
  duration?: number
  translateY?: number
  className?: string
}

export default function ScrollAnimated({
  children,
  delay = 0,
  duration = 800,
  translateY = 30,
  className = "",
}: ScrollAnimatedProps) {
  const ref = useScrollAnimation({
    delay,
    duration,
    translateY,
    opacity: 0,
  })

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  )
}

