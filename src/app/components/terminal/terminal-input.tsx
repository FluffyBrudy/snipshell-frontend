"use client"

import type React from "react"
import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface TerminalInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  prompt?: string
}

export const TerminalInput = forwardRef<HTMLInputElement, TerminalInputProps>(
  ({ className, prompt = "$", ...props }, ref) => {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-green-400 font-mono">{prompt}</span>
        <input
          ref={ref}
          className={cn(
            "flex-1 bg-transparent border-none outline-none text-green-400 font-mono placeholder:text-green-600",
            "focus:ring-0 focus:border-none",
            className,
          )}
          {...props}
        />
      </div>
    )
  },
)

TerminalInput.displayName = "TerminalInput"
