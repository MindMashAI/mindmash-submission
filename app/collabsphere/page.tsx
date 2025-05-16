"use client"

import { useState, useEffect } from "react"
import CollabSphereInterface from "@/components/collabsphere-interface" // Changed from named import to default import
import { useAudio } from "@/components/audio-manager"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import "./cyberpunk-styles.css"

export default function CollabSpherePage() {
  const { playSound } = useAudio()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)

  // Mock user data
  const user = {
    id: "current-user",
    username: "mindmash_user",
    name: "MindMash User",
    avatar: "/images/pfp/mindmash-user.png",
    bio: "AI Collaboration Enthusiast | Neural Network Explorer",
    syndicates: [{ id: "quantum-flow", name: "Quantum Flow", joinedAt: new Date().toISOString() }],
  }

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
      playSound("/sounds/boot.mp3")
    }, 1000)

    return () => clearTimeout(timer)
  }, [playSound])

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Neural network background with reduced opacity */}
      <div className="fixed inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[#000000]"></div>
      </div>

      {/* Cyberpunk grid overlay */}
      <div className="fixed inset-0 z-0 cyberpunk-grid opacity-10"></div>

      {/* Scanline effect */}
      <div className="fixed inset-0 z-0 scanline opacity-20"></div>

      {/* Main content */}
      <div className="relative z-10">
        {isLoading ? (
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 relative">
                <Image
                  src="https://jade-late-crow-559.mypinata.cloud/ipfs/bafybeia5skhvck24266qahayvxuhc5k3ez27xnmscrlwfjnwloeal5rdam"
                  alt="MindMash.AI Logo"
                  width={96}
                  height={96}
                  className="rounded-md border border-cyan-500 glow-cyan pulse"
                />
              </div>
              <h1 className="text-4xl font-bold mb-4 cyberpunk-title holographic">COLLABSPHERE</h1>
              <p className="text-cyan-400 text-lg">Initializing Neural Interface...</p>
              <div className="mt-4 w-64 mx-auto">
                <div className="progress-bar-bg">
                  <div className="progress-bar-cyan" style={{ width: `${Math.random() * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Back to Demo Button */}
            <div className="absolute top-4 left-4 z-20">
              <Link href="/demo">
                <Button
                  variant="outline"
                  className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-900/20 flex items-center gap-2"
                  onClick={() => playSound("/sounds/button-click.mp3")}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Demo
                </Button>
              </Link>
            </div>

            {/* CollabSphere Header with border-bottom instead of fixed line */}
            <div className="cyberpunk-header py-4 mb-6 border-b border-cyan-500/30">
              <div className="container mx-auto px-4">
                <div className="flex justify-center items-center">
                  <Image
                    src="https://jade-late-crow-559.mypinata.cloud/ipfs/bafybeia5skhvck24266qahayvxuhc5k3ez27xnmscrlwfjnwloeal5rdam"
                    alt="MindMash.AI Logo"
                    width={48}
                    height={48}
                    className="mr-4 rounded-md border border-cyan-500/50 glow-cyan"
                  />
                  <h1 className="text-5xl font-bold cyberpunk-title neon-text-cyan">COLLABSPHERE</h1>
                  <span className="text-sm text-fuchsia-400 ml-2 mt-1">[Beta]</span>
                </div>
                <p className="text-center text-gray-400 mt-1">Collaborative AI Nexus for MindMash.AI</p>
              </div>
            </div>

            <CollabSphereInterface user={user} />
          </>
        )}
      </div>
    </div>
  )
}
