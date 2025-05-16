"use client"

import { useState, useEffect } from "react"
import { Users, MessageSquare, Sparkles, Zap, Search, Plus } from "lucide-react"
import { useAudio } from "@/components/audio-manager"

interface ChatRoom {
  id: string
  name: string
  description: string
  members: number
  messages: number
  lastActive: string
  isAIEnabled: boolean
  category: "general" | "technical" | "creative" | "research" | "social"
}

interface ChatroomsListProps {
  onSelectRoom: (roomId: string) => void
}

export default function ChatroomsList({ onSelectRoom }: ChatroomsListProps) {
  const [rooms, setRooms] = useState<ChatRoom[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const { playSound } = useAudio()

  useEffect(() => {
    // Simulate API call to fetch rooms
    const fetchRooms = async () => {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockRooms: ChatRoom[] = [
        {
          id: "room1",
          name: "Neural Interface Development",
          description: "Discuss the latest in neural interface technology and development approaches",
          members: 128,
          messages: 1024,
          lastActive: "2 minutes ago",
          isAIEnabled: true,
          category: "technical",
        },
        {
          id: "room2",
          name: "Quantum Computing Applications",
          description: "Exploring practical applications of quantum computing in AI and neural networks",
          members: 96,
          messages: 876,
          lastActive: "15 minutes ago",
          isAIEnabled: true,
          category: "research",
        },
        {
          id: "room3",
          name: "Creative AI Collaboration",
          description: "Share and collaborate on creative projects using AI assistance",
          members: 156,
          messages: 2048,
          lastActive: "Just now",
          isAIEnabled: true,
          category: "creative",
        },
        {
          id: "room4",
          name: "MindMash Community",
          description: "General discussion for the MindMash community",
          members: 312,
          messages: 5120,
          lastActive: "5 minutes ago",
          isAIEnabled: false,
          category: "general",
        },
        {
          id: "room5",
          name: "Consciousness Models",
          description: "Theoretical discussions on modeling consciousness in AI systems",
          members: 87,
          messages: 743,
          lastActive: "1 hour ago",
          isAIEnabled: true,
          category: "research",
        },
        {
          id: "room6",
          name: "Neural Network Optimization",
          description: "Techniques and approaches for optimizing neural networks",
          members: 104,
          messages: 912,
          lastActive: "30 minutes ago",
          isAIEnabled: true,
          category: "technical",
        },
        {
          id: "room7",
          name: "Syndicate Coordination",
          description: "Coordination space for syndicate leaders and members",
          members: 76,
          messages: 512,
          lastActive: "3 hours ago",
          isAIEnabled: false,
          category: "social",
        },
      ]

      setRooms(mockRooms)
      setIsLoading(false)
    }

    fetchRooms()
  }, [])

  const handleCategoryFilter = (category: string | null) => {
    playSound("/sounds/button-click.mp3")
    setActiveCategory(category)
  }

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = activeCategory === null || room.category === activeCategory

    return matchesSearch && matchesCategory
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "technical":
        return <Zap className="h-4 w-4 text-blue-400" />
      case "creative":
        return <Sparkles className="h-4 w-4 text-purple-400" />
      case "research":
        return <Search className="h-4 w-4 text-green-400" />
      case "social":
        return <Users className="h-4 w-4 text-yellow-400" />
      default:
        return <MessageSquare className="h-4 w-4 text-gray-400" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "technical":
        return "border-blue-500/30 bg-blue-900/10"
      case "creative":
        return "border-purple-500/30 bg-purple-900/10"
      case "research":
        return "border-green-500/30 bg-green-900/10"
      case "social":
        return "border-yellow-500/30 bg-yellow-900/10"
      default:
        return "border-gray-700 bg-gray-900/20"
    }
  }

  return (
    <div>
      {/* Search and filters */}
      <div className="mb-6">
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search chat rooms..."
            className="w-full bg-black/30 border border-gray-800 rounded-lg px-4 py-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-fuchsia-500/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === null
                ? "bg-fuchsia-900/30 text-fuchsia-300 border border-fuchsia-500/50"
                : "bg-gray-900/30 text-gray-400 border border-gray-800 hover:bg-gray-800/30"
            }`}
            onClick={() => handleCategoryFilter(null)}
          >
            All
          </button>
          <button
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeCategory === "technical"
                ? "bg-blue-900/30 text-blue-300 border border-blue-500/50"
                : "bg-gray-900/30 text-gray-400 border border-gray-800 hover:bg-gray-800/30"
            }`}
            onClick={() => handleCategoryFilter("technical")}
          >
            <Zap className="h-3.5 w-3.5" />
            Technical
          </button>
          <button
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeCategory === "creative"
                ? "bg-purple-900/30 text-purple-300 border border-purple-500/50"
                : "bg-gray-900/30 text-gray-400 border border-gray-800 hover:bg-gray-800/30"
            }`}
            onClick={() => handleCategoryFilter("creative")}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Creative
          </button>
          <button
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeCategory === "research"
                ? "bg-green-900/30 text-green-300 border border-green-500/50"
                : "bg-gray-900/30 text-gray-400 border border-gray-800 hover:bg-gray-800/30"
            }`}
            onClick={() => handleCategoryFilter("research")}
          >
            <Search className="h-3.5 w-3.5" />
            Research
          </button>
          <button
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeCategory === "social"
                ? "bg-yellow-900/30 text-yellow-300 border border-yellow-500/50"
                : "bg-gray-900/30 text-gray-400 border border-gray-800 hover:bg-gray-800/30"
            }`}
            onClick={() => handleCategoryFilter("social")}
          >
            <Users className="h-3.5 w-3.5" />
            Social
          </button>
        </div>
      </div>

      {/* Room list */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border border-gray-800 rounded-lg p-4 animate-pulse">
              <div className="h-6 bg-gray-800 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-800 rounded w-full mb-4"></div>
              <div className="flex justify-between">
                <div className="h-4 bg-gray-800 rounded w-1/4"></div>
                <div className="h-4 bg-gray-800 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                className={`border ${getCategoryColor(room.category)} rounded-lg p-4 hover:border-fuchsia-500/30 transition-colors cursor-pointer`}
                onClick={() => onSelectRoom(room.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-white">{room.name}</h3>
                  <div className="flex items-center">
                    {getCategoryIcon(room.category)}
                    {room.isAIEnabled && (
                      <span className="ml-2 bg-fuchsia-900/30 text-fuchsia-300 text-xs px-2 py-0.5 rounded-full border border-fuchsia-500/30">
                        AI
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-4">{room.description}</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span className="flex items-center">
                    <Users className="h-3.5 w-3.5 mr-1" />
                    {room.members} members
                  </span>
                  <span className="flex items-center">
                    <MessageSquare className="h-3.5 w-3.5 mr-1" />
                    {room.messages} messages
                  </span>
                  <span>Active {room.lastActive}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Create new room button */}
          <button
            className="mt-6 w-full border border-dashed border-fuchsia-500/30 rounded-lg p-4 flex items-center justify-center text-fuchsia-400 hover:bg-fuchsia-900/10 transition-colors"
            onClick={() => playSound("/sounds/button-click.mp3")}
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New Chat Room
          </button>
        </>
      )}
    </div>
  )
}
