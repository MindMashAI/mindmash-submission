"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { useAudio } from "@/components/audio-manager"

interface InteractiveLogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  showText?: boolean
  className?: string
  onClick?: () => void
}

export default function InteractiveLogo({
  size = "md",
  showText = true,
  className = "",
  onClick,
}: InteractiveLogoProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const animationRef = useRef<NodeJS.Timeout | null>(null)
  const { playSound } = useAudio()

  // Size mapping
  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  }

  // Text size mapping
  const textSizeMap = {
    sm: "text-sm",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  }

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current)
      }
    }
  }, [])

  const handleClick = () => {
    if (onClick) onClick()

    playSound("/sounds/feature-select.mp3")
    setIsClicked(true)
    setIsAnimating(true)

    // Create a pulsing effect
    let pulseCount = 0
    const maxPulses = 5

    const pulseAnimation = () => {
      if (pulseCount < maxPulses) {
        setIsClicked((prev) => !prev)
        pulseCount++
        animationRef.current = setTimeout(pulseAnimation, 300)
      } else {
        setIsClicked(false)
        setIsAnimating(false)
      }
    }

    pulseAnimation()
  }

  return (
    <div
      className={`flex items-center cursor-pointer group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div
        className={`relative ${sizeMap[size]} transition-all duration-300 ${
          isHovered ? "scale-110" : ""
        } ${isClicked ? "scale-125" : ""}`}
      >
        <Image
          src="/images/mindmash-logo.png"
          alt="MindMash.AI Logo"
          fill
          className="object-contain"
          style={{
            filter:
              isHovered || isClicked
                ? `drop-shadow(0 0 ${size === "xl" ? "12" : "8"}px rgba(139, 92, 246, 0.8))`
                : "none",
          }}
        />

        {isAnimating && (
          <div className="absolute inset-0 -z-10">
            <div className={`absolute inset-0 rounded-full bg-purple-500/20 animate-ping`}></div>
          </div>
        )}
      </div>

      {showText && (
        <h3
          className={`ml-3 font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 transition-all duration-300 ${
            textSizeMap[size]
          } ${isHovered ? "tracking-wider" : ""}`}
        >
          MindMash.AI
        </h3>
      )}

      {isHovered && size !== "sm" && (
        <div className="absolute top-full left-0 mt-2 bg-black/80 backdrop-blur-sm border border-purple-500/30 p-2 rounded text-xs text-gray-300 w-48">
          Click to activate neural pulse effect
        </div>
      )}
    </div>
  )
}
