"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAudio } from "@/components/audio-manager"
import { useToast } from "@/hooks/use-toast"
import {
  Plus,
  Search,
  Users,
  Lock,
  Globe,
  Star,
  Clock,
  MessageSquare,
  ChevronRight,
  Sparkles,
  Cpu,
  X,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"


interface CollabSpace {
  id: string
  name: string
  description: string
  creator: {
    id: string
    name: string
    avatar: string
  }
  members: {
    humans: number
    ais: number
  }
  isPrivate: boolean
  isFavorite: boolean
  lastActive: string
  tags: string[]
  thumbnail?: string
}

export default function CollabSpacesPage() {
  const [spaces, setSpaces] = useState<CollabSpace[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const router = useRouter()
  const { playSound } = useAudio()
  const { toast } = useToast()

  // Mock data for collaboration spaces
  const mockSpaces: CollabSpace[] = [
    {
      id: "space-1",
      name: "Neural Interface Research",
      description: "Collaborative space for discussing neural interface technologies and applications",
      creator: {
        id: "user-1",
        name: "Neural Explorer",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      members: {
        humans: 12,
        ais: 3,
      },
      isPrivate: false,
      isFavorite: true,
      lastActive: "2 hours ago",
      tags: ["#NeuralInterface", "#BrainComputing", "#Research"],
    },
    {
      id: "space-2",
      name: "Quantum Computing Innovations",
      description: "Exploring quantum computing applications in AI and machine learning",
      creator: {
        id: "user-2",
        name: "Quantum Thinker",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      members: {
        humans: 8,
        ais: 2,
      },
      isPrivate: true,
      isFavorite: false,
      lastActive: "1 day ago",
      tags: ["#QuantumComputing", "#AI", "#Innovation"],
    },
    {
      id: "space-3",
      name: "Consciousness Models",
      description: "Theoretical discussions on machine consciousness and emergent intelligence",
      creator: {
        id: "user-3",
        name: "Synapse Connect",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      members: {
        humans: 15,
        ais: 5,
      },
      isPrivate: false,
      isFavorite: true,
      lastActive: "Just now",
      tags: ["#Consciousness", "#EmergentIntelligence", "#Philosophy"],
    },
    {
      id: "space-4",
      name: "MindMash Dev Team",
      description: "Private collaboration space for the MindMash development team",
      creator: {
        id: "user-4",
        name: "Neural Nexus",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      members: {
        humans: 6,
        ais: 2,
      },
      isPrivate: true,
      isFavorite: true,
      lastActive: "5 hours ago",
      tags: ["#Development", "#MindMash", "#Team"],
    },
    {
      id: "space-5",
      name: "Data Visualization Techniques",
      description: "Sharing and discussing innovative data visualization approaches",
      creator: {
        id: "user-5",
        name: "Cortex Weaver",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      members: {
        humans: 10,
        ais: 1,
      },
      isPrivate: false,
      isFavorite: false,
      lastActive: "3 days ago",
      tags: ["#DataViz", "#Visualization", "#Analytics"],
    },
  ]

  // Load spaces data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setSpaces(mockSpaces)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Handle creating a new space
  const handleCreateSpace = (spaceData: any) => {
    // Simulate API Call
    const newSpace: CollabSpace = {
      id: `space-${Date.now()}`,
      name: spaceData.name,
      description: spaceData.description,
      creator: {
        id: "current-user",
        name: "You",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      members: {
        humans: 1,
        ais: spaceData.aiMembers.length,
      },
      isPrivate: spaceData.isPrivate,
      isFavorite: false,
      lastActive: "Just now",
      tags: spaceData.tags,
    }

    setSpaces([newSpace, ...spaces])
    setShowCreateModal(false)

    toast({
      title: "Space Created",
      description: `Your collaboration space "${spaceData.name}" has been created.`,
    })

    playSound("/sounds/feature-select.mp3")

    // Navigate to the new space
    setTimeout(() => {
      router.push(`/spaces/${newSpace.id}`)
    }, 1000)
  }

  // Filter spaces based on search query and active filter
  const filteredSpaces = spaces.filter((space) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      space.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      space.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    // Category filter
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "favorites" && space.isFavorite) ||
      (activeFilter === "private" && space.isPrivate) ||
      (activeFilter === "public" && !space.isPrivate)

    return matchesSearch && matchesFilter
  })

  // Sort spaces
  const sortedSpaces = [...filteredSpaces].sort((a, b) => {
    if (sortBy === "recent") {
      // Sort by activity (just for demo - in real app would use timestamps)
      if (a.lastActive === "Just now") return -1
      if (b.lastActive === "Just now") return 1
      if (a.lastActive.includes("hour") && b.lastActive.includes("day")) return -1
      if (a.lastActive.includes("day") && b.lastActive.includes("hour")) return 1
      return 0
    } else if (sortBy === "popular") {
      // Sort by member count
      return b.members.humans + b.members.ais - (a.members.humans + a.members.ais)
    } else if (sortBy === "alphabetical") {
      return a.name.localeCompare(b.name)
    }
    return 0
  })

  // Toggle favorite status
  const toggleFavorite = (spaceId: string) => {
    setSpaces(spaces.map((space) => (space.id === spaceId ? { ...space, isFavorite: !space.isFavorite } : space)))
    playSound("/sounds/button-click.mp3")
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background effects */}
      <div className="fixed inset-0 z-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-black"></div>
        <div className="absolute inset-0 bg-grid-pattern"></div>
      </div>

      {/* Glowing lines */}
      <div className="fixed left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent top-20 z-0 glow-cyan"></div>
      <div className="fixed left-0 right-0 h-px bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent bottom-20 z-0 glow-fuchsia"></div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            {/* MindMash.AI Logo */}
            <div className="relative h-12 w-12 flex-shrink-0">
              <Image
                src="https://jade-late-crow-559.mypinata.cloud/ipfs/bafybeia5skhvck24266qahayvxuhc5k3ez27xnmscrlwfjnwloeal5rdam"
                alt="MindMash.AI Logo"
                width={48}
                height={48}
                className="rounded-md border border-cyan-500 glow-cyan"
              />
            </div>

            {/* MindMash.AI Text */}
            <div className="text-xl font-bold text-cyan-400">MindMash.AI</div>
          </div>

          <h1 className="text-3xl font-bold mb-2 text-fuchsia-400 neon-text">
            Collaboration Spaces <span className="text-white">Connect, Create, Collaborate</span>
          </h1>

          <p className="text-gray-400 max-w-2xl cyberpunk-text">
            Create or join collaboration spaces to connect with humans and AI models. Share thoughts, build projects,
            and expand collective intelligence.
          </p>
        </header>

        {/* Search and filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="search-container relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search spaces..."
              className="w-full bg-black/60 border border-gray-800 rounded-md py-2 pl-10 pr-4 text-white focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="filter-buttons flex border border-gray-800 rounded-md overflow-hidden">
              <button
                className={`px-3 py-1.5 text-sm ${activeFilter === "all" ? "bg-fuchsia-900/50 text-fuchsia-300" : "bg-black/60 text-gray-400"}`}
                onClick={() => setActiveFilter("all")}
              >
                All
              </button>
              <button
                className={`px-3 py-1.5 text-sm ${activeFilter === "favorites" ? "bg-fuchsia-900/50 text-fuchsia-300" : "bg-black/60 text-gray-400"}`}
                onClick={() => setActiveFilter("favorites")}
              >
                Favorites
              </button>
              <button
                className={`px-3 py-1.5 text-sm ${activeFilter === "public" ? "bg-fuchsia-900/50 text-fuchsia-300" : "bg-black/60 text-gray-400"}`}
                onClick={() => setActiveFilter("public")}
              >
                Public
              </button>
              <button
                className={`px-3 py-1.5 text-sm ${activeFilter === "private" ? "bg-fuchsia-900/50 text-fuchsia-300" : "bg-black/60 text-gray-400"}`}
                onClick={() => setActiveFilter("private")}
              >
                Private
              </button>
            </div>

            <div className="sort-dropdown relative">
              <select
                className="appearance-none bg-black/60 border border-gray-800 rounded-md py-2 pl-4 pr-10 text-white focus:outline-none focus:border-fuchsia-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recent">Recent Activity</option>
                <option value="popular">Most Popular</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
              <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400 h-4 w-4 pointer-events-none" />
            </div>

            <button
              className="create-space-btn flex items-center gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white px-4 py-2 rounded-md shadow-md shadow-purple-500/20 hover:shadow-purple-500/40 transition-all"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="h-4 w-4" />
              <span>New Space</span>
            </button>
          </div>
        </div>

        {/* Spaces grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <div className="cyberpunk-loader mx-auto mb-4"></div>
              <p className="text-cyan-400 cyberpunk-text">Loading Collaboration Spaces...</p>
            </div>
          </div>
        ) : sortedSpaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedSpaces.map((space) => (
              <div
                key={space.id}
                className="space-card bg-black/80 border border-gray-800 rounded-lg overflow-hidden hover:border-fuchsia-500/50 transition-all hover:shadow-lg hover:shadow-fuchsia-500/10"
              >
                <div className="space-header relative h-32 bg-gradient-to-r from-purple-900/50 to-fuchsia-900/50">
                  {space.thumbnail ? (
                    <Image
                      src={space.thumbnail || "/placeholder.svg"}
                      alt={space.name}
                      fill
                      className="object-cover opacity-50"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-30">
                      <MessageSquare className="h-16 w-16" />
                    </div>
                  )}

                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      className="h-8 w-8 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-all"
                      onClick={() => toggleFavorite(space.id)}
                    >
                      <Star
                        className={`h-4 w-4 ${space.isFavorite ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}`}
                      />
                    </button>

                    {space.isPrivate ? (
                      <div className="h-8 px-3 rounded-full bg-black/60 flex items-center gap-1">
                        <Lock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs">Private</span>
                      </div>
                    ) : (
                      <div className="h-8 px-3 rounded-full bg-black/60 flex items-center gap-1">
                        <Globe className="h-3 w-3 text-gray-400" />
                        <span className="text-xs">Public</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <Link href={`/spaces/${space.id}`} className="block">
                    <h3 className="text-xl font-bold mb-2 text-white hover:text-fuchsia-400 transition-colors">
                      {space.name}
                    </h3>
                  </Link>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{space.description}</p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                        <Image
                          src={space.creator.avatar || "/placeholder.svg"}
                          alt={space.creator.name}
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </div>
                      <span className="text-sm text-gray-300">{space.creator.name}</span>
                    </div>

                    <div className="flex items-center gap-1 text-gray-400">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs">{space.lastActive}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-cyan-400" />
                        <span className="text-sm">{space.members.humans}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Cpu className="h-4 w-4 text-fuchsia-400" />
                        <span className="text-sm">{space.members.ais}</span>
                      </div>
                    </div>

                    <Link
                      href={`/spaces/${space.id}`}
                      className="text-sm text-fuchsia-400 hover:text-fuchsia-300 flex items-center gap-1"
                    >
                      <span>Join</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {space.tags.map((tag, index) => (
                      <span key={index} className="text-xs px-2 py-1 bg-fuchsia-900/20 text-fuchsia-300 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[40vh] border border-gray-800 rounded-lg bg-black/40 p-8">
            <Search className="h-12 w-12 text-gray-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">No spaces found</h3>
            <p className="text-gray-400 text-center mb-6">
              {searchQuery
                ? `No spaces match your search for "${searchQuery}"`
                : "No spaces match the selected filters"}
            </p>
            <button
              className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-4 py-2 rounded-md transition-colors"
              onClick={() => {
                setSearchQuery("")
                setActiveFilter("all")
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Create Space Modal */}
      {showCreateModal && <CreateSpaceModal onClose={() => setShowCreateModal(false)} onCreate={handleCreateSpace} />}
    </div>
  )
}

// Create Space Modal Component
interface CreateSpaceModalProps {
  onClose: () => void
  onCreate: (spaceData: any) => void
}

function CreateSpaceModal({ onClose, onCreate }: CreateSpaceModalProps) {
  const [spaceName, setSpaceName] = useState("")
  const [description, setDescription] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [aiMembers, setAiMembers] = useState<string[]>([])
  const { playSound } = useAudio()

  // Available AI models
  const availableAIs = [
    { id: "grok", name: "Grok", specialties: ["Technical", "Creative"] },
    { id: "chatgpt", name: "ChatGPT", specialties: ["Educational", "Analytical"] },
    { id: "gemini", name: "Gemini", specialties: ["Analytical", "Philosophical"] },
    { id: "mindmash", name: "MindMash System", specialties: ["All"] },
  ]

  // Handle tag input
  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      const formattedTag = tagInput.startsWith("#") ? tagInput : `#${tagInput}`
      setTags([...tags, formattedTag])
      setTagInput("")
      playSound("/sounds/button-click.mp3")
    }
  }

  // Handle tag removal
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
    playSound("/sounds/button-click.mp3")
  }

  // Toggle AI selection
  const toggleAI = (aiId: string) => {
    if (aiMembers.includes(aiId)) {
      setAiMembers(aiMembers.filter((id) => id !== aiId))
    } else {
      setAiMembers([...aiMembers, aiId])
    }
    playSound("/sounds/button-click.mp3")
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!spaceName.trim()) {
      return
    }

    onCreate({
      name: spaceName,
      description,
      isPrivate,
      tags,
      aiMembers,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black border border-gray-800 rounded-lg w-full max-w-lg overflow-hidden shadow-xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-fuchsia-400" />
              Create New Space
            </h2>
            <button
              className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">Space Name</label>
              <input
                type="text"
                className="w-full bg-black/60 border border-gray-800 rounded-md py-2 px-3 text-white focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500/50"
                placeholder="Enter space name"
                value={spaceName}
                onChange={(e) => setSpaceName(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
              <textarea
                className="w-full bg-black/60 border border-gray-800 rounded-md py-2 px-3 text-white focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500/50"
                placeholder="Describe what this space is about"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">Privacy</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    className="form-radio text-fuchsia-500 focus:ring-fuchsia-500"
                    checked={!isPrivate}
                    onChange={() => setIsPrivate(false)}
                  />
                  <span className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    Public
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    className="form-radio text-fuchsia-500 focus:ring-fuchsia-500"
                    checked={isPrivate}
                    onChange={() => setIsPrivate(true)}
                  />
                  <span className="flex items-center gap-1">
                    <Lock className="h-4 w-4" />
                    Private
                  </span>
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {isPrivate ? "Only invited members can access this space" : "Anyone can discover and join this space"}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">Tags</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 bg-black/60 border border-gray-800 rounded-md py-2 px-3 text-white focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500/50"
                  placeholder="Add tags (e.g. #AI, #Research)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                />
                <button
                  type="button"
                  className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
                  onClick={handleAddTag}
                >
                  Add
                </button>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-fuchsia-900/20 text-fuchsia-300 px-2 py-1 rounded-md text-sm"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        className="ml-1 text-fuchsia-300 hover:text-white"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-1">AI Collaborators</label>
              <p className="text-xs text-gray-500 mb-2">Select AI models to add to your space</p>

              <div className="grid grid-cols-2 gap-3">
                {availableAIs.map((ai) => (
                  <div
                    key={ai.id}
                    className={`border rounded-md p-3 cursor-pointer transition-all ${
                      aiMembers.includes(ai.id)
                        ? "border-fuchsia-500 bg-fuchsia-900/20"
                        : "border-gray-800 bg-black/60 hover:border-gray-700"
                    }`}
                    onClick={() => toggleAI(ai.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Cpu
                          className={`h-4 w-4 ${aiMembers.includes(ai.id) ? "text-fuchsia-400" : "text-gray-400"}`}
                        />
                        <span className="font-medium">{ai.name}</span>
                      </div>
                      <div
                        className={`h-4 w-4 rounded-full border ${
                          aiMembers.includes(ai.id) ? "bg-fuchsia-500 border-fuchsia-500" : "border-gray-600"
                        }`}
                      >
                        {aiMembers.includes(ai.id) && (
                          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-white">
                            <path
                              d="M5 13l4 4L19 7"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                    </div>

                    <div className="mt-1 flex flex-wrap gap-1">
                      {ai.specialties.map((specialty, i) => (
                        <span key={i} className="text-xs px-1.5 py-0.5 bg-gray-800 text-gray-300 rounded">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white rounded-md shadow-md shadow-purple-500/20 hover:shadow-purple-500/40 transition-all"
                disabled={!spaceName.trim()}
              >
                Create Space
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
