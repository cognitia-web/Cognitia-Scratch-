"use client"

import { useState, useEffect, useRef } from "react"
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

  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev - 1)
      }, 1000)
    } else if (time === 0) {
      handleTimerComplete()
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, time])

  const handleTimerComplete = () => {
    setIsRunning(false)
    if (mode === "pomodoro") {
      setSessions((prev) => prev + 1)
      // Auto-start short break after 4 sessions, otherwise long break
      if (sessions + 1 >= 4) {
        setMode("longBreak")
        setTime(LONG_BREAK)
        setSessions(0)
      } else {
        setMode("shortBreak")
        setTime(SHORT_BREAK)
      }
    } else {
      setMode("pomodoro")
      setTime(POMODORO_DURATION)
    }
  }

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
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Focus Mode</h1>
        <p className="text-white/70">Stay focused with Pomodoro timer and ambient sounds</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2">
          <div className="text-center">
            <div className="flex justify-center gap-4 mb-6">
              <GlassButton
                variant={mode === "pomodoro" ? "gradient" : "ghost"}
                onClick={() => {
                  setMode("pomodoro")
                  setTime(POMODORO_DURATION)
                  setIsRunning(false)
                }}
              >
                Pomodoro
              </GlassButton>
              <GlassButton
                variant={mode === "shortBreak" ? "gradient" : "ghost"}
                onClick={() => {
                  setMode("shortBreak")
                  setTime(SHORT_BREAK)
                  setIsRunning(false)
                }}
              >
                Short Break
              </GlassButton>
              <GlassButton
                variant={mode === "longBreak" ? "gradient" : "ghost"}
                onClick={() => {
                  setMode("longBreak")
                  setTime(LONG_BREAK)
                  setIsRunning(false)
                }}
              >
                Long Break
              </GlassButton>
            </div>

            <motion.div
              key={time}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="mb-8"
            >
              <div className="text-8xl font-bold bg-gradient-to-r from-softBlue to-calmPurple bg-clip-text text-transparent mb-4">
                {formatTime(time)}
              </div>
              <p className="text-white/70 capitalize">{mode.replace(/([A-Z])/g, " $1")}</p>
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

            <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-sm text-white/70 mb-2">Sessions Completed Today</p>
              <p className="text-3xl font-bold text-white">{sessions}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="text-2xl font-bold text-white mb-4">Ambient Sounds</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white">White Noise</span>
              <button
                onClick={toggleSound}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
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
                    ? "bg-gradient-to-r from-softBlue/20 to-calmPurple/20 text-white border-white/30"
                    : "bg-white/5 text-white/70 hover:bg-white/10 border-white/10"
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

          <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
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

