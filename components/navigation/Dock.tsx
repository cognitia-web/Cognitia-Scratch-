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
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <GlassSurface className="px-4 py-3">
        <nav className="flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  relative flex items-center justify-center
                  w-12 h-12 rounded-xl
                  transition-all duration-200
                  ${isActive 
                    ? "bg-white/30 scale-110" 
                    : "hover:bg-white/20 hover:scale-105"
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-white/70"}`} />
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white/30 rounded-xl -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            )
          })}
        </nav>
      </GlassSurface>
    </div>
  )
}


