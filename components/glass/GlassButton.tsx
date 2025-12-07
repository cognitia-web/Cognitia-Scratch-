import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import React, { ButtonHTMLAttributes, forwardRef } from "react"

interface GlassButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'variant'> {
  variant?: "primary" | "secondary" | "ghost" | "gradient" | "destructive"
  size?: "sm" | "md" | "lg"
  asChild?: boolean
}

const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant = "primary", size = "md", children, asChild, ...props }, ref) => {
    const variants = {
      primary: "bg-gradient-to-r from-softBlue to-softBlue/80 text-white hover:from-softBlue/90 hover:to-softBlue/70 shadow-lg shadow-softBlue/20",
      secondary: "bg-gradient-to-r from-calmPurple to-calmPurple/80 text-white hover:from-calmPurple/90 hover:to-calmPurple/70 shadow-lg shadow-calmPurple/20",
      ghost: "bg-gray-700 text-white hover:bg-gray-600 border-gray-600",
      gradient: "bg-gradient-to-r from-softBlue via-calmPurple to-softBlue text-white hover:shadow-lg hover:shadow-softBlue/30",
      destructive: "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/20",
    }

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg font-semibold",
    }

    const baseClasses = cn(
      "border border-gray-600",
      "rounded-xl",
      "font-medium",
      "transition-all duration-300",
      "relative overflow-hidden",
      "group",
      variants[variant],
      sizes[size],
      className
    )

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement, {
        className: cn(baseClasses, (children as React.ReactElement).props?.className),
      })
    }

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={baseClasses}
        {...(props as any)}
      >
        <span className="relative z-10 flex items-center justify-center">
          {children}
        </span>
        {variant === "gradient" && (
          <div className="absolute inset-0 bg-gradient-to-r from-softBlue via-calmPurple to-softBlue opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
      </motion.button>
    )
  }
)

GlassButton.displayName = "GlassButton"

export default GlassButton

