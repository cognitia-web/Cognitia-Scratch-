"use client"

import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import AuroraBackground from "@/components/backgrounds/AuroraBackground"
import Dock from "@/components/navigation/Dock"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push("/auth/signout")
  }

  return (
    <div className="relative min-h-screen">
      <AuroraBackground />
      
      {/* Main content */}
      <div className="relative z-10">
        {/* Top bar */}
        <header className="h-16 flex items-center justify-between px-6">
          <h1 className="text-2xl font-bold text-white">Cognitia</h1>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-white/70 hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </header>

        {/* Page content */}
        <main className="p-6 pb-24 overflow-y-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Dock Navigation */}
      <Dock />
    </div>
  )
}

