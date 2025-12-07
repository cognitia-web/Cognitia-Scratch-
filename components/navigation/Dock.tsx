"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  CheckSquare,
  BookOpen,
  Dumbbell,
  GraduationCap,
  Focus,
  User,
} from "lucide-react"
import GlassSurface from "@/components/glass/GlassSurface"
import { motion } from "framer-motion"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
  { name: "Study", href: "/dashboard/study", icon: BookOpen },
  { name: "Workout", href: "/dashboard/workout", icon: Dumbbell },
  { name: "Courses", href: "/dashboard/courses", icon: GraduationCap },
  { name: "Focus", href: "/dashboard/focus", icon: Focus },
  { name: "Profile", href: "/dashboard/profile", icon: User },
]

export default function Dock() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50">
      <GlassSurface className="px-3 sm:px-4 py-2 sm:py-3 backdrop-blur-xl border-white/10 shadow-2xl">
        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <motion.div
                key={item.name}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={item.href}
                  className={`
                    relative flex items-center justify-center
                    w-10 h-10 sm:w-12 sm:h-12 rounded-xl
                    transition-all duration-300
                    ${isActive 
                      ? "bg-gradient-to-br from-softBlue/30 to-calmPurple/30 scale-110" 
                      : "hover:bg-gray-700/50"
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${isActive ? "text-softBlue" : "text-white/70 hover:text-white"}`} />
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-br from-softBlue/20 to-calmPurple/20 rounded-xl -z-10 border border-softBlue/30"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              </motion.div>
            )
          })}
        </nav>
      </GlassSurface>
    </div>
  )
}


