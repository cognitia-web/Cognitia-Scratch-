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
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Clock,
  Award,
  Play,
  ChevronRight,
  Quote
} from "lucide-react"
import { motion } from "framer-motion"

export default function LandingPage() {

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0a] text-white">
      <AuroraBackground />
      
      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-50 flex items-center justify-between px-4 sm:px-6 md:px-12 py-4 md:py-6 backdrop-blur-sm bg-black/20 border-b border-white/5"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="text-2xl md:text-3xl font-black bg-gradient-to-r from-softBlue via-calmPurple to-softBlue bg-clip-text text-transparent tracking-tight"
        >
          Cognitia
        </motion.div>
        <div className="flex items-center gap-3 md:gap-6">
          <Link
            href="/auth/signin"
            className="text-sm md:text-base text-white/80 hover:text-white font-medium transition-all duration-200 hover:scale-105"
          >
            Sign In
          </Link>
          <GlassButton 
            variant="gradient" 
            size="md"
            asChild
            className="group relative overflow-hidden"
          >
            <Link href="/auth/signup" className="flex items-center gap-2">
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </GlassButton>
        </div>
      </motion.nav>

      {/* Hero Section - Redesigned with Strong Typography */}
      <section className="relative z-10 px-4 sm:px-6 md:px-12 py-16 md:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto">
          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-3 md:gap-6 mb-8 md:mb-12"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-softBlue/20 to-calmPurple/20 border border-softBlue/30 backdrop-blur-sm">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-xs md:text-sm font-semibold text-white">4.9/5 Rating</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-calmPurple/20 to-softBlue/20 border border-calmPurple/30 backdrop-blur-sm">
              <Users className="w-4 h-4 text-softBlue" />
              <span className="text-xs md:text-sm font-semibold text-white">50K+ Students</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-softBlue/20 to-calmPurple/20 border border-softBlue/30 backdrop-blur-sm">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-xs md:text-sm font-semibold text-white">95% Success Rate</span>
            </div>
          </motion.div>

          {/* Main Headline - Strong Typography Hierarchy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-center mb-6 md:mb-8"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-[1.1] tracking-tight mb-4 md:mb-6">
              Study Smarter,
              <br />
              <span className="bg-gradient-to-r from-softBlue via-calmPurple to-softBlue bg-clip-text text-transparent animate-gradient">
                Achieve More
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/60 font-medium max-w-3xl mx-auto leading-relaxed">
              The AI-powered platform that helps students build habits, master skills, and stay consistent—proven by thousands of successful learners.
            </p>
          </motion.div>

          {/* CTA Buttons with Better Spacing */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mb-12 md:mb-16"
          >
            <GlassButton 
              size="lg" 
              variant="gradient"
              asChild
              className="group w-full sm:w-auto min-w-[200px]"
            >
              <Link href="/auth/signup" className="flex items-center justify-center gap-2">
                <span className="font-bold">Start Free Trial</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </GlassButton>
            <GlassButton 
              variant="ghost" 
              size="lg"
              asChild
              className="group w-full sm:w-auto"
            >
              <Link href="#demo" className="flex items-center justify-center gap-2">
                <Play className="w-5 h-5" />
                <span className="font-semibold">Watch Demo</span>
              </Link>
            </GlassButton>
          </motion.div>

          {/* Social Proof Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-softBlue to-calmPurple bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-white/60 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Demo Preview Section - Unique Structure */}
      <section id="demo" className="relative z-10 px-4 sm:px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 md:mb-6 leading-tight">
              See It In Action
            </h2>
            <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto">
              Watch how thousands of students are transforming their study habits
            </p>
          </motion.div>

          {/* Mock Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-softBlue/10 via-calmPurple/10 to-softBlue/10" />
            <div className="relative p-4 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {demoCards.map((card, index) => (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 md:p-6 bg-gray-800/50 border border-gray-700/50 rounded-xl hover:border-softBlue/50 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-gradient-to-br from-softBlue/20 to-calmPurple/20 rounded-lg">
                        <card.icon className="w-5 h-5 text-softBlue" />
                      </div>
                      <h3 className="font-bold text-white text-sm md:text-base">{card.title}</h3>
                    </div>
                    <div className="text-2xl md:text-3xl font-black text-white mb-1">{card.value}</div>
                    <div className="text-xs md:text-sm text-white/50">{card.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section - Redesigned with Better Visual Hierarchy */}
      <section id="features" className="relative z-10 px-4 sm:px-6 md:px-12 py-16 md:py-24 bg-gradient-to-b from-transparent via-black/20 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-20"
          >
            <div className="inline-block px-4 py-2 rounded-full bg-softBlue/10 border border-softBlue/30 mb-4 md:mb-6">
              <span className="text-sm md:text-base font-semibold text-softBlue">Powerful Features</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 md:mb-6 leading-tight">
              Everything You Need to
              <br />
              <span className="bg-gradient-to-r from-softBlue to-calmPurple bg-clip-text text-transparent">
                Excel Academically
              </span>
            </h2>
            <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto">
              Built by students, for students. Every feature is designed to help you succeed.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative p-6 md:p-8 bg-gray-800/50 border border-gray-700/50 rounded-2xl hover:border-softBlue/50 transition-all duration-300 hover:shadow-2xl hover:shadow-softBlue/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-softBlue/5 to-calmPurple/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="p-3 md:p-4 bg-gradient-to-br from-softBlue/20 to-calmPurple/20 rounded-xl w-fit mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 md:w-8 md:h-8 text-softBlue" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-white mb-3 md:mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-sm md:text-base text-white/60 leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  <div className="flex items-center gap-2 text-softBlue font-semibold text-sm md:text-base group-hover:gap-3 transition-all">
                    <span>Learn more</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Trust Building */}
      <section className="relative z-10 px-4 sm:px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-20"
          >
            <div className="inline-block px-4 py-2 rounded-full bg-calmPurple/10 border border-calmPurple/30 mb-4 md:mb-6">
              <span className="text-sm md:text-base font-semibold text-calmPurple">Real Results</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 md:mb-6 leading-tight">
              Loved by Students
              <br />
              <span className="bg-gradient-to-r from-calmPurple to-softBlue bg-clip-text text-transparent">
                Trusted by Thousands
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 md:p-8 bg-gray-800/50 border border-gray-700/50 rounded-2xl hover:border-softBlue/50 transition-all duration-300"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-softBlue/50 mb-4" />
                <p className="text-white/80 mb-6 leading-relaxed text-sm md:text-base">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-softBlue to-calmPurple flex items-center justify-center text-white font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm md:text-base">{testimonial.name}</div>
                    <div className="text-xs md:text-sm text-white/50">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section - Redesigned */}
      <section className="relative z-10 px-4 sm:px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative p-8 md:p-16 rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-softBlue/20 via-calmPurple/20 to-softBlue/20 backdrop-blur-xl"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(110,205,254,0.1),transparent_70%)]" />
            <div className="relative z-10 text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 md:mb-6 leading-tight">
                Ready to Transform
                <br />
                Your Study Journey?
              </h2>
              <p className="text-lg md:text-xl text-white/70 mb-8 md:mb-12 max-w-2xl mx-auto">
                Join 50,000+ students who are already achieving their academic goals. Start your free trial today—no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
                <GlassButton 
                  size="lg" 
                  variant="gradient"
                  asChild
                  className="group w-full sm:w-auto min-w-[240px]"
                >
                  <Link href="/auth/signup" className="flex items-center justify-center gap-2">
                    <span className="font-bold">Get Started for Free</span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </GlassButton>
                <div className="flex items-center gap-2 text-white/60 text-sm md:text-base">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>No credit card required</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-4 sm:px-6 md:px-12 py-8 md:py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-white/60 text-sm md:text-base">
            © 2024 Cognitia. All rights reserved.
          </div>
          <div className="flex items-center gap-4 md:gap-6 text-white/60 text-sm md:text-base">
            <Link href="#" className="hover:text-white transition-colors font-medium">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors font-medium">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors font-medium">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

