"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState, useRef, useEffect } from "react"
import { EnhancedNeuralNetwork } from "@/components/enhanced-neural-network"
import { EnhancedSemanticSearch } from "@/components/enhanced-semantic-search"
import { TrendingClusters } from "@/components/trending-clusters"
import { AIAssistedThought } from "@/components/ai-assisted-thought"
import { NodeCustomizer } from "@/components/node-customizer"
import { useAudio } from "@/components/audio-manager"
import { useToast } from "@/hooks/use-toast"
import { extractKeywords } from "@/lib/thought-cluster-utils"
import type { ThoughtNode, ThoughtCluster } from "@/types/types"
import { Maximize2, Minimize2 } from "lucide-react"

// Mock data for thoughts
const MOCK_THOUGHTS: ThoughtNode[] = [
  {
    id: "thought1",
    content: "Exploring the ethical implications of AI sentience. #AIEthics #Consciousness",
    author: { id: "user1", name: "Alice", avatar: "/placeholder.svg", type: "human" },
    timestamp: "Just now",
    connections: ["thought2", "thought3"],
    position: { x: 100, y: 100 },
    sentiment: "neutral",
    category: "philosophical",
    likes: 12,
    expansions: [],
    isExpanded: false,
    commentIds: ["comment1", "comment2"],
    clusterId: "cluster1",
  },
  {
    id: "thought2",
    content: "Quantum computing could revolutionize AI. #QuantumComputing #AI",
    author: { id: "user2", name: "Bob", avatar: "/placeholder.svg", type: "human" },
    timestamp: "1 hour ago",
    connections: ["thought1", "thought4"],
    position: { x: 200, y: 150 },
    sentiment: "positive",
    category: "technical",
    likes: 25,
    expansions: [],
    isExpanded: false,
    clusterId: "cluster1",
  },
  {
    id: "thought3",
    content: "Concerns about AI bias and fairness. #AIBias #Fairness",
    author: { id: "user3", name: "Charlie", avatar: "/placeholder.svg", type: "human" },
    timestamp: "2 hours ago",
    connections: ["thought1", "thought5"],
    position: { x: 150, y: 50 },
    sentiment: "negative",
    category: "philosophical",
    likes: 8,
    expansions: [],
    isExpanded: false,
    clusterId: "cluster2",
  },
  // Add more thoughts here...
]

interface CollabSphereInterfaceProps {
  user: {
    id: string
    name: string
    avatar: string
  }
}

