"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAudio } from "@/components/audio-manager"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Wallet, Mail, ArrowRight, Check, Loader2, Shield, Cpu, Sparkles } from "lucide-react"

export default function WalletCreationPage() {
  const [email, setEmail] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [walletCreated, setWalletCreated] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const router = useRouter()
  const { playSound } = useAudio()
  const { toast } = useToast()

  // Handle wallet creation progress
  useEffect(() => {
    if (isCreating) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setTimeout(() => {
              setWalletCreated(true)
              setWalletAddress("8xDy3LNmQdUgV7TcCVkS3bFbEJsWcPyTmTX9Nag7yVUc")
              playSound("/sounds/feature-select.mp3")
            }, 500)
            return 100
          }
          return prev + 2
        })
      }, 100)

      return () => clearInterval(interval)
    }
  }, [isCreating, playSound])

  const handleCreateWallet = (e) => {
    e.preventDefault()

    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)
    playSound("/sounds/feature-select.mp3")
  }

  const handleContinue = () => {
    playSound("/sounds/button-click.mp3")
    router.push("/onboarding/mint")
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress)
    playSound("/sounds/button-click.mp3")
    toast({
      title: "Copied to clipboard",
      description: "Wallet address has been copied to your clipboard",
    })
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
            Create Your Wallet
          </h1>
          <p className="text-gray-400">Powered by Crossmint</p>
        </div>

        <div className="mb-8">
          <Progress
            value={66}
            className="h-2 bg-gray-800"
            style={{
              boxShadow: "0 0 10px rgba(139, 92, 246, 0.5), 0 0 20px rgba(139, 92, 246, 0.3)",
              background: "linear-gradient(90deg, rgba(17, 24, 39, 1) 0%, rgba(17, 24, 39, 0.7) 100%)",
            }}
          />
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span className="text-purple-400">SynBot</span>
            <span className="text-purple-400">Wallet</span>
            <span className="">SoulSig</span>
          </div>
        </div>

        <Card className="bg-gray-900/50 border-purple-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-center flex items-center justify-center">
              <Wallet className="h-5 w-5 mr-2 text-purple-400" />
              Solana Smart Wallet
            </CardTitle>
            <CardDescription className="text-center">Create your non-custodial Solana wallet</CardDescription>
          </CardHeader>
          <CardContent>
            {!walletCreated ? (
              <form onSubmit={handleCreateWallet} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-white">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 bg-black/30 border-gray-700 text-white w-full px-3 py-2 rounded-md border"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isCreating}
                    />
                  </div>
                  <p className="text-xs text-gray-400">We'll use this email to create your Crossmint wallet</p>
                </div>

                <div className="p-4 bg-black/30 border border-purple-500/30 rounded-lg">
                  <p className="text-white text-sm mb-3">
                    We'll create a Solana smart wallet for you using Crossmint's technology. This wallet will store your
                    SoulSig NFT and MINDMASH tokens.
                  </p>
                  <p className="text-white text-sm">
                    Your wallet is non-custodial, meaning you have full control over your assets. Your SynBot can help
                    you manage your wallet and transactions.
                  </p>
                </div>

                {isCreating && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-white">
                      <span>Creating wallet...</span>
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
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Wallet...
                    </div>
                  ) : (
                    "Create Wallet"
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-green-400 font-medium">Wallet Created Successfully!</p>
                    <p className="text-xs text-gray-400">Your Solana wallet is ready to use</p>
                  </div>
                </div>

                {/* Wallet Info */}
                <div className="p-4 bg-black/30 border border-gray-800 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Wallet Address:</span>
                    <span className="text-sm font-mono text-white">8xDy3L...yVUc</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Network:</span>
                    <span className="text-sm text-white">Solana</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Status:</span>
                    <span className="text-sm text-green-400">Active</span>
                  </div>
                </div>

                {/* Wallet Features */}
                <div className="p-4 bg-black/30 border border-purple-500/30 rounded-lg">
                  <h3 className="text-lg font-medium text-purple-400 mb-2">Wallet Features:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span className="text-gray-300">Store and manage SoulSig NFTs and MINDMASH tokens</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span className="text-gray-300">Participate in governance and token-based incentives</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span className="text-gray-300">Secure, non-custodial control of your assets</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span className="text-gray-300">SynBot-assisted wallet management</span>
                    </li>
                  </ul>
                </div>

                {/* Wallet Balance */}
                <div className="mt-4">
                  <div className="p-4 rounded-lg bg-black/30 border border-gray-800">
                    <h3 className="text-sm font-medium mb-3 flex items-center">
                      <Wallet className="h-4 w-4 mr-2 text-purple-400" />
                      Wallet Balance
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">SOL Balance:</span>
                        <span className="text-sm text-white">0.00 SOL</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">USD Value:</span>
                        <span className="text-sm text-white">$0.00</span>
                      </div>
                      <div className="h-1 bg-gray-800 rounded-full overflow-hidden mt-2 relative">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 absolute top-0 left-0"
                          style={{
                            width: "0%",
                            boxShadow: "0 0 8px #d946ef, 0 0 15px #d946ef",
                          }}
                        />
                      </div>
                      <p className="text-xs text-center text-gray-400 mt-2">Your wallet is ready to receive funds</p>
                    </div>
                  </div>
                </div>

                <div className="text-center text-sm text-gray-400 mt-4">
                  <p>Your wallet is now ready! Next, you'll mint your SoulSig NFT to connect with your SynBot.</p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/onboarding">
              <Button variant="outline" className="border-gray-700 text-gray-400 hover:bg-gray-800">
                Back
              </Button>
            </Link>
            {walletCreated ? (
              <Button
                onClick={handleContinue}
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
              >
                Continue to Mint SoulSig
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="outline"
                className="border-purple-500/50 text-purple-400 hover:bg-purple-900/20"
                onClick={() => {
                  router.push("/onboarding/mint")
                  playSound("/sounds/button-click.mp3")
                }}
                disabled={isCreating && progress < 100}
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
