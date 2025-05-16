"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { RefreshCw, Copy, Check, AlertTriangle, TrendingUp } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface TokenBalance {
  name: string
  symbol: string
  balance: number
  value: number
  color: string
}

interface WalletBalanceDisplayProps {
  walletAddress?: string
  className?: string
  showChart?: boolean
  showActions?: boolean
  compact?: boolean
}

export function WalletBalanceDisplay({
  walletAddress,
  className = "",
  showChart = true,
  showActions = true,
  compact = false,
}: WalletBalanceDisplayProps) {
  const [loading, setLoading] = useState(true)
  const [solBalance, setSolBalance] = useState<number | null>(null)
  const [tokens, setTokens] = useState<TokenBalance[]>([])
  const [totalValue, setTotalValue] = useState(0)
  const [copied, setCopied] = useState(false)
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Simulate fetching wallet data
  const fetchWalletData = async () => {
    setLoading(true)
    setError(null)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    try {
      // Mock data for demonstration
      const mockSolBalance = 4.2069
      const mockTokens: TokenBalance[] = [
        {
          name: "Mash.BiT",
          symbol: "MB",
          balance: 1250,
          value: 625,
          color: "#8b5cf6",
        },
        {
          name: "SoulSig",
          symbol: "SOUL",
          balance: 1,
          value: 0, // Soulbound tokens have no transferable value
          color: "#ec4899",
        },
        {
          name: "SynToken",
          symbol: "SYN",
          balance: 75,
          value: 150,
          color: "#10b981",
        },
      ]

      setSolBalance(mockSolBalance)
      setTokens(mockTokens)
      setTotalValue(mockSolBalance * 150 + mockTokens.reduce((acc, token) => acc + token.value, 0))
      setLastRefreshed(new Date())

      toast({
        title: "Wallet Updated",
        description: "Your wallet data has been refreshed",
      })
    } catch (error) {
      console.error("Error fetching wallet data:", error)
      setError("Failed to fetch wallet data. Please try again.")

      toast({
        title: "Error",
        description: "Failed to fetch wallet data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Copy wallet address to clipboard
  const copyToClipboard = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)

      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      })
    }
  }

  // Fetch data on initial load
  useEffect(() => {
    fetchWalletData()
  }, [])

  // Prepare data for pie chart
  const chartData = tokens.map((token) => ({
    name: token.symbol,
    value: token.value > 0 ? token.value : 0.1, // Ensure soulbound tokens still show in chart
  }))

  // Add SOL to chart data
  if (solBalance) {
    chartData.unshift({
      name: "SOL",
      value: solBalance * 150, // Mock SOL price
    })
  }

  return (
    <Card className={`bg-gray-900 border-gray-800 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-cyber tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            Wallet Balance
          </CardTitle>
          <CardDescription className="text-gray-400">Your digital assets</CardDescription>
        </div>
        {showActions && (
          <Button
            variant="outline"
            size="sm"
            className="text-cyan-400 border-cyan-700 hover:bg-cyan-900/20"
            onClick={fetchWalletData}
            disabled={loading}
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <div className="bg-red-900/20 border border-red-800/50 p-3 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="text-red-400 mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          </div>
        )}

        {walletAddress && (
          <div className="p-2 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">Wallet Address</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/20 p-0"
                onClick={copyToClipboard}
              >
                {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <div className="bg-black/50 p-1 rounded border border-gray-700 break-all text-xs font-mono">
              {walletAddress}
            </div>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-400">Total Portfolio Value</span>
            <TrendingUp className="h-3 w-3 text-green-500" />
          </div>
          {loading ? (
            <Skeleton className="h-7 w-32 bg-gray-700" />
          ) : (
            <p className="text-xl font-bold">${totalValue.toLocaleString()}</p>
          )}
        </div>

        {!compact && showChart && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs font-medium text-gray-400 mb-2">Asset Distribution</h3>
              {loading ? (
                <div className="h-[200px] flex items-center justify-center">
                  <RefreshCw className="h-8 w-8 text-cyan-500 animate-spin" />
                </div>
              ) : (
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {[...tokens, { name: "Solana", symbol: "SOL", balance: 0, value: 0, color: "#f59e0b" }].map(
                          (token, index) => (
                            <Cell key={`cell-${index}`} fill={token.color} />
                          ),
                        )}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-xs font-medium text-gray-400 mb-2">Assets</h3>
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                {loading ? (
                  <>
                    <Skeleton className="h-12 w-full bg-gray-700" />
                    <Skeleton className="h-12 w-full bg-gray-700" />
                    <Skeleton className="h-12 w-full bg-gray-700" />
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between p-2 bg-gray-800 rounded border border-amber-800/30">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full mr-2 bg-amber-600 flex items-center justify-center">
                          <span className="text-xs font-bold">SOL</span>
                        </div>
                        <div>
                          <p className="font-medium">Solana</p>
                          <p className="text-xs text-gray-400">Native Token</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{solBalance?.toFixed(4)}</p>
                        <p className="text-xs text-gray-400">${(solBalance! * 150).toLocaleString()}</p>
                      </div>
                    </div>

                    {tokens.map((token, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-2 bg-gray-800 rounded border ${
                          token.symbol === "SOUL" ? "border-pink-800/30" : "border-purple-800/30"
                        }`}
                      >
                        <div className="flex items-center">
                          <div
                            className="w-6 h-6 rounded-full mr-2 flex items-center justify-center"
                            style={{ backgroundColor: token.color }}
                          >
                            <span className="text-xs font-bold">{token.symbol.substring(0, 2)}</span>
                          </div>
                          <div>
                            <div className="flex items-center">
                              <p className="font-medium">{token.name}</p>
                              {token.symbol === "SOUL" && (
                                <Badge variant="outline" className="ml-2 text-[10px] border-pink-800 text-pink-400">
                                  Soulbound
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-400">{token.symbol}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{token.balance.toLocaleString()}</p>
                          <p className="text-xs text-gray-400">
                            {token.symbol === "SOUL" ? "Non-transferable" : `$${token.value.toLocaleString()}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {compact && (
          <div className="space-y-2">
            {loading ? (
              <>
                <Skeleton className="h-12 w-full bg-gray-700" />
                <Skeleton className="h-12 w-full bg-gray-700" />
              </>
            ) : (
              <>
                <div className="flex items-center justify-between p-2 bg-gray-800 rounded border border-amber-800/30">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full mr-2 bg-amber-600 flex items-center justify-center">
                      <span className="text-xs font-bold">SOL</span>
                    </div>
                    <p className="font-medium">Solana</p>
                  </div>
                  <p className="font-medium">{solBalance?.toFixed(4)}</p>
                </div>

                {tokens.map((token, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-2 bg-gray-800 rounded border ${
                      token.symbol === "SOUL" ? "border-pink-800/30" : "border-purple-800/30"
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className="w-6 h-6 rounded-full mr-2 flex items-center justify-center"
                        style={{ backgroundColor: token.color }}
                      >
                        <span className="text-xs font-bold">{token.symbol.substring(0, 2)}</span>
                      </div>
                      <p className="font-medium">{token.name}</p>
                      {token.symbol === "SOUL" && (
                        <Badge variant="outline" className="ml-2 text-[10px] border-pink-800 text-pink-400">
                          Soulbound
                        </Badge>
                      )}
                    </div>
                    <p className="font-medium">{token.balance.toLocaleString()}</p>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {lastRefreshed && (
          <div className="text-xs text-gray-500 text-right">Last updated: {lastRefreshed.toLocaleTimeString()}</div>
        )}
      </CardContent>
    </Card>
  )
}
