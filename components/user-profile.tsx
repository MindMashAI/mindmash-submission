"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Copy, ExternalLink, RefreshCw } from "lucide-react"
import { useAudio } from "@/components/audio-manager"
import { getUserProfile, type User } from "@/lib/db-utils"
import { WalletBalanceMini } from "@/components/wallet-balance-mini"

export default function UserProfile() {
  const [profile, setProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [copied, setCopied] = useState(false)
  const { playSound } = useAudio()

  const fetchProfile = async () => {
    try {
      // Get user from localStorage
      const storedUser = localStorage.getItem("mindmash_user")
      if (!storedUser) {
        setLoading(false)
        return
      }

      const user = JSON.parse(storedUser)

      // Fetch the latest data from Supabase
      const latestProfile = await getUserProfile(user.user_id)
      if (latestProfile) {
        setProfile(latestProfile)
        // Update localStorage with latest data
        localStorage.setItem("mindmash_user", JSON.stringify(latestProfile))
      } else {
        setProfile(user)
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    playSound("/sounds/button-click.mp3")
    fetchProfile()
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    playSound("/sounds/button-click.mp3")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="p-6 bg-gradient-to-br from-gray-900 to-black rounded-lg border border-cyan-900/30">
        <div className="flex justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent"></div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="p-6 bg-gradient-to-br from-gray-900 to-black rounded-lg border border-cyan-900/30">
        <p className="text-gray-400">No profile found. Please sign in.</p>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gradient-to-br from-gray-900 to-black rounded-lg border border-cyan-900/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-purple-900/50 rounded-full flex items-center justify-center mr-4">
            <span className="text-lg font-bold text-purple-400">{profile.display_name.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              {profile.display_name}
            </h3>
            <p className="text-sm text-gray-400">Joined {new Date(profile.created_at).toLocaleDateString()}</p>
            <div className="mt-2">
              <WalletBalanceMini />
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/20"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-400 mb-2">Solana Wallet</h4>
        <div className="flex items-center bg-black/50 p-3 rounded-md border border-cyan-900/30">
          <span className="text-xs text-gray-300 truncate flex-1">{profile.wallet_address}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(profile.wallet_address)}
            className="ml-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/20"
          >
            {copied ? <span className="text-green-400 text-xs">Copied!</span> : <Copy className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              playSound("/sounds/button-click.mp3")
              window.open(`https://explorer.solana.com/address/${profile.wallet_address}?cluster=devnet`, "_blank")
            }}
            className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/20"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-black/30 p-4 rounded-md border border-cyan-900/20">
          <h4 className="text-sm font-medium text-gray-400 mb-1">Balance</h4>
          <p className="text-lg font-bold text-cyan-400">0.00 SOL</p>
        </div>
        <div className="bg-black/30 p-4 rounded-md border border-cyan-900/20">
          <h4 className="text-sm font-medium text-gray-400 mb-1">Mash.BiT</h4>
          <p className="text-lg font-bold text-purple-400">0 MASH</p>
        </div>
      </div>

      <div className="mt-6">
        <Button
          onClick={() => playSound("/sounds/button-click.mp3")}
          className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white"
        >
          Fund Wallet
        </Button>
      </div>
    </div>
  )
}
