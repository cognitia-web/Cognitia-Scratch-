"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AuroraBackground from "@/components/backgrounds/AuroraBackground"
import GlassCard from "@/components/glass/GlassCard"
import { Sparkles, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

const inspirationalQuotes = [
  {
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    quote: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt"
  },
  {
    quote: "You are braver than you believe, stronger than you seem, and smarter than you think.",
    author: "A.A. Milne"
  },
  {
    quote: "The only person you are destined to become is the person you decide to be.",
    author: "Ralph Waldo Emerson"
  },
  {
    quote: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson"
  },
  {
    quote: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt"
  },
  {
    quote: "Your limitation—it's only your imagination.",
    author: "Unknown"
  },
  {
    quote: "Great things never come from comfort zones.",
    author: "Unknown"
  },
  {
    quote: "Dream it. Wish it. Do it.",
    author: "Unknown"
  }
]

export default function SignOutPage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)
  const [quote] = useState(() => 
    inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)]
  )

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push("/")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <AuroraBackground />
      <div className="relative z-10 w-full max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard className="text-center p-12">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-softBlue/30 to-calmPurple/30 mb-6"
            >
              <Sparkles className="w-10 h-10 text-softBlue" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold text-white mb-6"
            >
              You've Got This! 💪
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <p className="text-2xl md:text-3xl font-semibold text-white/90 mb-4 italic">
                &ldquo;{quote.quote}&rdquo;
              </p>
              <p className="text-lg text-white/70">
                — {quote.author}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center gap-3 text-white/60"
            >
              <span>Redirecting in {countdown} seconds</span>
              <ArrowRight className="w-4 h-4 animate-pulse" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-8"
            >
              <motion.button
                onClick={() => router.push("/")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-softBlue to-calmPurple text-white rounded-xl font-medium hover:shadow-lg hover:shadow-softBlue/30 transition-all duration-300"
              >
                Go to Home
              </motion.button>
            </motion.div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}

