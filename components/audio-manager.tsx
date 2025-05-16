"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, useCallback } from "react"

interface AudioContextType {
  playSound: (src: string, volume?: number) => void
  toggleMute: () => void
  isMuted: boolean
  isAudioSupported: boolean
}

const AVAILABLE_SOUNDS = [
  "/sounds/boot.mp3",
  "/sounds/button-click.mp3",
  "/sounds/feature-select.mp3",
  "/sounds/terminal-command.mp3",
  "/sounds/tech-select.mp3",
  "/sounds/slide-change.mp3",
  "/sounds/terminal-toggle.mp3",
  "/sounds/maximize.mp3",
  "/sounds/roadmap-select.mp3",
  "/sounds/power.mp3",
  "/sounds/demo-select.mp3",
]

const AudioContext = createContext<AudioContextType>({
  playSound: () => {},
  toggleMute: () => {},
  isMuted: false,
  isAudioSupported: false,
})

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(false)
  const [isAudioSupported, setIsAudioSupported] = useState(false)
  const [audioCache, setAudioCache] = useState<{ [key: string]: HTMLAudioElement }>({})

  // Check if audio is supported
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && typeof Audio !== "undefined") {
        setIsAudioSupported(true)
      }
    } catch (e) {
      console.warn("Audio not supported in this environment")
      setIsAudioSupported(false)
    }
  }, [])

  const playSound = useCallback(
    (src: string, volume = 0.2) => {
      if (isMuted || !isAudioSupported) return

      try {
        // Create a new audio element each time to avoid issues
        const audio = new Audio(src)
        audio.volume = volume

        // Simple play with error handling
        audio.play().catch((e) => {
          console.warn(`Failed to play sound: ${src}`, e)
        })
      } catch (e) {
        console.warn(`Error playing sound: ${src}`, e)
      }
    },
    [isMuted, isAudioSupported],
  )

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev)
  }, [])

  return (
    <AudioContext.Provider value={{ playSound, toggleMute, isMuted, isAudioSupported }}>
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  return useContext(AudioContext)
}
