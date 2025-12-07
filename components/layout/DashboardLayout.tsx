"use client"

import { signOut } from "@/lib/firebase/auth"
import { useRouter } from "next/navigation"
import AuroraBackground from "@/components/backgrounds/AuroraBackground"
import Dock from "@/components/navigation/Dock"
import { motion } from "framer-motion"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/auth/signout")
  }

  return (
    <div className="relative min-h-screen bg-[#0a0a0a]">
      <AuroraBackground />
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen">
        {/* Top bar */}
        <header className="h-16 md:h-20 flex items-center justify-between px-4 sm:px-6 md:px-8 backdrop-blur-sm bg-black/20 border-b border-white/5">
          <motion.h1 
            whileHover={{ scale: 1.05 }}
            className="text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-softBlue via-calmPurple to-softBlue bg-clip-text text-transparent tracking-tight"
          >
            Cognitia
          </motion.h1>
          <motion.button
            onClick={handleSignOut}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 text-sm md:text-base text-white/80 hover:text-white font-medium transition-all duration-200 hover:bg-white/5 rounded-lg"
          >
            Sign Out
          </motion.button>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 md:p-8 pb-24 md:pb-28 overflow-y-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Dock Navigation */}
      <Dock />
    </div>
  )
}