const stats = [
  { value: "50K+", label: "Active Students" },
  { value: "2M+", label: "Tasks Completed" },
  { value: "95%", label: "Success Rate" },
  { value: "4.9/5", label: "Average Rating" },
]

const demoCards = [
  { icon: Trophy, title: "Points Earned", value: "12,450", label: "This month" },
  { icon: Target, title: "Streak", value: "47", label: "Days in a row" },
  { icon: CheckCircle, title: "Tasks Done", value: "234", label: "This week" },
]

const features = [
  {
    icon: Brain,
    title: "AI Study Assistant",
    description: "Get instant help with homework, explanations, and personalized study plans powered by advanced AI that understands your learning style."
  },
  {
    icon: Target,
    title: "Habit Tracking",
    description: "Build consistent study habits with streak tracking, daily reminders, and visual progress indicators that keep you motivated."
  },
  {
    icon: BookOpen,
    title: "Smart Flashcards",
    description: "Master any subject with spaced repetition algorithms and AI-generated flashcards that adapt to your learning pace."
  },
  {
    icon: Trophy,
    title: "Reward System",
    description: "Earn points for completed tasks and convert them to real rewards. Turn your study time into tangible benefits."
  },
  {
    icon: Zap,
    title: "Focus Mode",
    description: "Stay focused with Pomodoro timers, distraction-free study sessions, and productivity analytics that show your progress."
  },
  {
    icon: CheckCircle,
    title: "Task Management",
    description: "Organize your studies with drag-and-drop task lists, priority settings, and smart scheduling that fits your routine."
  },
]

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Computer Science Student",
    text: "Cognitia transformed how I study. The AI assistant helps me understand concepts I've been struggling with for weeks. My grades improved by a full letter!"
  },
  {
    name: "Marcus Johnson",
    role: "Pre-Med Student",
    text: "The habit tracking feature is a game-changer. I've maintained a 60-day streak and my productivity has never been higher. Highly recommend!"
  },
  {
    name: "Emily Rodriguez",
    role: "Engineering Student",
    text: "The reward system actually motivates me to study more. I've earned enough points to get a gift card, and the flashcards are incredibly effective."
  },
]
