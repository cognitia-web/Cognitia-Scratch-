import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export default function GlassCard({ 
  children, 
  className,
  hover = true,
  onClick 
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={hover ? { y: -4, scale: 1.01 } : {}}
      viewport={{ once: true, margin: "-50px" }}
      className={cn(
        "bg-gray-800/50",
        "border border-gray-700/50",
        "shadow-lg",
        "rounded-2xl",
        "p-6",
        "will-change-transform",
        "backdrop-blur-sm",
        "relative overflow-hidden",
        "group",
        hover && "transition-all duration-300 hover:bg-gray-800/80 hover:border-softBlue/50 hover:shadow-xl hover:shadow-softBlue/20",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-softBlue/5 to-calmPurple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}

