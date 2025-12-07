"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import AuroraBackground from "@/components/backgrounds/AuroraBackground"
import GlassCard from "@/components/glass/GlassCard"
import GlassButton from "@/components/glass/GlassButton"
import { Input } from "@/components/ui/input"
import { NumberInput } from "@/components/ui/number-input"
import GlassModal from "@/components/glass/GlassModal"
import { Sparkles, Mail, Lock, User, Calendar } from "lucide-react"

export default function SignUpPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
  })
  const [showAgeModal, setShowAgeModal] = useState(false)
  const [showGuardianModal, setShowGuardianModal] = useState(false)
  const [guardianEmail, setGuardianEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const age = formData.age ? parseInt(formData.age) : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (age < 16 && age > 0) {
      setShowGuardianModal(true)
      return
    }

    if (age < 13) {
      setError("Users must be at least 13 years old")
      return
    }

    setLoading(true)

    try {
      const { signUp } = await import("@/lib/firebase/auth")
      await signUp(
        formData.email,
        formData.password,
        formData.name,
        parseInt(formData.age),
        age < 16 ? guardianEmail : undefined
      )
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <AuroraBackground />
      <div className="relative z-10 w-full max-w-md">
        <GlassCard>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-softBlue/20 to-calmPurple/20 mb-4">
              <Sparkles className="w-8 h-8 text-softBlue" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Create Account
            </h1>
            <p className="text-white/70">
              Start your learning journey today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="w-full"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="w-full"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Age
              </label>
              <NumberInput
                min="13"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                onIncrement={() => {
                  const currentAge = parseInt(formData.age) || 13
                  setFormData({ ...formData, age: Math.min(currentAge + 1, 100).toString() })
                }}
                onDecrement={() => {
                  const currentAge = parseInt(formData.age) || 13
                  setFormData({ ...formData, age: Math.max(currentAge - 1, 13).toString() })
                }}
                required
                className="w-full"
                placeholder="16"
              />
              {age < 16 && age >= 13 && (
                <p className="text-sm text-softBlue/80 mt-2 flex items-center gap-1">
                  <span>ℹ️</span> Guardian consent required for users under 16
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                minLength={8}
                className="w-full"
                placeholder="••••••••"
              />
            </div>
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}
            <GlassButton 
              type="submit" 
              variant="gradient" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </GlassButton>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm">
              Already have an account?{" "}
              <Link 
                href="/auth/signin" 
                className="text-softBlue hover:text-softBlue/80 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </GlassCard>

      <GlassModal
        isOpen={showGuardianModal}
        onClose={() => setShowGuardianModal(false)}
        title="Guardian Consent Required"
      >
        <div className="space-y-4">
          <p className="text-white/80">
            Users under 16 require guardian consent. Please provide your
            guardian&apos;s email address.
          </p>
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Guardian Email
            </label>
            <Input
              type="email"
              value={guardianEmail}
              onChange={(e) => setGuardianEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <GlassButton
              variant="gradient"
              onClick={() => {
                setShowGuardianModal(false)
                handleSubmit(
                  new Event("submit") as unknown as React.FormEvent
                )
              }}
              className="flex-1"
            >
              Send OTP
            </GlassButton>
            <GlassButton
              variant="ghost"
              onClick={() => setShowGuardianModal(false)}
              className="flex-1"
            >
              Cancel
            </GlassButton>
          </div>
        </div>
      </GlassModal>
    </div>
    </div>
  )
}
