"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAudio } from "@/components/audio-manager"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { BrainCircuit, ArrowRight, Cpu } from "lucide-react"

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isSynBotCreating, setIsSynBotCreating] = useState(false)
  const [synBotProgress, setSynBotProgress] = useState(0)
  const router = useRouter()
  const { playSound } = useAudio()
  const { toast } = useToast()

  useEffect(() => {
    // Calculate progress based on current step
    setProgress((step / 2) * 100)
  }, [step])

  // Handle SynBot creation progress
  useEffect(() => {
    if (isSynBotCreating) {
      const interval = setInterval(() => {
        setSynBotProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setTimeout(() => {
              // When SynBot creation is complete, go to wallet page
              router.push("/onboarding/wallet")
              playSound("/sounds/feature-select.mp3")
            }, 500)
            return 100
          }
          return prev + 2
        })
      }, 100)

      return () => clearInterval(interval)
    }
  }, [isSynBotCreating, router, playSound])

  const handleNextStep = () => {
    playSound("/sounds/button-click.mp3")

    if (step < 2) {
      setIsLoading(true)

      // Simulate loading
      setTimeout(() => {
        setStep(step + 1)
        setIsLoading(false)
      }, 1500)
    } else {
      // Start SynBot creation process
      setIsSynBotCreating(true)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-black">
      <div className="w-full max-w-4xl">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="relative w-16 h-16">
              <Image
                src="/images/mindmash-logo.png"
                alt="MindMash.AI Logo"
                fill
                className="object-contain"
                style={{ filter: "drop-shadow(0 0 8px rgba(139, 92, 246, 0.5))" }}
              />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-2">
            Join The: MASH
          </h1>
          <p className="text-gray-400 text-lg">Your journey into collaborative intelligence begins here</p>
        </div>

        <div className="mb-8">
          <Progress
            value={progress}
            className="h-2 bg-gray-800"
            style={{
              boxShadow: "0 0 10px rgba(139, 92, 246, 0.5), 0 0 20px rgba(139, 92, 246, 0.3)",
              background: "linear-gradient(90deg, rgba(17, 24, 39, 1) 0%, rgba(17, 24, 39, 0.7) 100%)",
            }}
          />
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span className={step >= 1 ? "text-purple-400" : ""}>Introduction</span>
            <span className={step >= 2 ? "text-purple-400" : ""}>SynBot</span>
          </div>
        </div>

        <Card className="bg-gray-900/50 border-purple-500/30 backdrop-blur-sm">
          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle className="text-2xl text-center">Welcome to MindMash.AI</CardTitle>
                <CardDescription className="text-center text-gray-400">
                  The neural future of collaboration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center mb-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-900/30 to-cyan-900/30 rounded-full flex items-center justify-center">
                    <BrainCircuit className="h-16 w-16 text-purple-400" />
                  </div>
                </div>
                <p className="text-center text-gray-300">
                  MindMash.AI is a next-gen collaborative intelligence protocol where AI, identity, and creativity evolve together onchain. We're building the
                  operating system for AI-enhanced collective thinking.
                </p>
                <p className="text-center text-gray-300">
                  To get started, we'll set you up with your own SynBot, a Solana smart wallet, and a unique SoulSig NFT
                  that connects you to the MindMash ecosystem.
                </p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button
                  onClick={handleNextStep}
                  className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  )}
                </Button>
              </CardFooter>
            </>
          )}

          {step === 2 && (
            <>
              <CardHeader>
                <CardTitle className="text-2xl text-center">Create Your SynBot</CardTitle>
                <CardDescription className="text-center text-gray-400">
                  Your AI-powered identity & wallet agent
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center mb-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-900/30 to-cyan-900/30 rounded-full flex items-center justify-center relative">
                    {isSynBotCreating ? (
                      <div className="relative">
                        <Cpu className="h-16 w-16 text-purple-400 animate-pulse" />
                        <div className="absolute inset-0 rounded-full border-2 border-purple-500/50 animate-ping"></div>
                        <div
                          className="absolute -inset-4 rounded-full border border-cyan-500/30 animate-spin"
                          style={{ animationDuration: "8s" }}
                        ></div>
                        <div
                          className="absolute -inset-8 rounded-full border border-purple-500/20 animate-spin"
                          style={{ animationDuration: "12s", animationDirection: "reverse" }}
                        ></div>
                      </div>
                    ) : (
                      <>
                        <Cpu className="h-16 w-16 text-purple-400" />
                        <div className="absolute inset-0 rounded-full border-2 border-purple-500/50 animate-ping"></div>
                      </>
                    )}
                  </div>
                </div>

                {isSynBotCreating ? (
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Creating SynBot...</span>
                      <span>{synBotProgress}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden relative">
                      <div
                        className="h-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-cyan-500 absolute top-0 left-0 transition-all duration-200 ease-out"
                        style={{
                          width: `${synBotProgress}%`,
                          boxShadow: "0 0 10px #8b5cf6, 0 0 20px #8b5cf6",
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                      </div>
                    </div>
                    <div className="text-sm text-white">
                      {synBotProgress < 30 && "Initializing neural network..."}
                      {synBotProgress >= 30 && synBotProgress < 60 && "Training personality model..."}
                      {synBotProgress >= 60 && synBotProgress < 90 && "Configuring agent parameters..."}
                      {synBotProgress >= 90 && "Finalizing SynBot creation..."}
                    </div>

                    <div className="p-4 bg-black/30 border border-purple-500/30 rounded-lg mt-4">
                      <h3 className="text-lg font-medium text-purple-400 mb-2">SynBot Features:</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="text-purple-400 mr-2">•</span>
                          <span className="text-gray-300">Wallet management and transaction assistance</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-purple-400 mr-2">•</span>
                          <span className="text-gray-300">Collaborative intelligence amplification</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-purple-400 mr-2">•</span>
                          <span className="text-gray-300">Personalized content and connection recommendations</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-purple-400 mr-2">•</span>
                          <span className="text-gray-300">Autonomous actions based on your preferences</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-center text-white">
                      Your SynBot is an AI-powered agent that helps you navigate the MindMash ecosystem. It can assist
                      with wallet management, collaboration, and content creation.
                    </p>
                    <p className="text-center text-white">
                      Each SynBot has a unique personality and capabilities that evolve based on your interactions and
                      preferences.
                    </p>
                    <div className="p-4 bg-black/30 border border-purple-500/30 rounded-lg">
                      <h3 className="text-lg font-medium text-purple-400 mb-2">SynBot Features:</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="text-purple-400 mr-2">•</span>
                          <span className="text-gray-300">Wallet management and transaction assistance</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-purple-400 mr-2">•</span>
                          <span className="text-gray-300">Collaborative intelligence amplification</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-purple-400 mr-2">•</span>
                          <span className="text-gray-300">Personalized content and connection recommendations</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-purple-400 mr-2">•</span>
                          <span className="text-gray-300">Autonomous actions based on your preferences</span>
                        </li>
                      </ul>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter className="flex justify-center">
                {!isSynBotCreating && (
                  <Button
                    onClick={handleNextStep}
                    className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        Create My SynBot
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    )}
                  </Button>
                )}
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
