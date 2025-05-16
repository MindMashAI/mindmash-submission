"use client"

import { useState, useEffect, useCallback } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSolBalance, getTokenAccounts, estimatePortfolioValue, getMockData } from "@/lib/solana-helpers"
import { RefreshCw, TrendingUp, DollarSign, AlertTriangle } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

interface TokenBalance {
  name: string
  symbol: string
  balance: number
  value: number
  color: string
}

export function PortfolioAnalytics() {
  const { publicKey, connected, wallet } = useWallet()
  const [loading, setLoading] = useState(false)
  const [solBalance, setSolBalance] = useState(0)
  const [tokens, setTokens] = useState<TokenBalance[]>([])
  const [totalValue, setTotalValue] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [useMockData, setUseMockData] = useState(false)
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null)

  const fetchPortfolio = useCallback(async () => {
    if (!publicKey || !connected) return

    setLoading(true)
    setError(null)
    setUseMockData(false)

    try {
      // Use the wallet's connection if available
      if (wallet?.adapter?.connection) {
        // Get SOL balance
        const sol = await getSolBalance(publicKey, wallet.adapter.connection)
        setSolBalance(sol)

        // Get token balances
        const tokenAccounts = await getTokenAccounts(publicKey, wallet.adapter.connection)

        // Estimate portfolio value
        const portfolio = await estimatePortfolioValue(sol, tokenAccounts)
        setTotalValue(portfolio.totalValue)

        // Create token list with colors for chart
        const colors = ["#f59e0b", "#8b5cf6", "#10b981", "#3b82f6", "#ec4899"]

        const tokenList: TokenBalance[] = [
          {
            name: "Solana",
            symbol: "SOL",
            balance: sol,
            value: portfolio.breakdown.SOL,
            color: "#f59e0b",
          },
        ]

        // Add other tokens
        if (tokenAccounts.length > 0) {
          tokenAccounts.forEach((token, index) => {
            tokenList.push({
              name: token.mint.substring(0, 8) + "...",
              symbol: token.mint === "MashBiTTokenMint123456789" ? "MB" : `TKN${index + 1}`,
              balance: token.uiAmount,
              value: token.mint === "MashBiTTokenMint123456789" ? portfolio.breakdown.MB || 0 : 0,
              color: colors[index % colors.length],
            })
          })
        } else {
          // If no tokens found, add a sample Mash.BiT token
          tokenList.push({
            name: "Mash.BiT",
            symbol: "MB",
            balance: 1250,
            value: 625,
            color: "#8b5cf6",
          })
          setUseMockData(true)
        }

        setTokens(tokenList)
        setLastRefreshed(new Date())

        toast({
          title: "Portfolio Updated",
          description: "Your portfolio data has been refreshed",
        })
      } else {
        throw new Error("Wallet connection not available")
      }
    } catch (error) {
      console.error("Error fetching portfolio:", error)
      setError("Failed to fetch portfolio data. Using demo data instead.")

      // Use mock data as fallback
      const mockData = getMockData()
      setSolBalance(mockData.solBalance)
      setTokens([
        {
          name: "Solana",
          symbol: "SOL",
          balance: mockData.solBalance,
          value: mockData.solBalance * 150, // Mock SOL price
          color: "#f59e0b",
        },
        ...mockData.tokens,
      ])
      setTotalValue(mockData.totalValue)
      setUseMockData(true)
    } finally {
      setLoading(false)
    }
  }, [publicKey, connected, wallet?.adapter?.connection])

  useEffect(() => {
    fetchPortfolio()
  }, [publicKey, connected, fetchPortfolio])

  // Prepare data for pie chart
  const chartData = tokens.map((token) => ({
    name: token.symbol,
    value: token.value,
  }))

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Portfolio Analytics</CardTitle>
          <CardDescription className="text-gray-400">Track your assets and performance</CardDescription>
        </div>
        {connected && (
          <Button
            variant="outline"
            size="sm"
            className="text-amber-400 border-amber-700 hover:bg-amber-900/20"
            onClick={fetchPortfolio}
            disabled={loading}
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <RefreshCw className="h-8 w-8 text-amber-500 animate-spin" />
          </div>
        ) : !connected ? (
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 mx-auto text-gray-600 mb-2" />
            <p className="text-gray-400">Connect your wallet to view your portfolio</p>
          </div>
        ) : (
          <div className="space-y-6">
            {useMockData && (
              <div className="bg-amber-900/20 border border-amber-800/50 p-3 rounded-lg">
                <div className="flex items-start">
                  <AlertTriangle className="text-amber-400 mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                  <p className="text-amber-400 text-sm">
                    Showing sample portfolio data for demonstration. Your actual balance is displayed when available.
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-900/20 border border-red-800/50 p-3 rounded-lg">
                <div className="flex items-start">
                  <AlertTriangle className="text-red-400 mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              </div>
            )}

            {lastRefreshed && (
              <div className="text-xs text-gray-400 text-right">Last updated: {lastRefreshed.toLocaleTimeString()}</div>
            )}

            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-400">Total Portfolio Value</h3>
                <DollarSign className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Asset Distribution</h3>
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
                        {tokens.map((token, index) => (
                          <Cell key={`cell-${index}`} fill={token.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Assets</h3>
                <div className="space-y-2">
                  {tokens.map((token, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full mr-2" style={{ backgroundColor: token.color }}></div>
                        <div>
                          <p className="font-medium">{token.symbol}</p>
                          <p className="text-xs text-gray-400">{token.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{token.balance.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">${token.value.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
