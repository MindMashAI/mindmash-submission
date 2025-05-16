"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useAudio } from "@/components/audio-manager"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Network,
  MessageSquare,
  Send,
  Zap,
  Sparkles,
  Cpu,
  X,
  Plus,
  Layers,
  Maximize2,
  Minimize2,
  Lightbulb,
  Hash,
  Reply,
  Home,
  Focus,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { AIAssistedThought } from "@/components/ai-assisted-thought"
import type { ThoughtNode, ThoughtCluster } from "@/types/types"

// AI models available for collaboration
const AI_MODELS = [
  { id: "grok", name: "Grok", color: "#4ade80", specialties: ["technical", "creative"] },
  { id: "chatgpt", name: "ChatGPT", color: "#d946ef", specialties: ["educational", "analytical"] },
  { id: "gemini", name: "Gemini", color: "#22d3ee", specialties: ["analytical", "philosophical"] },
  { id: "system", name: "MindMash System", color: "#facc15", specialties: ["all"] },
]

// Neon colors for thoughts
const NEON_COLORS = [
  "#4ade80", // neon green
  "#d946ef", // neon purple
  "#22d3ee", // neon cyan
  "#facc15", // neon yellow
  "#f87171", // neon red
  "#60a5fa", // neon blue
  "#c084fc", // neon violet
  "#34d399", // neon teal
  "#fb923c", // neon orange
]

// Mock data for the neural thought network
const INITIAL_THOUGHTS: ThoughtNode[] = [
  {
    id: "thought1",
    content: "What if we could create a neural interface that directly translates thoughts to code?",
    author: {
      id: "user1",
      name: "NeuralPioneer",
      avatar: "/images/cyberpunk-avatars/neural-pioneer.png",
      type: "human",
    },
    timestamp: "2 hours ago",
    connections: ["thought2", "thought4", "comment1", "comment2"],
    position: { x: 50, y: 30 },
    sentiment: "positive",
    category: "technical",
    likes: 12,
    expansions: [],
    isExpanded: false,
    commentIds: ["comment1", "comment2"],
    clusterId: "cluster1",
    isComment: false,
    parentId: null,
  },
  {
    id: "thought2",
    content:
      "The technical challenges of neural-to-code translation include signal noise filtering and semantic mapping.",
    author: {
      id: "ai1",
      name: "Grok",
      avatar: "/placeholder.svg?height=40&width=40",
      type: "ai",
      model: "grok",
    },
    timestamp: "1 hour ago",
    connections: ["thought1", "thought3"],
    position: { x: 70, y: 50 },
    sentiment: "neutral",
    category: "technical",
    likes: 8,
    expansions: [],
    isExpanded: false,
    clusterId: "cluster1",
    isComment: false,
    parentId: null,
  },
  {
    id: "thought3",
    content: "We could use quantum computing to process neural signals at unprecedented speeds.",
    author: {
      id: "user2",
      name: "QuantumDreamer",
      avatar: "/images/cyberpunk-avatars/quantum-dreamer.png",
      type: "human",
    },
    timestamp: "45 minutes ago",
    connections: ["thought2", "thought5"],
    position: { x: 85, y: 70 },
    sentiment: "positive",
    category: "technical",
    likes: 15,
    expansions: [],
    isExpanded: false,
    clusterId: "cluster1",
    isComment: false,
    parentId: null,
  },
  {
    id: "thought4",
    content: "The ethical implications of direct neural interfaces need careful consideration.",
    author: {
      id: "ai2",
      name: "ChatGPT",
      avatar: "/placeholder.svg?height=40&width=40",
      type: "ai",
      model: "chatgpt",
    },
    timestamp: "30 minutes ago",
    connections: ["thought1", "thought6"],
    position: { x: 30, y: 60 },
    sentiment: "neutral",
    category: "philosophical",
    likes: 10,
    expansions: [],
    isExpanded: false,
    clusterId: "cluster2",
    isComment: false,
    parentId: null,
  },
  {
    id: "thought5",
    content: "I've created a prototype that achieves 60% accuracy in translating visual imagination to code.",
    author: {
      id: "user3",
      name: "CodeShaman",
      avatar: "/images/cyberpunk-avatars/code-shaman.png",
      type: "human",
    },
    timestamp: "20 minutes ago",
    connections: ["thought3"],
    position: { x: 65, y: 85 },
    sentiment: "positive",
    category: "technical",
    likes: 24,
    expansions: [],
    isExpanded: false,
    clusterId: "cluster1",
    isComment: false,
    parentId: null,
  },
  {
    id: "thought6",
    content: "What if we combined multiple AI models to create a more balanced ethical framework?",
    author: {
      id: "user4",
      name: "EthicalMinder",
      avatar: "/images/cyberpunk-avatars/ethical-minder.png",
      type: "human",
    },
    timestamp: "15 minutes ago",
    connections: ["thought4", "thought7"],
    position: { x: 15, y: 75 },
    sentiment: "positive",
    category: "philosophical",
    likes: 18,
    expansions: [],
    isExpanded: false,
    clusterId: "cluster2",
    isComment: false,
    parentId: null,
  },
  {
    id: "thought7",
    content: "A multi-model approach could provide diverse perspectives but might introduce conflicting values.",
    author: {
      id: "ai3",
      name: "Gemini",
      avatar: "/placeholder.svg?height=40&width=40",
      type: "ai",
      model: "gemini",
    },
    timestamp: "10 minutes ago",
    connections: ["thought6"],
    position: { x: 25, y: 90 },
    sentiment: "neutral",
    category: "analytical",
    likes: 7,
    expansions: [],
    isExpanded: false,
    clusterId: "cluster2",
    isComment: false,
    parentId: null,
  },
  // Comment nodes
  {
    id: "comment1",
    content: "This could revolutionize how we interact with computers!",
    author: {
      id: "user5",
      name: "TechVisionary",
      avatar: "/images/cyberpunk-avatars/tech-visionary.png",
      type: "human",
    },
    timestamp: "1 hour ago",
    connections: ["thought1"],
    position: { x: 45, y: 20 },
    sentiment: "positive",
    category: "technical",
    likes: 5,
    expansions: [],
    isExpanded: false,
    clusterId: "cluster1",
    isComment: true,
    parentId: "thought1",
  },
  {
    id: "comment2",
    content: "I wonder about the bandwidth limitations of current neural interfaces.",
    author: {
      id: "user6",
      name: "NeuroBiologist",
      avatar: "/images/cyberpunk-avatars/tech-visionary.png",
      type: "human",
    },
    timestamp: "45 minutes ago",
    connections: ["thought1"],
    position: { x: 55, y: 20 },
    sentiment: "neutral",
    category: "technical",
    likes: 3,
    expansions: [],
    isExpanded: false,
    clusterId: "cluster1",
    isComment: true,
    parentId: "thought1",
  },
]

