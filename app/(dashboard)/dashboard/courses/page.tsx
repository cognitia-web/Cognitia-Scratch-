"use client"

import { useState, useEffect } from "react"
import GlassCard from "@/components/glass/GlassCard"
import { BookOpen, Play, CheckCircle, Award } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

interface Course {
  id: string
  title: string
  description: string
  category: string
  level: string
  duration: number
  thumbnail?: string
  progress?: {
    progress: number
    completedLessons: number
  }
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [myCourses, setMyCourses] = useState<Course[]>([])

  useEffect(() => {
    fetchCourses()
    fetchMyCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const { apiRequest } = await import("@/lib/api-client")
      const data = await apiRequest("/api/courses")
      setCourses(data)
    } catch (error) {
      console.error("Failed to fetch courses:", error)
    }
  }

  const fetchMyCourses = async () => {
    try {
      const { apiRequest } = await import("@/lib/api-client")
      const data = await apiRequest("/api/courses/my-progress")
      setMyCourses(data)
    } catch (error) {
      console.error("Failed to fetch my courses:", error)
    }
  }

  const categories = [
    { name: "All", value: "ALL" },
    { name: "Coding", value: "CODING" },
    { name: "AI", value: "AI" },
    { name: "Guitar", value: "GUITAR" },
    { name: "Drawing", value: "DRAWING" },
    { name: "Productivity", value: "PRODUCTIVITY" },
  ]

  return (
    <div className="space-y-6 md:space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 md:mb-8"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-2 md:mb-4 leading-tight bg-gradient-to-r from-softBlue to-calmPurple bg-clip-text text-transparent">
          Life Skill Courses
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-white/60 font-medium">
          Learn new skills and track your progress
        </p>
      </motion.div>

      {myCourses.length > 0 && (
        <GlassCard>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-softBlue/20 to-calmPurple/20 rounded-lg">
              <BookOpen className="w-5 h-5 text-softBlue" />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white">My Courses</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myCourses.map((course) => (
              <Link
                key={course.id}
                href={`/dashboard/courses/${course.id}`}
                className="block"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-softBlue/20 rounded-lg">
                      <BookOpen className="w-5 h-5 text-softBlue" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{course.title}</h3>
                      <p className="text-xs text-white/60">{course.category}</p>
                    </div>
                  </div>
                  {course.progress && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-white/60">Progress</span>
                        <span className="text-xs font-semibold text-white">
                          {Math.round(course.progress.progress)}%
                        </span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div
                          className="bg-softBlue h-2 rounded-full transition-all"
                          style={{ width: `${course.progress.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              </Link>
            ))}
          </div>
        </GlassCard>
      )}

        <GlassCard>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-calmPurple/20 to-softBlue/20 rounded-lg">
              <Award className="w-5 h-5 text-calmPurple" />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white">Available Courses</h2>
          </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/dashboard/courses/${course.id}`}>
                <div className="p-6 bg-white/10 rounded-lg hover:bg-white/20 transition-colors cursor-pointer h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-calmPurple/20 rounded-xl">
                      <BookOpen className="w-6 h-6 text-calmPurple" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-lg">{course.title}</h3>
                      <p className="text-xs text-white/60 uppercase">{course.category}</p>
                    </div>
                  </div>
                  <p className="text-sm text-white/70 mb-4 flex-1">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/20">
                    <span className="text-xs text-white/60">
                      {course.duration} hours
                    </span>
                    <span className="text-xs px-2 py-1 bg-gradient-to-r from-softBlue/20 to-calmPurple/20 text-white rounded-lg border border-white/10">
                      {course.level}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        {courses.length === 0 && (
          <p className="text-center text-white/50 py-8">
            No courses available yet. Check back soon!
          </p>
        )}
      </GlassCard>
    </div>
  )
}

