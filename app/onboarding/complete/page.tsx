"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAudio } from "@/components/audio-manager"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, ArrowRight } from "lucide-react"
import { EmergencyNFTDisplay } from "@/components/emergency-nft-display"

export default function CompletePage() {
  const [isEntering, setIsEntering] = useState(false)
  const router = useRouter()
  const { playSound } = useAudio()

  const handleEnterPlatform = () => {
    setIsEntering(true)
    playSound("/sounds/feature-select.mp3")

    setTimeout(() => {
      router.push("/soulsig")
    }, 1500)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-black">
      <div className="w-full max-w-md">
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
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-2">
            Setup Complete!
          </h1>
          <p className="text-gray-400">You're ready to enter the MindMash ecosystem</p>
        </div>

        <Card className="bg-gray-900/50 border-purple-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-center">Welcome to MindMash.AI</CardTitle>
            <CardDescription className="text-center">
              Your journey into collaborative intelligence begins now
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center mb-6">
              <EmergencyNFTDisplay size="medium" />
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-black/30 border border-gray-800 rounded-lg">
                <h3 className="text-lg font-medium text-center mb-4">Setup Summary</h3>

                <div className="space-y-3">
                  <div className="flex items-center p-2 bg-green-900/20 border border-green-500/30 rounded-lg">
                    <div className="bg-green-900/30 p-1.5 rounded-full mr-3">
                      <Check className="h-4 w-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">SynBot</p>
                      <p className="text-xs text-gray-400">AI-powered identity & wallet agent</p>
                    </div>
                    <div className="ml-auto text-xs text-green-400 font-medium">Active</div>
                  </div>

                  <div className="flex items-center p-2 bg-green-900/20 border border-green-500/30 rounded-lg">
                    <div className="bg-green-900/30 p-1.5 rounded-full mr-3">
                      <Check className="h-4 w-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Solana Wallet</p>
                      <p className="text-xs text-gray-400">Non-custodial Crossmint wallet</p>
                    </div>
                    <div className="ml-auto text-xs text-green-400 font-medium">Connected</div>
                  </div>

                  <div className="flex items-center p-2 bg-green-900/20 border border-green-500/30 rounded-lg">
                    <div className="bg-green-900/30 p-1.5 rounded-full mr-3">
                      <Check className="h-4 w-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">SoulSig NFT</p>
                      <p className="text-xs text-gray-400">Your unique identity token</p>
                    </div>
                    <div className="ml-auto text-xs text-green-400 font-medium">Minted</div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-black/30 border border-purple-500/30 rounded-lg">
                <h3 className="text-lg font-medium text-purple-400 mb-2">What's Next:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start text-sm">
                    <span className="text-purple-400 mr-2">•</span>
                    <span className="text-white">Explore your SynBot interface and customize its behavior</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <span className="text-purple-400 mr-2">•</span>
                    <span className="text-white">Join Syndicates to collaborate with others on specific topics</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <span className="text-purple-400 mr-2">•</span>
                    <span className="text-white">
                      Participate in collaborative AI interactions and earn MINDMASH tokens
                    </span>
                  </li>
                  <li className="flex items-start text-sm">
                    <span className="text-purple-400 mr-2">•</span>
                    <span className="text-white">Connect with other users and build your neural network</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              onClick={handleEnterPlatform}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
              disabled={isEntering}
            >
              {isEntering ? (
                <div className="flex items-center">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                  Entering MindMash...
                </div>
              ) : (
                <div className="flex items-center">
                  Enter MindMash Platform
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
