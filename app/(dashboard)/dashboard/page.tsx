"use client"

import { useEffect, useState } from "react"
import GlassCard from "@/components/glass/GlassCard"
import { Flame, CheckCircle, Clock, Trophy } from "lucide-react"
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
    // Refresh every 30 seconds to get latest data
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  // Listen for storage events (when tasks are created/updated in other tabs)
  useEffect(() => {
    const handleStorageChange = () => {
      fetchStats()
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/dashboard/stats")
      const data = await res.json()
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">
          Welcome back!
        </h1>
        <p className="text-white/70">Here&apos;s your progress today</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="transform-gpu">
          <GlassCard>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-softBlue/20 rounded-xl">
                <Flame className="w-6 h-6 text-softBlue" />
              </div>
              <div>
                <p className="text-sm text-white/70">Current Streak</p>
                <p className="text-2xl font-bold text-white">
                  {loading ? "..." : `${stats.streak} days`}
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="transform-gpu">
          <GlassCard>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-calmPurple/20 rounded-xl">
                <CheckCircle className="w-6 h-6 text-calmPurple" />
              </div>
              <div>
                <p className="text-sm text-white/70">Tasks Completed</p>
                <p className="text-2xl font-bold text-white">
                  {loading ? "..." : stats.tasksCompleted}
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="transform-gpu">
          <GlassCard>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-softBlue/20 rounded-xl">
                <Clock className="w-6 h-6 text-softBlue" />
              </div>
              <div>
                <p className="text-sm text-white/70">Study Time</p>
                <p className="text-2xl font-bold text-white">
                  {loading ? "..." : `${stats.studyTime} min`}
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="transform-gpu">
          <GlassCard>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-calmPurple/20 rounded-xl">
                <Trophy className="w-6 h-6 text-calmPurple" />
              </div>
              <div>
                <p className="text-sm text-white/70">Points</p>
                <p className="text-2xl font-bold text-white">
                  {loading ? "..." : stats.points}
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <h2 className="text-2xl font-bold text-white mb-4">
            Today&apos;s Tasks
          </h2>
          <div className="space-y-3">
            {loading ? (
              <p className="text-white/50 text-center py-4">Loading...</p>
            ) : tasks.length > 0 ? (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 bg-white/10 rounded-lg"
                >
                  <input
                    type="checkbox"
                    className="w-5 h-5"
                    checked={task.status === "COMPLETED"}
                    readOnly
                  />
                  <span
                    className={
                      task.status === "COMPLETED"
                        ? "text-white line-through text-white/50"
                        : "text-white"
                    }
                  >
                    {task.title}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-white/50 text-center py-4">
                No tasks for today. Create one to get started!
              </p>
            )}
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="text-2xl font-bold text-white mb-4">
            Upcoming Exams
          </h2>
          <div className="space-y-3">
            {loading ? (
              <p className="text-white/50 text-center py-4">Loading...</p>
            ) : exams.length > 0 ? (
              exams.map((exam) => {
                const daysUntil = getDaysUntil(exam.date)
                return (
                  <div
                    key={exam.id}
                    className="p-4 bg-white/10 rounded-lg"
                  >
                    <p className="font-semibold text-white">{exam.title}</p>
                    <p className="text-sm text-white/70">
                      {daysUntil} {daysUntil === 1 ? "day" : "days"} remaining
                    </p>
                  </div>
                )
              })
            ) : (
              <p className="text-white/50 text-center py-4">
                No upcoming exams. Add one to track your schedule!
              </p>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

