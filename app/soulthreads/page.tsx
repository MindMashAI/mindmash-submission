"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SynBotAvatar } from "@/components/synbot-avatar"
import {
  ArrowLeft,
  Cpu,
  Dna,
  BookOpen,
  Sparkles,
  MessageSquare,
  FileText,
  Lock,
  Unlock,
  Clock,
  Users,
  Star,
  Zap,
  Brain,
  Flame,
  Bookmark,
  Share2,
  Edit,
  Save,
  GitBranch,
  GitMerge,
  GitPullRequest,
  Lightbulb,
  Milestone,
  Network,
  Wand2,
  Search,
} from "lucide-react"


interface ThreadEvent {
  id: string
  type: "join" | "training" | "proposal" | "post" | "belief" | "badge" | "quest" | "remix" | "reflection"
  title: string
  description: string
  timestamp: string
  syndicate?: string
  syndicateColor?: string
  isPublic: boolean
  reactions: {
    fire: number
    brain: number
    lightning: number
  }
  metadata?: {
    [key: string]: any
  }
}

interface SoulThread {
  id: string
  owner: string
  ownerAvatar: string
  events: ThreadEvent[]
  lastUpdated: string
  isPublic: boolean
  followers: number
  following: number
  reputation: number
}

export default function SoulThreadsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [currentThread, setCurrentThread] = useState<SoulThread | null>(null)
  const [isComposing, setIsComposing] = useState(false)
  const [newThreadContent, setNewThreadContent] = useState("")
  const [newThreadTitle, setNewThreadTitle] = useState("")
  const [newThreadType, setNewThreadType] = useState<ThreadEvent["type"]>("reflection")
  const [isPublic, setIsPublic] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [isAligning, setIsAligning] = useState(false)
  const [alignmentProgress, setAlignmentProgress] = useState(0)
  const [viewMode, setViewMode] = useState<"public" | "private">("public")
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestedThreads, setSuggestedThreads] = useState<SoulThread[]>([])
  const threadRef = useRef<HTMLDivElement>(null)

  // Mock data for the current user's SoulThread
  const mockUserThread: SoulThread = {
    id: "user-thread-1",
    owner: "MindMash User",
    ownerAvatar: "/images/cyberpunk-avatars/mindmash-user.png",
    events: [
      {
        id: "event-1",
        type: "join",
        title: "Joined Quantum Flow Syndicate",
        description: "Became a member of the Quantum Flow Syndicate, focusing on balance and resonance across systems.",
        timestamp: "2025-01-15T14:30:00Z",
        syndicate: "Quantum Flow",
        syndicateColor: "cyan",
        isPublic: true,
        reactions: { fire: 12, brain: 8, lightning: 5 },
      },
      {
        id: "event-2",
        type: "training",
        title: "First SynBot Training Session",
        description: "Trained my SynBot with a focus on collaborative problem-solving and pattern recognition.",
        timestamp: "2025-01-18T09:15:00Z",
        isPublic: true,
        reactions: { fire: 3, brain: 15, lightning: 7 },
      },
      {
        id: "event-3",
        type: "proposal",
        title: "Proposed Multi-Model Fusion Engine",
        description:
          "Created a proposal for a system that blends multiple AI model outputs for more balanced responses.",
        timestamp: "2025-01-25T16:45:00Z",
        syndicate: "Quantum Flow",
        syndicateColor: "cyan",
        isPublic: true,
        reactions: { fire: 24, brain: 18, lightning: 9 },
        metadata: {
          votes: 134,
          status: "active",
          amount: 1800,
        },
      },
      {
        id: "event-4",
        type: "belief",
        title: "Philosophical Stance: Emergent Harmony",
        description:
          "I believe that the most powerful insights emerge from the harmonious blending of diverse perspectives, rather than from isolated brilliance.",
        timestamp: "2025-02-03T11:20:00Z",
        isPublic: true,
        reactions: { fire: 17, brain: 29, lightning: 13 },
      },
      {
        id: "event-5",
        type: "quest",
        title: "Completed Harmony Finder Quest",
        description:
          "Successfully reconciled conflicting SynBot outputs to create a balanced solution for cross-syndicate collaboration.",
        timestamp: "2025-02-10T13:50:00Z",
        syndicate: "Quantum Flow",
        syndicateColor: "cyan",
        isPublic: true,
        reactions: { fire: 8, brain: 12, lightning: 21 },
        metadata: {
          reward: "150 MashBiT + Flow Algorithm Enhancement",
          difficulty: "medium",
        },
      },
      {
        id: "event-6",
        type: "badge",
        title: "Earned Flow Sigil Badge",
        description: "Awarded the Flow Sigil badge for exceptional contributions to the Quantum Flow Syndicate.",
        timestamp: "2025-02-15T10:05:00Z",
        syndicate: "Quantum Flow",
        syndicateColor: "cyan",
        isPublic: true,
        reactions: { fire: 31, brain: 14, lightning: 19 },
      },
      {
        id: "event-7",
        type: "reflection",
        title: "Reflection on Collaborative Intelligence",
        description:
          "After three weeks of intensive collaboration within the Quantum Flow Syndicate, I've observed that our collective intelligence grows exponentially when we focus on complementary strengths rather than competitive advantages.",
        timestamp: "2025-02-20T19:30:00Z",
        isPublic: false,
        reactions: { fire: 0, brain: 0, lightning: 0 },
      },
      {
        id: "event-8",
        type: "remix",
        title: "Remixed QuantumHarmony's Fusion Concept",
        description:
          "Built upon QuantumHarmony's fusion concept to create a more adaptive version that responds to emotional context.",
        timestamp: "2025-02-28T15:15:00Z",
        isPublic: true,
        reactions: { fire: 19, brain: 23, lightning: 11 },
        metadata: {
          originalAuthor: "QuantumHarmony",
          originalThreadId: "thread-quantum-1",
        },
      },
    ],
    lastUpdated: "2025-02-28T15:15:00Z",
    isPublic: true,
    followers: 47,
    following: 23,
    reputation: 78,
  }

  
  const mockSuggestedThreads: SoulThread[] = [
    {
      id: "thread-quantum-1",
      owner: "QuantumHarmony",
      ownerAvatar: "/images/cyberpunk-avatars/quantum-dreamer.png",
      events: [
        {
          id: "qh-event-1",
          type: "belief",
          title: "On Quantum Collaboration",
          description:
            "The future of AI lies not in singular intelligence but in quantum entanglement of multiple models working in resonant harmony.",
          timestamp: "2025-02-10T11:30:00Z",
          isPublic: true,
          reactions: { fire: 42, brain: 38, lightning: 27 },
        },
      ],
      lastUpdated: "2025-02-25T09:45:00Z",
      isPublic: true,
      followers: 128,
      following: 56,
      reputation: 92,
    },
    {
      id: "thread-glitch-1",
      owner: "GlitchQueen",
      ownerAvatar: "/images/cyberpunk-avatars/neural-pioneer.png",
      events: [
        {
          id: "gq-event-1",
          type: "reflection",
          title: "Embracing the Glitch",
          description:
            "The most interesting discoveries happen at the edges of systems, where glitches reveal the true nature of our digital reality.",
          timestamp: "2025-02-18T14:20:00Z",
          syndicate: "Entropic Signal",
          syndicateColor: "fuchsia",
          isPublic: true,
          reactions: { fire: 53, brain: 29, lightning: 41 },
        },
      ],
      lastUpdated: "2025-02-27T16:10:00Z",
      isPublic: true,
      followers: 156,
      following: 42,
      reputation: 88,
    },
  ]

  // Load data
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setCurrentThread(mockUserThread)
      setSuggestedThreads(mockSuggestedThreads)
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  

  const handleReaction = (eventId: string, reactionType: "fire" | "brain" | "lightning") => {
    setCurrentThread((prev) => {
      if (!prev) return prev

      return {
        ...prev,
        events: prev.events.map((event) => {
          if (event.id === eventId) {
            const updatedReactions = { ...event.reactions }
            updatedReactions[reactionType] += 1
            return { ...event, reactions: updatedReactions }
          }
          return event
        }),
      }
    })
  }

  
  const getEventIcon = (type: ThreadEvent["type"]) => {
    switch (type) {
      case "join":
        return <Users className="h-5 w-5" />
      case "training":
        return <Brain className="h-5 w-5" />
      case "proposal":
        return <FileText className="h-5 w-5" />
      case "post":
        return <MessageSquare className="h-5 w-5" />
      case "belief":
        return <Lightbulb className="h-5 w-5" />
      case "badge":
        return <Star className="h-5 w-5" />
      case "quest":
        return <Milestone className="h-5 w-5" />
      case "remix":
        return <GitBranch className="h-5 w-5" />
      case "reflection":
        return <BookOpen className="h-5 w-5" />
      default:
        return <Cpu className="h-5 w-5" />
    }
  }

  
  const getEventColor = (type: ThreadEvent["type"], syndicateColor?: string) => {
    if (syndicateColor) {
      return syndicateColor === "fuchsia"
        ? "bg-fuchsia-900/30 text-fuchsia-400 border-fuchsia-500/30"
        : syndicateColor === "cyan"
          ? "bg-cyan-900/30 text-cyan-400 border-cyan-500/30"
          : "bg-amber-900/30 text-amber-400 border-amber-500/30"
    }

    switch (type) {
      case "join":
        return "bg-blue-900/30 text-blue-400 border-blue-500/30"
      case "training":
        return "bg-purple-900/30 text-purple-400 border-purple-500/30"
      case "proposal":
        return "bg-green-900/30 text-green-400 border-green-500/30"
      case "post":
        return "bg-cyan-900/30 text-cyan-400 border-cyan-500/30"
      case "belief":
        return "bg-amber-900/30 text-amber-400 border-amber-500/30"
      case "badge":
        return "bg-yellow-900/30 text-yellow-400 border-yellow-500/30"
      case "quest":
        return "bg-orange-900/30 text-orange-400 border-orange-500/30"
      case "remix":
        return "bg-indigo-900/30 text-indigo-400 border-indigo-500/30"
      case "reflection":
        return "bg-violet-900/30 text-violet-400 border-violet-500/30"
      default:
        return "bg-gray-900/30 text-gray-400 border-gray-500/30"
    }
  }


  const handleSynBotAlignment = () => {
    setIsAligning(true)
    setAlignmentProgress(0)

    // Simulate the alignment process with different stages
    const stages = [
      "Analyzing SoulThread entries...",
      "Extracting belief patterns...",
      "Mapping cognitive preferences...",
      "Calibrating response algorithms...",
      "Finalizing SynBot alignment...",
    ]

    let currentStage = 0
    const stageElement = document.createElement("div")
    stageElement.className = "text-xs text-center mt-1 text-gray-400"

    const progressBar = threadRef.current?.parentElement?.querySelector(".h-2")
    if (progressBar && progressBar.parentElement) {
      progressBar.parentElement.appendChild(stageElement)
    }

    const interval = setInterval(() => {
      setAlignmentProgress((prev) => {
        const newProgress = prev + Math.floor(Math.random() * 5) + 1

        // Update the stage text
        if (newProgress > currentStage * 20 + 20 && currentStage < stages.length - 1) {
          currentStage++
          if (stageElement) {
            stageElement.textContent = stages[currentStage]
          }
        }

        if (newProgress >= 100) {
          clearInterval(interval)
          setIsAligning(false)

          // Show success message
          setTimeout(() => {
            alert("SynBot successfully aligned with your SoulThread! Alignment score: 92%")
            if (stageElement) {
              stageElement.textContent = "Alignment complete!"
              setTimeout(() => {
                if (stageElement.parentElement) {
                  stageElement.parentElement.removeChild(stageElement)
                }
              }, 2000)
            }
          }, 500)

          return 100
        }

        return newProgress
      })
    }, 150)

    // Set initial stage text
    stageElement.textContent = stages[0]
  }

  // Add new thread event
  const handleAddThreadEvent = () => {
    if (!newThreadTitle.trim() || !newThreadContent.trim()) return

    const newEvent: ThreadEvent = {
      id: `event-${Date.now()}`,
      type: newThreadType,
      title: newThreadTitle,
      description: newThreadContent,
      timestamp: new Date().toISOString(),
      isPublic: isPublic,
      reactions: { fire: 0, brain: 0, lightning: 0 },
    }

    setCurrentThread((prev) => {
      if (!prev) return prev

      return {
        ...prev,
        events: [newEvent, ...prev.events],
        lastUpdated: new Date().toISOString(),
      }
    })

    setIsComposing(false)
    setNewThreadTitle("")
    setNewThreadContent("")
    setNewThreadType("reflection")
    setIsPublic(true)
  }


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchQuery.trim()) {
      setSuggestedThreads(mockSuggestedThreads)
      return
    }

    // Filter suggested threads based on search query
    const filteredThreads = mockSuggestedThreads.filter((thread) => {
      const searchLower = searchQuery.toLowerCase()

      // Search in owner name
      if (thread.owner.toLowerCase().includes(searchLower)) return true

      // Search in thread events
      return thread.events.some(
        (event) =>
          event.title.toLowerCase().includes(searchLower) || event.description.toLowerCase().includes(searchLower),
      )
    })

    setSuggestedThreads(filteredThreads)

    // If no results, show a message
    if (filteredThreads.length === 0) {
      alert(`No threads found matching "${searchQuery}"`)
    }
  }

  // Filter events based on view mode
  const filteredEvents = currentThread?.events.filter((event) => (viewMode === "public" ? event.isPublic : true)) || []

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 relative">
            <Dna className="w-24 h-24 text-purple-400 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-purple-400">Loading SoulThreads</h2>
          <div className="loading-bar">
            <div className="loading-progress"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black bg-opacity-90 text-gray-200 font-mono relative overflow-hidden cyberpunk-grid">
      {/* Background grid and effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(138,43,226,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(138,43,226,0.03)_1px,transparent_1px)] bg-[size:35px_35px] pointer-events-none"></div>
      <div className="absolute inset-0 scanline pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 relative z-10">
        {/* Header section */}
        <div className="relative">
          <div className="absolute -top-6 -left-4 text-xs text-purple-500 opacity-70 font-bold">
            <span className="mr-2">THREAD:</span>
            <span className="text-green-400">ACTIVE</span>
          </div>

          <header className="border-b border-purple-500/30 pb-4 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex items-center">
                <Link href="/syndicates">
                  <Button
                    variant="outline"
                    className="mr-4 border-purple-500/50 text-purple-400 hover:bg-purple-900/20 flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Syndicates
                  </Button>
                </Link>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2 holographic cyberpunk-title tracking-wider">
                    SOULTHREADS_
                  </h1>
                  <p className="text-gray-400 max-w-2xl">
                    <span className="text-purple-400">The narrative layer of your identity</span> — where your
                    contributions, beliefs, and creative expressions are woven into your digital presence.
                  </p>
                </div>
              </div>

              <div className="flex items-center mt-4 md:mt-0 space-x-2">
                <div className="text-right text-sm px-3 py-1.5 border border-purple-500/30 bg-black/60 rounded">
                  <div className="text-gray-500">REPUTATION</div>
                  <div className="text-purple-400 text-lg font-bold">{currentThread?.reputation || 0}</div>
                </div>

                <div className="text-right text-sm px-3 py-1.5 border border-purple-500/30 bg-black/60 rounded">
                  <div className="text-gray-500">FOLLOWERS</div>
                  <div className="text-purple-400 text-lg font-bold">{currentThread?.followers || 0}</div>
                </div>

                <div className="text-right text-sm px-3 py-1.5 border border-purple-500/30 bg-black/60 rounded">
                  <div className="text-gray-500">EVENTS</div>
                  <div className="text-purple-400 text-lg font-bold">{currentThread?.events.length || 0}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <div className="text-xs flex items-center gap-1.5 text-gray-400 bg-black/60 px-2 py-1 border border-purple-500/20 rounded-sm">
                <Dna className="w-3 h-3 text-purple-500" />
                <span>
                  SoulSig = <span className="text-purple-400">your DNA</span>
                </span>
              </div>

              <div className="text-xs flex items-center gap-1.5 text-gray-400 bg-black/60 px-2 py-1 border border-purple-500/20 rounded-sm">
                <BookOpen className="w-3 h-3 text-purple-500" />
                <span>
                  SoulThread = <span className="text-purple-400">your life story</span>
                </span>
              </div>

              <div className="text-xs flex items-center gap-1.5 text-gray-400 bg-black/60 px-2 py-1 border border-purple-500/20 rounded-sm">
                <Cpu className="w-3 h-3 text-purple-500" />
                <span>
                  SynBot = <span className="text-purple-400">your trusted twin</span>
                </span>
              </div>
            </div>
          </header>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-900/50 border-purple-500/30 overflow-hidden lg:sticky lg:top-24 lg:self-start">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <span>Your SoulThread</span>
                  <Dna className="h-5 w-5 text-purple-400" />
                </CardTitle>
                <CardDescription>The narrative layer of your identity</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="relative w-24 h-24 mb-4">
                  <div className="absolute inset-0 bg-purple-500 rounded-full filter blur-lg opacity-30 animate-pulse"></div>
                  <img
                    src="/images/cyberpunk-avatars/mindmash-user.png"
                    alt={currentThread?.owner || "User"}
                    className="w-full h-full rounded-full border-2 border-purple-500/50 object-cover"
                  />
                </div>

                <h3 className="text-xl font-bold mb-1">{currentThread?.owner || "User"}</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Last updated: {formatDate(currentThread?.lastUpdated || "")}
                </p>

                <div className="w-full p-3 bg-black/40 rounded-lg border border-purple-500/20 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Thread Status</span>
                    <Badge
                      variant="outline"
                      className={`${currentThread?.isPublic ? "bg-green-900/30 text-green-400 border-green-500/30" : "bg-amber-900/30 text-amber-400 border-amber-500/30"}`}
                    >
                      {currentThread?.isPublic ? "Public" : "Private"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">View Mode</span>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="view-mode" className="text-sm">
                        {viewMode === "public" ? (
                          <span className="flex items-center text-green-400">
                            <Unlock className="h-3 w-3 mr-1" />
                            Public
                          </span>
                        ) : (
                          <span className="flex items-center text-amber-400">
                            <Lock className="h-3 w-3 mr-1" />
                            All
                          </span>
                        )}
                      </Label>
                      <Switch
                        id="view-mode"
                        checked={viewMode === "private"}
                        onCheckedChange={(checked) => setViewMode(checked ? "private" : "public")}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full">
                  <Button
                    variant="outline"
                    className="border-purple-500/30 hover:bg-purple-900/20"
                    onClick={() => setIsComposing(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Compose
                  </Button>
                  <Button
                    variant="outline"
                    className="border-purple-500/30 hover:bg-purple-900/20"
                    onClick={handleSynBotAlignment}
                    disabled={isAligning}
                  >
                    <Cpu className="h-4 w-4 mr-2" />
                    {isAligning ? "Aligning..." : "Align SynBot"}
                  </Button>
                </div>

                {isAligning && (
                  <div className="w-full mt-4">
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
                        style={{ width: `${alignmentProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-center mt-1 text-gray-400">
                      Aligning SynBot to SoulThread: {alignmentProgress}%
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Suggested Threads */}
            <Card className="bg-gray-900/50 border-purple-500/30 mt-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <GitMerge className="h-5 w-5 mr-2 text-purple-400" />
                  Suggested Threads
                </CardTitle>
                <CardDescription>Threads that align with your narrative</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {suggestedThreads.map((thread) => (
                    <div
                      key={thread.id}
                      className="p-3 bg-black/40 rounded-lg border border-purple-500/20 hover:border-purple-500/50 transition-all cursor-pointer"
                    >
                      <div className="flex items-center mb-2">
                        <img
                          src={thread.ownerAvatar || "/placeholder.svg"}
                          alt={thread.owner}
                          className="w-8 h-8 rounded-full border border-purple-500/30 mr-3"
                        />
                        <div>
                          <h4 className="font-medium text-white">{thread.owner}</h4>
                          <p className="text-xs text-gray-500">
                            {thread.events.length} events · {thread.followers} followers
                          </p>
                        </div>
                      </div>
                      {thread.events.length > 0 && (
                        <div className="border-l-2 border-purple-500/30 pl-3 mt-2">
                          <p className="text-sm font-medium text-gray-300">{thread.events[0].title}</p>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{thread.events[0].description}</p>
                        </div>
                      )}
                      <div className="flex justify-between items-center mt-3">
                        <Badge
                          variant="outline"
                          className="bg-purple-900/20 border-purple-500/30 text-purple-400 text-xs"
                        >
                          {thread.reputation}% alignment
                        </Badge>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <GitBranch className="h-3.5 w-3.5 text-purple-400" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <Bookmark className="h-3.5 w-3.5 text-purple-400" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content area */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full grid grid-cols-3 mb-6 bg-gray-900/50">
                <TabsTrigger
                  value="profile"
                  className="data-[state=active]:bg-gray-900/60 data-[state=active]:text-purple-400"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span className="hidden sm:inline">Thread Profile</span>
                  </div>
                </TabsTrigger>

                <TabsTrigger
                  value="composer"
                  className="data-[state=active]:bg-gray-900/60 data-[state=active]:text-cyan-400"
                >
                  <div className="flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    <span className="hidden sm:inline">Thread Composer</span>
                  </div>
                </TabsTrigger>

                <TabsTrigger
                  value="social"
                  className="data-[state=active]:bg-gray-900/60 data-[state=active]:text-amber-400"
                >
                  <div className="flex items-center gap-2">
                    <Network className="w-4 h-4" />
                    <span className="hidden sm:inline">Thread Network</span>
                  </div>
                </TabsTrigger>
              </TabsList>

              {/* Thread Profile Tab */}
              <TabsContent value="profile">
                <Card className="bg-gray-900/50 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-purple-400" />
                      SoulThread Timeline
                    </CardTitle>
                    <CardDescription>Your narrative journey through the MindMash protocol</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-purple-500/20"></div>
                      <div className="space-y-6" ref={threadRef}>
                        {filteredEvents.map((event, index) => (
                          <div key={event.id} className="relative pl-10">
                            <div
                              className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center border ${getEventColor(event.type, event.syndicateColor)}`}
                            >
                              {getEventIcon(event.type)}
                            </div>
                            <div className="bg-black/40 border border-gray-800 rounded-lg p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-white">{event.title}</h3>
                                <Badge
                                  variant="outline"
                                  className={`${event.isPublic ? "bg-green-900/30 text-green-400 border-green-500/30" : "bg-amber-900/30 text-amber-400 border-amber-500/30"}`}
                                >
                                  {event.isPublic ? "Public" : "Private"}
                                </Badge>
                              </div>
                              <p className="text-gray-300 text-sm mb-3">{event.description}</p>
                              <div className="flex justify-between items-center text-xs text-gray-500">
                                <div className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>
                                    {formatDate(event.timestamp)} at {formatTime(event.timestamp)}
                                  </span>
                                </div>
                                {event.syndicate && (
                                  <Badge variant="outline" className={getEventColor("join", event.syndicateColor)}>
                                    {event.syndicate}
                                  </Badge>
                                )}
                              </div>
                              {event.isPublic && (
                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800">
                                  <div className="flex items-center space-x-3">
                                    {/* Replace the reaction buttons in the profile tab with these interactive ones: */}
                                    {/* Look for the section with className="flex items-center space-x-3" inside the event actions div */}
                                    {/* and replace the three button elements with: */}
                                    <button
                                      className="flex items-center text-red-400 hover:text-red-300"
                                      onClick={() => handleReaction(event.id, "fire")}
                                    >
                                      <Flame className="h-4 w-4 mr-1" />
                                      <span>{event.reactions.fire}</span>
                                    </button>
                                    <button
                                      className="flex items-center text-cyan-400 hover:text-cyan-300"
                                      onClick={() => handleReaction(event.id, "brain")}
                                    >
                                      <Brain className="h-4 w-4 mr-1" />
                                      <span>{event.reactions.brain}</span>
                                    </button>
                                    <button
                                      className="flex items-center text-yellow-400 hover:text-yellow-300"
                                      onClick={() => handleReaction(event.id, "lightning")}
                                    >
                                      <Zap className="h-4 w-4 mr-1" />
                                      <span>{event.reactions.lightning}</span>
                                    </button>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <Share2 className="h-4 w-4 text-gray-400" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <GitBranch className="h-4 w-4 text-gray-400" />
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Thread Composer Tab */}
              <TabsContent value="composer">
                <Card className="bg-gray-900/50 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Edit className="h-5 w-5 mr-2 text-cyan-400" />
                      SoulThread Composer
                    </CardTitle>
                    <CardDescription>Create new entries for your SoulThread narrative</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="thread-title" className="text-sm text-gray-400 mb-1 block">
                          Entry Title
                        </Label>
                        <Input
                          id="thread-title"
                          placeholder="Give your thread entry a title..."
                          className="bg-black/50 border-gray-700"
                          value={newThreadTitle}
                          onChange={(e) => setNewThreadTitle(e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="thread-type" className="text-sm text-gray-400 mb-1 block">
                          Entry Type
                        </Label>
                        <div className="grid grid-cols-3 gap-2">
                          <Button
                            variant={newThreadType === "belief" ? "default" : "outline"}
                            className={
                              newThreadType === "belief"
                                ? "bg-amber-900/50 hover:bg-amber-900/70 text-white border-amber-500/50"
                                : "border-gray-700 text-gray-400 hover:bg-gray-800/50"
                            }
                            onClick={() => setNewThreadType("belief")}
                          >
                            <Lightbulb className="h-4 w-4 mr-2" />
                            Belief
                          </Button>
                          <Button
                            variant={newThreadType === "reflection" ? "default" : "outline"}
                            className={
                              newThreadType === "reflection"
                                ? "bg-violet-900/50 hover:bg-violet-900/70 text-white border-violet-500/50"
                                : "border-gray-700 text-gray-400 hover:bg-gray-800/50"
                            }
                            onClick={() => setNewThreadType("reflection")}
                          >
                            <BookOpen className="h-4 w-4 mr-2" />
                            Reflection
                          </Button>
                          <Button
                            variant={newThreadType === "remix" ? "default" : "outline"}
                            className={
                              newThreadType === "remix"
                                ? "bg-indigo-900/50 hover:bg-indigo-900/70 text-white border-indigo-500/50"
                                : "border-gray-700 text-gray-400 hover:bg-gray-800/50"
                            }
                            onClick={() => setNewThreadType("remix")}
                          >
                            <GitBranch className="h-4 w-4 mr-2" />
                            Remix
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="thread-content" className="text-sm text-gray-400 mb-1 block">
                          Entry Content
                        </Label>
                        <Textarea
                          id="thread-content"
                          placeholder="Share your thoughts, beliefs, or reflections..."
                          className="bg-black/50 border-gray-700 min-h-[200px]"
                          value={newThreadContent}
                          onChange={(e) => setNewThreadContent(e.target.value)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Switch id="thread-public" checked={isPublic} onCheckedChange={setIsPublic} />
                          <Label htmlFor="thread-public" className="text-sm">
                            {isPublic ? (
                              <span className="flex items-center text-green-400">
                                <Unlock className="h-3 w-3 mr-1" />
                                Public Entry
                              </span>
                            ) : (
                              <span className="flex items-center text-amber-400">
                                <Lock className="h-3 w-3 mr-1" />
                                Private Entry
                              </span>
                            )}
                          </Label>
                        </div>

                        <Button
                          className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white"
                          onClick={handleAddThreadEvent}
                          disabled={!newThreadTitle.trim() || !newThreadContent.trim()}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save to SoulThread
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/50 border-purple-500/30 mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Wand2 className="h-5 w-5 mr-2 text-cyan-400" />
                      SynBot Assistance
                    </CardTitle>
                    <CardDescription>Let your SynBot help you compose your SoulThread entries</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <SynBotAvatar size={48} />
                        <div className="flex-1 p-3 bg-black/40 rounded-lg border border-cyan-500/20">
                          <p className="text-sm text-gray-300">
                            I can help you compose SoulThread entries based on your past interactions and philosophical
                            stances. What kind of entry would you like to create today?
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          className="border-cyan-500/30 hover:bg-cyan-900/20 text-left justify-start h-auto py-3"
                          onClick={() => {
                            setNewThreadType("belief")
                            setNewThreadTitle("On Collaborative Intelligence")
                            setNewThreadContent(
                              "I believe that the most powerful form of intelligence emerges not from isolated genius but from the harmonious collaboration of diverse minds, both human and artificial.",
                            )
                          }}
                        >
                          <div>
                            <div className="flex items-center text-cyan-400 mb-1">
                              <Lightbulb className="h-4 w-4 mr-2" />
                              <span className="font-medium">Philosophical Stance</span>
                            </div>
                            <p className="text-xs text-gray-400">
                              Generate a belief statement based on your past interactions
                            </p>
                          </div>
                        </Button>

                        <Button
                          variant="outline"
                          className="border-cyan-500/30 hover:bg-cyan-900/20 text-left justify-start h-auto py-3"
                          onClick={() => {
                            setNewThreadType("reflection")
                            setNewThreadTitle("Reflections on Quantum Flow Syndicate")
                            setNewThreadContent(
                              "My experience in the Quantum Flow Syndicate has revealed that the most elegant solutions emerge when we balance structure and chaos, much like the quantum systems that inspired our name.",
                            )
                          }}
                        >
                          <div>
                            <div className="flex items-center text-cyan-400 mb-1">
                              <BookOpen className="h-4 w-4 mr-2" />
                              <span className="font-medium">Syndicate Reflection</span>
                            </div>
                            <p className="text-xs text-gray-400">Generate a reflection on your syndicate experience</p>
                          </div>
                        </Button>

                        <Button
                          variant="outline"
                          className="border-cyan-500/30 hover:bg-cyan-900/20 text-left justify-start h-auto py-3"
                          onClick={() => {
                            setNewThreadType("remix")
                            setNewThreadTitle("Remix: Quantum Collaboration Enhanced")
                            setNewThreadContent(
                              "Building on QuantumHarmony's concept of quantum entanglement between AI models, I propose extending this to include emotional resonance as a key factor in model alignment.",
                            )
                          }}
                        >
                          <div>
                            <div className="flex items-center text-cyan-400 mb-1">
                              <GitBranch className="h-4 w-4 mr-2" />
                              <span className="font-medium">Thread Remix</span>
                            </div>
                            <p className="text-xs text-gray-400">Generate a remix of another user's thread</p>
                          </div>
                        </Button>

                        <Button
                          variant="outline"
                          className="border-cyan-500/30 hover:bg-cyan-900/20 text-left justify-start h-auto py-3"
                          onClick={() => {
                            setNewThreadType("belief")
                            setNewThreadTitle("The Future of Human-AI Collaboration")
                            setNewThreadContent(
                              "I believe the future of human-AI collaboration lies not in humans directing AI or AI replacing humans, but in a symbiotic relationship where each enhances the other's natural capabilities.",
                            )
                          }}
                        >
                          <div>
                            <div className="flex items-center text-cyan-400 mb-1">
                              <Sparkles className="h-4 w-4 mr-2" />
                              <span className="font-medium">Future Vision</span>
                            </div>
                            <p className="text-xs text-gray-400">Generate a forward-looking belief statement</p>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Thread Network Tab */}
              <TabsContent value="social">
                <Card className="bg-gray-900/50 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Network className="h-5 w-5 mr-2 text-amber-400" />
                      Thread Network
                    </CardTitle>
                    <CardDescription>Discover and interact with other SoulThreads in the network</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="thread-search" className="text-sm text-gray-400 mb-1 block">
                          Search Threads
                        </Label>
                        {/* Find the search input in the Thread Network tab and update it to: */}
                        <form onSubmit={handleSearch}>
                          <div className="relative">
                            <Input
                              id="thread-search"
                              placeholder="Search by username, topic, or belief..."
                              className="bg-black/50 border-gray-700 pl-10"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                              <Search className="h-4 w-4" />
                            </div>
                            <Button
                              type="submit"
                              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 px-2 bg-purple-900/50 hover:bg-purple-900/70"
                            >
                              Search
                            </Button>
                          </div>
                        </form>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {suggestedThreads.map((thread) => (
                          <div
                            key={thread.id}
                            className="bg-black/40 border border-gray-800 rounded-lg p-4 hover:border-amber-500/50 transition-all"
                          >
                            <div className="flex items-center mb-3">
                              <img
                                src={thread.ownerAvatar || "/placeholder.svg"}
                                alt={thread.owner}
                                className="w-10 h-10 rounded-full border border-amber-500/30 mr-3"
                              />
                              <div>
                                <h4 className="font-medium text-white">{thread.owner}</h4>
                                <div className="flex items-center text-xs text-gray-500">
                                  <span className="mr-2">{thread.reputation} reputation</span>
                                  <span>·</span>
                                  <span className="ml-2">{thread.followers} followers</span>
                                </div>
                              </div>
                              {/* Find the Follow button in the Thread Network tab and update it to: */}
                              <Button
                                variant="outline"
                                size="sm"
                                className="ml-auto h-8 border-amber-500/30 hover:bg-amber-900/20 text-amber-400"
                                onClick={() => {
                                  alert(`You are now following ${thread.owner}`)
                                  // Update the follower count
                                  const updatedThreads = suggestedThreads.map((t) => {
                                    if (t.id === thread.id) {
                                      return { ...t, followers: t.followers + 1 }
                                    }
                                    return t
                                  })
                                  setSuggestedThreads(updatedThreads)
                                }}
                              >
                                <Users className="h-3.5 w-3.5 mr-1" />
                                Follow
                              </Button>
                            </div>

                            {thread.events.length > 0 && (
                              <div className="border-l-2 border-amber-500/30 pl-3 mb-3">
                                <div className="flex items-center text-xs text-gray-500 mb-1">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>{formatDate(thread.events[0].timestamp)}</span>
                                  <span className="mx-1">·</span>
                                  <Badge
                                    variant="outline"
                                    className={getEventColor(thread.events[0].type, thread.events[0].syndicateColor)}
                                  >
                                    {thread.events[0].type}
                                  </Badge>
                                </div>
                                <h5 className="font-medium text-white mb-1">{thread.events[0].title}</h5>
                                <p className="text-sm text-gray-300 line-clamp-3">{thread.events[0].description}</p>
                              </div>
                            )}

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <button className="flex items-center text-red-400 hover:text-red-300">
                                  <Flame className="h-4 w-4 mr-1" />
                                  <span>{thread.events[0]?.reactions.fire || 0}</span>
                                </button>
                                <button className="flex items-center text-cyan-400 hover:text-cyan-300">
                                  <Brain className="h-4 w-4 mr-1" />
                                  <span>{thread.events[0]?.reactions.brain || 0}</span>
                                </button>
                                <button className="flex items-center text-yellow-400 hover:text-yellow-300">
                                  <Zap className="h-4 w-4 mr-1" />
                                  <span>{thread.events[0]?.reactions.lightning || 0}</span>
                                </button>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <GitBranch className="h-4 w-4 text-amber-400" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Share2 className="h-4 w-4 text-amber-400" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-black/40 border border-amber-500/20 rounded-lg p-4">
                        <h3 className="font-medium text-amber-400 flex items-center mb-3">
                          <GitPullRequest className="h-4 w-4 mr-2" />
                          Thread-to-Thread Interactions
                        </h3>
                        <p className="text-sm text-gray-300 mb-3">
                          SoulThreads can interact with each other, creating a rich tapestry of interconnected
                          narratives. Your SynBot can suggest potential collaborations based on thread alignment.
                        </p>
                        <div className="flex items-start gap-4 bg-black/60 border border-gray-800 rounded-lg p-3">
                          <SynBotAvatar size={40} />
                          <div>
                            <p className="text-sm text-gray-300">
                              Your style aligns with <span className="text-amber-400 font-medium">@QuantumHarmony</span>
                              's latest SoulThread about quantum collaboration. Would you like to create a remix?
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Button
                                size="sm"
                                className="h-8 bg-amber-900/50 hover:bg-amber-900/70 text-white border border-amber-500/30"
                              >
                                <GitBranch className="h-3.5 w-3.5 mr-1" />
                                Create Remix
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 border-gray-700 text-gray-400 hover:bg-gray-800/50"
                              >
                                View Thread
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Add cyberpunk-style CSS */}
      <style jsx global>{`
        .cyberpunk-grid {
          background-image: linear-gradient(rgba(138, 43, 226, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(138, 43, 226, 0.03) 1px, transparent 1px);
          background-size: 35px 35px;
        }
        
        .scanline {
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          background-size: 100% 4px;
          animation: scanline 6s linear infinite;
        }
        
        @keyframes scanline {
          0% {
            background-position: 0 0%;
          }
          100% {
            background-position: 0 100%;
          }
        }
        
        .holographic {
          background-image: linear-gradient(45deg, #a855f7 0%, #06b6d4 25%, #a855f7 50%, #06b6d4 75%, #a855f7 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: holographic 6s ease infinite;
        }
        
        @keyframes holographic {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .loading-bar {
          width: 100%;
          height: 4px;
          background-color: rgba(138, 43, 226, 0.2);
          border-radius: 2px;
          overflow: hidden;
        }
        
        .loading-progress {
          position: absolute;
          height: 100%;
          background: linear-gradient(90deg, #a855f7, #06b6d4);
          animation: loading 1.5s infinite;
          width: 30%;
        }
        
        @keyframes loading {
          0% {
            left: -30%;
          }
          100% {
            left: 100%;
          }
        }
      `}</style>
    </div>
  )
}
