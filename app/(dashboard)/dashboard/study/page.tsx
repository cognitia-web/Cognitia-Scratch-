"use client"

import { useState, useEffect, useRef } from "react"
import GlassCard from "@/components/glass/GlassCard"
import GlassButton from "@/components/glass/GlassButton"
import { Send, Plus, Calendar, BookOpen } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import GlassModal from "@/components/glass/GlassModal"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface Exam {
  id: string
  name: string
  date: string
  notes?: string
}

export default function StudyPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [exams, setExams] = useState<Exam[]>([])
  const [flashcards, setFlashcards] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<"chat" | "exams" | "flashcards">("chat")
  const [showExamModal, setShowExamModal] = useState(false)
  const [showFlashcardModal, setShowFlashcardModal] = useState(false)
  const [examForm, setExamForm] = useState({ title: "", subject: "", date: "" })
  const [flashcardForm, setFlashcardForm] = useState({ question: "", answer: "" })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchExams()
    fetchFlashcards()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const fetchExams = async () => {
    try {
      const { apiRequest } = await import("@/lib/api-client")
      const data = await apiRequest("/api/exams")
      // Map the data to match our interface
      setExams(data.map((exam: any) => ({
        id: exam.id,
        name: exam.title || exam.name, // Support both title and name
        date: exam.date,
        notes: exam.notes || exam.subject,
      })))
    } catch (error) {
      console.error("Failed to fetch exams:", error)
    }
  }

  const fetchFlashcards = async () => {
    try {
      const { apiRequest } = await import("@/lib/api-client")
      const data = await apiRequest("/api/flashcards")
      setFlashcards(data)
    } catch (error) {
      console.error("Failed to fetch flashcards:", error)
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return

    const messageContent = input.trim()
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageContent,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const { apiRequest } = await import("@/lib/api-client")
      const data = await apiRequest("/api/study/chat", {
        method: "POST",
        body: JSON.stringify({ message: messageContent }),
      })

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || "I'm sorry, I couldn't process that request.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Failed to send message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">AI Study Assistant</h1>
        <p className="text-white/70">Get help with your studies, plan exams, and review flashcards</p>
      </div>

      <div className="flex gap-2 mb-4">
        <GlassButton
          variant={activeTab === "chat" ? "gradient" : "ghost"}
          onClick={() => setActiveTab("chat")}
        >
          Chat
        </GlassButton>
        <GlassButton
          variant={activeTab === "exams" ? "gradient" : "ghost"}
          onClick={() => setActiveTab("exams")}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Exams
        </GlassButton>
        <GlassButton
          variant={activeTab === "flashcards" ? "gradient" : "ghost"}
          onClick={() => setActiveTab("flashcards")}
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Flashcards
        </GlassButton>
      </div>

      {activeTab === "chat" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlassCard className="lg:col-span-2">
            <div className="flex flex-col h-[600px]">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-2xl ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-softBlue to-softBlue/80 text-white shadow-lg shadow-softBlue/20"
                            : "bg-gray-800 text-white border border-gray-700"
                        }`}
                      >
                        <p>{message.content}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-softBlue rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-softBlue rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                        <div className="w-2 h-2 bg-softBlue rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-4 border-t border-gray-700">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Ask a question..."
                    className="flex-1"
                  />
                  <GlassButton variant="gradient" onClick={handleSendMessage} disabled={loading}>
                    <Send className="w-4 h-4" />
                  </GlassButton>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <GlassButton
                variant="ghost"
                className="w-full justify-start text-white hover:text-white"
                onClick={async () => {
                  const message = "Generate a study plan for my upcoming exams"
                  const userMessage: Message = {
                    id: Date.now().toString(),
                    role: "user",
                    content: message,
                    timestamp: new Date(),
                  }
                  setMessages((prev) => [...prev, userMessage])
                  setLoading(true)
                  try {
                    const { apiRequest } = await import("@/lib/api-client")
                    const data = await apiRequest("/api/study/chat", {
                      method: "POST",
                      body: JSON.stringify({ message }),
                    })
                    const assistantMessage: Message = {
                      id: (Date.now() + 1).toString(),
                      role: "assistant",
                      content: data.response || "I'm sorry, I couldn't process that request.",
                      timestamp: new Date(),
                    }
                    setMessages((prev) => [...prev, assistantMessage])
                  } catch (error) {
                    console.error("Failed to send message:", error)
                    const errorMessage: Message = {
                      id: (Date.now() + 1).toString(),
                      role: "assistant",
                      content: "Sorry, I encountered an error. Please try again.",
                      timestamp: new Date(),
                    }
                    setMessages((prev) => [...prev, errorMessage])
                  } finally {
                    setLoading(false)
                  }
                }}
              >
                Generate Study Plan
              </GlassButton>
              <GlassButton
                variant="ghost"
                className="w-full justify-start text-white hover:text-white"
                onClick={async () => {
                  const message = "Explain this concept: [your topic]"
                  const userMessage: Message = {
                    id: Date.now().toString(),
                    role: "user",
                    content: message,
                    timestamp: new Date(),
                  }
                  setMessages((prev) => [...prev, userMessage])
                  setLoading(true)
                  try {
                    const { apiRequest } = await import("@/lib/api-client")
                    const data = await apiRequest("/api/study/chat", {
                      method: "POST",
                      body: JSON.stringify({ message }),
                    })
                    const assistantMessage: Message = {
                      id: (Date.now() + 1).toString(),
                      role: "assistant",
                      content: data.response || "I'm sorry, I couldn't process that request.",
                      timestamp: new Date(),
                    }
                    setMessages((prev) => [...prev, assistantMessage])
                  } catch (error) {
                    console.error("Failed to send message:", error)
                    const errorMessage: Message = {
                      id: (Date.now() + 1).toString(),
                      role: "assistant",
                      content: "Sorry, I encountered an error. Please try again.",
                      timestamp: new Date(),
                    }
                    setMessages((prev) => [...prev, errorMessage])
                  } finally {
                    setLoading(false)
                  }
                }}
              >
                Explain Concept
              </GlassButton>
              <GlassButton
                variant="ghost"
                className="w-full justify-start text-white hover:text-white"
                onClick={async () => {
                  const message = "Create flashcards for: [your topic]"
                  const userMessage: Message = {
                    id: Date.now().toString(),
                    role: "user",
                    content: message,
                    timestamp: new Date(),
                  }
                  setMessages((prev) => [...prev, userMessage])
                  setLoading(true)
                  try {
                    const { apiRequest } = await import("@/lib/api-client")
                    const data = await apiRequest("/api/study/chat", {
                      method: "POST",
                      body: JSON.stringify({ message }),
                    })
                    const assistantMessage: Message = {
                      id: (Date.now() + 1).toString(),
                      role: "assistant",
                      content: data.response || "I'm sorry, I couldn't process that request.",
                      timestamp: new Date(),
                    }
                    setMessages((prev) => [...prev, assistantMessage])
                  } catch (error) {
                    console.error("Failed to send message:", error)
                    const errorMessage: Message = {
                      id: (Date.now() + 1).toString(),
                      role: "assistant",
                      content: "Sorry, I encountered an error. Please try again.",
                      timestamp: new Date(),
                    }
                    setMessages((prev) => [...prev, errorMessage])
                  } finally {
                    setLoading(false)
                  }
                }}
              >
                Create Flashcards
              </GlassButton>
            </div>
          </GlassCard>
        </div>
      )}

      {activeTab === "exams" && (
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Upcoming Exams</h2>
            <GlassButton variant="gradient" onClick={() => setShowExamModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Exam
            </GlassButton>
          </div>
          <div className="space-y-3">
            {exams.map((exam) => {
              const daysUntil = Math.ceil(
                (new Date(exam.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              )
              return (
                <div
                  key={exam.id}
                  className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">{exam.name}</p>
                      {exam.notes && (
                        <p className="text-sm text-white/60">{exam.notes}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold bg-gradient-to-r from-softBlue to-calmPurple bg-clip-text text-transparent">{daysUntil} days</p>
                      <p className="text-xs text-white/40">
                        {new Date(exam.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
            {exams.length === 0 && (
              <p className="text-center text-white/50 py-8">
                No exams scheduled. Add one to get started!
              </p>
            )}
          </div>
        </GlassCard>
      )}

      {activeTab === "flashcards" && (
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Flashcards</h2>
            <GlassButton variant="gradient" onClick={() => setShowFlashcardModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Flashcard
            </GlassButton>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {flashcards.map((card) => (
              <div
                key={card.id}
                className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer border border-white/10"
              >
                <p className="font-semibold text-white mb-2">{card.front || card.question}</p>
                <p className="text-sm text-white/60">{card.back || card.answer}</p>
              </div>
            ))}
            {flashcards.length === 0 && (
              <p className="col-span-full text-center text-white/50 py-8">
                No flashcards yet. Create one to start studying!
              </p>
            )}
          </div>
        </GlassCard>
      )}

      <GlassModal
        isOpen={showExamModal}
        onClose={() => {
          setShowExamModal(false)
          setExamForm({ title: "", subject: "", date: "" })
        }}
        title="Add Exam"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Exam Title
            </label>
            <Input
              value={examForm.title}
              onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
              placeholder="e.g., Math Final"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Subject
            </label>
            <Input
              value={examForm.subject}
              onChange={(e) => setExamForm({ ...examForm, subject: e.target.value })}
              placeholder="e.g., Mathematics"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Date
            </label>
            <Input
              type="date"
              value={examForm.date}
              onChange={(e) => setExamForm({ ...examForm, date: e.target.value })}
            />
          </div>
          <div className="flex gap-2 pt-4">
            <GlassButton
              variant="gradient"
              className="flex-1"
              onClick={async () => {
                try {
                  const { apiRequest } = await import("@/lib/api-client")
                  await apiRequest("/api/exams", {
                    method: "POST",
                    body: JSON.stringify({
                      title: examForm.title,
                      subject: examForm.subject || "General",
                      date: examForm.date,
                      notes: examForm.subject || null,
                    }),
                  })
                  await fetchExams()
                  setShowExamModal(false)
                  setExamForm({ title: "", subject: "", date: "" })
                  // Trigger custom event to update dashboard
                  window.dispatchEvent(new Event('taskUpdated'))
                } catch (error) {
                  console.error("Failed to create exam:", error)
                }
              }}
            >
              Add Exam
            </GlassButton>
            <GlassButton
              variant="ghost"
              onClick={() => {
                setShowExamModal(false)
                setExamForm({ title: "", subject: "", date: "" })
              }}
              className="flex-1"
            >
              Cancel
            </GlassButton>
          </div>
        </div>
      </GlassModal>

      <GlassModal
        isOpen={showFlashcardModal}
        onClose={() => {
          setShowFlashcardModal(false)
          setFlashcardForm({ question: "", answer: "" })
        }}
        title="Create Flashcard"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Question
            </label>
            <Input
              value={flashcardForm.question}
              onChange={(e) => setFlashcardForm({ ...flashcardForm, question: e.target.value })}
              placeholder="Enter the question"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Answer
            </label>
            <Input
              value={flashcardForm.answer}
              onChange={(e) => setFlashcardForm({ ...flashcardForm, answer: e.target.value })}
              placeholder="Enter the answer"
            />
          </div>
          <div className="flex gap-2 pt-4">
            <GlassButton
              variant="gradient"
              className="flex-1"
              onClick={async () => {
                try {
                  if (!flashcardForm.question.trim() || !flashcardForm.answer.trim()) {
                    alert("Please fill in both question and answer")
                    return
                  }

                  const { apiRequest } = await import("@/lib/api-client")
                  await apiRequest("/api/flashcards", {
                    method: "POST",
                    body: JSON.stringify({
                      question: flashcardForm.question,
                      answer: flashcardForm.answer,
                    }),
                  })
                  await fetchFlashcards()
                  setShowFlashcardModal(false)
                  setFlashcardForm({ question: "", answer: "" })
                } catch (error) {
                  console.error("Failed to create flashcard:", error)
                }
              }}
            >
              Create
            </GlassButton>
            <GlassButton
              variant="ghost"
              onClick={() => {
                setShowFlashcardModal(false)
                setFlashcardForm({ question: "", answer: "" })
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

