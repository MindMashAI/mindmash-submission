"use client"

import { type ReactNode, useState, useEffect } from "react"

interface HolographicProjectionProps {
  children: ReactNode
  className?: string
}

export default function HolographicProjection({ children, className = "" }: HolographicProjectionProps) {
  const [glitchActive, setGlitchActive] = useState(false)
  const [rotationX, setRotationX] = useState(0)
  const [rotationY, setRotationY] = useState(0)

  // Random glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        setGlitchActive(true)
        setTimeout(() => setGlitchActive(false), 150)
      }
    }, 4000)

    return () => clearInterval(glitchInterval)
  }, [])

  // Subtle floating effect
  useEffect(() => {
    let animationFrame: number
    let angle = 0

    const animate = () => {
      angle += 0.01
      setRotationX(Math.sin(angle) * 2)
      setRotationY(Math.cos(angle) * 2)
      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => cancelAnimationFrame(animationFrame)
  }, [])

  return (
    <div className={`relative ${className}`}>
      {/* Holographic base */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-4 bg-cyan-500/20 blur-xl rounded-full"></div>

      {/* Holographic projection */}
      <div
        className={`relative z-10 ${glitchActive ? "animate-glitch" : ""}`}
        style={{
          transform: `perspective(1000px) rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
          transition: "transform 0.5s ease-out",
        }}
      >
        {children}

        {/* Holographic scan lines */}
        <div className="absolute inset-0 pointer-events-none z-20 bg-scanline opacity-10"></div>

        {/* Holographic frame */}
        <div className="absolute inset-0 pointer-events-none z-20 border border-cyan-400/30 rounded-lg"></div>

        {/* Glitch overlay */}
        {glitchActive && <div className="absolute inset-0 pointer-events-none z-30 bg-cyan-500/10 animate-pulse"></div>}

        {/* Holographic glow */}
        <div className="absolute inset-0 -z-10 bg-cyan-500/5 blur-md rounded-lg"></div>
      </div>
    </div>
  )
}
