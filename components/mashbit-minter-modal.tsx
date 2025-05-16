"use client"

import { useState, useEffect } from "react"
import { X, Wallet, CheckCircle, Download, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAudio } from "@/components/audio-manager"
import CrossmintCheckoutWrapper from "./crossmint-checkout-wrapper"

interface MashbitMinterModalProps {
  isOpen: boolean
  onClose: () => void
  currentTokens: number
}

export default function MashbitMinterModal({ isOpen, onClose, currentTokens }: MashbitMinterModalProps) {
  const { playSound } = useAudio()
  const [step, setStep] = useState(1)
  const [recipient, setRecipient] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [price, setPrice] = useState<string | null>(null)
  const [loadingPrice, setLoadingPrice] = useState(false)
  const [useFallbackMinting, setUseFallbackMinting] = useState(false)
  const [isMinting, setIsMinting] = useState(false)

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setRecipient("")
      setError(null)
      setPrice(null)
      setUseFallbackMinting(false)
      setIsMinting(false)
    }
  }, [isOpen])

  // Fetch collection price when modal opens
  useEffect(() => {
    if (isOpen && step === 1) {
      const fetchPrice = async () => {
        setLoadingPrice(true)
        try {
          const response = await fetch("/api/get-collection-info", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Failed to fetch collection info")
          }

          const data = await response.json()
          console.log("Collection info:", data)
          setPrice(data.payments?.price || "0")
        } catch (err: any) {
          console.error("Error fetching price:", err)
          setError("Failed to load collection price: " + err.message)
        } finally {
          setLoadingPrice(false)
        }
      }

      fetchPrice()
    }
  }, [isOpen, step])

  const handleConnectWallet = () => {
    if (!recipient) {
      setError("Please provide a wallet address or email")
      return
    }
    playSound("/sounds/button-click.mp3")
    setStep(2)
  }

  const handleCheckoutEvent = (event: any) => {
    console.log("Crossmint checkout event:", event)

    if (event.type === "payment:process.succeeded") {
      playSound("/sounds/feature-select.mp3")
      setStep(3)
    } else if (event.type.includes("failed") || event.type.includes("rejected")) {
      setError("Checkout failed: " + (event.payload?.message || "Unknown error"))
      setStep(1)
    } else if (event.type === "error") {
      // If there's an error with the Crossmint component, switch to fallback
      setUseFallbackMinting(true)
    }
  }

  const handleFallbackMint = async () => {
    setIsMinting(true)
    setError(null)
    playSound("/sounds/feature-select.mp3")

    try {
      console.log("Using fallback minting for recipient:", recipient)

      const response = await fetch("/api/mint-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipient: recipient.includes("@") ? `email:${recipient}:solana` : `wallet:${recipient}:solana`,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Minting failed")
      }

      const result = await response.json()
      console.log("Fallback minting successful:", result)

      setStep(3)
    } catch (err: any) {
      console.error("Fallback minting error:", err)
      setError(err.message || "Failed to mint token")
    } finally {
      setIsMinting(false)
    }
  }

  if (!isOpen) return null

  // Client ID for Crossmint - using the one provided in the example
  const clientId =
    "ck_staging_255qV8mwDwT4uuVWPCGsBYpDaRwXfuRGzy5ZYSVAnLxw416dRU2dbYiji7nEgQKBd1d4q5NvKczVtTXj5LKvMXZBBba4zWdKVQ2fbFb62Sc1abotvynrafmzHXiiME9bqHduGKboMEA8rejx5njuMtB8Chjmpp8Z5EHyyABeKTAxnpWKjUzuf2f8Fd1RshxEGixaHk9ndpjDcNnnUgE7ASe"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-black/90 border border-cyan-900/50 rounded-lg shadow-lg shadow-cyan-500/20 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900/50 to-cyan-900/50 px-4 py-3 border-b border-cyan-900/50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            Mint Mash.BiT Token
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full hover:bg-black/50">
            <X className="h-4 w-4 text-gray-400" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && <div className="text-red-500 text-sm mb-4 bg-red-900/20 p-3 rounded">{error}</div>}

          {/* Step 1: Connect Wallet */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 mb-4">
                  <Wallet className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Connect Your Wallet</h3>
                <p className="text-gray-400 mb-4">Provide your wallet address or email to mint a Mash.BiT token.</p>
              </div>

              <div className="bg-black/60 border border-gray-800 rounded-md p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-300">Current Balance:</span>
                  <span className="text-cyan-400 font-bold">{currentTokens} Mash.BiT</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Price:</span>
                  {loadingPrice ? (
                    <span className="text-gray-400">Loading...</span>
                  ) : (
                    <span className="text-cyan-400 font-bold">{price && price !== "0" ? `${price} SOL` : "Free"}</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Enter wallet address or email"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full bg-black/60 border border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-cyan-500"
                />
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white py-2"
                  onClick={handleConnectWallet}
                  disabled={!recipient || loadingPrice}
                >
                  Connect
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Checkout (Embedded or Fallback) */}
          {step === 2 && !useFallbackMinting && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">Purchase Mash.BiT Token</h3>
                <p className="text-gray-400 mb-4">
                  Complete your purchase to mint one Mash.BiT token {price && price !== "0" ? `for ${price} SOL` : ""}.
                </p>
              </div>

              <div className="bg-black/60 border border-gray-800 rounded-md overflow-hidden">
                <CrossmintCheckoutWrapper
                  collectionId="bb74a5fe-efe4-4906-b44a-0b08b2796ef5"
                  environment="staging"
                  clientId={clientId}
                  mintConfig={{
                    quantity: 1,
                    totalPrice: price || "0",
                  }}
                  payment={{
                    fiat: { enabled: true },
                    crypto: { enabled: true },
                  }}
                  recipient={recipient.includes("@") ? `email:${recipient}` : `wallet:${recipient}:solana`}
                  onEvent={handleCheckoutEvent}
                  uiConfig={{
                    colors: {
                      background: "#1a1a1a",
                      surface: "#2a2a2a",
                      textPrimary: "#ffffff",
                      textSecondary: "#a0a0a0",
                      accent: "#00f6ff",
                    },
                  }}
                />
              </div>
            </div>
          )}

          {/* Step 2 Fallback: Direct Minting */}
          {step === 2 && useFallbackMinting && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 mb-4">
                  <Download className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Mint Mash.BiT Token</h3>
                <p className="text-gray-400 mb-4">
                  Mint one Mash.BiT token to your wallet {price && price !== "0" ? `for ${price} SOL` : ""}.
                </p>
              </div>

              <div className="bg-black/60 border border-gray-800 rounded-md p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-300">Recipient:</span>
                  <span className="text-green-400 text-sm break-all">{recipient}</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-300">Current Balance:</span>
                  <span className="text-cyan-400 font-bold">{currentTokens} Mash.BiT</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Price:</span>
                  <span className="text-cyan-400 font-bold">{price && price !== "0" ? `${price} SOL` : "Free"}</span>
                </div>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white py-2"
                onClick={handleFallbackMint}
                disabled={isMinting}
              >
                {isMinting ? (
                  <span className="flex items-center">
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Minting...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Download className="h-4 w-4 mr-2" /> Mint 1 Token
                  </span>
                )}
              </Button>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 mb-4">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Token Minted Successfully!</h3>
                <p className="text-gray-400 mb-4">Your Mash.BiT token has been added to your wallet.</p>
              </div>

              <div className="bg-black/60 border border-gray-800 rounded-md p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-300">Previous Balance:</span>
                  <span className="text-gray-400 font-bold">{currentTokens} Mash.BiT</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-300">Minted Amount:</span>
                  <span className="text-fuchsia-400 font-bold">+1 Mash.BiT</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">New Balance:</span>
                  <span className="text-cyan-400 font-bold">{currentTokens + 1} Mash.BiT</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white py-2"
                  onClick={onClose}
                >
                  Close
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-cyan-900/50 text-cyan-400 hover:bg-cyan-900/20"
                  onClick={() => {
                    setStep(1)
                    setRecipient("")
                  }}
                >
                  Mint Another Token
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
