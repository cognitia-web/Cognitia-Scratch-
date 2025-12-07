"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import GlassCard from "@/components/glass/GlassCard"
import GlassButton from "@/components/glass/GlassButton"
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react"
import { motion } from "framer-motion"

const POMODORO_DURATION = 25 * 60 // 25 minutes in seconds
const SHORT_BREAK = 5 * 60 // 5 minutes
const LONG_BREAK = 15 * 60 // 15 minutes

const WHITE_NOISE_SOUNDS = [
  { name: "Rain", url: "/sounds/rain.mp3" },
  { name: "Ocean", url: "/sounds/ocean.mp3" },
  { name: "Forest", url: "/sounds/forest.mp3" },
  { name: "Coffee Shop", url: "/sounds/coffee-shop.mp3" },
]

export default function FocusPage() {
  const [time, setTime] = useState(POMODORO_DURATION)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState<"pomodoro" | "shortBreak" | "longBreak">("pomodoro")
  const [sessions, setSessions] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [selectedSound, setSelectedSound] = useState(WHITE_NOISE_SOUNDS[0])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const handleTimerComplete = useCallback(() => {
    setIsRunning(false)
    if (mode === "pomodoro") {
      setSessions((prev) => {
        const newSessions = prev + 1
        // Auto-start short break after 4 sessions, otherwise long break
        if (newSessions >= 4) {
          setMode("longBreak")
          setTime(LONG_BREAK)
          return 0
        } else {
          setMode("shortBreak")
          setTime(SHORT_BREAK)
          return newSessions
        }
      })
    } else {
      setMode("pomodoro")
      setTime(POMODORO_DURATION)
    }
  }, [mode])

  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => {
          if (prev <= 1) {
            handleTimerComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, time, handleTimerComplete])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const resetTimer = () => {
    setIsRunning(false)
    if (mode === "pomodoro") {
      setTime(POMODORO_DURATION)
    } else if (mode === "shortBreak") {
      setTime(SHORT_BREAK)
    } else {
      setTime(LONG_BREAK)
    }
  }

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled)
    if (audioRef.current) {
      if (!soundEnabled) {
        audioRef.current.play().catch(() => {})
      } else {
        audioRef.current.pause()
      }
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
          Focus Mode
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-white/60 font-medium">
          Stay focused with Pomodoro timer and ambient sounds
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2">
          <div className="text-center">
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-6 md:mb-8">
              <GlassButton
                variant={mode === "pomodoro" ? "gradient" : "ghost"}
                size="lg"
                onClick={() => {
                  setMode("pomodoro")
                  setTime(POMODORO_DURATION)
                  setIsRunning(false)
                }}
                className="group"
              >
                <span className="font-semibold">Pomodoro</span>
              </GlassButton>
              <GlassButton
                variant={mode === "shortBreak" ? "gradient" : "ghost"}
                size="lg"
                onClick={() => {
                  setMode("shortBreak")
                  setTime(SHORT_BREAK)
                  setIsRunning(false)
                }}
                className="group"
              >
                <span className="font-semibold">Short Break</span>
              </GlassButton>
              <GlassButton
                variant={mode === "longBreak" ? "gradient" : "ghost"}
                size="lg"
                onClick={() => {
                  setMode("longBreak")
                  setTime(LONG_BREAK)
                  setIsRunning(false)
                }}
                className="group"
              >
                <span className="font-semibold">Long Break</span>
              </GlassButton>
            </div>

            <motion.div
              key={time}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="mb-8"
            >
              <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black bg-gradient-to-r from-softBlue to-calmPurple bg-clip-text text-transparent mb-4 md:mb-6">
                {formatTime(time)}
              </div>
              <p className="text-base sm:text-lg md:text-xl text-white/60 font-medium capitalize">{mode.replace(/([A-Z])/g, " $1")}</p>
            </motion.div>

            <div className="flex justify-center gap-4">
              <GlassButton
                variant="gradient"
                onClick={() => setIsRunning(!isRunning)}
                size="lg"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Start
                  </>
                )}
              </GlassButton>
              <GlassButton variant="ghost" onClick={resetTimer} size="lg">
                <RotateCcw className="w-5 h-5 mr-2" />
                Reset
              </GlassButton>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 p-4 md:p-6 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-softBlue/50 transition-all duration-300"
            >
              <p className="text-sm md:text-base text-white/60 mb-2 font-medium">Sessions Completed Today</p>
              <p className="text-3xl md:text-4xl font-black bg-gradient-to-r from-softBlue to-calmPurple bg-clip-text text-transparent">{sessions}</p>
            </motion.div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-calmPurple/20 to-softBlue/20 rounded-lg">
              <Volume2 className="w-5 h-5 text-calmPurple" />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white">Ambient Sounds</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white">White Noise</span>
              <button
                onClick={toggleSound}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-white" />
                ) : (
                  <VolumeX className="w-5 h-5 text-white/60" />
                )}
              </button>
            </div>
            {WHITE_NOISE_SOUNDS.map((sound) => (
              <button
                key={sound.name}
                onClick={() => {
                  setSelectedSound(sound)
                  if (soundEnabled && audioRef.current) {
                    audioRef.current.src = sound.url
                    audioRef.current.play().catch(() => {})
                  }
                }}
                className={`w-full p-3 rounded-xl transition-colors text-left border ${
                  selectedSound.name === sound.name
                    ? "bg-gradient-to-r from-softBlue/20 to-calmPurple/20 text-white border-gray-600"
                    : "bg-gray-800 text-white/70 hover:bg-gray-750 border-gray-700"
                }`}
              >
                {sound.name}
              </button>
            ))}
            {soundEnabled && (
              <audio
                ref={audioRef}
                src={selectedSound.url}
                loop
                className="hidden"
              />
            )}
          </div>

          <div className="mt-6 p-4 bg-gray-800 rounded-xl border border-gray-700">
            <h3 className="font-semibold text-white mb-2">Focus Tips</h3>
            <ul className="text-sm text-white/70 space-y-1">
              <li>• Remove distractions</li>
              <li>• Take breaks between sessions</li>
              <li>• Stay hydrated</li>
              <li>• Use ambient sounds to focus</li>
            </ul>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

