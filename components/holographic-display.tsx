"use client"

import { type ReactNode, useEffect, useState } from "react"

interface HolographicDisplayProps {
  children: ReactNode
}

export default function HolographicDisplay({ children }: HolographicDisplayProps) {
  const [glitchActive, setGlitchActive] = useState(false)
  const [scanlineActive, setScanlineActive] = useState(true)

  // Random glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitchActive(true)
        setTimeout(() => setGlitchActive(false), 150)
      }
    }, 3000)

    return () => clearInterval(glitchInterval)
  }, [])

  return (
    <div className="relative">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-cyan-500/10 blur-3xl rounded-full"></div>

      {/* Main content */}
      <div className={`relative z-10 ${glitchActive ? "animate-glitch" : ""}`}>{children}</div>

      {/* Scanlines */}
      {scanlineActive && <div className="absolute inset-0 pointer-events-none z-20 bg-scanline opacity-10"></div>}

      {/* Holographic frame */}
      <div className="absolute inset-0 pointer-events-none z-20 border-2 border-cyan-400/30 rounded-lg"></div>

      {/* Glitch overlay */}
      {glitchActive && <div className="absolute inset-0 pointer-events-none z-30 bg-cyan-500/10 animate-pulse"></div>}
    </div>
  )
}
