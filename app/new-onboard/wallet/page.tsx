"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ProgressBar } from "@/components/progress-bar"
import { useAudio } from "@/components/audio-manager"
import { Cpu, ArrowRight, Wallet, Shield, Sparkles } from "lucide-react"

export default function NewOnboardingWalletPage() {
  const [progress, setProgress] = useState(0)
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()
  const { playSound } = useAudio()

  useEffect(() => {
    if (isCreating) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setTimeout(() => {
              router.push("/new-onboard/mint")
              playSound("/sounds/feature-select.mp3")
            }, 500)
            return 100
          }
          return prev + 2
        })
      }, 100)

      return () => clearInterval(interval)
    }
  }, [isCreating, router, playSound])

  const handleCreateWallet = () => {
    setIsCreating(true)
    playSound("/sounds/button-click.mp3")
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900/30 border-purple-500/20 backdrop-blur-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-white">Create Wallet</CardTitle>
            <div className="flex items-center space-x-1 text-sm text-gray-400">
              <span className="font-medium">Step 2</span>
              <span>/</span>
              <span>3</span>
            </div>
          </div>
          <CardDescription>Set up your Solana wallet for MindMash</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center p-6 bg-black/30 rounded-lg border border-gray-800">
            <div className="w-16 h-16 mb-4 relative">
              <Wallet className="w-16 h-16 text-purple-400" />
              <div className="absolute inset-0 bg-purple-500 rounded-full filter blur-md opacity-30 animate-pulse"></div>
            </div>
            <h3 className="text-lg font-bold mb-2 text-white">Crossmint Wallet</h3>
            <p className="text-sm text-center text-gray-400 mb-4">
              We'll create a non-custodial Solana wallet for you powered by Crossmint
            </p>
            {isCreating ? (
              <div className="w-full space-y-2">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Creating wallet...</span>
                  <span>{progress}%</span>
                </div>
                <ProgressBar value={progress} color="modern" size="md" />
                <div className="flex flex-col space-y-2 mt-4">
                  <div className="flex items-center space-x-2">
                    <Shield className={`h-4 w-4 ${progress >= 30 ? "text-green-500" : "text-gray-600"}`} />
                    <span className={`text-sm ${progress >= 30 ? "text-gray-300" : "text-gray-600"}`}>
                      Generating secure keys
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Cpu className={`h-4 w-4 ${progress >= 60 ? "text-green-500" : "text-gray-600"}`} />
                    <span className={`text-sm ${progress >= 60 ? "text-gray-300" : "text-gray-600"}`}>
                      Connecting to Solana
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sparkles className={`h-4 w-4 ${progress >= 90 ? "text-green-500" : "text-gray-600"}`} />
                    <span className={`text-sm ${progress >= 90 ? "text-gray-300" : "text-gray-600"}`}>
                      Finalizing setup
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white border-0"
                onClick={handleCreateWallet}
              >
                Create Wallet
              </Button>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/new-onboard">
            <Button variant="outline" className="border-gray-700 text-gray-400 hover:bg-gray-800">
              Back
            </Button>
          </Link>
          <Button
            variant="outline"
            className="border-purple-500/50 text-purple-400 hover:bg-purple-900/20"
            onClick={() => {
              router.push("/new-onboard/mint")
              playSound("/sounds/button-click.mp3")
            }}
            disabled={isCreating && progress < 100}
          >
            Skip
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
