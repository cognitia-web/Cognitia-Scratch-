"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/providers/AuthProvider"
import GlassCard from "@/components/glass/GlassCard"
import GlassButton from "@/components/glass/GlassButton"
import ProfileCard from "@/components/profile/ProfileCard"
import { Trophy, Download, Trash2, Shield } from "lucide-react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"

interface Reward {
  id: string
  points: number
  type: string
  status: string
  amount?: number
  createdAt: string
}

export default function ProfilePage() {
  const { user } = useAuth()
  const [rewards, setRewards] = useState<Reward[]>([])
  const [totalPoints, setTotalPoints] = useState(0)
  const [pointsToConvert, setPointsToConvert] = useState("")
  const [userStats, setUserStats] = useState({
    experience: 0,
    stage: "Beginner",
    balance: 0,
  })

  useEffect(() => {
    fetchRewards()
    fetchUserStats()
  }, [])

  const fetchUserStats = async () => {
    try {
      const { apiRequest } = await import("@/lib/api-client")
      const data = await apiRequest("/api/dashboard/stats")
      setUserStats({
        experience: data.points || 0,
        stage: data.points >= 10000 ? "Expert" : data.points >= 5000 ? "Advanced" : data.points >= 1000 ? "Intermediate" : "Beginner",
        balance: data.points || 0,
      })
    } catch (error) {
      console.error("Failed to fetch user stats:", error)
    }
  }

  const fetchRewards = async () => {
    try {
      const { apiRequest } = await import("@/lib/api-client")
      const data = await apiRequest("/api/rewards")
      setRewards(data.rewards || [])
      setTotalPoints(data.totalPoints || 0)
    } catch (error) {
      console.error("Failed to fetch rewards:", error)
    }
  }

  const handleConvertPoints = async () => {
    const points = parseInt(pointsToConvert)
    if (points < 100 || points > totalPoints) {
      alert("Invalid points amount. Minimum 100 points required.")
      return
    }

    try {
      const { apiRequest } = await import("@/lib/api-client")
      await apiRequest("/api/rewards/convert", {
        method: "POST",
        body: JSON.stringify({ points }),
      })

      fetchRewards()
      setPointsToConvert("")
      alert("Points conversion initiated!")
    } catch (error) {
      console.error("Failed to convert points:", error)
    }
  }

  const handleExportData = async () => {
    try {
      const { apiRequest } = await import("@/lib/api-client")
      const blob = await apiRequest("/api/data/export") as Blob
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `cognitia-data-${new Date().toISOString()}.json`
      a.click()
    } catch (error) {
      console.error("Failed to export data:", error)
    }
  }

  const handleDeleteData = async () => {
    if (!confirm("Are you sure you want to delete all your data? This action cannot be undone.")) {
      return
    }

    try {
      const { apiRequest } = await import("@/lib/api-client")
      await apiRequest("/api/data/delete", {
        method: "DELETE",
      })

      alert("All data deleted successfully")
      window.location.href = "/auth/signin"
    } catch (error) {
      console.error("Failed to delete data:", error)
    }
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 md:mb-8"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-2 md:mb-4 leading-tight bg-gradient-to-r from-softBlue to-calmPurple bg-clip-text text-transparent">
          Profile & Settings
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-white/60 font-medium">
          Manage your account, rewards, and privacy
        </p>
      </motion.div>

      {/* Profile Card */}
      {user && (
        <ProfileCard
          name={user.displayName || "User"}
          email={user.email || ""}
          experience={userStats.experience}
          stage={userStats.stage}
          balance={userStats.balance}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-softBlue/20 rounded-xl">
              <Trophy className="w-6 h-6 text-softBlue" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Rewards</h2>
              <p className="text-white/70">Total Points: {totalPoints}</p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Convert Points to USD
              </label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={pointsToConvert}
                  onChange={(e) => setPointsToConvert(e.target.value)}
                  placeholder="Min 100 points"
                  className="flex-1"
                />
                <GlassButton variant="gradient" onClick={handleConvertPoints}>
                  Convert
                </GlassButton>
              </div>
              <p className="text-xs text-white/50 mt-1">
                100 points = $1.00 USD
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-white">Recent Rewards</h3>
            {rewards.slice(0, 5).map((reward) => (
              <div
                key={reward.id}
                className="p-3 bg-gray-800 rounded-xl flex items-center justify-between border border-gray-700"
              >
                <div>
                  <p className="text-sm font-medium text-white">
                    {reward.points} points
                  </p>
                  <p className="text-xs text-white/60">
                    {new Date(reward.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-lg ${
                    reward.status === "COMPLETED"
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : reward.status === "PROCESSING"
                      ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                      : "bg-gray-800 text-white/60 border border-gray-700"
                  }`}
                >
                  {reward.status}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-calmPurple/20 rounded-xl">
              <Shield className="w-6 h-6 text-calmPurple" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white">Privacy & Data</h2>
              <p className="text-base md:text-lg text-white/60 font-medium">Manage your data and privacy settings</p>
            </div>
          </div>

          <div className="space-y-4">
            <GlassButton
              variant="ghost"
              onClick={handleExportData}
              className="w-full justify-start"
            >
              <Download className="w-4 h-4 mr-2" />
              Export All Data
            </GlassButton>
            <GlassButton
              variant="ghost"
              onClick={handleDeleteData}
              className="w-full justify-start text-red-500 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete All Data
            </GlassButton>
          </div>

          <div className="mt-6 p-4 bg-gray-800 rounded-xl border border-gray-700">
            <h3 className="font-semibold text-white mb-2">Privacy Information</h3>
            <ul className="text-sm text-white/70 space-y-1">
              <li>• All videos are encrypted and auto-delete after 30 days</li>
              <li>• Only metadata is stored (no raw video data)</li>
              <li>• You can export or delete your data at any time</li>
              <li>• Guardian reports contain only non-sensitive information</li>
            </ul>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

