"use client"

import { useState, useEffect } from "react"
import GlassCard from "@/components/glass/GlassCard"
import GlassButton from "@/components/glass/GlassButton"
import { Plus, Activity, Utensils } from "lucide-react"
import { motion } from "framer-motion"
import VideoRecorder from "@/components/verification/VideoRecorder"
import GlassModal from "@/components/glass/GlassModal"
import { Input } from "@/components/ui/input"

interface Workout {
  id: string
  type: string
  duration: number
  calories?: number
  verified?: boolean
  createdAt: string
}

interface FoodLog {
  id: string
  name: string
  calories: number
  protein?: number
  carbs?: number
  fats?: number
  date: string
}

export default function WorkoutPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([])
  const [activeTab, setActiveTab] = useState<"workout" | "nutrition">("workout")
  const [showWorkoutModal, setShowWorkoutModal] = useState(false)
  const [showFoodModal, setShowFoodModal] = useState(false)
  const [foodForm, setFoodForm] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
  })

  useEffect(() => {
    fetchWorkouts()
    fetchFoodLogs()
  }, [])

  const fetchWorkouts = async () => {
    try {
      const { apiRequest } = await import("@/lib/api-client")
      const data = await apiRequest("/api/workouts")
      setWorkouts(data)
    } catch (error) {
      console.error("Failed to fetch workouts:", error)
    }
  }

  const fetchFoodLogs = async () => {
    try {
      const { apiRequest } = await import("@/lib/api-client")
      const data = await apiRequest("/api/food")
      setFoodLogs(data)
    } catch (error) {
      console.error("Failed to fetch food logs:", error)
    }
  }

  const handleVideoVerification = async (videoBlob: Blob, hash: string) => {
    // Upload video for workout verification
    const formData = new FormData()
    formData.append("video", videoBlob)
    formData.append("hash", hash)
    formData.append("type", "WORKOUT")

    try {
      const { getAuthToken } = await import("@/lib/api-client")
      const token = await getAuthToken()
      
      const res = await fetch("/api/verification", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (res.ok) {
        // Create workout record
        const { apiRequest } = await import("@/lib/api-client")
        await apiRequest("/api/workouts", {
          method: "POST",
          body: JSON.stringify({
            type: "General Workout",
            duration: 20,
            verified: true,
          }),
        })

        await fetchWorkouts()
        setShowWorkoutModal(false)
      }
    } catch (error) {
      console.error("Failed to verify workout:", error)
    }
  }

  // Calculate weekly stats
  const weeklyWorkouts = workouts.filter((w) => {
    const workoutDate = new Date(w.createdAt)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return workoutDate >= weekAgo
  })

  const weeklyCalories = weeklyWorkouts.reduce(
    (sum, w) => sum + (w.calories || 0),
    0
  )

  const weeklyDuration = weeklyWorkouts.reduce((sum, w) => sum + w.duration, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Workout & Health</h1>
        <p className="text-white/70">Track your workouts and nutrition</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-softBlue/20 rounded-xl">
              <Activity className="w-6 h-6 text-softBlue" />
            </div>
            <div>
              <p className="text-sm text-white/70">This Week</p>
              <p className="text-2xl font-bold text-white">
                {weeklyWorkouts.length} workouts
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-calmPurple/20 rounded-xl">
              <Activity className="w-6 h-6 text-calmPurple" />
            </div>
            <div>
              <p className="text-sm text-white/70">Total Time</p>
              <p className="text-2xl font-bold text-white">
                {weeklyDuration} min
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-softBlue/20 rounded-xl">
              <Utensils className="w-6 h-6 text-softBlue" />
            </div>
            <div>
              <p className="text-sm text-white/70">Calories Burned</p>
              <p className="text-2xl font-bold text-white">
                {weeklyCalories} kcal
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="flex gap-2 mb-4">
        <GlassButton
          variant={activeTab === "workout" ? "gradient" : "ghost"}
          onClick={() => setActiveTab("workout")}
        >
          <Activity className="w-4 h-4 mr-2" />
          Workouts
        </GlassButton>
        <GlassButton
          variant={activeTab === "nutrition" ? "gradient" : "ghost"}
          onClick={() => setActiveTab("nutrition")}
        >
          <Utensils className="w-4 h-4 mr-2" />
          Nutrition
        </GlassButton>
      </div>

      {activeTab === "workout" && (
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Workout History</h2>
            <GlassButton variant="gradient" onClick={() => setShowWorkoutModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Log Workout
            </GlassButton>
          </div>
          <div className="space-y-3">
            {workouts.map((workout) => (
              <div
                key={workout.id}
                className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/10"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">{workout.type}</p>
                    <p className="text-sm text-white/60">
                      {workout.duration} minutes
                      {workout.calories && ` • ${workout.calories} kcal`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/40">
                      {new Date(workout.createdAt).toLocaleDateString()}
                    </p>
                    {workout.verified && (
                      <span className="text-xs text-green-400">✓ Verified</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {workouts.length === 0 && (
              <p className="text-center text-white/50 py-8">
                No workouts logged yet. Start tracking your fitness journey!
              </p>
            )}
          </div>
        </GlassCard>
      )}

      {activeTab === "nutrition" && (
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Food Log</h2>
            <GlassButton variant="gradient" onClick={() => setShowFoodModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Food
            </GlassButton>
          </div>
          <div className="space-y-3">
            {foodLogs.map((food) => (
              <div
                key={food.id}
                className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/10"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">{food.name}</p>
                    <p className="text-sm text-white/60">
                      {food.calories} kcal
                      {food.protein && ` • P: ${food.protein}g`}
                      {food.carbs && ` • C: ${food.carbs}g`}
                      {food.fats && ` • F: ${food.fats}g`}
                    </p>
                  </div>
                  <p className="text-xs text-white/40">
                    {new Date(food.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {foodLogs.length === 0 && (
              <p className="text-center text-white/50 py-8">
                No food logged yet. Track your nutrition!
              </p>
            )}
          </div>
        </GlassCard>
      )}

      <GlassModal
        isOpen={showWorkoutModal}
        onClose={() => setShowWorkoutModal(false)}
        title="Verify Workout"
      >
        <VideoRecorder
          onRecordingComplete={handleVideoVerification}
          maxDuration={30}
        />
        <GlassButton
          variant="ghost"
          onClick={() => setShowWorkoutModal(false)}
          className="mt-4 w-full"
        >
          Cancel
        </GlassButton>
      </GlassModal>

      <GlassModal
        isOpen={showFoodModal}
        onClose={() => {
          setShowFoodModal(false)
          setFoodForm({ name: "", calories: "", protein: "", carbs: "", fats: "" })
        }}
        title="Add Food"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Food Name
            </label>
            <Input
              value={foodForm.name}
              onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })}
              placeholder="e.g., Roti"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Calories
            </label>
            <Input
              type="number"
              value={foodForm.calories}
              onChange={(e) => setFoodForm({ ...foodForm, calories: e.target.value })}
              placeholder="Calories"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Protein (g)
              </label>
              <Input
                type="number"
                value={foodForm.protein}
                onChange={(e) => setFoodForm({ ...foodForm, protein: e.target.value })}
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Carbs (g)
              </label>
              <Input
                type="number"
                value={foodForm.carbs}
                onChange={(e) => setFoodForm({ ...foodForm, carbs: e.target.value })}
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Fats (g)
              </label>
              <Input
                type="number"
                value={foodForm.fats}
                onChange={(e) => setFoodForm({ ...foodForm, fats: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <GlassButton
              variant="gradient"
              className="flex-1"
              onClick={async () => {
                try {
                  const { apiRequest } = await import("@/lib/api-client")
                  await apiRequest("/api/food", {
                    method: "POST",
                    body: JSON.stringify({
                      name: foodForm.name,
                      calories: parseInt(foodForm.calories) || 0,
                      protein: foodForm.protein ? parseFloat(foodForm.protein) : undefined,
                      carbs: foodForm.carbs ? parseFloat(foodForm.carbs) : undefined,
                      fats: foodForm.fats ? parseFloat(foodForm.fats) : undefined,
                    }),
                  })
                  await fetchFoodLogs()
                  setShowFoodModal(false)
                  setFoodForm({ name: "", calories: "", protein: "", carbs: "", fats: "" })
                } catch (error) {
                  console.error("Failed to add food:", error)
                }
              }}
            >
              Add Food
            </GlassButton>
            <GlassButton
              variant="ghost"
              onClick={() => {
                setShowFoodModal(false)
                setFoodForm({ name: "", calories: "", protein: "", carbs: "", fats: "" })
              }}
              className="flex-1"
            >
              Cancel
            </GlassButton>
          </div>
        </div>
      </GlassModal>
    </div>
  )
}

