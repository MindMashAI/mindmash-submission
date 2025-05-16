"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import NeuralConnectionEffect from "@/components/neural-connection-effect"
import { Button } from "@/components/ui/button"
import { useAudio } from "@/components/audio-manager"
import { Brain, Presentation } from "lucide-react"
import { WalletBalanceDisplay } from "@/components/wallet-balance-display"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const router = useRouter()
  const { playSound } = useAudio()
  const isDemo = searchParams.get("demo") === "true"

  useEffect(() => {
    // Demo = mock data
    setTimeout(() => {
      setUser({
        display_name: isDemo ? "Demo User" : "MindMash User",
        wallet_address: isDemo ? "Demo Mode - No Wallet Connected" : "8ZaDMEy1MrBNxTW3TxNQgJgxKkfYbNHPJbHX4AYMKq9V",
        created_at: new Date().toISOString(),
      })
      setLoading(false)
    }, 1000)
  }, [isDemo])

  const handleViewPitchDeck = () => {
    playSound("/sounds/slide-change.mp3")
    router.push("/demo")
  }

  return (
    <div className="relative min-h-screen bg-black">
      {/* Neural background effect */}
      <div className="absolute inset-0 z-0">
        <NeuralConnectionEffect />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6 border-b border-gray-800">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-full flex items-center justify-center">
            <Brain className="h-4 w-4 text-white" />
          </div>
          <h1 className="ml-2 text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            MindMash.AI
          </h1>
        </div>
        <Button
          variant="ghost"
          onClick={() => {
            playSound("/sounds/button-click.mp3")
            router.push("/")
          }}
          className="text-gray-400 hover:text-cyan-400"
        >
          Sign Out
        </Button>
      </header>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900/80 backdrop-blur-md border border-purple-500/30 rounded-lg shadow-2xl overflow-hidden">
            <div className="p-6">
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-6">
                MindMash.AI Dashboard
              </h1>

              {loading ? (
                <div className="py-8 text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent mb-4"></div>
                  <p className="text-gray-400">Loading your neural profile...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Pitch Deck Promo */}
                  <div className="p-6 bg-gradient-to-br from-purple-900/30 to-cyan-900/30 rounded-lg border border-purple-500/30">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                      <div className="mb-4 md:mb-0">
                        <h2 className="text-xl font-bold text-white">View Our Pitch Deck</h2>
                        <p className="text-gray-400 mt-1">
                          Explore the full MindMash.AI presentation and learn about our vision
                        </p>
                      </div>
                      <Button
                        onClick={handleViewPitchDeck}
                        className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white"
                      >
                        View Pitch Deck
                        <Presentation className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <h2 className="text-xl font-semibold text-white mb-4">Your Neural Profile</h2>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Display Name:</span>
                        <span className="text-white font-medium">{user.display_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Wallet Address:</span>
                        <span className="text-white font-mono text-sm truncate max-w-[250px]">
                          {user.wallet_address}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Joined:</span>
                        <span className="text-white">{new Date(user.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                      <h2 className="text-lg font-semibold text-white mb-3">Neural Activity</h2>
                      <div className="h-32 flex items-center justify-center">
                        <p className="text-gray-400 text-center">No neural activity recorded yet</p>
                      </div>
                    </div>

                    <div className="col-span-1">
                      <WalletBalanceDisplay
                        walletAddress="5Gh7Yt5KJ3bCmFhaUAHxBRPQJqNWmqxiKZbW5r9NcbtY"
                        showChart={true}
                        compact={false}
                      />
                    </div>

                    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                      <h2 className="text-lg font-semibold text-white mb-3">Thought Clusters</h2>
                      <div className="h-32 flex items-center justify-center">
                        <p className="text-gray-400 text-center">No thought clusters joined yet</p>
                      </div>
                    </div>
                  </div>

                  {isDemo && (
                    <div className="p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
                      <p className="text-yellow-400 text-sm">
                        You are currently in demo mode. To access all features, please sign in with your Solana wallet.
                      </p>
                      <div className="mt-4">
                        <Button
                          onClick={() => {
                            playSound("/sounds/button-click.mp3")
                            router.push("/auth")
                          }}
                          className="bg-gradient-to-r from-yellow-600 to-yellow-800 hover:from-yellow-700 hover:to-yellow-900 text-white"
                        >
                          Sign In with Wallet
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
