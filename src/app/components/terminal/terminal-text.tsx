"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface TerminalTextProps {
  children: React.ReactNode
  className?: string
  color?: "green" | "red" | "yellow" | "blue" | "white"
}

export function TerminalText({ children, className, color = "green" }: TerminalTextProps) {
  const colorClasses = {
    green: "text-green-400",
    red: "text-red-400",
    yellow: "text-yellow-400",
    blue: "text-blue-400",
    white: "text-white",
  }

  return <div className={cn("font-mono", colorClasses[color], className)}>{children}</div>
}
