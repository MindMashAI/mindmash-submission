"use client"

import { useState } from "react"
import { EmergencyNFTDisplay } from "@/components/emergency-nft-display"
import { Button } from "@/components/ui/button"

export default function TestNFTPage() {
  const [size, setSize] = useState<"small" | "medium" | "large">("medium")
  const [showDebug, setShowDebug] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-8 text-center">NFT Display Test Page</h1>

      <div className="max-w-md mx-auto bg-gray-900/50 border border-purple-500/30 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-center">SoulSig NFT Display</h2>

        <div className="mb-6">
          <EmergencyNFTDisplay size={size} />
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <Button variant={size === "small" ? "default" : "outline"} onClick={() => setSize("small")}>
            Small
          </Button>
          <Button variant={size === "medium" ? "default" : "outline"} onClick={() => setSize("medium")}>
            Medium
          </Button>
          <Button variant={size === "large" ? "default" : "outline"} onClick={() => setSize("large")}>
            Large
          </Button>
        </div>

        <Button variant="outline" className="w-full" onClick={() => setShowDebug(!showDebug)}>
          {showDebug ? "Hide Debug Info" : "Show Debug Info"}
        </Button>

        {showDebug && (
          <div className="mt-4 p-4 bg-black/60 border border-gray-700 rounded text-xs font-mono overflow-auto">
            <div id="emergency-nft-log" className="text-green-400">
              Waiting for render...
            </div>
            <div className="mt-2 text-gray-400">Component Size: {size}</div>
            <div className="mt-2 text-gray-400">
              Browser: {typeof window !== "undefined" ? window.navigator.userAgent : "SSR"}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
