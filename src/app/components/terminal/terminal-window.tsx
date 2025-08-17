"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface TerminalWindowProps {
  children: React.ReactNode
  title?: string
  className?: string
}

export function TerminalWindow({ children, title = "Terminal", className }: TerminalWindowProps) {
  return (
    <div className={cn("bg-black border border-green-500 rounded-lg overflow-hidden shadow-2xl", className)}>
      {/* Terminal Header */}
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-green-500">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="text-green-400 text-sm font-mono">{title}</div>
        <div className="w-16"></div>
      </div>

      {/* Terminal Content */}
      <div className="p-4 font-mono text-green-400 bg-black min-h-[400px]">{children}</div>
    </div>
  )
}
