"use client"

import { useEffect, useState } from "react"
import GlassCard from "@/components/glass/GlassCard"
import { Flame, CheckCircle, Clock, Trophy, TrendingUp, Calendar } from "lucide-react"
import { motion } from "framer-motion"

interface Task {
  id: string
  title: string
  status: string
}

interface Exam {
  id: string
  name?: string
  title?: string
  subject?: string
  date: string | Date
}

export default function DashboardPage() {
  const [stats, setStats] = useState({
    streak: 0,
    tasksCompleted: 0,
    studyTime: 0,
    points: 0,
  })
  const [tasks, setTasks] = useState<Task[]>([])
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleStorageChange = () => {
      fetchStats()
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const fetchStats = async () => {
    try {
      const { apiRequest } = await import("@/lib/api-client")
      const data = await apiRequest("/api/dashboard/stats")
      setStats({
        streak: data.streak || 0,
        tasksCompleted: data.tasksCompleted || 0,
        studyTime: data.studyTime || 0,
        points: data.points || 0,
      })
      setTasks(data.todaysTasks || [])
      setExams(data.upcomingExams || [])
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const getDaysUntil = (dateString: string | Date) => {
    const examDate = typeof dateString === 'string' ? new Date(dateString) : dateString
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const diffTime = examDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const statCards = [
    {
      icon: Flame,
      label: "Current Streak",
      value: loading ? "..." : `${stats.streak} days`,
      color: "softBlue",
      gradient: "from-softBlue/20 to-softBlue/10"
    },
    {
      icon: CheckCircle,
      label: "Tasks Completed",
      value: loading ? "..." : stats.tasksCompleted.toString(),
      color: "calmPurple",
      gradient: "from-calmPurple/20 to-calmPurple/10"
    },
    {
      icon: Clock,
      label: "Study Time",
      value: loading ? "..." : `${stats.studyTime} min`,
      color: "softBlue",
      gradient: "from-softBlue/20 to-softBlue/10"
    },
    {
      icon: Trophy,
      label: "Points Earned",
      value: loading ? "..." : stats.points.toString(),
      color: "calmPurple",
      gradient: "from-calmPurple/20 to-calmPurple/10"
    },
  ]

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header with Better Typography */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-2 md:mb-4 leading-tight">
          Welcome Back!
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-white/60 font-medium">
          Here&apos;s your progress today
        </p>
      </motion.div>

      {/* Stats Grid with Better Design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="h-full">
                <div className="flex items-center gap-4">
                  <div className={`p-3 md:p-4 bg-gradient-to-br ${card.gradient} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-5 h-5 md:w-6 md:h-6 ${card.color === "softBlue" ? "text-softBlue" : "text-calmPurple"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-white/60 font-medium mb-1">{card.label}</p>
                    <p className="text-xl sm:text-2xl md:text-3xl font-black text-white truncate">
                      {card.value}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )
        })}
      </div>

      {/* Tasks and Exams with Better Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-softBlue/20 to-calmPurple/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-softBlue" />
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white">
                Today&apos;s Tasks
              </h2>
            </div>
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-softBlue"></div>
                </div>
              ) : tasks.length > 0 ? (
                tasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="flex items-center gap-3 p-3 md:p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-softBlue/50 transition-all duration-300 group"
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                      task.status === "COMPLETED" 
                        ? "bg-softBlue border-softBlue" 
                        : "border-gray-600 group-hover:border-softBlue"
                    }`}>
                      {task.status === "COMPLETED" && (
                        <CheckCircle className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span className={`flex-1 text-sm md:text-base font-medium transition-all ${
                      task.status === "COMPLETED"
                        ? "text-white/50 line-through"
                        : "text-white group-hover:text-softBlue"
                    }`}>
                      {task.title}
                    </span>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-white/50 text-sm md:text-base">
                    No tasks for today. Create one to get started!
                  </p>
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-calmPurple/20 to-softBlue/20 rounded-lg">
                <Calendar className="w-5 h-5 text-calmPurple" />
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white">
                Upcoming Exams
              </h2>
            </div>
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-calmPurple"></div>
                </div>
              ) : exams.length > 0 ? (
                exams.map((exam, index) => {
                  const daysUntil = getDaysUntil(exam.date)
                  return (
                    <motion.div
                      key={exam.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      className="p-4 md:p-5 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-calmPurple/50 transition-all duration-300 group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="font-bold text-white text-sm md:text-base mb-1 group-hover:text-calmPurple transition-colors">
                            {exam.title || exam.name}
                          </p>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-calmPurple/70" />
                            <p className="text-xs md:text-sm text-white/60">
                              {daysUntil} {daysUntil === 1 ? "day" : "days"} remaining
                            </p>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                          daysUntil <= 7 
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : daysUntil <= 14
                            ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                            : "bg-green-500/20 text-green-400 border border-green-500/30"
                        }`}>
                          {daysUntil}d
                        </div>
                      </div>
                    </motion.div>
                  )
                })
              ) : (
                <div className="text-center py-8">
                  <p className="text-white/50 text-sm md:text-base">
                    No upcoming exams. Add one to track your schedule!
                  </p>
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}
