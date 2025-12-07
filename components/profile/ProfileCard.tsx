"use client"

import { motion } from "framer-motion"
import GlassCard from "@/components/glass/GlassCard"
import { User, Award, Coins, TrendingUp, Camera } from "lucide-react"
import { useState } from "react"

interface ProfileCardProps {
  name: string
  email: string
  image?: string
  experience: number // Total XP points
  stage: string // Current stage/level
  balance: number // Points balance
}

export default function ProfileCard({
  name,
  email,
  image,
  experience,
  stage,
  balance,
}: ProfileCardProps) {
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false)
  const [isHoveringBanner, setIsHoveringBanner] = useState(false)

  const handleImageChange = (type: "avatar" | "banner") => {
    // TODO: Implement image upload functionality
    console.log(`Change ${type} clicked`)
  }

  return (
    <GlassCard className="overflow-hidden">
      <div className="relative">
        {/* Header with gradient */}
        <div 
          className="h-32 bg-gradient-to-r from-softBlue via-calmPurple to-softBlue relative overflow-hidden group"
          onMouseEnter={() => setIsHoveringBanner(true)}
          onMouseLeave={() => setIsHoveringBanner(false)}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
          {isHoveringBanner && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => handleImageChange("banner")}
              className="absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-softBlue rounded-lg hover:bg-softBlue/90 transition-colors">
                <Camera className="w-4 h-4 text-white" />
                <span className="text-white font-medium">Change Banner</span>
              </div>
            </motion.button>
          )}
        </div>

        {/* Profile Content */}
        <div className="px-6 pb-6 -mt-16">
          {/* Avatar */}
          <div 
            className="relative mb-4 w-fit"
            onMouseEnter={() => setIsHoveringAvatar(true)}
            onMouseLeave={() => setIsHoveringAvatar(false)}
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-softBlue to-calmPurple p-1">
              <div className="w-full h-full rounded-full bg-charcoal flex items-center justify-center overflow-hidden">
                {image ? (
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-white/70" />
                )}
              </div>
            </div>
            {isHoveringAvatar && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => handleImageChange("avatar")}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-sm"
              >
                <div className="flex items-center gap-2 px-3 py-1.5 bg-softBlue rounded-lg hover:bg-softBlue/90 transition-colors">
                  <Camera className="w-3 h-3 text-white" />
                  <span className="text-white text-xs font-medium">Change</span>
                </div>
              </motion.button>
            )}
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-charcoal" />
          </div>

          {/* Name and Email */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-1">{name}</h2>
            <p className="text-white/60 text-sm">{email}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            {/* Experience */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-gray-800 rounded-xl border border-gray-700 text-center"
            >
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-5 h-5 text-softBlue" />
              </div>
              <p className="text-2xl font-bold text-white mb-1">{experience.toLocaleString()}</p>
              <p className="text-xs text-white/60">Experience</p>
            </motion.div>

            {/* Stage */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-gray-800 rounded-xl border border-gray-700 text-center"
            >
              <div className="flex items-center justify-center mb-2">
                <Award className="w-5 h-5 text-calmPurple" />
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stage}</p>
              <p className="text-xs text-white/60">Stage</p>
            </motion.div>

            {/* Balance */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-gray-800 rounded-xl border border-gray-700 text-center"
            >
              <div className="flex items-center justify-center mb-2">
                <Coins className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="text-2xl font-bold text-white mb-1">{balance.toLocaleString()}</p>
              <p className="text-xs text-white/60">Balance</p>
            </motion.div>
          </div>
        </div>
      </div>
    </GlassCard>
  )
}

