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
      primary: "bg-gradient-to-r from-softBlue to-softBlue/80 text-white hover:from-softBlue hover:to-softBlue/90 shadow-lg shadow-softBlue/20 hover:shadow-softBlue/40",
      secondary: "bg-gradient-to-r from-calmPurple to-calmPurple/80 text-white hover:from-calmPurple hover:to-calmPurple/90 shadow-lg shadow-calmPurple/20 hover:shadow-calmPurple/40",
      ghost: "bg-gray-700/50 text-white hover:bg-gray-600/80 border-gray-600 hover:border-gray-500 backdrop-blur-sm",
      gradient: "bg-gradient-to-r from-softBlue via-calmPurple to-softBlue text-white hover:shadow-xl hover:shadow-softBlue/40 bg-[length:200%_200%] hover:bg-[position:100%_50%] transition-all duration-500",
      destructive: "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/20 hover:shadow-red-600/40",
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
      "hover:scale-105",
      "active:scale-95",
      "shadow-lg",
      "hover:shadow-xl",
      "hover:shadow-softBlue/30",
      variants[variant],
      sizes[size],
      className
    )

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<any>
      // Don't forward ref to Link components as they don't accept refs
      const { ref: _, ...childProps } = child.props || {}
      return React.cloneElement(child, {
        ...childProps,
        className: cn(baseClasses, child.props?.className),
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

