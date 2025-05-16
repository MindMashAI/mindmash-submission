"use client"

import type React from "react"

// This component provides a global audio context for the application
// It handles audio playback in a way that's compatible with browser restrictions

import { createContext, useContext, useEffect, useState } from "react"

interface AudioContextType {
  playSound: (soundPath: string) => void
  isAudioSupported: boolean
}

const AudioContext = createContext<AudioContextType>({
  playSound: () => {},
  isAudioSupported: false,
})

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isAudioSupported, setIsAudioSupported] = useState(false)
  const [audioInitialized, setAudioInitialized] = useState(false)

  // Check if audio is supported
  useEffect(() => {
    const checkAudioSupport = () => {
      try {
        // Check if we're in a browser environment
        if (typeof window !== "undefined" && typeof Audio !== "undefined") {
          // Create a test audio element
          const audio = new Audio()
          setIsAudioSupported(true)
        }
      } catch (e) {
        console.log("Audio not supported in this environment")
        setIsAudioSupported(false)
      }
      setAudioInitialized(true)
    }

    checkAudioSupport()
  }, [])

  // Function to play sounds safely
  const playSound = (soundPath: string) => {
    if (!isAudioSupported || !soundPath) return

    try {
      const sound = new Audio(soundPath)
      sound.volume = 0.2

      // Add error handling
      sound.onerror = () => {
        console.log("Audio not available:", soundPath)
      }

      // Use the play promise to catch any errors
      const playPromise = sound.play()

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Audio playback prevented:", error)
        })
      }
    } catch (e) {
      console.log("Error playing audio:", e)
    }
  }

  // Only render children once we've checked audio support
  if (!audioInitialized) {
    return null
  }

  return <AudioContext.Provider value={{ playSound, isAudioSupported }}>{children}</AudioContext.Provider>
}

// Hook to use audio in components
export function useAudio() {
  return useContext(AudioContext)
}
