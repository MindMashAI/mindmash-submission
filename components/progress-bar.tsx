"use client"

import { cn } from "@/lib/utils"

interface ProgressBarProps {
  value: number
  max?: number
  size?: "sm" | "md" | "lg"
  color?: "default" | "neon" | "modern"
  className?: string
}

export function ProgressBar({ value, max = 100, size = "md", color = "default", className }: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  }

  const colorStyles = {
    default: {
      background: "bg-gray-800",
      fill: "bg-purple-600",
      shadow: "",
    },
    neon: {
      background: "bg-gray-800",
      fill: "bg-gradient-to-r from-purple-600 to-cyan-500",
      shadow: "shadow-[0_0_10px_rgba(139,92,246,0.5),_0_0_20px_rgba(139,92,246,0.3)]",
    },
    modern: {
      background: "bg-gray-800",
      fill: "bg-gradient-to-r from-purple-600 via-fuchsia-500 to-cyan-500",
      shadow: "shadow-[0_0_10px_rgba(139,92,246,0.5)]",
    },
  }

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-full",
        sizeClasses[size],
        colorStyles[color].background,
        colorStyles[color].shadow,
        className,
      )}
    >
      <div
        className={cn("h-full transition-all duration-300 ease-out", colorStyles[color].fill)}
        style={{
          width: `${percentage}%`,
          boxShadow:
            color === "neon" ? "0 0 10px #8b5cf6, 0 0 20px #8b5cf6" : color === "modern" ? "0 0 10px #8b5cf6" : "none",
        }}
      >
        {color === "modern" && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        )}
      </div>
    </div>
  )
}
