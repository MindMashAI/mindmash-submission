"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import NeuralConnectionEffect from "@/components/neural-connection-effect"
import AnimatedLogo from "@/components/animated-logo"
import UsersList from "@/components/users-list"
import { useAudio } from "@/components/audio-manager"

export default function CommunityPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const { playSound } = useAudio()

  useEffect(() => {
    // Check if user is authenticated
    const user = localStorage.getItem("mindmash_user")
    if (!user) {
      router.push("/auth")
      return
    }

    setIsAuthenticated(true)
    setIsLoaded(true)
    playSound("/sounds/boot.mp3")
  }, [router, playSound])

  if (!isLoaded || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-black text-white font-mono overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute inset-0 bg-scanline opacity-5"></div>
      <NeuralConnectionEffect className="opacity-30" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6 border-b border-gray-800">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              playSound("/sounds/button-click.mp3")
              router.push("/dashboard")
            }}
            className="mr-4 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <AnimatedLogo size={32} />
          <h1 className="ml-3 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            MindMash.AI Community
          </h1>
        </div>
      </header>

      {/* Main content */}
      <div className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              Neural Network Members
            </h2>
            <p className="text-gray-400">
              Connect with other minds in the collective intelligence network. Explore profiles, view wallet addresses,
              and initiate neural connections.
            </p>
          </div>

          <UsersList />
        </div>
      </div>
    </div>
  )
}
