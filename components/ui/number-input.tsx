"use client"

import * as React from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onIncrement?: () => void
  onDecrement?: () => void
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, onIncrement, onDecrement, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          type="number"
          className={cn(
            "flex h-10 w-full rounded-xl border border-gray-600 bg-gray-800 px-4 py-2 pr-12 text-sm text-white placeholder:text-gray-400 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-softBlue/50 focus-visible:ring-offset-2 focus-visible:border-softBlue/50 transition-all disabled:cursor-not-allowed disabled:opacity-50",
            "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
            className
          )}
          ref={ref}
          {...props}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-0.5">
          <button
            type="button"
            onClick={onIncrement}
            className="p-0.5 rounded-md bg-gray-700 hover:bg-gray-600 border border-gray-600 transition-colors"
          >
            <ChevronUp className="w-3 h-3 text-white" />
          </button>
          <button
            type="button"
            onClick={onDecrement}
            className="p-0.5 rounded-md bg-gray-700 hover:bg-gray-600 border border-gray-600 transition-colors"
          >
            <ChevronDown className="w-3 h-3 text-white" />
          </button>
        </div>
      </div>
    )
  }
)
NumberInput.displayName = "NumberInput"

export { NumberInput }

