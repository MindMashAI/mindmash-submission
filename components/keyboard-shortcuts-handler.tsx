"use client"

import { useEffect } from "react"

interface KeyboardShortcutsHandlerProps {
  onToggleFullscreen: () => void
  onToggleMute: () => void
  onToggleHelp: () => void
}

export default function KeyboardShortcutsHandler({
  onToggleFullscreen,
  onToggleMute,
  onToggleHelp,
}: KeyboardShortcutsHandlerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return
      }

      console.log("Key pressed:", e.key) // Add logging to debug

      // F key for fullscreen
      if (e.key === "f" || e.key === "F") {
        onToggleFullscreen()
        e.preventDefault()
      }

      // M key for mute
      if (e.key === "m" || e.key === "M") {
        onToggleMute()
        e.preventDefault()
      }

      // ? key for help
      if (e.key === "?") {
        onToggleHelp()
        e.preventDefault()
      }
    }

    // Use keyup instead of keydown for more reliable detection
    window.addEventListener("keyup", handleKeyDown)

    return () => {
      window.removeEventListener("keyup", handleKeyDown)
    }
  }, [onToggleFullscreen, onToggleMute, onToggleHelp])

  return null
}
