"use client"

import Link from "next/link"
import AuroraBackground from "@/components/backgrounds/AuroraBackground"
import GlassButton from "@/components/glass/GlassButton"
import { 
  ArrowRight, 
  BookOpen, 
  Target, 
  Trophy, 
  Brain, 
  Zap,
  CheckCircle,
  Sparkles
} from "lucide-react"
import { motion } from "framer-motion"

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <AuroraBackground />
      
      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 md:px-12 py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-white"
        >
          Cognitia
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-4"
        >
          <Link
            href="/auth/signin"
            className="text-white/70 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <GlassButton asChild>
            <Link href="/auth/signup" className="flex items-center">
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </GlassButton>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 md:px-12 py-20 md:py-32">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-softBlue" />
            <span className="text-sm text-white/80">AI-Powered Study Companion</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Study Smarter,
            <br />
            <span className="bg-gradient-to-r from-softBlue to-calmPurple bg-clip-text text-transparent">
              Not Harder
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/70 mb-12 max-w-3xl mx-auto"
          >
            Build habits, learn skills, and stay consistent with AI-powered tools designed for students who want to excel.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <GlassButton size="lg" asChild>
              <Link href="/auth/signup">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </GlassButton>
            <GlassButton variant="ghost" size="lg" asChild>
              <Link href="#features">
                Learn More
              </Link>
            </GlassButton>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 md:px-12 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-white/70">
              Powerful tools designed for modern students
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 h-full">
                  <div className="p-3 bg-gradient-to-br from-softBlue/20 to-calmPurple/20 rounded-xl w-fit mb-4">
                    <feature.icon className="w-6 h-6 text-softBlue" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-white/70">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 md:px-12 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center p-12 bg-gradient-to-br from-softBlue/20 via-calmPurple/20 to-softBlue/20 backdrop-blur-xl border border-white/20 rounded-3xl"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Study Habits?
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Join thousands of students who are already achieving their goals
            </p>
            <GlassButton size="lg" asChild>
              <Link href="/auth/signup">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </GlassButton>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 md:px-12 py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="text-white/70 mb-4 md:mb-0">
            © 2024 Cognitia. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-white/70">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    icon: Brain,
    title: "AI Study Assistant",
    description: "Get instant help with homework, explanations, and study plans powered by advanced AI."
  },
  {
    icon: Target,
    title: "Habit Tracking",
    description: "Build consistent study habits with streak tracking and daily reminders."
  },
  {
    icon: BookOpen,
    title: "Smart Flashcards",
    description: "Master any subject with spaced repetition and AI-generated flashcards."
  },
  {
    icon: Trophy,
    title: "Reward System",
    description: "Earn points for completed tasks and convert them to real rewards."
  },
  {
    icon: Zap,
    title: "Focus Mode",
    description: "Stay focused with Pomodoro timers and distraction-free study sessions."
  },
  {
    icon: CheckCircle,
    title: "Task Management",
    description: "Organize your studies with drag-and-drop task lists and priority settings."
  },
]
