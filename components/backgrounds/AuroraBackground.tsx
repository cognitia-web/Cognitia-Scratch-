"use client"

import InteractiveAurora from "./InteractiveAurora"

export default function AuroraBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden will-change-auto pointer-events-none">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]" />
      
      {/* Interactive Aurora Canvas */}
      <InteractiveAurora />
      
      {/* Additional Aurora effects */}
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-softBlue/30 blur-3xl opacity-50 animate-pulse will-change-opacity" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-calmPurple/30 blur-3xl opacity-50 animate-pulse will-change-opacity" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-softBlue/20 blur-3xl opacity-30 will-change-opacity" />
    </div>
  )
}

