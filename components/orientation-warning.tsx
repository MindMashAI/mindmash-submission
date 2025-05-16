"use client"

import { useState, useEffect } from "react"
import { RotateCcw, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OrientationWarning() {
  const [showWarning, setShowWarning] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Check if we're on a mobile device
    const checkOrientation = () => {
      if (typeof window !== "undefined") {
        const isMobile = window.innerWidth < 768
        const isPortrait = window.innerHeight > window.innerWidth

        setShowWarning(isMobile && isPortrait && !dismissed)
      }
    }

    // Check on mount and when window resizes
    checkOrientation()
    window.addEventListener("resize", checkOrientation)
    window.addEventListener("orientationchange", checkOrientation)

    return () => {
      window.removeEventListener("resize", checkOrientation)
      window.removeEventListener("orientationchange", checkOrientation)
    }
  }, [dismissed])

  if (!showWarning) return null

  return (
    <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-cyan-900 rounded-lg p-6 max-w-sm relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6 rounded-full"
          onClick={() => setDismissed(true)}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="flex flex-col items-center text-center">
          <RotateCcw className="h-16 w-16 text-cyan-400 mb-4 animate-spin-slow" />
          <h3 className="text-xl font-bold text-white mb-2">Please Rotate Your Device</h3>
          <p className="text-gray-300 mb-4">
            This presentation is best viewed in landscape orientation for the full experience.
          </p>
          <Button onClick={() => setDismissed(true)} className="bg-cyan-600 hover:bg-cyan-700 text-white">
            Continue Anyway
          </Button>
        </div>
      </div>
    </div>
  )
}
