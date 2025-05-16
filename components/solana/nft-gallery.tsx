"use client"

import { useState, useEffect, useCallback } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getNFTs, getMockData } from "@/lib/solana-helpers"
import { RefreshCw, ImageIcon, AlertTriangle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"


type NFTAttribute = {
  trait_type: string
  value: string
}

interface NFT {
  mint: string
  name: string
  image: string
  attributes?: NFTAttribute[] // Using array notation instead of generic syntax
  description?: string
  id?: string
}

export function NFTGallery() {
  const { publicKey, connected, wallet } = useWallet()
  const [loading, setLoading] = useState(false)
  const [nfts, setNfts] = useState<NFT[]>([])
  const [selectedNft, setSelectedNft] = useState<NFT | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [useMockData, setUseMockData] = useState(false)
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null)

  // Function to safely fetch NFTs with proper error handling
  const fetchNFTs = useCallback(async () => {
    if (!connected || !publicKey) {
      console.log("Wallet not connected, using mock data")
      return getMockData().nfts
    }

    try {
      // Check if wallet connection is available
      if (!wallet || !wallet.adapter || !wallet.adapter.connected || !wallet.adapter.connection) {
        console.log("Wallet adapter not ready, using mock data")
        return getMockData().nfts
      }

      // Try to fetch real NFTs
      console.log("Fetching real NFTs from wallet")
      const fetchedNfts = await getNFTs(publicKey, wallet.adapter.connection)

      if (fetchedNfts && fetchedNfts.length > 0) {
        console.log(`Found ${fetchedNfts.length} NFTs`)
        setUseMockData(false)
        return fetchedNfts
      } else {
        console.log("No NFTs found, using mock data")
        setUseMockData(true)
        return getMockData().nfts
      }
    } catch (error) {
      console.error("Error fetching NFTs:", error)
      setUseMockData(true)
      return getMockData().nfts
    }
  }, [connected, publicKey, wallet])

  const loadNFTs = useCallback(async () => {
    if (!connected) {
      setNfts([])
      setError("Connect your wallet to view your NFTs")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Add a small delay to ensure wallet connection is established
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Fetch NFTs
      const fetchedNfts = await fetchNFTs()
      setNfts(fetchedNfts)
      setLastRefreshed(new Date())

      // Show success message
      if (fetchedNfts.length > 0) {
        toast({
          title: "NFTs Loaded",
          description: `Found ${fetchedNfts.length} NFTs in your wallet`,
        })
      } else {
        setError("No NFTs found in your wallet")
      }
    } catch (err) {
      console.error("Error loading NFTs:", err)
      setError("Unable to fetch NFTs. Using demo data instead.")
      setNfts(getMockData().nfts)
      setUseMockData(true)
    } finally {
      setLoading(false)
    }
  }, [connected, fetchNFTs])

  // Load NFTs when wallet connection changes
  useEffect(() => {
    if (connected) {
      loadNFTs()
    } else {
      setNfts([])
    }
  }, [connected, loadNFTs])

  const refreshNFTs = () => {
    loadNFTs()
  }

  // Example update:
  const mockNFTs = [
    {
      id: "1",
      name: "Neural Pioneer Bot",
      image: "/placeholder.svg?key=vyeph",
      description:
        "Rare Neural Pioneer Bot trading card. Enhanced with neural network capabilities and quantum processing.",
      attributes: [
        { trait_type: "Rarity", value: "Legendary" },
        { trait_type: "Power", value: "95/100" },
        { trait_type: "Neural Capacity", value: "Advanced" },
      ],
    },
    {
      id: "2",
      name: "Quantum Dreamer Bot",
      image: "/placeholder.svg?key=a11n6",
      description:
        "Limited edition Quantum Dreamer Bot card. Capable of quantum calculations and reality manipulation.",
      attributes: [
        { trait_type: "Rarity", value: "Epic" },
        { trait_type: "Power", value: "88/100" },
        { trait_type: "Quantum Field", value: "Unstable" },
      ],
    },
    {
      id: "3",
      name: "Code Shaman Bot",
      image: "/placeholder.svg?key=7hd5c",
      description:
        "Mystic Code Shaman Bot card. Masters ancient and future coding languages with supernatural ability.",
      attributes: [
        { trait_type: "Rarity", value: "Rare" },
        { trait_type: "Power", value: "82/100" },
        { trait_type: "Code Mastery", value: "Transcendent" },
      ],
    },
  ]

  // Update the nfts array to use the new image paths:
  const hardcodedNfts = [
    {
      id: 1,
      name: "SoulSig #001",
      image: "/images/nft/soulsig-nft-1.png",
      description: "Your digital identity signature on the blockchain",
      mint: "",
      attributes: [],
    },
    {
      id: 2,
      name: "SoulSig #002",
      image: "/images/nft/soulsig-nft-2.png",
      description: "Secure your digital presence with SoulSig",
      mint: "",
      attributes: [],
    },
    {
      id: 3,
      name: "MindMash #001",
      image: "/images/nft/mindmash-nft-1.png",
      description: "The future of collaborative intelligence",
      mint: "",
      attributes: [],
    },
    {
      id: 4,
      name: "MindMash #002",
      image: "/images/nft/mindmash-nft-2.png",
      description: "Connect your mind to the network",
      mint: "",
      attributes: [],
    },
    {
      id: 5,
      name: "SoulSig #003",
      image: "/images/nft/soulsig-nft-3.png",
      description: "Your unique digital fingerprint",
      mint: "",
      attributes: [],
    },
  ]

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>NFT Gallery</CardTitle>
          <CardDescription className="text-gray-400">View your NFT collection</CardDescription>
        </div>
        {connected && (
          <Button
            variant="outline"
            size="sm"
            className="text-amber-400 border-amber-700 hover:bg-amber-900/20"
            onClick={refreshNFTs}
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
            <ImageIcon className="h-12 w-12 mx-auto text-gray-600 mb-2" />
            <p className="text-gray-400">Connect your wallet to view your NFTs</p>
          </div>
        ) : nfts.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 mx-auto text-gray-600 mb-2" />
            <p className="text-gray-400">No NFTs found in your wallet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {useMockData && (
              <div className="bg-amber-900/20 border border-amber-800/50 p-3 rounded-lg">
                <div className="flex items-start">
                  <AlertTriangle className="text-amber-400 mr-2 mt-0.5 h-4 w-4 flex-shrink-0" />
                  <p className="text-amber-400 text-sm">
                    {error || "Using demo NFTs for preview. Connect a wallet with NFTs to see your collection."}
                  </p>
                </div>
              </div>
            )}

            {lastRefreshed && (
              <div className="text-xs text-gray-400 text-right">Last updated: {lastRefreshed.toLocaleTimeString()}</div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {nfts.map((nft, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 cursor-pointer hover:border-amber-500 transition-colors"
                  onClick={() => setSelectedNft(nft)}
                >
                  <div className="aspect-square relative">
                    <img
                      src={nft.image || "/placeholder.svg"}
                      alt={nft.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `/placeholder.svg?height=150&width=150&text=NFT`
                      }}
                    />
                  </div>
                  <div className="p-2">
                    <h3 className="font-medium truncate">{nft.name}</h3>
                    <p className="text-sm text-gray-400 truncate">{nft.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <Dialog open={!!selectedNft} onOpenChange={(open) => !open && setSelectedNft(null)}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedNft?.name}</DialogTitle>
            <DialogDescription className="text-gray-400">NFT Details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="aspect-square relative rounded-lg overflow-hidden border border-gray-700">
              <img
                src={selectedNft?.image || "/placeholder.svg"}
                alt={selectedNft?.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = `/placeholder.svg?height=300&width=300&text=NFT`
                }}
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-400">Attributes</h3>
              {selectedNft?.attributes && selectedNft.attributes.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {selectedNft.attributes.map((attr, index) => (
                    <div key={index} className="bg-gray-800 p-2 rounded-md">
                      <p className="text-xs text-gray-400">{attr.trait_type}</p>
                      <p className="font-medium">{attr.value}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No attributes found</p>
              )}
            </div>
            <div className="pt-2">
              <p className="text-xs text-gray-400">Mint Address</p>
              <p className="font-mono text-xs truncate">{selectedNft?.mint}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Description</p>
              <p className="text-sm">{selectedNft?.description}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
