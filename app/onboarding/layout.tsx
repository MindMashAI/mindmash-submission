"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAudio } from "@/components/audio-manager"
import NeuralConnectionEffect from "@/components/neural-connection-effect"

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const { playSound } = useAudio()

  useEffect(() => {
    setIsLoaded(true)
    playSound("/sounds/boot.mp3")
  }, [playSound])

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono relative">
      {/* Background effects */}
      <div className="fixed inset-0 z-0">
        <NeuralConnectionEffect className="opacity-30" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">{children}</div>
    </div>
  )
}
