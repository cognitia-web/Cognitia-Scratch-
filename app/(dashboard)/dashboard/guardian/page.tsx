"use client"

import { useState, useEffect } from "react"
import GlassCard from "@/components/glass/GlassCard"
import { Users, Calendar, TrendingUp } from "lucide-react"

interface Report {
  id: string
  date: string
  studyTime: number
  tasksCompleted: number
  streaks: number
  upcomingExams: any
  user: {
    name: string
    email: string
  }
}

export default function GuardianPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [students, setStudents] = useState<any[]>([])

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const { apiRequest } = await import("@/lib/api-client")
      const data = await apiRequest("/api/guardian/reports")
      setReports(data.reports || [])
      setStudents(data.students || [])
    } catch (error) {
      console.error("Failed to fetch reports:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Guardian Dashboard</h1>
        <p className="text-white/70">View progress reports for your students</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-softBlue/20 rounded-xl">
              <Users className="w-6 h-6 text-softBlue" />
            </div>
              <div>
                <p className="text-sm text-white/70">Linked Students</p>
                <p className="text-2xl font-bold text-white">
                  {students.length}
                </p>
              </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-calmPurple/20 rounded-xl">
              <Calendar className="w-6 h-6 text-calmPurple" />
            </div>
              <div>
                <p className="text-sm text-white/70">Reports Available</p>
                <p className="text-2xl font-bold text-white">
                  {reports.length}
                </p>
              </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-softBlue/20 rounded-xl">
              <TrendingUp className="w-6 h-6 text-softBlue" />
            </div>
              <div>
                <p className="text-sm text-white/70">Average Study Time</p>
                <p className="text-2xl font-bold text-white">
                  {reports.length > 0
                    ? Math.round(
                        reports.reduce((sum, r) => sum + r.studyTime, 0) /
                          reports.length
                      )
                    : 0}{" "}
                min
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

        <GlassCard>
          <h2 className="text-2xl font-bold text-white mb-4">Daily Reports</h2>
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/10"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-white">
                      {report.user.name || report.user.email}
                    </p>
                    <p className="text-sm text-white/60">
                      {new Date(report.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-white/60">Study Time</p>
                    <p className="font-semibold text-white">
                      {report.studyTime} min
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-white/60">Tasks Completed</p>
                    <p className="font-semibold text-white">
                      {report.tasksCompleted}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-white/60">Active Streaks</p>
                    <p className="font-semibold text-white">
                      {report.streaks}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-white/60">Upcoming Exams</p>
                    <p className="font-semibold text-white">
                      {Array.isArray(report.upcomingExams)
                        ? report.upcomingExams.length
                        : 0}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {reports.length === 0 && (
              <p className="text-center text-white/50 py-8">
                No reports available yet. Reports are generated daily for students with linked guardians.
              </p>
            )}
          </div>
        </GlassCard>
    </div>
  )
}

