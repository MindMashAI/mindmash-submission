"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, Send, Sparkles, User, Users, Settings, Paperclip, Smile, Zap } from "lucide-react"
import { useAudio } from "@/components/audio-manager"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  content: string
  sender: {
    id: string
    name: string
    avatar?: string
    isAI?: boolean
  }
  timestamp: string
}

interface ChatroomViewProps {
  roomId: string
  onBack: () => void
  chatroom: any
}

// Mock messages for demo
const mockMessages = [
  {
    id: "m1",
    sender: "Alice Chen",
    senderType: "user",
    content: "Has anyone looked at the latest research on transformer models?",
    timestamp: "10:23 AM",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "m2",
    sender: "GPT-4",
    senderType: "ai",
    content:
      "Yes, there's been significant progress in making them more efficient. The Transformer-XL architecture introduces relative positional embeddings and a segment-level recurrence mechanism that allows it to learn dependencies beyond a fixed-length context.",
    timestamp: "10:24 AM",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "m3",
    sender: "Bob Johnson",
    senderType: "user",
    content:
      "I've been experimenting with some of those approaches. The segment recurrence really helps with maintaining context across longer sequences.",
    timestamp: "10:26 AM",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "m4",
    sender: "Claude",
    senderType: "ai",
    content:
      "Another interesting development is the Reformer, which uses locality-sensitive hashing to reduce the complexity of attention from O(n²) to O(n log n), making it possible to handle much longer sequences.",
    timestamp: "10:28 AM",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "m5",
    sender: "Emma Davis",
    senderType: "user",
    content: "Has anyone implemented these in PyTorch? I'm looking for some example code to study.",
    timestamp: "10:30 AM",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "m6",
    sender: "Alice Chen",
    senderType: "user",
    content:
      "I can share my implementation later today. It's based on the Hugging Face transformers library but with some modifications for our specific use case.",
    timestamp: "10:32 AM",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "m7",
    sender: "GPT-4",
    senderType: "ai",
    content:
      "If you're looking for examples, the Hugging Face documentation has some excellent tutorials on implementing various transformer architectures. Their GitHub repository also contains numerous examples that might be helpful.",
    timestamp: "10:33 AM",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function ChatroomView({ roomId, onBack, chatroom }: ChatroomViewProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [roomInfo, setRoomInfo] = useState<any>(null)
  const [participants, setParticipants] = useState<any[]>([])
  const [showParticipants, setShowParticipants] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { playSound } = useAudio()
  const { toast } = useToast()

  // Fetch room data and messages
  useEffect(() => {
    const fetchRoomData = async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock room info
      const mockRoomInfo = {
        id: roomId,
        name:
          roomId === "room1"
            ? "Neural Interface Development"
            : roomId === "room2"
              ? "Quantum Computing Applications"
              : roomId === "room3"
                ? "Creative AI Collaboration"
                : "Chat Room",
        description: "Discuss the latest in neural interface technology and development approaches",
        members: 128,
        isAIEnabled: true,
        category: "technical",
      }

      // Mock participants
      const mockParticipants = [
        { id: "user1", name: "Neural Explorer", avatar: "/placeholder.svg?height=40&width=40", isOnline: true },
        { id: "user2", name: "Quantum Thinker", avatar: "/placeholder.svg?height=40&width=40", isOnline: true },
        { id: "user3", name: "Synapse Connect", avatar: "/placeholder.svg?height=40&width=40", isOnline: false },
        { id: "ai1", name: "MindMash AI", avatar: "/placeholder.svg?height=40&width=40", isAI: true, isOnline: true },
        { id: "user4", name: "Neural Nexus", avatar: "/placeholder.svg?height=40&width=40", isOnline: true },
        { id: "user5", name: "Cortex Weaver", avatar: "/placeholder.svg?height=40&width=40", isOnline: false },
      ]

      // Mock messages
      const mockMessages: Message[] = [
        {
          id: "msg1",
          content: "Has anyone experimented with the new neural interface SDK released last week?",
          sender: { id: "user1", name: "Neural Explorer", avatar: "/placeholder.svg?height=40&width=40" },
          timestamp: "10:15 AM",
        },
        {
          id: "msg2",
          content:
            "Yes, I've been testing it. The signal processing is much improved compared to the previous version.",
          sender: { id: "user2", name: "Quantum Thinker", avatar: "/placeholder.svg?height=40&width=40" },
          timestamp: "10:18 AM",
        },
        {
          id: "msg3",
          content: "I'm particularly impressed with the reduced latency in thought-to-code translation.",
          sender: { id: "user2", name: "Quantum Thinker", avatar: "/placeholder.svg?height=40&width=40" },
          timestamp: "10:19 AM",
        },
        {
          id: "msg4",
          content:
            "Based on the latest research, the new SDK implements advanced noise filtering algorithms that significantly improve signal clarity. This allows for more precise neural pattern recognition.",
          sender: { id: "ai1", name: "MindMash AI", avatar: "/placeholder.svg?height=40&width=40", isAI: true },
          timestamp: "10:21 AM",
        },
        {
          id: "msg5",
          content: "Has anyone encountered issues with memory usage? I'm seeing some unexpected spikes.",
          sender: { id: "user3", name: "Synapse Connect", avatar: "/placeholder.svg?height=40&width=40" },
          timestamp: "10:25 AM",
        },
        {
          id: "msg6",
          content: "I noticed that too. It seems to happen when processing complex visual imagery.",
          sender: { id: "user5", name: "Cortex Weaver", avatar: "/placeholder.svg?height=40&width=40" },
          timestamp: "10:28 AM",
        },
        {
          id: "msg7",
          content:
            "The team is working on optimizing memory usage. There's a beta patch available that addresses some of these issues. I can share the link if you're interested.",
          sender: { id: "user4", name: "Neural Nexus", avatar: "/placeholder.svg?height=40&width=40" },
          timestamp: "10:30 AM",
        },
        {
          id: "msg8",
          content: "That would be great! I'd like to test it with my current project.",
          sender: { id: "user3", name: "Synapse Connect", avatar: "/placeholder.svg?height=40&width=40" },
          timestamp: "10:32 AM",
        },
      ]

      setRoomInfo(mockRoomInfo)
      setParticipants(mockParticipants)
      setMessages(mockMessages)
      setIsLoading(false)
    }

    fetchRoomData()
  }, [roomId])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    playSound("/sounds/button-click.mp3")

    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      content: newMessage,
      sender: { id: "current-user", name: "You", avatar: "/placeholder.svg?height=40&width=40" },
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMessage])
    setNewMessage("")

    // Simulate AI response after a short delay
    if (roomInfo?.isAIEnabled) {
      setTimeout(() => {
        const aiResponses = [
          "That's an interesting perspective. Based on recent research, neural interfaces are showing promising results in that area.",
          "I've analyzed similar patterns in quantum computing applications. The correlation between neural signals and computational outcomes suggests new possibilities.",
          "Your approach aligns with emerging trends in the field. Have you considered incorporating adaptive learning algorithms to enhance the response?",
          "The data suggests that combining these techniques could yield significant improvements in signal processing efficiency.",
          "This reminds me of recent advancements in synaptic bridging technology. The applications for thought-to-code conversion are particularly promising.",
        ]

        const aiMessage: Message = {
          id: `msg-ai-${Date.now()}`,
          content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
          sender: { id: "ai1", name: "MindMash AI", avatar: "/placeholder.svg?height=40&width=40", isAI: true },
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }

        setMessages((prev) => [...prev, aiMessage])
        playSound("/sounds/notification.mp3")
      }, 1500)
    }
  }

  const toggleParticipants = () => {
    playSound("/sounds/button-click.mp3")
    setShowParticipants(!showParticipants)
  }

  return (
    <div className="flex h-[calc(100vh-140px)]">
      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="border-b border-gray-800 p-4 flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="mr-3 p-1.5 rounded-full hover:bg-gray-800 transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-fuchsia-400">{roomInfo?.name || "Loading..."}</h2>
              <p className="text-sm text-gray-400">{roomInfo?.description}</p>
            </div>
          </div>
          <div className="flex items-center">
            <button
              className={`p-2 rounded-full ${showParticipants ? "bg-fuchsia-900/30 text-fuchsia-300" : "hover:bg-gray-800 text-gray-400"} transition-colors mr-2`}
              onClick={toggleParticipants}
              aria-label="Show participants"
            >
              <Users className="h-5 w-5" />
            </button>
            <button
              className="p-2 rounded-full hover:bg-gray-800 text-gray-400 transition-colors"
              aria-label="Room settings"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-fuchsia-500"></div>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                  {message.sender.avatar ? (
                    <img
                      src={message.sender.avatar || "/placeholder.svg"}
                      alt={message.sender.name}
                      className="w-full h-full object-cover"
                    />
                  ) : message.sender.isAI ? (
                    <Sparkles className="h-4 w-4 text-fuchsia-400" />
                  ) : (
                    <User className="h-4 w-4 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-medium ${message.sender.isAI ? "text-fuchsia-400" : "text-blue-400"}`}>
                      {message.sender.name}
                    </span>
                    {message.sender.isAI && (
                      <span className="bg-fuchsia-900/30 text-fuchsia-300 text-xs px-1.5 py-0.5 rounded-sm">AI</span>
                    )}
                    <span className="text-gray-500 text-xs">{message.timestamp}</span>
                  </div>
                  <div
                    className={`p-3 rounded-lg ${
                      message.sender.isAI
                        ? "bg-fuchsia-900/10 border border-fuchsia-500/20"
                        : message.sender.id === "current-user"
                          ? "bg-blue-900/10 border border-blue-500/20"
                          : "bg-gray-900/50 border border-gray-800"
                    }`}
                  >
                    <p className="text-gray-200">{message.content}</p>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message input */}
        <div className="border-t border-gray-800 p-4">
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-gray-800 text-gray-400 transition-colors">
              <Paperclip className="h-5 w-5" />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Type your message..."
                className="w-full bg-gray-900/50 border border-gray-800 rounded-full px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-fuchsia-500/50"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button className="absolute right-2 top-2 p-1 rounded-full hover:bg-gray-800 text-gray-400 transition-colors">
                <Smile className="h-5 w-5" />
              </button>
            </div>
            <button
              className="p-2 rounded-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              <Send className="h-5 w-5" />
            </button>
            {roomInfo?.isAIEnabled && (
              <button className="p-2 rounded-full bg-gradient-to-r from-fuchsia-600 to-blue-600 text-white transition-colors">
                <Zap className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Participants sidebar (conditionally rendered) */}
      {showParticipants && (
        <div className="w-64 border-l border-gray-800 overflow-y-auto custom-scrollbar">
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-lg font-semibold text-fuchsia-400 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Participants ({participants.length})
            </h3>
          </div>
          <div className="p-2">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-900/50 transition-colors"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                    {participant.avatar ? (
                      <img
                        src={participant.avatar || "/placeholder.svg"}
                        alt={participant.name}
                        className="w-full h-full object-cover"
                      />
                    ) : participant.isAI ? (
                      <Sparkles className="h-4 w-4 text-fuchsia-400" />
                    ) : (
                      <User className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  {participant.isOnline && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-black"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className={`font-medium ${participant.isAI ? "text-fuchsia-400" : "text-white"}`}>
                      {participant.name}
                    </span>
                    {participant.isAI && (
                      <span className="ml-2 bg-fuchsia-900/30 text-fuchsia-300 text-xs px-1.5 py-0.5 rounded-sm">
                        AI
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{participant.isOnline ? "Online" : "Offline"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
