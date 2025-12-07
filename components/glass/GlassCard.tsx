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
      transition={{ duration: 0.2, ease: "easeOut" }}
      viewport={{ once: true, margin: "-50px" }}
      className={cn(
        "bg-gray-800",
        "border border-gray-700",
        "shadow-lg",
        "rounded-2xl",
        "p-6",
        "will-change-transform",
        hover && "transition duration-300 hover:bg-gray-750 hover:shadow-xl",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