export default function CollabSphereInterface({ user }: CollabSphereInterfaceProps) {
  const [thoughts, setThoughts] = useState<ThoughtNode[]>(MOCK_THOUGHTS)
  const [clusters, setClusters] = useState<ThoughtCluster[]>([])
  const [searchResults, setSearchResults] = useState<ThoughtNode[]>([])
  const [activeThought, setActiveThought] = useState<string | null>(null)
  const [showNodeCustomizer, setShowNodeCustomizer] = useState(false)
  const [selectedNode, setSelectedNode] = useState<ThoughtNode | null>(null)
  const { playSound } = useAudio()
  const { toast } = useToast()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [newPostContent, setNewPostContent] = useState("")

  useEffect(() => {
    // Generate clusters when thoughts change
    const newClusters = generateThoughtClusters(thoughts)
    setClusters(newClusters)
  }, [thoughts])

  const handleThoughtClick = (thoughtId: string) => {
    setActiveThought(thoughtId)
    playSound("/sounds/feature-select.mp3")
  }

  const handleNodeUpdate = (nodeId: string, visualStyle: ThoughtNode["visualStyle"]) => {
    setThoughts((prevThoughts) =>
      prevThoughts.map((thought) => (thought.id === nodeId ? { ...thought, visualStyle } : thought)),
    )
    setShowNodeCustomizer(false)
  }

  const handleSearch = (query: string) => {
    const results = semanticSearch(query, thoughts)
    setSearchResults(results)
    toast({
      title: `Found ${results.length} results`,
      description: results.length > 0 ? "Showing most relevant thoughts" : "Try a different search term",
    })
  }

  const handleClearSearch = () => {
    setSearchResults([])
  }

  const handleCreateThought = () => {
    // Add a new thought to the thoughts array
    const newThought: ThoughtNode = {
      id: `thought-${Date.now()}`,
      content: "",
      author: { id: user.id, name: user.name, avatar: user.avatar, type: "human" },
      timestamp: "Just now",
      connections: [],
      position: { x: 0, y: 0 },
      likes: 0,
      expansions: [],
      isExpanded: false,
      commentIds: [],
      clusterId: null,
      isComment: false,
      parentId: null,
    }
    setThoughts([newThought, ...thoughts])
    setActiveThought(newThought.id)
  }

  const handleZoom = (level: number) => {
    setZoomLevel(level)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`)
      })
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  return (
    <div className="neural-sphere-container">
      <header className="neural-header">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="neural-logo">
            <img src="/images/mindmash-logo.png" alt="MindMash.AI" className="h-8 w-8" />
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              MindMash.AI
            </h1>
          </div>
          <div className="flex items-center">
            <button className="neural-button-circle" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      <div className="neural-content">
        <EnhancedNeuralNetwork />
        <EnhancedSemanticSearch
          onSearch={handleSearch}
          onClearSearch={handleClearSearch}
          thoughts={thoughts}
          onSearchResults={setSearchResults}
        />
        <TrendingClusters clusters={clusters} thoughts={thoughts} onSelectCluster={handleThoughtClick} />
      </div>

      <div className="neural-thought-creator">
        <div className="neural-thought-creator-header">
          <h3 className="text-lg font-bold">Create New Thought</h3>
        </div>
        <div className="neural-thought-input-container">
          <Textarea
            placeholder="Share your thoughts..."
            className="neural-thought-input"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
          />
        </div>
        <div className="neural-ai-collaboration">
          <AIAssistedThought onSelect={setNewPostContent} currentInput={newPostContent} preferredAIModels={[]} />
        </div>
        <div className="neural-thought-actions">
          <Button className="neural-button secondary" onClick={() => setNewPostContent("")}>
            Clear
          </Button>
          <Button className="neural-button primary" onClick={handleCreateThought}>
            Create Thought
          </Button>
        </div>
      </div>

      {showNodeCustomizer && (
        <NodeCustomizer
          thoughtNode={selectedNode!}
          onUpdate={handleNodeUpdate}
          onClose={() => setShowNodeCustomizer(false)}
        />
      )}
    </div>
  )
}

function generateThoughtClusters(thoughts: ThoughtNode[]): ThoughtCluster[] {
  // Group thoughts by clusterId
  const clusterMap = new Map<string, ThoughtNode[]>()

  thoughts.forEach((thought) => {
    if (thought.clusterId) {
      if (!clusterMap.has(thought.clusterId)) {
        clusterMap.set(thought.clusterId, [])
      }
      clusterMap.get(thought.clusterId)?.push(thought)
    }
  })

  // Convert map to array of clusters
  const clusters: ThoughtCluster[] = []

  clusterMap.forEach((clusterThoughts, clusterId) => {
    // Extract common topics from thoughts
    const topics = new Set<string>()
    clusterThoughts.forEach((thought) => {
      const extractedTopics = extractKeywords(thought.content)
      extractedTopics.forEach((topic) => topics.add(topic))
    })

    // Create cluster
    clusters.push({
      id: clusterId,
      name: `Cluster ${clusterId.replace("cluster", "")}`,
      posts: clusterThoughts.map((t) => t.id),
      tags: Array.from(topics).map((t) => `#${t}`),
      trendingScore: calculateTrendingScore(clusterThoughts),
    })
  })

  return clusters
}

function calculateTrendingScore(thoughts: ThoughtNode[]): number {
  // Simple algorithm: sum of likes + number of comments + recency factor
  let score = 0

  thoughts.forEach((thought) => {
    // Add likes
    score += thought.likes || 0

    // Add comment count
    score += thought.commentIds?.length || 0

    // Add recency factor (more recent = higher score)
    const timeAgo = getMinutesAgo(thought.timestamp)
    if (timeAgo < 60) {
      // Less than an hour
      score += 10
    } else if (timeAgo < 1440) {
      // Less than a day
      score += 5
    } else {
      score += 1
    }
  })

  return score
}

function getMinutesAgo(timestamp: string): number {
  // Parse timestamps like "2 hours ago", "45 minutes ago", etc.
  const timeRegex = /(\d+)\s+(minute|hour|day|week|month|year)s?\s+ago/i
  const match = timestamp.match(timeRegex)

  if (!match) return 1000000 // Default to a large number if format doesn't match

  const value = Number.parseInt(match[1])
  const unit = match[2].toLowerCase()

  switch (unit) {
    case "minute":
      return value
    case "hour":
      return value * 60
    case "day":
      return value * 60 * 24
    case "week":
      return value * 60 * 24 * 7
    case "month":
      return value * 60 * 24 * 30
    case "year":
      return value * 60 * 24 * 365
    default:
      return value
  }
}

function semanticSearch(query: string, thoughts: ThoughtNode[]): ThoughtNode[] {
  const queryTokens = query.toLowerCase().split(/\s+/)

  const scoredThoughts = thoughts.map((thought) => {
    const contentTokens = thought.content.toLowerCase().split(/\s+/)
    const intersection = queryTokens.filter((token) => contentTokens.includes(token))
    const score = intersection.length / queryTokens.length
    return { thought, score }
  })

  return scoredThoughts.sort((a, b) => b.score - a.score).map((item) => item.thought)
}
