"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAudio } from "@/components/audio-manager"

export default function PitchDeckRedirect() {
  const router = useRouter()
  const { playSound } = useAudio()

  useEffect(() => {
    playSound("/sounds/slide-change.mp3")
    // Redirect to the root page for pitch deck
    router.push("/")
  }, [router, playSound])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent mb-4"></div>
        <p className="text-cyan-400">Loading pitch deck presentation...</p>
      </div>
    </div>
  )
}
