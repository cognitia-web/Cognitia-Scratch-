"use client"

import { useState, useEffect } from "react"
import GlassCard from "@/components/glass/GlassCard"
import GlassButton from "@/components/glass/GlassButton"
import { Plus, Trash2, Edit, CheckSquare, Target } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import GlassModal from "@/components/glass/GlassModal"
import { Input } from "@/components/ui/input"

interface Task {
  id: string
  title: string
  description?: string
  type: string
  priority: string
  status: string
  dueDate?: string
  order: number
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [habits, setHabits] = useState<any[]>([])
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showHabitModal, setShowHabitModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "STUDY",
    priority: "MEDIUM",
    dueDate: "",
  })
  const [habitForm, setHabitForm] = useState({
    name: "",
    description: "",
  })

  useEffect(() => {
    setLoading(true)
    setError(null)
    Promise.all([fetchTasks(), fetchHabits()])
      .finally(() => setLoading(false))
  }, [])

  const fetchTasks = async () => {
    try {
      const { apiRequest } = await import("@/lib/api-client")
      const data = await apiRequest("/api/tasks")
      if (Array.isArray(data)) {
        setTasks(data)
        setError(null)
      } else {
        console.error("Invalid tasks data:", data)
        setTasks([])
        setError("Failed to load tasks. Invalid data format.")
      }
    } catch (error: any) {
      console.error("Failed to fetch tasks:", error)
      setTasks([])
      const errorMsg = error.message || "Failed to load tasks"
      setError(errorMsg)
      if (error.message?.includes("not authenticated")) {
        setError("Please sign in to view your tasks")
      }
    }
  }

  const fetchHabits = async () => {
    try {
      const { apiRequest } = await import("@/lib/api-client")
      const data = await apiRequest("/api/habits")
      if (Array.isArray(data)) {
        setHabits(data)
      } else {
        console.error("Invalid habits data:", data)
        setHabits([])
      }
    } catch (error: any) {
      console.error("Failed to fetch habits:", error)
      setHabits([])
      // Don't set error state for habits, just log it
    }
  }

  const handleCreateTask = async () => {
    if (!formData.title.trim()) {
      alert("Please enter a task title")
      return
    }

    try {
      const { apiRequest } = await import("@/lib/api-client")
      await apiRequest("/api/tasks", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          dueDate: formData.dueDate || null,
        }),
      })

      await fetchTasks()
      setShowTaskModal(false)
      setFormData({
        title: "",
        description: "",
        type: "STUDY",
        priority: "MEDIUM",
        dueDate: "",
      })
      // Trigger custom event to update dashboard
      window.dispatchEvent(new Event('taskUpdated'))
    } catch (error: any) {
      console.error("Failed to create task:", error)
      alert(error.message || "Failed to create task. Please try again.")
    }
  }

  const handleUpdateTask = async () => {
    if (!editingTask) return

    try {
      const { apiRequest } = await import("@/lib/api-client")
      await apiRequest(`/api/tasks/${editingTask.id}`, {
        method: "PATCH",
        body: JSON.stringify(formData),
      })

      fetchTasks()
      setShowTaskModal(false)
      setEditingTask(null)
      setFormData({
        title: "",
        description: "",
        type: "STUDY",
        priority: "MEDIUM",
        dueDate: "",
      })
    } catch (error) {
      console.error("Failed to update task:", error)
    }
  }

  const handleDeleteTask = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return

    try {
      const { apiRequest } = await import("@/lib/api-client")
      await apiRequest(`/api/tasks/${id}`, {
        method: "DELETE",
      })

      fetchTasks()
    } catch (error) {
      console.error("Failed to delete task:", error)
    }
  }

  const handleToggleTask = async (task: Task) => {
    const newStatus =
      task.status === "COMPLETED" ? "PENDING" : "COMPLETED"
    try {
      const { apiRequest } = await import("@/lib/api-client")
      await apiRequest(`/api/tasks/${task.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      })
      await fetchTasks()
      // Trigger custom event to update dashboard
      window.dispatchEvent(new Event('taskUpdated'))
    } catch (error) {
      console.error("Failed to update task:", error)
      alert("Failed to update task. Please try again.")
    }
  }

  const openEditModal = (task: Task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      description: task.description || "",
      type: task.type,
      priority: task.priority,
      dueDate: task.dueDate || "",
    })
    setShowTaskModal(true)
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-2 md:mb-4 leading-tight bg-gradient-to-r from-softBlue to-calmPurple bg-clip-text text-transparent">
            Tasks & Habits
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/60 font-medium">Manage your daily tasks and build consistent habits</p>
        </div>
        <div className="flex gap-3">
          <GlassButton variant="secondary" onClick={() => setShowHabitModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Habit
          </GlassButton>
          <GlassButton variant="gradient" onClick={() => {
            setEditingTask(null)
            setFormData({
              title: "",
              description: "",
              type: "STUDY",
              priority: "MEDIUM",
              dueDate: "",
            })
            setShowTaskModal(true)
          }}>
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </GlassButton>
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl"
        >
          <p className="text-red-400 text-sm">{error}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-softBlue/20 to-calmPurple/20 rounded-lg">
                <CheckSquare className="w-5 h-5 text-softBlue" />
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white">Tasks</h2>
            </div>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-white/50">Loading tasks...</p>
              </div>
            ) : (
            <div className="space-y-3">
            <AnimatePresence>
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/10"
                >
                  <input
                    type="checkbox"
                    checked={task.status === "COMPLETED"}
                    onChange={() => handleToggleTask(task)}
                    className="w-5 h-5 rounded border-white/30 accent-softBlue"
                  />
                  <div className="flex-1">
                    <p
                      className={
                        task.status === "COMPLETED"
                          ? "line-through text-white/40"
                          : "text-white font-medium"
                      }
                    >
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-sm text-white/60">{task.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(task)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4 text-white/70 hover:text-white" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {tasks.length === 0 && (
              <p className="text-center text-white/50 py-8">
                No tasks yet. Create one to get started!
              </p>
            )}
          </div>
          )}
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-calmPurple/20 to-softBlue/20 rounded-lg">
                <Target className="w-5 h-5 text-calmPurple" />
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white">Habits</h2>
            </div>
            <div className="space-y-3">
            {habits.map((habit) => (
              <div
                key={habit.id}
                className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/10"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-white">{habit.name}</p>
                  <span className="text-sm font-bold bg-gradient-to-r from-softBlue to-calmPurple bg-clip-text text-transparent">
                    {habit.streak} 🔥
                  </span>
                </div>
                {habit.description && (
                  <p className="text-sm text-white/60">{habit.description}</p>
                )}
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-white/40">
                    Longest streak: {habit.longestStreak} days
                  </span>
                </div>
              </div>
            ))}
            {habits.length === 0 && (
              <p className="text-center text-white/50 py-8">
                No habits yet. Create one to build consistency!
              </p>
            )}
          </div>
          </GlassCard>
        </motion.div>
      </div>

      <GlassModal
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false)
          setEditingTask(null)
        }}
        title={editingTask ? "Edit Task" : "Create Task"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Title
            </label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Task title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Description
            </label>
            <Input
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Task description (optional)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="w-full h-10 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-softBlue/50 focus:border-softBlue/50 transition-all"
            >
              <option value="STUDY" className="bg-charcoal">Study</option>
              <option value="WORKOUT" className="bg-charcoal">Workout</option>
              <option value="SKILL" className="bg-charcoal">Skill</option>
              <option value="HABIT" className="bg-charcoal">Habit</option>
              <option value="OTHER" className="bg-charcoal">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
              className="w-full h-10 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-softBlue/50 focus:border-softBlue/50 transition-all"
            >
              <option value="LOW" className="bg-charcoal">Low</option>
              <option value="MEDIUM" className="bg-charcoal">Medium</option>
              <option value="HIGH" className="bg-charcoal">High</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Due Date
            </label>
            <Input
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
            />
          </div>
          <div className="flex gap-2 pt-4">
            <GlassButton
              onClick={editingTask ? handleUpdateTask : handleCreateTask}
              variant="gradient"
              className="flex-1"
            >
              {editingTask ? "Update" : "Create"}
            </GlassButton>
            <GlassButton
              variant="ghost"
              onClick={() => {
                setShowTaskModal(false)
                setEditingTask(null)
              }}
              className="flex-1"
            >
              Cancel
            </GlassButton>
          </div>
        </div>
      </GlassModal>

      <GlassModal
        isOpen={showHabitModal}
        onClose={() => {
          setShowHabitModal(false)
          setHabitForm({ name: "", description: "" })
        }}
        title="Create Habit"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Habit Name
            </label>
            <Input
              value={habitForm.name}
              onChange={(e) => setHabitForm({ ...habitForm, name: e.target.value })}
              placeholder="e.g., Daily Exercise"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Description (Optional)
            </label>
            <Input
              value={habitForm.description}
              onChange={(e) => setHabitForm({ ...habitForm, description: e.target.value })}
              placeholder="Describe your habit"
            />
          </div>
          <div className="flex gap-2 pt-4">
            <GlassButton
              variant="gradient"
              className="flex-1"
              onClick={async () => {
                if (!habitForm.name.trim()) {
                  alert("Please enter a habit name")
                  return
                }

                try {
                  const { apiRequest } = await import("@/lib/api-client")
                  await apiRequest("/api/habits", {
                    method: "POST",
                    body: JSON.stringify(habitForm),
                  })
                  await fetchHabits()
                  setShowHabitModal(false)
                  setHabitForm({ name: "", description: "" })
                  // Trigger custom event to update dashboard
                  window.dispatchEvent(new Event('taskUpdated'))
                } catch (error: any) {
                  console.error("Failed to create habit:", error)
                  alert(error.message || "Failed to create habit. Please try again.")
                }
              }}
            >
              Create Habit
            </GlassButton>
            <GlassButton
              variant="ghost"
              onClick={() => {
                setShowHabitModal(false)
                setHabitForm({ name: "", description: "" })
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

