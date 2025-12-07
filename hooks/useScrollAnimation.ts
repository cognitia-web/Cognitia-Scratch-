"use client"

import { useEffect, useRef } from "react"
// @ts-ignore
import anime from "animejs"

interface UseScrollAnimationOptions {
  delay?: number
  duration?: number
  easing?: string
  translateY?: number
  opacity?: number
  scale?: number
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            anime({
              targets: element,
              opacity: options.opacity ?? 1,
              translateY: options.translateY ?? 0,
              scale: options.scale ?? 1,
              duration: options.duration ?? 800,
              delay: options.delay ?? 0,
              easing: options.easing ?? "easeOutExpo",
            })
            observer.unobserve(element)
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [options])

  return elementRef
}

