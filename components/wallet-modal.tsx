"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Copy, RefreshCw, TrendingUp } from "lucide-react"
import { useAudio } from "@/components/audio-manager"

interface WalletModalProps {
  isOpen: boolean
  onClose: () => void
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const { playSound } = useAudio()
  const [lastUpdated, setLastUpdated] = useState<string>("4:44:14 PM")

  // Mock wallet data
  const walletAddress = "5Gh7YtSKJ3bCmFhaUAHxBRPJqNmqx1KZoW5r9Ncb1Y"
  const totalValue = "$1,406.035"
  const assets = [
    { name: "Solana", symbol: "SOL", balance: "4.2069", color: "#f59e0b" },
    { name: "Mash.BiT", symbol: "MB", balance: "1,250", color: "#8b5cf6" },
    { name: "SoulSig", symbol: "SO", balance: "1", color: "#ec4899", soulbound: true },
    { name: "SynToken", symbol: "SY", balance: "75", color: "#10b981" },
  ]

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    playSound("/sounds/button-click.mp3")
    setTimeout(() => setCopied(false), 2000)
  }

  const refreshWallet = () => {
    setLoading(true)
    playSound("/sounds/button-click.mp3")

    // Simulate loading
    setTimeout(() => {
      setLoading(false)
      setLastUpdated(new Date().toLocaleTimeString())
    }, 1500)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 flex items-center justify-between">
            <span>Wallet Balance</span>
            <Button
              variant="outline"
              size="sm"
              className="text-cyan-400 border-cyan-700 hover:bg-cyan-900/20"
              onClick={refreshWallet}
              disabled={loading}
            >
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
          </DialogTitle>
          <p className="text-gray-400 text-sm">Your digital assets</p>
        </DialogHeader>

        {/* Wallet Address */}
        <div className="p-2 bg-gray-800 rounded-lg border border-gray-700 mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400">Wallet Address</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/20 p-0"
              onClick={copyToClipboard}
            >
              {copied ? "Copied" : "Copy"}
              <Copy className="h-3 w-3 ml-1" />
            </Button>
          </div>
          <div className="bg-black/50 p-1 rounded border border-gray-700 break-all text-xs font-mono">
            {walletAddress}
          </div>
        </div>

        {/* Total Value */}
        <div className="bg-gray-800 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-400">Total Portfolio Value</span>
            <TrendingUp className="h-3 w-3 text-green-500" />
          </div>
          <p className="text-xl font-bold">{totalValue}</p>
        </div>

        {/* Assets List */}
        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
          {assets.map((asset, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-2 bg-gray-800 rounded border ${
                asset.soulbound
                  ? "border-pink-800/30"
                  : asset.symbol === "SOL"
                    ? "border-amber-800/30"
                    : "border-purple-800/30"
              }`}
            >
              <div className="flex items-center">
                <div
                  className="w-6 h-6 rounded-full mr-2 flex items-center justify-center"
                  style={{ backgroundColor: asset.color }}
                >
                  <span className="text-xs font-bold">{asset.symbol.substring(0, 2)}</span>
                </div>
                <div>
                  <p className="font-medium">{asset.name}</p>
                  {asset.soulbound && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-pink-900/50 text-pink-400 border border-pink-800/50">
                      Soulbound
                    </span>
                  )}
                </div>
              </div>
              <p className="font-medium">{asset.balance}</p>
            </div>
          ))}
        </div>

        <div className="text-xs text-gray-500 text-right mt-2">Last updated: {lastUpdated}</div>
      </DialogContent>
    </Dialog>
  )
}
