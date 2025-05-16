"use client"

import Link from "next/link"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAudio } from "@/components/audio-manager"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Sparkles, ArrowRight, Check, Loader2, Fingerprint } from "lucide-react"

export default function MintPage() {
  const [isMinting, setIsMinting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [mintComplete, setMintComplete] = useState(false)
  const [nftDetails, setNftDetails] = useState<any>(null)
  const router = useRouter()
  const { playSound } = useAudio()
  const { toast } = useToast()

  // Handle minting progress
  useEffect(() => {
    if (isMinting) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setTimeout(() => {
              setMintComplete(true)
              setNftDetails({
                name: "SoulSig #5289",
                collection: "MindMash SoulSig",
                mintAddress: "7xDy3LNmQdUgV7TcCVkS3bFbEJsWcPyTmTX9Nag7yVUc",
                network: "Solana",
                type: "Soulbound NFT",
              })
              playSound("/sounds/feature-select.mp3")
            }, 500)
            return 100
          }
          return prev + 2
        })
      }, 100)

      return () => clearInterval(interval)
    }
  }, [isMinting, playSound])

  const handleMint = () => {
    setIsMinting(true)
    playSound("/sounds/feature-select.mp3")
  }

  const handleContinue = () => {
    playSound("/sounds/button-click.mp3")
    router.push("/onboarding/complete")
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
            Mint Your SoulSig
          </h1>
          <p className="text-gray-400">Your unique identity in the MindMash ecosystem</p>
        </div>

        <div className="mb-8">
          <Progress
            value={100}
            className="h-2 bg-gray-800"
            style={{
              boxShadow: "0 0 10px rgba(139, 92, 246, 0.5), 0 0 20px rgba(139, 92, 246, 0.3)",
              background: "linear-gradient(90deg, rgba(17, 24, 39, 1) 0%, rgba(17, 24, 39, 0.7) 100%)",
            }}
          />
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span className="text-purple-400">SynBot</span>
            <span className="text-purple-400">Wallet</span>
            <span className="text-purple-400">SoulSig</span>
          </div>
        </div>

        <Card className="bg-gray-900/50 border-purple-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-center flex items-center justify-center">
              <Fingerprint className="h-5 w-5 mr-2 text-purple-400" />
              SoulSig NFT
            </CardTitle>
            <CardDescription className="text-center">
              Mint your soulbound NFT to connect with your SynBot
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center mb-4 relative">
              {/* Trading card style NFT display */}
              <div
                className="relative overflow-hidden border-2 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                style={{
                  width: "180px",
                  height: "250px",
                  borderRadius: "10px",
                  margin: "0 auto",
                }}
              >
                <img src="/images/soulsig-nft-image.png" alt="SoulSig NFT" className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <h3 className="text-cyan-400 font-bold text-lg mb-0.5">SoulSig</h3>
                  <p className="text-cyan-100 text-xs">Your digital identity token</p>
                </div>
              </div>

              {mintComplete && (
                <div
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    backgroundColor: "rgba(34, 197, 94, 0.8)",
                    borderRadius: "9999px",
                    padding: "4px",
                    zIndex: 10,
                  }}
                >
                  <Check style={{ width: "16px", height: "16px", color: "white" }} />
                </div>
              )}
            </div>

            {!mintComplete ? (
              <div className="space-y-4">
                <div className="p-4 bg-black/30 border border-gray-700 rounded-lg space-y-2">
                  <h3 className="text-sm font-medium text-purple-400 mb-2">About SoulSig NFTs:</h3>
                  <p className="text-white text-sm mb-3">
                    Your SoulSig is a soulbound NFT that represents your unique identity in the MindMash ecosystem. It
                    connects to your SynBot and enables special features and permissions.
                  </p>
                  <p className="text-white text-sm mb-3">
                    As a soulbound token, your SoulSig cannot be transferred or sold - it's uniquely yours and evolves
                    with your journey through MindMash.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start text-sm">
                      <span className="text-purple-400 mr-2">•</span>
                      <span className="text-white">Soulbound NFTs that represent your unique identity in MindMash</span>
                    </li>
                    <li className="flex items-start text-sm">
                      <span className="text-purple-400 mr-2">•</span>
                      <span className="text-white">Cannot be transferred or sold - uniquely yours forever</span>
                    </li>
                    <li className="flex items-start text-sm">
                      <span className="text-purple-400 mr-2">•</span>
                      <span className="text-white">Connects to your SynBot and enables special features</span>
                    </li>
                    <li className="flex items-start text-sm">
                      <span className="text-purple-400 mr-2">•</span>
                      <span className="text-white">Evolves based on your contributions and interactions</span>
                    </li>
                  </ul>
                </div>

                {isMinting && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-white">
                      <span>Minting SoulSig...</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden relative">
                      <div
                        className="h-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-cyan-500 absolute top-0 left-0 transition-all duration-200 ease-out"
                        style={{
                          width: `${progress}%`,
                          boxShadow: "0 0 10px #8b5cf6, 0 0 20px #8b5cf6",
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                      </div>
                    </div>
                    <div className="text-xs text-white">
                      {progress < 25 && "Preparing metadata..."}
                      {progress >= 25 && progress < 50 && "Connecting to Solana network..."}
                      {progress >= 50 && progress < 75 && "Creating on-chain transaction..."}
                      {progress >= 75 && progress < 100 && "Finalizing mint..."}
                      {progress >= 100 && "Mint complete!"}
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleMint}
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                  disabled={isMinting}
                >
                  {isMinting ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Minting...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      Mint SoulSig NFT
                      <Sparkles className="ml-2 h-4 w-4" />
                    </div>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-green-400 font-medium">SoulSig Minted Successfully!</p>
                    <p className="text-xs text-gray-400">Your SoulSig is now in your wallet</p>
                  </div>
                </div>

                <div className="p-4 bg-black/30 border border-gray-700 rounded-lg space-y-2">
                  <h3 className="text-sm font-medium text-purple-400 mb-2">NFT Details:</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Name:</span>
                      <span className="text-sm text-white">{nftDetails.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Collection:</span>
                      <span className="text-sm text-white">{nftDetails.collection}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Mint Address:</span>
                      <span className="text-sm font-mono text-xs bg-black/50 px-2 py-1 rounded text-purple-300">
                        {nftDetails.mintAddress.substring(0, 6)}...
                        {nftDetails.mintAddress.substring(nftDetails.mintAddress.length - 4)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Network:</span>
                      <span className="text-sm text-white">Solana</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Type:</span>
                      <span className="text-sm text-white">{nftDetails.type}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/onboarding/wallet">
              <Button variant="outline" className="border-gray-700 text-gray-400 hover:bg-gray-800">
                Back
              </Button>
            </Link>
            {mintComplete ? (
              <Button
                onClick={handleContinue}
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
              >
                Continue to SynBot
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="outline"
                className="border-purple-500/50 text-purple-400 hover:bg-purple-900/20"
                onClick={() => {
                  router.push("/onboarding/complete")
                  playSound("/sounds/button-click.mp3")
                }}
                disabled={isMinting && progress < 100}
              >
                Skip
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
