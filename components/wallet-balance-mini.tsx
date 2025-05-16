"\"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Wallet } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { WalletBalanceDisplay } from "./wallet-balance-display"

interface WalletBalanceMiniProps {
  walletAddress?: string
}

export function WalletBalanceMini({ walletAddress }: WalletBalanceMiniProps) {
  const [loading, setLoading] = useState(true)
  const [solBalance, setSolBalance] = useState<number | null>(null)
  const [mbBalance, setMbBalance] = useState<number | null>(null)

  // Simulate fetching wallet data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data
      setSolBalance(4.2069)
      setMbBalance(1250)
      setLoading(false)
    }

    fetchData()
  }, [])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="border-cyan-700 text-cyan-400 hover:bg-cyan-900/20">
          <Wallet className="h-4 w-4 mr-2" />
          {loading ? (
            <Skeleton className="h-4 w-16 bg-gray-700" />
          ) : (
            <span>
              {solBalance?.toFixed(2)} SOL | {mbBalance?.toLocaleString()} MB
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-gray-900 border-gray-800">
        <WalletBalanceDisplay walletAddress={walletAddress} showChart={false} compact={true} />
      </PopoverContent>
    </Popover>
  )
}