// Initial thought clusters
const INITIAL_CLUSTERS: ThoughtCluster[] = [
  {
    id: "cluster1",
    name: "Neural-to-Code Translation",
    posts: ["thought1", "thought2", "thought3", "thought5", "comment1", "comment2"],
    tags: ["#NeuralInterface", "#CodeGeneration", "#BrainComputing"],
    trendingScore: 87,
  },
  {
    id: "cluster2",
    name: "Ethics of Neural Interfaces",
    posts: ["thought4", "thought6", "thought7"],
    tags: ["#Ethics", "#AIEthics", "#NeuralEthics"],
    trendingScore: 65,
  },
]

export default function NeuralFeedPage() {
  const [thoughts, setThoughts] = useState<ThoughtNode[]>(INITIAL_THOUGHTS)
  const [clusters, setClusters] = useState<ThoughtCluster[]>(INITIAL_CLUSTERS)
  const [newThought, setNewThought] = useState("")
  const [newComment, setNewComment] = useState("")
  const [commentingOnThought, setCommentingOnThought] = useState<string | null>(null)
  const [selectedAIModels, setSelectedAIModels] = useState<string[]>(["system"])
  const [activeThought, setActiveThought] = useState<string | null>(null)
  const [isCreatingThought, setIsCreatingThought] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [viewMode, setViewMode] = useState<"network" | "feed">("network")
  const [isProcessing, setIsProcessing] = useState(false)
  const [previousResponses, setPreviousResponses] = useState<string[]>([])
  const [zoomLevel, setZoomLevel] = useState(1)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [draggedNode, setDraggedNode] = useState<string | null>(null)
  const [customizingNode, setCustomizingNode] = useState<string | null>(null)
  const [searchResults, setSearchResults] = useState<ThoughtNode[] | null>(null)
  const [focusMode, setFocusMode] = useState(false)
  const [focusedThought, setFocusedThought] = useState<string | null>(null)

  const networkRef = useRef<HTMLDivElement>(null)
  const thoughtInputRef = useRef<HTMLTextAreaElement>(null)
  const commentInputRef = useRef<HTMLTextAreaElement>(null)
  const { toast } = useToast()
  const { playSound } = useAudio()

  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isLoading, setIsLoading] = useState(true)

  // Get a neon color based on a string ID
  const getNeonColor = (id: string) => {
    const charCode = id.charCodeAt(id.length - 1) % NEON_COLORS.length
    return NEON_COLORS[charCode]
  }

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Handle node customization
  const openNodeCustomizer = (nodeId: string) => {
    setCustomizingNode(nodeId)
    playSound("/sounds/feature-select.mp3")
  }

  // Update node visual style
  const updateNodeVisualStyle = (nodeId: string, visualStyle: ThoughtNode["visualStyle"]) => {
    setThoughts((prev) => prev.map((t) => (t.id === nodeId ? { ...t, visualStyle } : t)))
  }

  // Handle search results
  const handleSearchResults = (results: ThoughtNode[]) => {
    setSearchResults(results)
    if (results.length > 0) {
      toast({
        title: "Search Results",
        description: `Found ${results.length} matching thoughts`,
      })
    }
  }

  // Clear search results
  const clearSearchResults = () => {
    setSearchResults(null)
  }

  // Handle AI assisted thought input
  const handleAIThoughtSuggestion = (content: string) => {
    setNewThought(content)
    thoughtInputRef.current?.focus()
  }

  // Select a cluster to focus on
  const handleSelectCluster = (clusterId: string) => {
    // Filter thoughts to show only this cluster
    setFocusMode(true)
    const clusterThoughts = thoughts.filter((t) => t.clusterId === clusterId)
    if (clusterThoughts.length > 0) {
      setFocusedThought(clusterThoughts[0].id)

      toast({
        title: "Cluster Selected",
        description: `Focusing on cluster with ${clusterThoughts.length} thoughts`,
      })
    }
  }

  // Handle zoom controls
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 2))
    playSound("/sounds/button-click.mp3")
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.5))
    playSound("/sounds/button-click.mp3")
  }

  // Toggle thought expansion
  const toggleThoughtExpansion = (thoughtId: string) => {
    playSound("/sounds/button-click.mp3")
    setThoughts((prev) => prev.map((t) => (t.id === thoughtId ? { ...t, isExpanded: !t.isExpanded } : t)))
  }

  // Like a thought
  const likeThought = (thoughtId: string) => {
    playSound("/sounds/button-click.mp3")
    setThoughts((prev) => prev.map((t) => (t.id === thoughtId ? { ...t, likes: t.likes + 1 } : t)))
  }

  // Toggle focus mode
  const toggleFocusMode = (thoughtId?: string) => {
    if (focusMode && focusedThought === thoughtId) {
      setFocusMode(false)
      setFocusedThought(null)
    } else {
      setFocusMode(true)
      setFocusedThought(thoughtId || activeThought)
    }
  }

  // Handle node drag start
  const handleNodeDragStart = (e: React.MouseEvent, thoughtId: string) => {
    e.stopPropagation()
    setDraggedNode(thoughtId)
  }

  // Handle node drag
  const handleNodeDrag = (e: React.MouseEvent) => {
    if (draggedNode && networkRef.current) {
      const rect = networkRef.current.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100

      setThoughts((prev) =>
        prev.map((t) =>
          t.id === draggedNode
            ? { ...t, position: { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) } }
            : t,
        ),
      )
    }
  }

  // Handle node drag end
  const handleNodeDragEnd = () => {
    setDraggedNode(null)
  }

  // Handle mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY * -0.01
    setZoomLevel((prev) => Math.min(Math.max(prev + delta, 0.5), 3))
  }

  // Handle mouse down for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && !draggedNode) {
      // Left mouse button
      setIsDragging(true)
      setDragStart({ x: e.clientX, y: e.clientY })
    }
  }

  // Handle mouse move for panning
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - dragStart.x
      const dy = e.clientY - dragStart.y
      setPanOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }))
      setDragStart({ x: e.clientX, y: e.clientY })
    }

    if (draggedNode) {
      handleNodeDrag(e)
    }
  }

  // Handle mouse up to stop panning
  const handleMouseUp = () => {
    setIsDragging(false)
    handleNodeDragEnd()
  }

  // Reset zoom and pan
  const resetView = () => {
    setZoomLevel(1)
    setPanOffset({ x: 0, y: 0 })
    playSound("/sounds/button-click.mp3")
  }

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    playSound("/sounds/maximize.mp3")
  }

  // Get comments for a thought
  const getCommentNodesForThought = (thoughtId: string) => {
    return thoughts.filter((t) => t.isComment && t.parentId === thoughtId)
  }

  // Get cluster for a thought
  const getClusterForThought = (thoughtId: string) => {
    const thought = thoughts.find((t) => t.id === thoughtId)
    if (!thought?.clusterId) return null
    return clusters.find((c) => c.id === thought.clusterId) || null
  }

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
      playSound("/sounds/boot.mp3")
    }, 1500)

    return () => clearTimeout(timer)
  }, [playSound])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 relative">
            <Network className="w-24 h-24 text-cyan-400 glow-cyan pulse" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-cyan-400">Loading Neural Feed</h2>
          <div className="loading-bar">
            <div className="loading-progress"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`neural-sphere-container ${isFullscreen ? "fullscreen" : ""}`}>
      {/* Header */}
      <header className="neural-header">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/collabsphere">
              <Button
                variant="outline"
                className="mr-4 border-cyan-500/50 text-cyan-400 hover:bg-cyan-900/20 flex items-center gap-2"
                onClick={() => playSound("/sounds/button-click.mp3")}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to CollabSphere
              </Button>
            </Link>
            <div className="neural-logo flex items-center">
              <div className="mr-3 relative w-10 h-10">
                <Image
                  src="/images/mindmash-logo.png"
                  alt="MindMash Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
                <div className="absolute inset-0 bg-cyan-500 rounded-full filter blur-md opacity-30 animate-pulse"></div>
              </div>
              <div className="flex items-center">
                <h1 className="text-3xl font-black tracking-wider neural-text-glow cyberpunk-title mr-3">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                    NEURAL_FEED
                  </span>
                </h1>
                <div className="hidden sm:flex items-center">
                  <span className="text-lg font-bold text-pink-500 mr-2 glitch-text">
                    [MIND<span className="text-cyan-400">MAP</span>]
                  </span>
                  <span className="text-sm text-gray-400 border-l border-gray-700 pl-2 cyberpunk-subtitle">
                    SOCIAL FEED OF THE FUTURE
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              className={`neural-tab-button ${viewMode === "network" ? "active" : ""}`}
              onClick={() => setViewMode("network")}
            >
              <Network className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline">Neural Network</span>
            </button>
            <button
              className={`neural-tab-button ${viewMode === "feed" ? "active" : ""}`}
              onClick={() => setViewMode("feed")}
            >
              <Layers className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline">Thought Feed</span>
            </button>
            <Link href="/soulsig">
              <Button
                variant="outline"
                className="border-purple-500/50 text-purple-400 hover:bg-purple-900/20 flex items-center gap-2"
                onClick={() => playSound("/sounds/feature-select.mp3")}
              >
                <Cpu className="h-4 w-4" />
                <span className="hidden sm:inline">SoulSig</span>
              </Button>
            </Link>
            <button className="neural-button-circle" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="neural-content">
        {/* Neural Network View */}
        {viewMode === "network" && (
          <div
            className="neural-network-container"
            ref={networkRef}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div
              className="neural-network"
              style={{
                transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
                cursor: isDragging ? "grabbing" : draggedNode ? "grabbing" : "grab",
              }}
            >
              {/* Connection lines */}
              {thoughts.map((thought) =>
                thought.connections.map((connectionId) => {
                  const connectedThought = thoughts.find((t) => t.id === connectionId)
                  if (!connectedThought) return null

                  // Skip if in focus mode and not connected to focused thought
                  if (
                    focusMode &&
                    focusedThought &&
                    thought.id !== focusedThought &&
                    connectedThought.id !== focusedThought
                  ) {
                    return null
                  }

                  // Calculate line coordinates
                  const x1 = thought.position.x
                  const y1 = thought.position.y
                  const x2 = connectedThought.position.x
                  const y2 = connectedThought.position.y

                  // Determine color based on thought authors
                  let strokeColor = "#4ade80" // Default green

                  // If this is a comment connection, use a different style
                  if (thought.isComment || connectedThought.isComment) {
                    // Get the comment node
                    const commentNode = thought.isComment ? thought : connectedThought

                    // Get neon color based on comment ID
                    strokeColor = getNeonColor(commentNode.id)

                    return (
                      <svg
                        key={`${thought.id}-${connectionId}`}
                        className="neural-connection"
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          width: "100%",
                          height: "100%",
                          pointerEvents: "none",
                          zIndex: 1,
                        }}
                      >
                        <line
                          x1={`${x1}%`}
                          y1={`${y1}%`}
                          x2={`${x2}%`}
                          y2={`${y2}%`}
                          stroke={strokeColor}
                          strokeWidth="2"
                          strokeOpacity="0.8"
                          strokeDasharray="4"
                        />
                      </svg>
                    )
                  }

                  // For regular connections, use colors based on the nodes
                  const sourceColor = getNeonColor(thought.id)
                  const targetColor = getNeonColor(connectedThought.id)

                  return (
                    <svg
                      key={`${thought.id}-${connectionId}`}
                      className="neural-connection"
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: "100%",
                        height: "100%",
                        pointerEvents: "none",
                        zIndex: 1,
                      }}
                    >
                      <defs>
                        <linearGradient id={`gradient-${thought.id}-${connectionId}`} x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor={sourceColor} />
                          <stop offset="100%" stopColor={targetColor} />
                        </linearGradient>
                      </defs>
                      <line
                        x1={`${x1}%`}
                        y1={`${y1}%`}
                        x2={`${x2}%`}
                        y2={`${y2}%`}
                        stroke={`url(#gradient-${thought.id}-${connectionId})`}
                        strokeWidth="2"
                        strokeOpacity="0.6"
                      />
                    </svg>
                  )
                }),
              )}

              {/* Thought nodes */}
              {thoughts.map((thought) => {
                // Skip if in focus mode and not the focused thought or connected to it
                if (focusMode && focusedThought) {
                  const isFocused = thought.id === focusedThought
                  const isConnected =
                    thought.connections.includes(focusedThought) ||
                    thoughts.find((t) => t.id === focusedThought)?.connections.includes(thought.id)

                  if (!isFocused && !isConnected) {
                    return null
                  }
                }

                // Get neon color based on thought ID
                const neonColor = getNeonColor(thought.id)

                return (
                  <div
                    key={thought.id}
                    className={`neural-node ${thought.isExpanded ? "expanded" : ""}`}
                    style={{
                      left: `${thought.position.x}%`,
                      top: `${thought.position.y}%`,
                      opacity:
                        hoveredNode && hoveredNode !== thought.id && !thought.connections.includes(hoveredNode)
                          ? 0.5
                          : 1,
                    }}
                    onClick={() => toggleThoughtExpansion(thought.id)}
                    onMouseDown={(e) => handleNodeDragStart(e, thought.id)}
                    onMouseEnter={() => setHoveredNode(thought.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    {!thought.isExpanded ? (
                      // When collapsed, just show the profile picture with pulsing effect
                      <div
                        className="neural-node-avatar"
                        style={{
                          borderColor: thought.visualStyle?.color || neonColor,
                          boxShadow: thought.visualStyle?.glow
                            ? `0 0 8px ${thought.visualStyle?.color || neonColor}`
                            : `0 0 8px ${neonColor}`,
                          width: thought.isComment ? "32px" : `${40 * (thought.visualStyle?.size || 1)}px`,
                          height: thought.isComment ? "32px" : `${40 * (thought.visualStyle?.size || 1)}px`,
                          animation: thought.visualStyle?.pulseEffect ? "pulse 2s infinite" : "none",
                          borderRadius:
                            thought.visualStyle?.shape === "circle"
                              ? "50%"
                              : thought.visualStyle?.shape === "square"
                                ? "4px"
                                : "50%",
                          clipPath:
                            thought.visualStyle?.shape === "hexagon"
                              ? "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
                              : "none",
                        }}
                      >
                        {thought.author.type === "ai" ? (
                          <Cpu className="neural-avatar-icon" style={{ color: neonColor }} />
                        ) : (
                          <img
                            src={
                              thought.author.avatar ||
                              `/placeholder.svg?height=40&width=40&query=cyberpunk profile picture with neon ${neonColor || "/placeholder.svg"} glow`
                            }
                            alt={thought.author.name}
                            className="neural-avatar-img"
                          />
                        )}
                      </div>
                    ) : (
                      // When expanded, show the full thought content
                      <div className="neural-node-expanded" style={{ borderColor: neonColor }}>
                        <div className="neural-thought-header">
                          <div className="neural-avatar">
                            {thought.author.type === "ai" ? (
                              <Cpu className="neural-avatar-icon" style={{ color: neonColor }} />
                            ) : (
                              <img
                                src={
                                  thought.author.avatar ||
                                  `/placeholder.svg?height=40&width=40&query=cyberpunk profile picture with neon ${neonColor || "/placeholder.svg"} glow`
                                }
                                alt={thought.author.name}
                                className="neural-avatar-img"
                              />
                            )}
                          </div>
                          <div>
                            <span className="neural-thought-author">{thought.author.name}</span>
                            <span className="neural-timestamp">{thought.timestamp}</span>
                          </div>
                        </div>
                        <p className="neural-thought-text">{thought.content}</p>

                        {/* Cluster tag if part of a cluster */}
                        {thought.clusterId && (
                          <div className="neural-cluster-tag">
                            <Hash className="h-3 w-3 mr-1" />
                            <span>{getClusterForThought(thought.id)?.name || "Cluster"}</span>
                          </div>
                        )}

                        <div className="neural-thought-footer">
                          <div className="neural-actions">
                            <button
                              className="neural-action-button"
                              onClick={(e) => {
                                e.stopPropagation()
                                likeThought(thought.id)
                              }}
                            >
                              <Zap className="h-3 w-3 mr-1" />
                              <span>{thought.likes}</span>
                            </button>

                            {!thought.isComment && (
                              <>
                                <button
                                  className="neural-action-button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleThoughtExpansion(thought.id)
                                  }}
                                >
                                  <MessageSquare className="h-3 w-3 mr-1" />
                                  <span>{thought.expansions.length}</span>
                                </button>
                                <button
                                  className="neural-action-button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setCommentingOnThought(thought.id)
                                  }}
                                >
                                  <Reply className="h-3 w-3 mr-1" />
                                  <span>{getCommentNodesForThought(thought.id).length}</span>
                                </button>
                                <button
                                  className="neural-action-button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleFocusMode(thought.id)
                                  }}
                                >
                                  <Focus className="h-3 w-3 mr-1" />
                                  <span>Focus</span>
                                </button>
                                <button
                                  className="neural-action-button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    openNodeCustomizer(thought.id)
                                  }}
                                >
                                  <Settings className="h-3 w-3 mr-1" />
                                  <span>Style</span>
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Comments */}
                        {thought.isExpanded && getCommentNodesForThought(thought.id).length > 0 && (
                          <div className="neural-comments">
                            <div className="neural-comments-header">
                              <Reply className="h-4 w-4 mr-1" />
                              <span>Comments ({getCommentNodesForThought(thought.id).length})</span>
                            </div>
                            {getCommentNodesForThought(thought.id).map((comment) => (
                              <div key={comment.id} className="neural-comment">
                                <div className="neural-comment-header">
                                  <div className="neural-avatar small">
                                    {comment.author.type === "ai" ? (
                                      <Cpu className="neural-avatar-icon" />
                                    ) : (
                                      <img
                                        src={
                                          comment.author.avatar ||
                                          `/placeholder.svg?height=40&width=40&query=cyberpunk profile picture with neon ${getNeonColor(comment.id) || "/placeholder.svg"} glow`
                                        }
                                        alt={comment.author.name}
                                        className="neural-avatar-img"
                                      />
                                    )}
                                  </div>
                                  <span>{comment.author.name}</span>
                                </div>
                                <p className="neural-comment-content">{comment.content}</p>
                                <div className="neural-comment-footer">
                                  <span className="neural-timestamp">{comment.timestamp}</span>
                                  <button
                                    className="neural-action-button small"
                                    onClick={() => likeThought(comment.id)}
                                  >
                                    <Zap className="h-2 w-2 mr-1" />
                                    <span>{comment.likes}</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Create new thought button (floating) */}
              {!isCreatingThought && (
                <button className="neural-create-button" onClick={() => setIsCreatingThought(true)}>
                  <Plus className="h-6 w-6" />
                </button>
              )}
            </div>

            {/* Horizontal Zoom controls */}
            <div className="neural-zoom-controls">
              <button className="neural-zoom-button" onClick={handleZoomOut} aria-label="Zoom Out">
                -
              </button>
              <span className="neural-zoom-level">{Math.round(zoomLevel * 100)}%</span>
              <button className="neural-zoom-button" onClick={handleZoomIn} aria-label="Zoom In">
                +
              </button>
              <button
                className="neural-zoom-button reset"
                onClick={resetView}
                title="Reset View"
                aria-label="Reset View"
              >
                <span>↻</span>
              </button>
            </div>

            {/* Toolbar */}
            <div className="neural-toolbar">
              <button
                className={`neural-tool-button ${focusMode ? "active" : ""}`}
                onClick={() => toggleFocusMode()}
                title="Focus Mode"
              >
                <Focus className="h-5 w-5" />
              </button>
              <button className="neural-tool-button" onClick={resetView} title="Reset View">
                <Home className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Feed View */}
        {viewMode === "feed" && (
          <div className="neural-feed-container">
            {thoughts
              .filter((t) => !t.isComment)
              .map((thought) => (
                <div
                  key={thought.id}
                  className="neural-feed-item"
                  style={{
                    borderColor: getNeonColor(thought.id),
                  }}
                >
                  <div className="neural-thought-author">
                    <div className="neural-avatar">
                      {thought.author.type === "ai" ? (
                        <Cpu className="neural-avatar-icon" />
                      ) : (
                        <img
                          src={
                            thought.author.avatar ||
                            `/placeholder.svg?height=40&width=40&query=cyberpunk profile picture with neon ${getNeonColor(thought.id) || "/placeholder.svg"} glow`
                          }
                          alt={thought.author.name}
                          className="neural-avatar-img"
                        />
                      )}
                    </div>
                    <div>
                      <span className="font-bold">{thought.author.name}</span>
                      <span className="neural-timestamp block text-xs">{thought.timestamp}</span>
                    </div>
                  </div>
                  <p className="neural-thought-content">{thought.content}</p>

                  {/* Cluster tag if part of a cluster */}
                  {thought.clusterId && (
                    <div className="neural-cluster-tag feed">
                      <Hash className="h-4 w-4 mr-1" />
                      <span>{getClusterForThought(thought.id)?.name || "Cluster"}</span>
                    </div>
                  )}

                  <div className="neural-thought-footer">
                    <div className="neural-category">
                      <span className="neural-category-tag">{thought.category}</span>
                    </div>
                    <div className="neural-actions">
                      <button className="neural-action-button" onClick={() => likeThought(thought.id)}>
                        <Zap className="h-4 w-4 mr-1" />
                        <span>{thought.likes}</span>
                      </button>
                      <button className="neural-action-button" onClick={() => toggleThoughtExpansion(thought.id)}>
                        <MessageSquare className="h-4 w-4 mr-1" />
                        <span>{thought.expansions.length}</span>
                      </button>
                      <button className="neural-action-button" onClick={() => setCommentingOnThought(thought.id)}>
                        <Reply className="h-4 w-4 mr-1" />
                        <span>{getCommentNodesForThought(thought.id).length}</span>
                      </button>
                    </div>
                  </div>

                  {/* Comments */}
                  {thought.isExpanded && getCommentNodesForThought(thought.id).length > 0 && (
                    <div className="neural-comments">
                      <div className="neural-comments-header">
                        <Reply className="h-4 w-4 mr-1" />
                        <span>Comments ({getCommentNodesForThought(thought.id).length})</span>
                      </div>
                      {getCommentNodesForThought(thought.id).map((comment) => (
                        <div key={comment.id} className="neural-comment">
                          <div className="neural-comment-header">
                            <div className="neural-avatar small">
                              {comment.author.type === "ai" ? (
                                <Cpu className="neural-avatar-icon" />
                              ) : (
                                <img
                                  src={
                                    comment.author.avatar ||
                                    `/placeholder.svg?height=40&width=40&query=cyberpunk profile picture with neon ${getNeonColor(comment.id) || "/placeholder.svg"} glow`
                                  }
                                  alt={comment.author.name}
                                  className="neural-avatar-img"
                                />
                              )}
                            </div>
                            <span>{comment.author.name}</span>
                          </div>
                          <p className="neural-comment-content">{comment.content}</p>
                          <div className="neural-comment-footer">
                            <span className="neural-timestamp">{comment.timestamp}</span>
                            <button className="neural-action-button small" onClick={() => likeThought(comment.id)}>
                              <Zap className="h-2 w-2 mr-1" />
                              <span>{comment.likes}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

            {/* Create new thought button (fixed at bottom for feed view) */}
            {!isCreatingThought && (
              <button className="neural-create-button-fixed" onClick={() => setIsCreatingThought(true)}>
                <Lightbulb className="h-6 w-6 mr-2" />
                <span>New Thought</span>
              </button>
            )}
          </div>
        )}

        {/* New thought creation panel */}
        {isCreatingThought && (
          <div className="neural-thought-creator">
            <div className="neural-thought-creator-header">
              <h3 className="text-lg font-bold flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 neural-icon-pulse" />
                Share Your Thought
              </h3>
              <button className="neural-button-circle small" onClick={() => setIsCreatingThought(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="neural-thought-input-container">
              <textarea
                ref={thoughtInputRef}
                value={newThought}
                onChange={(e) => setNewThought(e.target.value)}
                className="neural-thought-input"
                placeholder="What's on your mind? Share a thought, idea, or question... Use @username to mention users and #topic to tag topics"
                rows={4}
              />
            </div>

            <div className="neural-ai-assistance">
              <AIAssistedThought
                onSelect={handleAIThoughtSuggestion}
                currentInput={newThought}
                preferredAIModels={["system"]}
              />
            </div>

            <div className="neural-ai-collaboration">
              <h4 className="text-sm font-bold mb-2 flex items-center">
                <Sparkles className="h-4 w-4 mr-1" />
                AI Collaboration
              </h4>
              <div className="neural-ai-models">
                {AI_MODELS.map((model) => (
                  <button
                    key={model.id}
                    className={`neural-ai-model-button ${selectedAIModels.includes(model.id) ? "selected" : ""}`}
                    style={
                      {
                        "--model-color": model.color,
                        borderColor: selectedAIModels.includes(model.id) ? model.color : "transparent",
                      } as React.CSSProperties
                    }
                    onClick={() => {
                      playSound("/sounds/button-click.mp3")
                      setSelectedAIModels((prev) =>
                        prev.includes(model.id) ? prev.filter((id) => id !== model.id) : [...prev, model.id],
                      )
                    }}
                  >
                    <Cpu className="h-4 w-4 mr-1" style={{ color: model.color }} />
                    <span>{model.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="neural-thought-actions">
              <button className="neural-button secondary" onClick={() => setIsCreatingThought(false)}>
                Cancel
              </button>
              <button
                className="neural-button primary"
                onClick={() => {
                  // Create a new thought node
                  const newThoughtId = `thought-${Date.now()}`
                  const newThoughtNode: ThoughtNode = {
                    id: newThoughtId,
                    content: newThought,
                    author: {
                      id: "user-current",
                      name: "MindMash User",
                      avatar: "/images/cyberpunk-avatars/mindmash-user.png",
                      type: "human",
                    },
                    timestamp: "Just now",
                    connections: [],
                    position: { x: Math.random() * 70 + 15, y: Math.random() * 70 + 15 },
                    sentiment: "neutral",
                    category: "general",
                    likes: 0,
                    expansions: [],
                    isExpanded: false,
                    commentIds: [],
                    clusterId: null,
                    isComment: false,
                    parentId: null,
                    visualStyle: {
                      color: NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)],
                      glow: true,
                      pulseEffect: true,
                    },
                  }

                  setThoughts((prevThoughts) => [newThoughtNode, ...prevThoughts])
                  setNewThought("")
                  setIsCreatingThought(false)
                  playSound("/sounds/feature-select.mp3")

                  toast({
                    title: "Thought Created",
                    description: "Your thought has been added to the neural network",
                  })
                }}
                disabled={!newThought.trim()}
              >
                <Send className="h-4 w-4 mr-2" />
                Share Thought
              </button>
            </div>
          </div>
        )}

        {/* Comment creation panel */}
        {commentingOnThought && (
          <div className="neural-comment-creator">
            <div className="neural-comment-creator-header">
              <h3 className="text-lg font-bold flex items-center">
                <Reply className="h-5 w-5 mr-2" />
                Add Comment
              </h3>
              <button className="neural-button-circle small" onClick={() => setCommentingOnThought(null)}>
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="neural-comment-input-container">
              <textarea
                ref={commentInputRef}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="neural-comment-input"
                placeholder="Add your comment... Use @username to mention users and #topic to tag topics"
                rows={3}
              />
            </div>

            <div className="neural-comment-actions">
              <button className="neural-button secondary" onClick={() => setCommentingOnThought(null)}>
                Cancel
              </button>
              <button
                className="neural-button primary"
                onClick={() => {
                  // Create a new comment node
                  const newCommentId = `comment-${Date.now()}`
                  const parentThought = thoughts.find((t) => t.id === commentingOnThought)

                  if (parentThought) {
                    const newCommentNode: ThoughtNode = {
                      id: newCommentId,
                      content: newComment,
                      author: {
                        id: "user-current",
                        name: "MindMash User",
                        avatar: "/images/cyberpunk-avatars/mindmash-user.png",
                        type: "human",
                      },
                      timestamp: "Just now",
                      connections: [parentThought.id],
                      position: {
                        x: parentThought.position.x + (Math.random() * 10 - 5),
                        y: parentThought.position.y + (Math.random() * 10 + 5),
                      },
                      sentiment: "neutral",
                      category: parentThought.category,
                      likes: 0,
                      expansions: [],
                      isExpanded: false,
                      commentIds: [],
                      clusterId: parentThought.clusterId,
                      isComment: true,
                      parentId: parentThought.id,
                    }

                    // Add the comment to thoughts array
                    setThoughts((prevThoughts) => [...prevThoughts, newCommentNode])

                    // Update the parent thought's commentIds
                    setThoughts((prevThoughts) =>
                      prevThoughts.map((t) =>
                        t.id === parentThought.id ? { ...t, commentIds: [...(t.commentIds || []), newCommentId] } : t,
                      ),
                    )

                    setNewComment("")
                    setCommentingOnThought(null)
                    playSound("/sounds/button-click.mp3")

                    toast({
                      title: "Comment Added",
                      description: "Your comment has been added to the thought",
                    })
                  }
                }}
                disabled={!newComment.trim()}
              >
                <Send className="h-4 w-4 mr-2" />
                Post Comment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
