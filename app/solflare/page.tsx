"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Check, ExternalLink, RefreshCw, AlertTriangle, Download, Info } from "lucide-react"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { WalletContextProvider } from "@/lib/wallet-provider"
import { SendReceiveInterface } from "@/components/solana/send-receive"
import { NFTGallery } from "@/components/solana/nft-gallery"
import { PortfolioAnalytics } from "@/components/solana/portfolio-analytics"
import { SwapInterface } from "@/components/solana/swap-interface"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { getSolBalance, getTokenAccounts, getMockData } from "@/lib/solana-helpers"
// Add the import for the WalletBalanceDisplay component
import { WalletBalanceDisplay } from "@/components/wallet-balance-display"

function SolflareContent() {
  const { publicKey, connected, connecting, disconnect } = useWallet()
  const { connection } = useConnection()
  const [copied, setCopied] = useState(false)
  const [solBalance, setSolBalance] = useState<number | null>(null)
  const [tokenAccounts, setTokenAccounts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSolflareInstalled, setIsSolflareInstalled] = useState<boolean | null>(null)
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null)
  const [walletActivity, setWalletActivity] = useState<{
    lastTransaction: string | null
    transactionCount: number
  }>({
    lastTransaction: null,
    transactionCount: 0,
  })
  const [useMockData, setUseMockData] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check if Solflare is installed
  useEffect(() => {
    const checkSolflareInstalled = () => {
      // Check if we're in a browser environment
      if (typeof window === "undefined") return

      // Check if Solflare is available in window
      const isSolflareAvailable = !!(window.solflare?.isSolflare || window.solana?.isSolflare)
      setIsSolflareInstalled(isSolflareAvailable)
    }

    checkSolflareInstalled()
  }, [])

  // Copy wallet address to clipboard
  const copyToClipboard = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      })
    }
  }

  // Fetch wallet data (SOL balance, transactions, etc.)
  const fetchWalletData = useCallback(async () => {
    if (!connected || !publicKey) {
      setUseMockData(true)
      const mockData = getMockData()
      setSolBalance(mockData.solBalance)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Check if connection is available
      if (!connection) {
        setError("Connection not available. Using demo data.")
        const mockData = getMockData()
        setSolBalance(mockData.solBalance)
        setUseMockData(true)
        return
      }

      // Fetch SOL balance - this now returns mock data on error instead of throwing
      const balance = await getSolBalance(publicKey, connection)
      setSolBalance(balance)

      // Fetch token accounts - this now returns empty array on error instead of throwing
      const tokens = await getTokenAccounts(publicKey, connection)
      setTokenAccounts(tokens)

      try {
        // Fetch recent transactions
        const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 10 })

        setWalletActivity({
          lastTransaction: signatures.length > 0 ? signatures[0].signature : null,
          transactionCount: signatures.length,
        })
      } catch (txError) {
        console.error("Error fetching transaction signatures:", txError)
        // Don't update wallet activity on error
      }

      setLastRefreshed(new Date())

      // If we got this far without errors that caused fallback to mock data
      if (balance !== 4.2069 || tokens.length > 0) {
        setUseMockData(false)
        toast({
          title: "Wallet Data Updated",
          description: "Your wallet data has been refreshed",
        })
      } else {
        setUseMockData(true)
        setError("Limited RPC access. Using demo data for visualization.")
      }
    } catch (error) {
      console.error("Error fetching wallet data:", error)
      setError("Failed to fetch wallet data. Using demo data instead.")

      // Use mock data as fallback
      const mockData = getMockData()
      setSolBalance(mockData.solBalance)
      setUseMockData(true)

      toast({
        title: "Error",
        description: "Failed to fetch wallet data. Using demo data instead.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [connected, publicKey, connection])

  // Fetch wallet data when connected
  useEffect(() => {
    if (connected) {
      // Add a small delay to ensure wallet connection is established
      const timer = setTimeout(() => {
        fetchWalletData()
      }, 1500) // Increased delay to ensure connection is ready

      return () => clearTimeout(timer)
    } else {
      setSolBalance(null)
      setTokenAccounts([])
      setWalletActivity({
        lastTransaction: null,
        transactionCount: 0,
      })
    }
  }, [connected, fetchWalletData])

  // Handle wallet connection events
  useEffect(() => {
    if (connected && publicKey) {
      toast({
        title: "Wallet Connected",
        description: `Connected to ${publicKey.toString().slice(0, 6)}...${publicKey.toString().slice(-4)}`,
      })
    }
  }, [connected, publicKey])

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <Link href="/demo">
            <Button variant="outline" size="sm" className="mr-4 border-cyan-500 text-cyan-400 hover:bg-cyan-900/20">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Demo
            </Button>
          </Link>

          <div className="flex items-center">
            <img
              src="https://jade-late-crow-559.mypinata.cloud/ipfs/bafybeia5skhvck24266qahayvxuhc5k3ez27xnmscrlwfjnwloeal5rdam"
              alt="MindMash.AI Logo"
              className="h-8 w-8 mr-2"
            />
            <h1 className="text-2xl md:text-3xl font-bold font-cyber tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              MindMash.AI
            </h1>
          </div>
        </div>

        <div className="mb-6 bg-blue-900/20 border border-blue-800/50 p-4 rounded-lg">
          <div className="flex items-start">
            <Info className="text-blue-400 mr-2 mt-1 h-5 w-5 flex-shrink-0" />
            <div>
              <h4 className="text-blue-400 font-medium">Demo Environment</h4>
              <p className="text-sm text-gray-300">
                This is a demonstration of the Solflare wallet integration. For this demo, we're using Solana's devnet
                and mock data. In a production environment, you would connect to mainnet with full RPC access.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-amber-900/20 border border-amber-800/50 p-4 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="text-amber-400 mr-2 mt-1 h-5 w-5 flex-shrink-0" />
              <div>
                <h4 className="text-amber-400 font-medium">Connection Notice</h4>
                <p className="text-sm text-gray-300">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <div className="flex items-center mb-2">
                <img
                  src="https://jade-late-crow-559.mypinata.cloud/ipfs/bafkreiflum5uy3zywjbdt6od4ezedtvrcbdqdtcl464otbde3s7u5rg6se"
                  alt="Solflare"
                  className="h-8 w-8 mr-3"
                />
                <CardTitle>Connect to Solflare</CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                Manage your Solana assets with Solflare wallet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-r from-amber-900/20 to-amber-800/20 p-4 rounded-lg border border-amber-800/50">
                <p className="text-amber-400 text-sm">
                  Solflare is a non-custodial wallet built specifically for Solana. It allows you to securely store,
                  send, receive, and stake SOL and SPL tokens.
                </p>
              </div>

              {isSolflareInstalled === false && (
                <div className="bg-amber-900/20 border border-amber-800/50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle className="text-amber-400 mr-2 mt-1 h-5 w-5" />
                    <div>
                      <h4 className="text-amber-400 font-medium">Solflare Not Detected</h4>
                      <p className="text-sm text-gray-300 mb-2">
                        To use this feature, please install the Solflare browser extension.
                      </p>
                      <Button
                        size="sm"
                        className="bg-amber-600 hover:bg-amber-700 text-white"
                        onClick={() => window.open("https://solflare.com/download", "_blank")}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Solflare
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Status</span>
                  {connecting ? (
                    <span className="text-blue-400 bg-blue-900/30 px-2 py-1 rounded text-xs flex items-center">
                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" /> Connecting
                    </span>
                  ) : connected ? (
                    <span className="text-green-400 bg-green-900/30 px-2 py-1 rounded text-xs flex items-center">
                      <Check className="h-3 w-3 mr-1" /> Connected
                    </span>
                  ) : (
                    <span className="text-amber-400 bg-amber-900/30 px-2 py-1 rounded text-xs">Disconnected</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Network</span>
                  <span className="text-white">Devnet</span>
                </div>
                {isSolflareInstalled !== null && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Solflare Extension</span>
                    {isSolflareInstalled ? (
                      <span className="text-green-400 bg-green-900/30 px-2 py-1 rounded text-xs flex items-center">
                        <Check className="h-3 w-3 mr-1" /> Installed
                      </span>
                    ) : (
                      <span className="text-amber-400 bg-amber-900/30 px-2 py-1 rounded text-xs">Not Installed</span>
                    )}
                  </div>
                )}
                {connected && lastRefreshed && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Last Updated</span>
                    <span className="text-xs text-gray-300">{lastRefreshed.toLocaleTimeString()}</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full">
                {/* Custom styling for the Solflare connect button */}
                <div className="wallet-adapter-button-container">
                  <WalletMultiButton className="wallet-adapter-button wallet-adapter-button-trigger bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-2 rounded-md w-full flex justify-center items-center h-10" />
                </div>
                {connected && (
                  <div className="space-y-2 mt-2">
                    <Button
                      variant="outline"
                      className="w-full border-amber-700 text-amber-400 hover:bg-amber-900/20"
                      onClick={fetchWalletData}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Refreshing...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" /> Refresh Data
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-red-700 text-red-400 hover:bg-red-900/20"
                      onClick={() => {
                        disconnect()
                        toast({
                          title: "Wallet Disconnected",
                          description: "Your Solflare wallet has been disconnected",
                        })
                      }}
                    >
                      Disconnect Wallet
                    </Button>
                  </div>
                )}
              </div>
            </CardFooter>
          </Card>

          <Card className="bg-gray-900 border-gray-800 md:col-span-2">
            <CardHeader>
              <CardTitle>Your Wallet</CardTitle>
              <CardDescription className="text-gray-400">View and manage your wallet address</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {connected && publicKey ? (
                <WalletBalanceDisplay walletAddress={publicKey.toString()} showActions={true} showChart={true} />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">Connect your wallet to view your assets</p>
                  <img
                    src="https://jade-late-crow-559.mypinata.cloud/ipfs/bafkreiflum5uy3zywjbdt6od4ezedtvrcbdqdtcl464otbde3s7u5rg6se"
                    alt="Solflare"
                    className="h-16 w-16 mx-auto opacity-50"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* New Features Section */}
        <div className="mb-6">
          <Tabs defaultValue="send-receive" className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="send-receive">Send & Receive</TabsTrigger>
              <TabsTrigger value="nft-gallery">NFT Gallery</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="swap">Swap</TabsTrigger>
            </TabsList>

            <TabsContent value="send-receive">
              <SendReceiveInterface />
            </TabsContent>

            <TabsContent value="nft-gallery">
              <NFTGallery />
            </TabsContent>

            <TabsContent value="portfolio">
              <PortfolioAnalytics />
            </TabsContent>

            <TabsContent value="swap">
              <SwapInterface />
            </TabsContent>
          </Tabs>
        </div>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="font-cyber tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              MindMash.AI + Solflare
            </CardTitle>
            <CardDescription className="text-gray-400">
              Learn more about the Solflare wallet integration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                <h3 className="font-bold text-amber-400 mb-2 font-cyber">Secure</h3>
                <p className="text-sm text-gray-300">
                  Your private keys never leave your device. Solflare uses industry-standard encryption to protect your
                  assets.
                </p>
              </div>
              <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                <h3 className="font-bold text-amber-400 mb-2 font-cyber">Fast</h3>
                <p className="text-sm text-gray-300">
                  Built specifically for Solana, Solflare provides lightning-fast transactions and a smooth user
                  experience.
                </p>
              </div>
              <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                <h3 className="font-bold text-amber-400 mb-2 font-cyber">Feature-Rich</h3>
                <p className="text-sm text-gray-300">
                  Stake SOL, manage NFTs, and interact with dApps seamlessly from one interface.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-900/20 to-amber-800/20 p-4 rounded-lg border border-amber-800/50">
              <h3 className="font-bold text-amber-400 mb-2 font-cyber">Getting Started</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
                <li>
                  Visit{" "}
                  <a
                    href="https://www.solflare.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:underline"
                  >
                    solflare.com
                  </a>{" "}
                  or download the mobile app
                </li>
                <li>Create a new wallet or import an existing one</li>
                <li>Secure your wallet with a strong password and backup your seed phrase</li>
                <li>Connect to MindMash.AI to start using your wallet</li>
              </ol>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
              onClick={() => window.open("https://www.solflare.com/", "_blank")}
            >
              Visit Solflare Website
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}


export default function SolflarePage() {
  return (
    <WalletContextProvider>
      <SolflareContent />
    </WalletContextProvider>
  )
}
