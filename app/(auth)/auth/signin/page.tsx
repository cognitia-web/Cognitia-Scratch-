"use client"

import { useState } from "react"
import { signIn, signInWithGoogle, signInWithGitHub, signInWithMicrosoft } from "@/lib/firebase/auth"
import { useRouter } from "next/navigation"
import Link from "next/link"
import AuroraBackground from "@/components/backgrounds/AuroraBackground"
import GlassCard from "@/components/glass/GlassCard"
import GlassButton from "@/components/glass/GlassButton"
import { Input } from "@/components/ui/input"
import { Sparkles, Mail, Lock, Github, Chrome, Building2 } from "lucide-react"
import { motion } from "framer-motion"

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await signIn(email, password)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Invalid credentials")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <AuroraBackground />
      <div className="relative z-10 w-full max-w-md">
        <GlassCard>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 md:mb-10"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-softBlue/20 to-calmPurple/20 mb-4 md:mb-6"
            >
              <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-softBlue" />
            </motion.div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2 md:mb-4 bg-gradient-to-r from-softBlue to-calmPurple bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-base sm:text-lg text-white/60 font-medium">
              Sign in to continue your learning journey
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm md:text-base font-semibold text-white/90 mb-2 md:mb-3 flex items-center gap-2">
                <Mail className="w-4 h-4 md:w-5 md:h-5 text-softBlue" />
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full text-base"
                placeholder="your@email.com"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm md:text-base font-semibold text-white/90 mb-2 md:mb-3 flex items-center gap-2">
                <Lock className="w-4 h-4 md:w-5 md:h-5 text-softBlue" />
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full text-base"
                placeholder="••••••••"
              />
            </motion.div>
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}
            <GlassButton 
              type="submit" 
              variant="gradient" 
              className="w-full" 
              disabled={loading || oauthLoading !== null}
            >
              {loading ? "Signing in..." : "Sign In"}
            </GlassButton>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-800 text-white/60">Or continue with</span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3">
            <GlassButton
              variant="ghost"
              className="w-full justify-center gap-3"
              onClick={async () => {
                setOauthLoading("google")
                setError("")
                try {
                  await signInWithGoogle()
                  router.push("/dashboard")
                } catch (err: any) {
                  setError(err.message || "Failed to sign in with Google")
                } finally {
                  setOauthLoading(null)
                }
              }}
              disabled={loading || oauthLoading !== null}
            >
              <Chrome className="w-5 h-5" />
              <span className="font-semibold">
                {oauthLoading === "google" ? "Signing in..." : "Continue with Google"}
              </span>
            </GlassButton>

            <GlassButton
              variant="ghost"
              className="w-full justify-center gap-3"
              onClick={async () => {
                setOauthLoading("github")
                setError("")
                try {
                  await signInWithGitHub()
                  router.push("/dashboard")
                } catch (err: any) {
                  setError(err.message || "Failed to sign in with GitHub")
                } finally {
                  setOauthLoading(null)
                }
              }}
              disabled={loading || oauthLoading !== null}
            >
              <Github className="w-5 h-5" />
              <span className="font-semibold">
                {oauthLoading === "github" ? "Signing in..." : "Continue with GitHub"}
              </span>
            </GlassButton>

            <GlassButton
              variant="ghost"
              className="w-full justify-center gap-3"
              onClick={async () => {
                setOauthLoading("microsoft")
                setError("")
                try {
                  await signInWithMicrosoft()
                  router.push("/dashboard")
                } catch (err: any) {
                  setError(err.message || "Failed to sign in with Microsoft")
                } finally {
                  setOauthLoading(null)
                }
              }}
              disabled={loading || oauthLoading !== null}
            >
              <Building2 className="w-5 h-5" />
              <span className="font-semibold">
                {oauthLoading === "microsoft" ? "Signing in..." : "Continue with Microsoft"}
              </span>
            </GlassButton>
          </div>

          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm">
              Don't have an account?{" "}
              <Link 
                href="/auth/signup" 
                className="text-softBlue hover:text-softBlue/80 font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

