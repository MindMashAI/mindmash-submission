"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAudio } from "@/components/audio-manager"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import {
  ArrowLeft,
  Cpu,
  Wallet,
  Brain,
  Shield,
  Activity,
  BarChart3,
  Sparkles,
  Zap,
  Lock,
  Check,
  X,
  Plus,
  RefreshCw,
  Send,
  Download,
  Upload,
  Fingerprint,
  Key,
  Network,
  Users,
  FileText,
  Code,
  Layers,
  MessageSquare,
  Settings,
  Star,
  Gauge,
  ExternalLink,
  Copy,
  Coins,
  Share,
} from "lucide-react"

// Mock data for the SynBot
const SYNBOT_DATA = {
  name: "NeuraSyn #5289",
  avatar: "/images/synbot-avatar.svg",
  wallet: {
    address: "8xDy3LNmQdUgV7TcCVkS3bFbEJsWcPyTmTX9Nag7yVUc",
    balance: 1.42,
    tokens: [
      { name: "SOL", amount: 1.42, value: 150 },
      { name: "USDC", amount: 250, value: 250 },
      { name: "MINDMASH", amount: 1500, value: 375 },
    ],
    nfts: [
      {
        name: "SoulSig #5289",
        image: "/images/soulsig-nft-image.png",
        rarity: "Legendary",
        attributes: {
          intelligence: 92,
          creativity: 88,
          resilience: 95,
        },
      },
      {
        name: "NeuroByte #42",
        image: "/placeholder-ikxj6.png",
        rarity: "Rare",
        attributes: {
          hacking: 85,
          stealth: 76,
          combat: 62,
        },
      },
      {
        name: "SynthWave Rider #137",
        image: "/placeholder-y84hq.png",
        rarity: "Epic",
        attributes: {
          speed: 91,
          style: 88,
          rhythm: 79,
        },
      },
      {
        name: "NetRunner Elite #008",
        image: "/placeholder-p4r0h.png",
        rarity: "Mythic",
        attributes: {
          netrunning: 96,
          encryption: 89,
          perception: 84,
        },
      },
    ],
  },
  behavior: {
    alignment: 87,
    learning: 64,
    autonomy: 45,
    creativity: 92,
    reliability: 78,
  },
  permissions: {
    canVote: true,
    canPost: true,
    canTrade: false,
    canSpend: true,
    spendLimit: 50,
    whitelistedAddresses: [
      "DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK",
      "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    ],
  },
  activity: [
    { type: "vote", description: "Voted on MIP-289: Neural Expansion", time: "2 hours ago" },
    { type: "claim", description: "Claimed 150 MINDMASH tokens", time: "1 day ago" },
    { type: "post", description: "Generated post in Syndicate #42", time: "3 days ago" },
    { type: "collab", description: "Initiated collab with SynBot #3182", time: "1 week ago" },
  ],
  stats: {
    level: 7,
    experience: 2340,
    nextLevel: 3000,
    reputation: 92,
    tasks: 47,
    collaborations: 12,
  },
  traits: [
    { name: "Analytical", level: 8 },
    { name: "Creative", level: 9 },
    { name: "Diplomatic", level: 6 },
    { name: "Technical", level: 7 },
    { name: "Strategic", level: 8 },
  ],
  solanaStats: {
    totalTransactions: 147,
    stakingRewards: 0.08,
    delegatedSOL: 0.5,
    validator: "Chorus One",
    lastTransaction: "2 hours ago",
  },
}

// Solana validators
const SOLANA_VALIDATORS = [
  { name: "Chorus One", apy: "7.1%", identity: "ChorusmmK7i1AxXeiTtQgQZhQNiXYU84ULeaYF1EH15n" },
  { name: "Figment", apy: "6.9%", identity: "FigmentNetworks3sX3phNEEzs7xH4s1xPpfVD4LSEfqRr" },
  { name: "Staking Facilities", apy: "7.0%", identity: "StakingFacilitiesStakers1111Vwz3ytEfEBwV" },
  { name: "P2P Validator", apy: "7.2%", identity: "P2P1111111111111111111111111111111111111111" },
  { name: "Everstake", apy: "6.8%", identity: "EverstakeEverstakeEverstakeEverstakeEvers" },
]

// Define attribute type separately to avoid syntax issues
type NFTAttribute = {
  trait_type: string
  value: string
}

export default function SoulSigPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [synbot, setSynbot] = useState(SYNBOT_DATA)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isTraining, setIsTraining] = useState(false)
  const [trainingProgress, setTrainingProgress] = useState(0)
  const [chatExpanded, setChatExpanded] = useState(false)
  const [selectedNFT, setSelectedNFT] = useState(null)
  const [showNFTModal, setShowNFTModal] = useState(false)
  const [showAddressInFull, setShowAddressInFull] = useState(false)
  const [selectedValidator, setSelectedValidator] = useState(SOLANA_VALIDATORS[0])
  const [showValidatorModal, setShowValidatorModal] = useState(false)
  const [isStaking, setIsStaking] = useState(false)
  const [stakingAmount, setStakingAmount] = useState(0.1)
  const [currentEmotion, setCurrentEmotion] = useState("Neutral")
  const { toast } = useToast()
  const { playSound } = useAudio()

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      playSound("/sounds/boot.mp3")
    }, 1500)

    return () => clearTimeout(timer)
  }, [playSound])

  // Simulate training
  const startTraining = () => {
    setIsTraining(true)
    setTrainingProgress(0)
    playSound("/sounds/feature-select.mp3")

    const interval = setInterval(() => {
      setTrainingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsTraining(false)
          toast({
            title: "Training Complete",
            description: "Your SynBot has evolved with new behavioral patterns",
          })
          playSound("/sounds/feature-select.mp3")

          // Update synbot stats after training
          setSynbot((prev) => ({
            ...prev,
            behavior: {
              ...prev.behavior,
              learning: Math.min(100, prev.behavior.learning + 5),
              alignment: Math.min(100, prev.behavior.alignment + 3),
            },
            stats: {
              ...prev.stats,
              experience: prev.stats.experience + 150,
              level: prev.stats.experience + 150 >= prev.stats.nextLevel ? prev.stats.level + 1 : prev.stats.level,
            },
          }))

          return 100
        }
        return prev + 5
      })
    }, 300)
  }

  // Toggle permission
  const togglePermission = (permission) => {
    setSynbot((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: !prev.permissions[permission],
      },
    }))
    playSound("/sounds/button-click.mp3")
  }

  // Update spend limit
  const updateSpendLimit = (value) => {
    setSynbot((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        spendLimit: value[0],
      },
    }))
  }

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    playSound("/sounds/button-click.mp3")
    toast({
      title: "Copied to clipboard",
      description: "Address has been copied to your clipboard",
    })
  }

  // Format wallet address
  const formatWalletAddress = (address, showFull = false) => {
    if (showFull) return address
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  // View NFT details
  const viewNFTDetails = (nft) => {
    setSelectedNFT(nft)
    setShowNFTModal(true)
    playSound("/sounds/button-click.mp3")
  }

  // Start staking process
  const startStaking = () => {
    setIsStaking(true)
    playSound("/sounds/feature-select.mp3")

    setTimeout(() => {
      setIsStaking(false)
      setSynbot((prev) => ({
        ...prev,
        wallet: {
          ...prev.wallet,
          balance: prev.wallet.balance - stakingAmount,
        },
        solanaStats: {
          ...prev.solanaStats,
          delegatedSOL: prev.solanaStats.delegatedSOL + stakingAmount,
          stakingRewards: prev.solanaStats.stakingRewards + (stakingAmount * 0.07) / 12,
        },
      }))

      toast({
        title: "Staking Successful",
        description: `${stakingAmount} SOL has been staked with ${selectedValidator.name}`,
      })

      setShowValidatorModal(false)
      playSound("/sounds/feature-select.mp3")
    }, 2000)
  }

  // Handle emotion change
  const handleEmotionChange = (emotion) => {
    setCurrentEmotion(emotion)
  }

  // Get rarity color
  const getRarityColor = (rarity) => {
    switch (rarity) {
      case "Common":
        return "bg-gray-600 text-white"
      case "Uncommon":
        return "bg-green-600 text-white"
      case "Rare":
        return "bg-blue-600 text-white"
      case "Epic":
        return "bg-purple-600 text-white"
      case "Legendary":
        return "bg-yellow-600 text-black"
      case "Mythic":
        return "bg-red-600 text-white"
      default:
        return "bg-gray-600 text-white"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 relative">
            <Cpu className="w-24 h-24 text-purple-400 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-purple-400">Loading SoulSig</h2>
          <div className="loading-bar">
            <div className="loading-progress"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-black/80 backdrop-blur-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/neural-feed">
              <Button
                variant="outline"
                className="mr-4 border-purple-500/30 text-purple-400 hover:bg-purple-900/10 flex items-center gap-2 rounded-full"
                onClick={() => playSound("/sounds/button-click.mp3")}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <div className="flex items-center">
              <div className="mr-3 relative w-10 h-10">
                <Cpu className="w-10 h-10 text-purple-400" />
                <div className="absolute inset-0 bg-purple-500 rounded-full filter blur-md opacity-30 animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-600">
                  SOULSIG 5
                </h1>
                <p className="text-sm text-gray-400">SynBot Identity Wallet Engine</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-purple-500/30 text-purple-400 hover:bg-purple-900/10 rounded-full"
              onClick={() => {
                setChatExpanded(!chatExpanded)
                playSound("/sounds/button-click.mp3")
                setActiveTab("chat")
              }}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat with SynBot
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-purple-500/30 text-purple-400 hover:bg-purple-900/10 rounded-full p-2 h-9 w-9"
              onClick={() => {
                playSound("/sounds/button-click.mp3")
                toast({
                  title: "Settings",
                  description: "SynBot settings panel opened",
                })
              }}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* SynBot Profile Card */}
          <Card className="bg-gray-900/30 border-purple-500/20 overflow-hidden lg:sticky lg:top-24 lg:self-start backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span>{synbot.name}</span>
                <Fingerprint className="h-5 w-5 text-purple-400" />
              </CardTitle>
              <CardDescription>AI-Powered Identity & Wallet Agent</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              {/* NFT Image with modern effects */}
              <div className="relative w-48 h-48 mb-6">
                {/* Glass morphism background */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 backdrop-blur-sm border border-white/10"></div>

                {/* Pulse effects */}
                <div className="absolute inset-0 rounded-2xl bg-cyan-500/10 animate-pulse"></div>
                <div
                  className="absolute inset-0 rounded-2xl bg-purple-500/10 animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="absolute inset-0 rounded-2xl shadow-[0_0_20px_rgba(139,92,246,0.3)] animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>

                {/* NFT Image */}
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  <img
                    src="/images/soulsig-nft-image.png"
                    alt="SoulSig NFT"
                    className="w-auto h-auto max-w-full max-h-full rounded-2xl"
                  />
                </div>
              </div>

              {/* SynBot Stats */}
              <div className="w-full p-3 bg-black/40 rounded-lg border border-purple-500/20 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                    <span className="text-sm">Level {synbot.stats.level}</span>
                  </div>
                  <Badge variant="outline" className="bg-purple-900/30 text-purple-300 border-purple-500/30">
                    {synbot.stats.reputation} Rep
                  </Badge>
                </div>
                <div className="space-y-1 mb-2">
                  <div className="flex justify-between text-xs">
                    <span>
                      XP: {synbot.stats.experience}/{synbot.stats.nextLevel}
                    </span>
                    <span>{Math.floor((synbot.stats.experience / synbot.stats.nextLevel) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-black/40 rounded-full overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-cyan-500 absolute top-0 left-0 transition-all duration-500 ease-out"
                      style={{ width: `${(synbot.stats.experience / synbot.stats.nextLevel) * 100}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{synbot.stats.tasks} Tasks</span>
                  <span>{synbot.stats.collaborations} Collabs</span>
                </div>
              </div>

              <div className="w-full p-3 bg-black/40 rounded-lg border border-purple-500/20 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Wallet Address</span>
                  <div className="flex items-center">
                    <span
                      className="text-sm font-mono bg-black/50 px-2 py-1 rounded cursor-pointer hover:bg-black/70"
                      onClick={() => setShowAddressInFull(!showAddressInFull)}
                    >
                      {formatWalletAddress(synbot.wallet.address, showAddressInFull)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 ml-1"
                      onClick={() => copyToClipboard(synbot.wallet.address)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Balance</span>
                  <span className="text-sm font-bold text-purple-300">{synbot.wallet.balance} SOL</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full">
                <Button
                  variant="outline"
                  className="border-purple-500/30 hover:bg-purple-900/20"
                  onClick={() => {
                    playSound("/sounds/button-click.mp3")
                    toast({
                      title: "Wallet Connected",
                      description: "Your Crossmint wallet is now connected to SynBot",
                    })
                  }}
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect
                </Button>
                <Button
                  variant="outline"
                  className="border-purple-500/30 hover:bg-purple-900/20"
                  onClick={() => {
                    playSound("/sounds/button-click.mp3")
                    toast({
                      title: "Training Started",
                      description: "Your SynBot is learning from your behavior",
                    })
                    startTraining()
                  }}
                  disabled={isTraining}
                >
                  <Brain className="h-4 w-4 mr-2" />
                  {isTraining ? "Training..." : "Train"}
                </Button>
              </div>

              {isTraining && (
                <div className="w-full mt-4">
                  <div className="custom-progress">
                    <div className="custom-progress-fill" style={{ width: `${trainingProgress}%` }}></div>
                  </div>
                  <p className="text-xs text-center mt-1 text-gray-400">
                    Training SynBot: {trainingProgress}% Complete
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="dashboard" className="w-full" onValueChange={setActiveTab} value={activeTab}>
              <TabsList className="grid grid-cols-6 mb-6 bg-gray-900/30 rounded-xl p-1">
                <TabsTrigger
                  value="dashboard"
                  onClick={() => playSound("/sounds/button-click.mp3")}
                  className="rounded-lg data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-300"
                >
                  <Activity className="h-4 w-4 mr-2 md:mr-0 lg:mr-2" />
                  <span className="hidden md:inline lg:inline">Dashboard</span>
                </TabsTrigger>
                <TabsTrigger
                  value="behavior"
                  onClick={() => playSound("/sounds/button-click.mp3")}
                  className="rounded-lg data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-300"
                >
                  <Brain className="h-4 w-4 mr-2 md:mr-0 lg:mr-2" />
                  <span className="hidden md:inline lg:inline">Behavior</span>
                </TabsTrigger>
                <TabsTrigger
                  value="wallet"
                  onClick={() => playSound("/sounds/button-click.mp3")}
                  className="rounded-lg data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-300"
                >
                  <Wallet className="h-4 w-4 mr-2 md:mr-0 lg:mr-2" />
                  <span className="hidden md:inline lg:inline">Wallet</span>
                </TabsTrigger>
                <TabsTrigger
                  value="permissions"
                  onClick={() => playSound("/sounds/button-click.mp3")}
                  className="rounded-lg data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-300"
                >
                  <Shield className="h-4 w-4 mr-2 md:mr-0 lg:mr-2" />
                  <span className="hidden md:inline lg:inline">Permissions</span>
                </TabsTrigger>
                <TabsTrigger
                  value="soulthread"
                  onClick={() => playSound("/sounds/button-click.mp3")}
                  className="rounded-lg data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-300"
                >
                  <Layers className="h-4 w-4 mr-2 md:mr-0 lg:mr-2" />
                  <span className="hidden md:inline lg:inline">SoulThread</span>
                </TabsTrigger>
                <TabsTrigger
                  value="chat"
                  onClick={() => playSound("/sounds/button-click.mp3")}
                  className="rounded-lg data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-300"
                >
                  <MessageSquare className="h-4 w-4 mr-2 md:mr-0 lg:mr-2" />
                  <span className="hidden md:inline lg:inline">Chat</span>
                </TabsTrigger>
              </TabsList>

              {/* Dashboard Tab */}
              <TabsContent value="dashboard">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-gray-900/30 border-purple-500/20 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Activity className="h-5 w-5 mr-2 text-purple-400" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {synbot.activity.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-start p-3 rounded-xl bg-black/20 border border-gray-800/50 backdrop-blur-sm hover:bg-black/30 transition-colors"
                          >
                            <div
                              className={`p-2 rounded-full mr-3 ${
                                item.type === "vote"
                                  ? "bg-blue-900/30"
                                  : item.type === "claim"
                                    ? "bg-green-900/30"
                                    : item.type === "post"
                                      ? "bg-purple-900/30"
                                      : "bg-orange-900/30"
                              }`}
                            >
                              {item.type === "vote" ? (
                                <Check className="h-4 w-4" />
                              ) : item.type === "claim" ? (
                                <Download className="h-4 w-4" />
                              ) : item.type === "post" ? (
                                <FileText className="h-4 w-4" />
                              ) : (
                                <Users className="h-4 w-4" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{item.description}</p>
                              <p className="text-xs text-gray-400">{item.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-900/50 border-purple-500/30">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <BarChart3 className="h-5 w-5 mr-2 text-purple-400" />
                        SynBot Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(synbot.behavior).map(([key, value]) => (
                          <div key={key} className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-sm capitalize">{key}</span>
                              <span className="text-sm font-mono">{value}%</span>
                            </div>
                            <div className="custom-progress">
                              <div className="custom-progress-fill" style={{ width: `${value}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white border-0 rounded-lg"
                        onClick={() => {
                          playSound("/sounds/feature-select.mp3")
                          startTraining()
                        }}
                        disabled={isTraining}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        {isTraining ? "Training in Progress..." : "Retrain SynBot"}
                      </Button>
                    </CardFooter>
                  </Card>
                </div>

                {/* Solana Stats */}
                <Card className="bg-gray-900/50 border-purple-500/30 mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Coins className="h-5 w-5 mr-2 text-purple-400" />
                      Solana Stats
                    </CardTitle>
                    <CardDescription>Your Solana blockchain activity and staking information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-black/30 border border-gray-800">
                        <h3 className="text-sm font-medium mb-3">Blockchain Activity</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Total Transactions</span>
                            <span className="text-sm">{synbot.solanaStats.totalTransactions}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Last Transaction</span>
                            <span className="text-sm">{synbot.solanaStats.lastTransaction}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-black/30 border border-gray-800">
                        <h3 className="text-sm font-medium mb-3">Staking Information</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Delegated SOL</span>
                            <span className="text-sm">{synbot.solanaStats.delegatedSOL} SOL</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Staking Rewards</span>
                            <span className="text-sm">{synbot.solanaStats.stakingRewards} SOL</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-400">Validator</span>
                            <span className="text-sm">{synbot.solanaStats.validator}</span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-3 border-purple-500/30 hover:bg-purple-900/20"
                          onClick={() => {
                            setShowValidatorModal(true)
                            playSound("/sounds/button-click.mp3")
                          }}
                        >
                          <Coins className="h-4 w-4 mr-2" />
                          Stake More SOL
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* SynBot Traits */}
                <Card className="bg-gray-900/50 border-purple-500/30 mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Gauge className="h-5 w-5 mr-2 text-purple-400" />
                      SynBot Traits
                    </CardTitle>
                    <CardDescription>Personality traits that define your SynBot's behavior</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {synbot.traits.map((trait, index) => (
                        <div key={index} className="p-4 rounded-lg bg-black/30 border border-gray-800">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-medium">{trait.name}</h3>
                            <Badge variant="outline" className="bg-purple-900/30 border-purple-500/30">
                              Lvl {trait.level}
                            </Badge>
                          </div>
                          <div className="flex">
                            {[...Array(10)].map((_, i) => (
                              <div
                                key={i}
                                className={`h-1.5 w-full mr-0.5 rounded-sm ${
                                  i < trait.level ? "bg-purple-500" : "bg-gray-700"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Behavior Tab */}
              <TabsContent value="behavior">
                <Card className="bg-gray-900/50 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Brain className="h-5 w-5 mr-2 text-purple-400" />
                      Behavior Model
                    </CardTitle>
                    <CardDescription>Train and customize your SynBot's behavior patterns</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="p-4 rounded-lg bg-black/30 border border-gray-800">
                        <h3 className="text-sm font-medium mb-2 flex items-center">
                          <Sparkles className="h-4 w-4 mr-2 text-purple-400" />
                          Learning Sources
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="learn-posts" className="flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-gray-400" />
                              Learn from my posts
                            </Label>
                            <Switch id="learn-posts" checked={true} />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="learn-votes" className="flex items-center">
                              <Check className="h-4 w-4 mr-2 text-gray-400" />
                              Learn from my votes
                            </Label>
                            <Switch id="learn-votes" checked={true} />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="learn-dms" className="flex items-center">
                              <Send className="h-4 w-4 mr-2 text-gray-400" />
                              Learn from my DMs
                            </Label>
                            <Switch id="learn-dms" checked={false} />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="learn-collabs" className="flex items-center">
                              <Users className="h-4 w-4 mr-2 text-gray-400" />
                              Learn from my collaborations
                            </Label>
                            <Switch id="learn-collabs" checked={true} />
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-black/30 border border-gray-800">
                        <h3 className="text-sm font-medium mb-2 flex items-center">
                          <Zap className="h-4 w-4 mr-2 text-purple-400" />
                          Behavior Sliders
                        </h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label>Creativity</Label>
                              <span className="text-xs font-mono">{synbot.behavior.creativity}%</span>
                            </div>
                            <Slider defaultValue={[synbot.behavior.creativity]} max={100} step={1} className="w-full" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label>Autonomy</Label>
                              <span className="text-xs font-mono">{synbot.behavior.autonomy}%</span>
                            </div>
                            <Slider defaultValue={[synbot.behavior.autonomy]} max={100} step={1} className="w-full" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label>Reliability</Label>
                              <span className="text-xs font-mono">{synbot.behavior.reliability}%</span>
                            </div>
                            <Slider
                              defaultValue={[synbot.behavior.reliability]}
                              max={100}
                              step={1}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-black/30 border border-gray-800">
                        <h3 className="text-sm font-medium mb-2 flex items-center">
                          <Code className="h-4 w-4 mr-2 text-purple-400" />
                          Advanced Training
                        </h3>
                        <div className="space-y-3">
                          <Button
                            variant="outline"
                            className="w-full border-purple-500/30 hover:bg-purple-900/20"
                            onClick={() => {
                              playSound("/sounds/feature-select.mp3")
                              toast({
                                title: "Training Started",
                                description: "Your SynBot is learning from your behavior",
                              })
                              startTraining()
                            }}
                            disabled={isTraining}
                          >
                            <Brain className="h-4 w-4 mr-2" />
                            {isTraining ? "Training..." : "Start Deep Training"}
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full border-purple-500/30 hover:bg-purple-900/20"
                            onClick={() => {
                              playSound("/sounds/button-click.mp3")
                              toast({
                                title: "Checkpoint Saved",
                                description: "Your SynBot's current state has been saved to IPFS",
                              })
                            }}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Save Checkpoint to IPFS
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Wallet Tab */}
              <TabsContent value="wallet">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-gray-900/50 border-purple-500/30">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Wallet className="h-5 w-5 mr-2 text-purple-400" />
                        Crossmint Wallet
                      </CardTitle>
                      <CardDescription>Non-custodial wallet powered by Crossmint</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="p-4 rounded-lg bg-black/30 border border-gray-800 mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-400">Wallet Address</span>
                          <div className="flex items-center">
                            <span
                              className="text-sm font-mono bg-black/50 px-2 py-1 rounded cursor-pointer hover:bg-black/70"
                              onClick={() => setShowAddressInFull(!showAddressInFull)}
                            >
                              {formatWalletAddress(synbot.wallet.address, showAddressInFull)}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 ml-1"
                              onClick={() => copyToClipboard(synbot.wallet.address)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-400">Total Balance</span>
                          <span className="text-sm font-bold text-purple-300">${775}</span>
                        </div>
                      </div>

                      <h3 className="text-sm font-medium mb-2">Tokens</h3>
                      <div className="space-y-2 mb-4">
                        {synbot.wallet.tokens.map((token, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-3 rounded-lg bg-black/30 border border-gray-800"
                          >
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-purple-900/30 flex items-center justify-center mr-3">
                                <span className="text-xs font-bold">{token.name.substring(0, 2)}</span>
                              </div>
                              <div>
                                <p className="text-sm font-medium">{token.name}</p>
                                <p className="text-xs text-gray-400">{token.amount} tokens</p>
                              </div>
                            </div>
                            <span className="text-sm font-bold">${token.value}</span>
                          </div>
                        ))}
                      </div>

                      <h3 className="text-sm font-medium mb-2">NFTs</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {synbot.wallet.nfts.map((nft, index) => (
                          <div
                            key={index}
                            className="flip-card p-3 rounded-xl bg-black/20 border border-purple-500/10 flex flex-col items-center cursor-pointer hover:bg-black/30 transition-colors group overflow-hidden backdrop-blur-sm"
                            onClick={() => viewNFTDetails(nft)}
                          >
                            <div className="flip-card-inner w-full">
                              {/* Front of card */}
                              <div className="flip-card-front w-full">
                                <div className="relative w-full mb-2">
                                  <div className="absolute top-0 right-0 z-10">
                                    <Badge className={`${getRarityColor(nft.rarity)} text-xs rounded-full px-2 py-0.5`}>
                                      {nft.rarity}
                                    </Badge>
                                  </div>
                                  <div className="relative w-full h-40 overflow-hidden rounded-xl border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.3)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all duration-500">
                                    {/* Animated glow overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-cyan-500/10 to-purple-500/0 animate-glow-slide"></div>

                                    {/* Holographic effect */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-cyan-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                    <img
                                      src={nft.image || "/placeholder.svg"}
                                      alt={nft.name}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                    />
                                  </div>
                                </div>
                                <p className="text-xs font-medium text-center text-cyan-300 group-hover:text-cyan-100 transition-colors">
                                  {nft.name}
                                </p>
                              </div>

                              {/* Back of card */}
                              <div className="flip-card-back w-full bg-black/80 rounded-md p-3">
                                <h4 className="text-sm font-bold text-cyan-300 mb-2">{nft.name}</h4>
                                <div className="space-y-1 text-xs">
                                  {Object.entries(nft.attributes)
                                    .slice(0, 3)
                                    .map(([key, value]) => (
                                      <div key={key} className="flex justify-between">
                                        <span className="text-gray-400 capitalize">{key}</span>
                                        <span className="text-cyan-200">{value}</span>
                                      </div>
                                    ))}
                                </div>
                                <div className="mt-2 pt-2 border-t border-gray-700">
                                  <p className="text-[10px] text-center text-gray-400">Click for details</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-900/50 border-purple-500/30">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Activity className="h-5 w-5 mr-2 text-purple-400" />
                        Wallet Actions
                      </CardTitle>
                      <CardDescription>Manage your SynBot's wallet capabilities</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-black/30 border border-gray-800">
                          <h3 className="text-sm font-medium mb-3 flex items-center">
                            <Send className="h-4 w-4 mr-2 text-purple-400" />
                            Quick Actions
                          </h3>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              variant="outline"
                              className="border-purple-500/30 hover:bg-purple-900/20"
                              onClick={() => {
                                playSound("/sounds/button-click.mp3")
                                toast({
                                  title: "Deposit Initiated",
                                  description: "Follow the prompts to complete your deposit",
                                })
                              }}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Deposit
                            </Button>
                            <Button
                              variant="outline"
                              className="border-purple-500/30 hover:bg-purple-900/20"
                              onClick={() => {
                                playSound("/sounds/button-click.mp3")
                                toast({
                                  title: "Withdrawal Initiated",
                                  description: "Follow the prompts to complete your withdrawal",
                                })
                              }}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Withdraw
                            </Button>
                            <Button
                              variant="outline"
                              className="border-purple-500/30 hover:bg-purple-900/20"
                              onClick={() => {
                                playSound("/sounds/button-click.mp3")
                                toast({
                                  title: "Swap Initiated",
                                  description: "Follow the prompts to swap your tokens",
                                })
                              }}
                            >
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Swap
                            </Button>
                            <Button
                              variant="outline"
                              className="border-purple-500/30 hover:bg-purple-900/20"
                              onClick={() => {
                                playSound("/sounds/button-click.mp3")
                                toast({
                                  title: "Transfer Initiated",
                                  description: "Follow the prompts to transfer your tokens",
                                })
                              }}
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Transfer
                            </Button>
                          </div>
                        </div>

                        <div className="p-4 rounded-lg bg-black/30 border border-gray-800">
                          <h3 className="text-sm font-medium mb-3 flex items-center">
                            <Coins className="h-4 w-4 mr-2 text-purple-400" />
                            Solana Actions
                          </h3>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              variant="outline"
                              className="border-purple-500/30 hover:bg-purple-900/20"
                              onClick={() => {
                                setShowValidatorModal(true)
                                playSound("/sounds/button-click.mp3")
                              }}
                            >
                              <Coins className="h-4 w-4 mr-2" />
                              Stake SOL
                            </Button>
                            <Button
                              variant="outline"
                              className="border-purple-500/30 hover:bg-purple-900/20"
                              onClick={() => {
                                playSound("/sounds/button-click.mp3")
                                toast({
                                  title: "Claim Rewards",
                                  description: "Staking rewards have been claimed",
                                })
                                setSynbot((prev) => ({
                                  ...prev,
                                  wallet: {
                                    ...prev.wallet,
                                    balance: prev.wallet.balance + prev.solanaStats.stakingRewards,
                                  },
                                  solanaStats: {
                                    ...prev.solanaStats,
                                    stakingRewards: 0,
                                  },
                                }))
                              }}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Claim Rewards
                            </Button>
                            <Button
                              variant="outline"
                              className="border-purple-500/30 hover:bg-purple-900/20 col-span-2"
                              onClick={() => {
                                playSound("/sounds/button-click.mp3")
                                window.open("https://explorer.solana.com", "_blank")
                              }}
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View on Solana Explorer
                            </Button>
                          </div>
                        </div>

                        <div className="p-4 rounded-lg bg-black/30 border border-gray-800">
                          <h3 className="text-sm font-medium mb-3 flex items-center">
                            <Key className="h-4 w-4 mr-2 text-purple-400" />
                            Automated Actions
                          </h3>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="auto-claim" className="flex items-center">
                                <Download className="h-4 w-4 mr-2 text-gray-400" />
                                Auto-claim airdrops
                              </Label>
                              <Switch id="auto-claim" checked={true} />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="auto-stake" className="flex items-center">
                                <Lock className="h-4 w-4 mr-2 text-gray-400" />
                                Auto-stake rewards
                              </Label>
                              <Switch id="auto-stake" checked={false} />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="auto-vote" className="flex items-center">
                                <Check className="h-4 w-4 mr-2 text-gray-400" />
                                Auto-vote in DAOs
                              </Label>
                              <Switch id="auto-vote" checked={true} />
                            </div>
                          </div>
                        </div>

                        <div className="p-4 rounded-lg bg-black/30 border border-gray-800">
                          <h3 className="text-sm font-medium mb-3 flex items-center">
                            <Network className="h-4 w-4 mr-2 text-purple-400" />
                            Connect Wallet
                          </h3>
                          <div className="flex">
                            <Input
                              placeholder="Enter wallet address"
                              className="mr-2 bg-black/50 border-gray-800"
                              defaultValue=""
                            />
                            <Button
                              variant="outline"
                              className="border-purple-500/30 hover:bg-purple-900/20"
                              onClick={() => {
                                playSound("/sounds/button-click.mp3")
                                toast({
                                  title: "Wallet Connected",
                                  description: "Your wallet has been connected to SynBot",
                                })
                              }}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Permissions Tab */}
              <TabsContent value="permissions">
                <Card className="bg-gray-900/50 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-purple-400" />
                      SynBot Permissions
                    </CardTitle>
                    <CardDescription>Configure what your SynBot can do autonomously</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="p-4 rounded-lg bg-black/30 border border-gray-800">
                        <h3 className="text-sm font-medium mb-3 flex items-center">
                          <Lock className="h-4 w-4 mr-2 text-purple-400" />
                          Action Permissions
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="perm-vote" className="flex items-center">
                              <Check className="h-4 w-4 mr-2 text-gray-400" />
                              Can vote in DAOs
                            </Label>
                            <Switch
                              id="perm-vote"
                              checked={synbot.permissions.canVote}
                              onCheckedChange={() => togglePermission("canVote")}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="perm-post" className="flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-gray-400" />
                              Can create posts
                            </Label>
                            <Switch
                              id="perm-post"
                              checked={synbot.permissions.canPost}
                              onCheckedChange={() => togglePermission("canPost")}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="perm-trade" className="flex items-center">
                              <RefreshCw className="h-4 w-4 mr-2 text-gray-400" />
                              Can trade tokens
                            </Label>
                            <Switch
                              id="perm-trade"
                              checked={synbot.permissions.canTrade}
                              onCheckedChange={() => togglePermission("canTrade")}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="perm-spend" className="flex items-center">
                              <Wallet className="h-4 w-4 mr-2 text-gray-400" />
                              Can spend funds
                            </Label>
                            <Switch
                              id="perm-spend"
                              checked={synbot.permissions.canSpend}
                              onCheckedChange={() => togglePermission("canSpend")}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-black/30 border border-gray-800">
                        <h3 className="text-sm font-medium mb-3 flex items-center">
                          <Wallet className="h-4 w-4 mr-2 text-purple-400" />
                          Spending Limits
                        </h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label>Daily Spend Limit (USD)</Label>
                              <span className="text-xs font-mono">${synbot.permissions.spendLimit}</span>
                            </div>
                            <Slider
                              defaultValue={[synbot.permissions.spendLimit]}
                              max={500}
                              step={5}
                              onValueChange={updateSpendLimit}
                              disabled={!synbot.permissions.canSpend}
                              className="w-full"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="require-approval" className="flex items-center">
                              <Shield className="h-4 w-4 mr-2 text-gray-400" />
                              Require approval for transactions over limit
                            </Label>
                            <Switch id="require-approval" checked={true} />
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-black/30 border border-gray-800">
                        <h3 className="text-sm font-medium mb-3 flex items-center">
                          <Users className="h-4 w-4 mr-2 text-purple-400" />
                          Whitelisted Addresses
                        </h3>
                        <div className="space-y-2 mb-3">
                          {synbot.permissions.whitelistedAddresses.map((address, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center p-2 rounded-lg bg-black/50 border border-gray-800"
                            >
                              <span className="text-sm font-mono">{formatWalletAddress(address)}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => {
                                  playSound("/sounds/button-click.mp3")
                                  setSynbot((prev) => ({
                                    ...prev,
                                    permissions: {
                                      ...prev.permissions,
                                      whitelistedAddresses: prev.permissions.whitelistedAddresses.filter(
                                        (_, i) => i !== index,
                                      ),
                                    },
                                  }))
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        <div className="flex">
                          <Input
                            placeholder="Enter wallet address"
                            className="mr-2 bg-black/50 border-gray-800"
                            defaultValue=""
                          />
                          <Button
                            variant="outline"
                            className="border-purple-500/30 hover:bg-purple-900/20"
                            onClick={() => {
                              playSound("/sounds/button-click.mp3")
                              toast({
                                title: "Address Whitelisted",
                                description: "The address has been added to the whitelist",
                              })
                            }}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* SoulThread Tab */}
              <TabsContent value="soulthread">
                <Card className="bg-gray-900/50 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Layers className="h-5 w-5 mr-2 text-purple-400" />
                      SoulThread Integration
                    </CardTitle>
                    <CardDescription>Connect your SynBot to the SoulThread narrative layer</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="p-4 rounded-lg bg-black/30 border border-gray-800">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-medium flex items-center">
                            <Network className="h-4 w-4 mr-2 text-purple-400" />
                            SoulThread Connection
                          </h3>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-purple-500/30 hover:bg-purple-900/20"
                            onClick={() => {
                              playSound("/sounds/button-click.mp3")
                              toast({
                                title: "SoulThread Connected",
                                description: "Your SynBot is now connected to the SoulThread narrative layer",
                              })
                            }}
                          >
                            Connect
                          </Button>
                        </div>
                        <p className="text-sm text-gray-400 mb-4">
                          SoulThreads are long-term creative arcs that coordinate multiple SynBots across Syndicates and
                          quests. Connect your SynBot to enable advanced collaborative features.
                        </p>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="soulthread-sync" className="flex items-center">
                            <RefreshCw className="h-4 w-4 mr-2 text-gray-400" />
                            Enable SoulThread synchronization
                          </Label>
                          <Switch id="soulthread-sync" checked={false} />
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-black/30 border border-gray-800">
                        <h3 className="text-sm font-medium mb-3 flex items-center">
                          <Users className="h-4 w-4 mr-2 text-purple-400" />
                          Multi-Agent Collaborations
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="collab-enable" className="flex items-center">
                              <Users className="h-4 w-4 mr-2 text-gray-400" />
                              Enable Multi-Agent Collaborations
                            </Label>
                            <Switch id="collab-enable" checked={true} />
                          </div>
                          <p className="text-sm text-gray-400">
                            Enable your SynBot to participate in collaborative SoulThreads with other agents.
                          </p>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-black/30 border border-gray-800">
                        <h3 className="text-sm font-medium mb-3 flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-purple-400" />
                          Narrative Customization
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="narrative-style" className="flex items-center">
                              <Code className="h-4 w-4 mr-2 text-gray-400" />
                              Narrative Style
                            </Label>
                            <Input
                              placeholder="Enter narrative style"
                              className="bg-black/50 border-gray-800 w-32"
                              defaultValue="Cyberpunk Noir"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="narrative-tone" className="flex items-center">
                              <Sparkles className="h-4 w-4 mr-2 text-gray-400" />
                              Narrative Tone
                            </Label>
                            <Input
                              placeholder="Enter narrative tone"
                              className="bg-black/50 border-gray-800 w-32"
                              defaultValue="Optimistic"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Chat Tab */}
              <TabsContent value="chat">
                <Card className="bg-gray-900/50 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2 text-purple-400" />
                      SynBot Chat
                    </CardTitle>
                    <CardDescription>Engage in real-time conversations with your SynBot</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px] p-4 rounded-lg bg-black/30 border border-gray-800 flex flex-col justify-end">
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <div className="w-8 h-8 rounded-full bg-purple-900/30 flex items-center justify-center mr-3">
                            <span className="text-xs font-bold">SB</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Hello! How can I assist you today?</p>
                            <p className="text-xs text-gray-400">2 minutes ago</p>
                          </div>
                        </div>
                        <div className="flex items-start self-end">
                          <div>
                            <p className="text-sm font-medium text-right">
                              I'd like to know more about SoulThread integration.
                            </p>
                            <p className="text-xs text-gray-400 text-right">1 minute ago</p>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center ml-3">
                            <span className="text-xs font-bold">ME</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex">
                      <Input placeholder="Type your message..." className="bg-black/50 border-gray-800 mr-2" />
                      <Button
                        variant="outline"
                        className="border-purple-500/30 hover:bg-purple-900/20"
                        onClick={() => {
                          playSound("/sounds/button-click.mp3")
                          toast({
                            title: "Message Sent",
                            description: "Your message has been sent to SynBot",
                          })
                        }}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* NFT Modal */}
      <Dialog open={showNFTModal} onOpenChange={setShowNFTModal}>
        <DialogContent className="sm:max-w-[425px] bg-gray-900/80 border-purple-500/30 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle>{selectedNFT?.name}</DialogTitle>
            <DialogDescription>Details about your selected NFT</DialogDescription>
          </DialogHeader>
          {selectedNFT && (
            <div className="space-y-4">
              <div className="relative w-full h-64 overflow-hidden rounded-md border-2 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.5)] animate-pulse-border">
                {/* Animated holographic overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-cyan-500/5 to-pink-500/10 opacity-50 animate-pulse"></div>

                {/* Animated scan line */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="h-1 w-full bg-cyan-400/30 animate-scan-line"></div>
                </div>

                <img
                  src={selectedNFT.image || "/placeholder.svg"}
                  alt={selectedNFT.name}
                  className="w-full h-full object-cover animate-float"
                />

                {/* Animated corner accents */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-400"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-400"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-400"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-400"></div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Rarity</span>
                <Badge className={`${getRarityColor(selectedNFT.rarity)} text-xs animate-pulse`}>
                  {selectedNFT.rarity}
                </Badge>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Attributes</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(selectedNFT.attributes).map(([key, value], index) => (
                    <div
                      key={key}
                      className="flex justify-between p-2 rounded-lg bg-black/30 border border-gray-800 hover:border-cyan-500/50 transition-colors duration-300"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <span className="text-xs capitalize">{key}</span>
                      <span className="text-xs font-mono text-cyan-300">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive buttons */}
              <div className="flex justify-center space-x-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-900/20 group"
                >
                  <Download className="h-4 w-4 mr-2 group-hover:animate-bounce" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-purple-500/50 text-purple-400 hover:bg-purple-900/20 group"
                >
                  <Share className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                  Share
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Validator Modal */}
      <Dialog open={showValidatorModal} onOpenChange={setShowValidatorModal}>
        <DialogContent className="sm:max-w-[425px] bg-gray-900/80 border-purple-500/30 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle>Stake SOL</DialogTitle>
            <DialogDescription>Choose a validator and amount to stake</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Select Validator</h4>
              <div className="space-y-2">
                {SOLANA_VALIDATORS.map((validator) => (
                  <div
                    key={validator.identity}
                    className={`flex justify-between items-center p-3 rounded-lg bg-black/30 border ${
                      selectedValidator.identity === validator.identity ? "border-purple-500" : "border-gray-800"
                    } cursor-pointer hover:bg-black/50 transition-colors`}
                    onClick={() => {
                      setSelectedValidator(validator)
                      playSound("/sounds/button-click.mp3")
                    }}
                  >
                    <div>
                      <p className="text-sm font-medium">{validator.name}</p>
                      <p className="text-xs text-gray-400">APY: {validator.apy}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Staking Amount</h4>
              <div className="flex items-center">
                <Input
                  type="number"
                  placeholder="Enter amount"
                  className="bg-black/50 border-gray-800 mr-2"
                  value={stakingAmount}
                  onChange={(e) => setStakingAmount(Number.parseFloat(e.target.value))}
                />
                <span className="text-sm text-gray-400">SOL</span>
              </div>
            </div>
            <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={startStaking} disabled={isStaking}>
              {isStaking ? "Staking..." : "Stake SOL"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
