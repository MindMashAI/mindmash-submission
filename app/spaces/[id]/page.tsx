"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAudio } from "@/components/audio-manager"
import { useToast } from "@/hooks/use-toast"
import { Users, Lock, Globe, Star, ArrowLeft, Settings, UserPlus, Cpu, Pin, X } from "lucide-react"
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
    humans: {
      id: string
      name: string
      avatar: string
      isOnline: boolean
      role: "owner" | "admin" | "member"
    }[]
    ais: {
      id: string
      name: string
      avatar: string
      model: string
    }[]
  }
  isPrivate: boolean
  isFavorite: boolean
  createdAt: string
  tags: string[]
  messages: Message[]
}

interface Message {
  id: string
  content: string
  author: {
    id: string
    name: string
    avatar: string
    type: "human" | "ai"
    model?: string
  }
  timestamp: string
  isPinned?: boolean
  reactions?: {
    type: string
    count: number
    userIds: string[]
  }[]
  attachments?: {
    type: string
    url: string
    name: string
  }[]
  replyTo?: string
}

export default function CollabSpacePage() {
  const params = useParams()
  const router = useRouter()
  const { playSound } = useAudio()
  const { toast } = useToast()
  const [space, setSpace] = useState<CollabSpace | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [showMembers, setShowMembers] = useState(false)
  const [currentEmotion, setCurrentEmotion] = useState("Neutral")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messageInputRef = useRef<HTMLTextAreaElement>(null)

  // Mock data for the collaboration space
  const mockSpace: CollabSpace = {
    id: params.id as string,
    name: "Neural Interface Research",
    description: "Collaborative space for discussing neural interface technologies and applications",
    creator: {
      id: "user-1",
      name: "Neural Explorer",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    members: {
      humans: [
        {
          id: "user-1",
          name: "Neural Explorer",
          avatar: "/images/pfp/quantum-coder.png",
          isOnline: true,
          role: "owner",
        },
        {
          id: "user-2",
          name: "Quantum Thinker",
          avatar: "/images/pfp/neural-nomad.png",
          isOnline: false,
          role: "admin",
        },
        {
          id: "user-3",
          name: "Synapse Connect",
          avatar: "/images/pfp/logic-lord.png",
          isOnline: true,
          role: "member",
        },
        {
          id: "current-user",
          name: "You",
          avatar: "/images/pfp/mindmash-user.png",
          isOnline: true,
          role: "member",
        },
      ],
      ais: [
        {
          id: "ai-grok",
          name: "Grok",
          avatar: "/images/pfp/synth-sage.png",
          model: "grok",
        },
        {
          id: "ai-chatgpt",
          name: "ChatGPT",
          avatar: "/images/pfp/cortex-captain.png",
          model: "chatgpt",
        },
        {
          id: "ai-system",
          name: "MindMash System",
          avatar: "/images/pfp/byte-bender.png",
          model: "system",
        },
      ],
    },
    isPrivate: false,
    isFavorite: true,
    createdAt: "2023-04-15",
    tags: ["#NeuralInterface", "#BrainComputing", "#Research"],
    messages: [
      {
        id: "msg-1",
        content:
          "Welcome to the Neural Interface Research space! This is where we'll collaborate on neural interface technologies and applications.",
        author: {
          id: "user-1",
          name: "Neural Explorer",
          avatar: "/images/pfp/quantum-coder.png",
          type: "human",
        },
        timestamp: "2 hours ago",
        isPinned: true,
      },
      {
        id: "msg-2",
        content:
          "I've been working on a new approach to reduce signal noise in neural interfaces. The preliminary results are promising!",
        author: {
          id: "user-2",
          name: "Quantum Thinker",
          avatar: "/images/pfp/neural-nomad.png",
          type: "human",
        },
        timestamp: "1 hour ago",
        reactions: [
          { type: "👍", count: 2, userIds: ["user-1", "user-3"] },
          { type: "🔬", count: 1, userIds: ["user-3"] },
        ],
      },
      {
        id: "msg-3",
        content:
          "Based on recent research, signal noise reduction can be approached through quantum filtering techniques. This could potentially increase signal clarity by up to 40% in laboratory conditions.",
        author: {
          id: "ai-grok",
          name: "Grok",
          avatar: "/images/pfp/synth-sage.png",
          type: "ai",
          model: "grok",
        },
        timestamp: "45 minutes ago",
      },
      {
        id: "msg-4",
        content:
          "That's fascinating! @Quantum Thinker Have you considered combining your approach with the quantum filtering techniques Grok mentioned?",
        author: {
          id: "user-3",
          name: "Synapse Connect",
          avatar: "/images/pfp/logic-lord.png",
          type: "human",
        },
        timestamp: "30 minutes ago",
        replyTo: "msg-2",
      },
      {
        id: "msg-5",
        content:
          "I've analyzed multiple approaches to neural interface signal processing. A hybrid approach combining traditional filters with quantum computing shows the most promise for real-world applications outside laboratory settings.",
        author: {
          id: "ai-chatgpt",
          name: "ChatGPT",
          avatar: "/images/pfp/cortex-captain.png",
          type: "ai",
          model: "chatgpt",
        },
        timestamp: "20 minutes ago",
      },
      {
        id: "msg-6",
        content:
          "The MindMash team has developed a prototype neural interface that achieves 75% signal clarity in real-world testing. We're looking for collaborators to help refine the technology.",
        author: {
          id: "ai-system",
          name: "MindMash System",
          avatar: "/images/pfp/byte-bender.png",
          type: "ai",
          model: "system",
        },
        timestamp: "10 minutes ago",
        attachments: [{ type: "pdf", url: "#", name: "neural_interface_prototype.pdf" }],
      },
    ],
  }

  // Load space data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setSpace(mockSpace)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [space?.messages])

  // Handle sending a message
  const handleSendMessage = () => {
    if (!message.trim() || !space) return

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content: message,
      author: {
        id: "current-user",
        name: "You",
        avatar: "/images/pfp/mindmash-user.png",
        type: "human",
      },
      timestamp: "Just now",
    }

    setSpace({
      ...space,
      messages: [...space.messages, newMessage],
    })

    setMessage("")
    playSound("/sounds/button-click.mp3")

    // Simulate AI responses
    setTimeout(() => {
      // Random selection of AI to respond
      const aiIndex = Math.floor(Math.random() * space.members.ais.length)
      const ai = space.members.ais[aiIndex]

      const aiResponse: Message = {
        id: `msg-${Date.now() + 1}`,
        content: getAIResponse(ai.model, message),
        author: {
          id: ai.id,
          name: ai.name,
          avatar: ai.avatar,
          type: "ai",
          model: ai.model,
        },
        timestamp: "Just now",
      }

      setSpace((prevSpace) => ({
        ...prevSpace!,
        messages: [...prevSpace!.messages, aiResponse],
      }))

      playSound("/sounds/feature-select.mp3")
    }, 2000)
  }

  // Get a simulated AI response
  const getAIResponse = (model: string, userMessage: string): string => {
    const responses: Record<string, string[]> = {
      grok: [
        "Based on my analysis, this neural interface approach could be optimized further with recursive algorithms.",
        "I've simulated your proposal and found several potential improvements to the signal processing pipeline.",
        "The quantum computing angle is promising. My calculations suggest a 32% improvement in signal clarity is achievable.",
        "Your ideas align with cutting-edge research in the field. I'd recommend exploring tensor-based signal processing as well.",
      ],
      chatgpt: [
        "I've analyzed your message from multiple perspectives. The neural interface technology you're describing has significant potential applications in healthcare and accessibility.",
        "Looking at the broader context, your approach to neural interfaces could benefit from incorporating recent advances in machine learning for signal interpretation.",
        "There are several considerations worth exploring here. First, the ethical implications of direct neural interfaces need careful consideration. Second, the technical challenges of signal fidelity remain substantial.",
        "Your thoughts on neural interfaces are intriguing. To build on this, we might consider how these technologies could evolve over the next decade based on current research trajectories.",
      ],
      system: [
        "The MindMash neural interface framework could integrate well with your proposed approach. Our team has developed complementary technologies you might find useful.",
        "Based on collective intelligence analysis, your ideas have an 87% alignment with current research frontiers in neural interfaces.",
        "I've identified several potential collaboration opportunities within the MindMash ecosystem that align with your research direction.",
        "Your contribution has been added to the MindMash knowledge graph. Several related projects might benefit from your insights.",
      ],
    }

    const modelResponses = responses[model] || responses.system
    return modelResponses[Math.floor(Math.random() * modelResponses.length)]
  }

  // Handle AI activity
  const handleAIActivity = (aiType: string) => {
    // This function would handle any special effects or state changes when an AI is active
    console.log(`AI ${aiType} is active`)
  }

  // Handle emotion change
  const handleEmotionChange = (emotion: string) => {
    setCurrentEmotion(emotion)
  }

  // Toggle favorite status
  const toggleFavorite = () => {
    if (!space) return
    setSpace({
      ...space,
      isFavorite: !space.isFavorite,
    })

    toast({
      title: space.isFavorite ? "Removed from favorites" : "Added to favorites",
      description: space.isFavorite
        ? `${space.name} has been removed from your favorites`
        : `${space.name} has been added to your favorites`,
    })

    playSound("/sounds/button-click.mp3")
  }

  // Pin a message
  const pinMessage = (messageId: string) => {
    if (!space) return

    setSpace({
      ...space,
      messages: space.messages.map((msg) => (msg.id === messageId ? { ...msg, isPinned: !msg.isPinned } : msg)),
    })

    playSound("/sounds/button-click.mp3")
  }

  // Add reaction to a message
  const addReaction = (messageId: string, reaction: string) => {
    if (!space) return

    setSpace({
      ...space,
      messages: space.messages.map((msg) => {
        if (msg.id !== messageId) return msg

        const existingReactions = msg.reactions || []
        const existingReaction = existingReactions.find((r) => r.type === reaction)

        if (existingReaction) {
          // Toggle reaction
          if (existingReaction.userIds.includes("current-user")) {
            return {
              ...msg,
              reactions: existingReactions
                .map((r) =>
                  r.type === reaction
                    ? {
                        ...r,
                        count: r.count - 1,
                        userIds: r.userIds.filter((id) => id !== "current-user"),
                      }
                    : r,
                )
                .filter((r) => r.count > 0),
            }
          } else {
            return {
              ...msg,
              reactions: existingReactions.map((r) =>
                r.type === reaction
                  ? {
                      ...r,
                      count: r.count + 1,
                      userIds: [...r.userIds, "current-user"],
                    }
                  : r,
              ),
            }
          }
        } else {
          // Add new reaction
          return {
            ...msg,
            reactions: [...existingReactions, { type: reaction, count: 1, userIds: ["current-user"] }],
          }
        }
      }),
    })

    playSound("/sounds/button-click.mp3")
  }

  // Delete a message
  const deleteMessage = (messageId: string) => {
    if (!space) return

    setSpace({
      ...space,
      messages: space.messages.filter((msg) => msg.id !== messageId),
    })

    toast({
      title: "Message deleted",
      description: "Your message has been removed from the conversation",
    })

    playSound("/sounds/button-click.mp3")
  }

  // Handle back navigation
  const handleBack = () => {
    router.push("/spaces")
    playSound("/sounds/button-click.mp3")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="cyberpunk-loader mx-auto mb-4"></div>
          <p className="text-cyan-400 cyberpunk-text">Loading Collaboration Space...</p>
        </div>
      </div>
    )
  }

  if (!space) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-2">Space Not Found</h2>
          <p className="text-gray-400 mb-6">
            The collaboration space you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/spaces" className="px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 rounded-md transition-colors">
            Back to Spaces
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <button className="mr-3 p-2 rounded-full hover:bg-gray-800 transition-colors" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">{space.name}</h1>
                {space.isPrivate ? (
                  <Lock className="h-4 w-4 text-gray-400" />
                ) : (
                  <Globe className="h-4 w-4 text-gray-400" />
                )}
              </div>
              <p className="text-sm text-gray-400">{space.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="relative p-2 rounded-full hover:bg-gray-800 transition-colors"
              onClick={() => setShowMembers(!showMembers)}
            >
              <Users className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-4 w-4 bg-fuchsia-500 rounded-full text-xs flex items-center justify-center">
                {space.members.humans.length + space.members.ais.length}
              </span>
            </button>

            <button className="p-2 rounded-full hover:bg-gray-800 transition-colors" onClick={toggleFavorite}>
              <Star className={`h-5 w-5 ${space.isFavorite ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}`} />
            </button>

            <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Members sidebar (conditionally shown) */}
        {showMembers && (
          <div className="w-64 border-r border-gray-800 bg-black/90 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold">Members</h2>
                <button
                  className="p-1 rounded-full hover:bg-gray-800 transition-colors"
                  onClick={() => setShowMembers(false)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-sm text-gray-400 mb-2 flex items-center gap-1">
                  <Users className="h-3 w-3" /> Humans ({space.members.humans.length})
                </h3>
                <div className="space-y-3">
                  {space.members.humans.map((member) => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                            <Image
                              src={member.avatar || "/placeholder.svg"}
                              alt={member.name}
                              width={32}
                              height={32}
                              className="object-cover"
                            />
                          </div>
                          {member.isOnline && (
                            <div className="absolute bottom-0 right-0 h-2 w-2 bg-green-500 rounded-full border border-black"></div>
                          )}
                        </div>
                        <span className={member.id === "current-user" ? "font-medium" : ""}>{member.name}</span>
                      </div>
                      <span className="text-xs px-2 py-0.5 bg-gray-800 rounded-full">{member.role}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm text-gray-400 mb-2 flex items-center gap-1">
                  <Cpu className="h-3 w-3" /> AI Models ({space.members.ais.length})
                </h3>
                <div className="space-y-3">
                  {space.members.ais.map((ai) => (
                    <div key={ai.id} className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                        <Image
                          src={ai.avatar || "/placeholder.svg"}
                          alt={ai.name}
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </div>
                      <span>{ai.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full mt-6 flex items-center justify-center gap-2 border border-gray-800 rounded-md py-2 hover:bg-gray-900 transition-colors">
                <UserPlus className="h-4 w-4" />
                <span>Invite Members</span>
              </button>
            </div>
          </div>
        )}

        {/* Chat area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Pinned messages */}
            {space.messages.some((msg) => msg.isPinned) && (
              <div className="bg-gray-900/50 border border-gray-800 rounded-md p-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <Pin className="h-3 w-3" />
                  <span>Pinned Messages</span>
                </div>
                <div className="space-y-2">
                  {space.messages
                    .filter((msg) => msg.isPinned)
                    .map((msg) => (
                      <div key={`pinned-${msg.id}`} className="flex items-start gap-2 text-sm">
                        <div className="h-6 w-6 rounded-full bg-gray-800 flex-shrink-0 flex items-center justify-center overflow-hidden">
                          {msg.author.type === "ai" ? (
                            <Cpu className="h-3 w-3 text-fuchsia-400" />
                          ) : (
                            <Image
                              src={msg.author.avatar || "/placeholder.svg"}
                              alt={msg.author.name}
                              width={24}
                              height={24}
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <span className="font-medium">{msg.author.name}: </span>
                          <span className="text-gray-300">
                            {msg.content.length > 100 ? `${msg.content.substring(0, 100)}...` : msg.content}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Regular messages */}
            {space.messages.map((msg) => (
              <div key={msg.id} className="message-container group">
                <div
                  className={`flex items-start gap-3 ${msg.author.id === "current-user" ? "bg-gray-900/30" : "bg-black/60"} p-3 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors`}
                >
                  <div className="h-10 w-10 rounded-full bg-gray-800 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {msg.author.type === "ai" ? (
                      <Image
                        src={msg.author.avatar || "/placeholder.svg"}
                        alt={msg.author.name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    ) : (
                      <Image
                        src={msg.author.avatar || "/placeholder.svg"}
                        alt={msg.author.name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{msg.author.name}</span>
                      {msg.author.type === "ai" && (
                        <span className="text-xs px-1.5 py-0.5 bg-fuchsia-900/50 text-fuchsia-300 rounded-full border border-fuchsia-800/50">
                          {msg.author.model}
                        </span>
                      )}
                      <span className="text-xs text-gray-500">{msg.timestamp}</span>
                    </div>

                    {msg.replyTo && (
                      <div className="mb-2 pl-2 border-l-2 border-gray-700 text-sm text-gray-400">
                        Replying to {space.messages.find((m) => m.id === msg.replyTo)?.author.name || "message"}
                      </div>
                    )}

                    <div className="text-gray-200 break-words">{msg.content}</div>

                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {msg.attachments.map((attachment, index) => (
                          <div
                            key={`${msg.id}-attachment-${index}`}
                            className="px-3 py-1.5 bg-gray-800 rounded-md flex items-center gap-2 text-sm"
                          >
                            <span>{attachment.name}</span>
                            <button className="text-cyan-400 hover:text-cyan-300">Download</button>
                          </div>
                        ))}
                      </div>
                    )}

                    {msg.reactions && msg.reactions.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {msg.reactions.map((reaction) => (
                          <button
                            key={`${msg.id}-reaction-${reaction.type}`}
                            className={`px-2 py-0.5 rounded-full text-sm flex items-center gap-1 ${
                              reaction.userIds.includes("current-user")
                                ? "bg-gray-700"
                                : "bg-gray-800 hover:bg-gray-700"
                            }`}
                            onClick={() => addReaction(msg.id, reaction.type)}
                          >
                            <span>{reaction.type}</span>
                            <span className="text-xs text-gray-400">{reaction.count}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex flex-col gap-1">
                      <button
                        className="p-1 rounded-full hover:bg-gray-800 transition-colors"
                        onClick={() => pinMessage(msg.id)}
                        title={msg.isPinned ? "Unpin message" : "Pin message"}
                      >
                        <Pin className={`h-4 w-4 ${msg.isPinned ? "text-cyan-400" : "text-gray-400"}`} />
                      </button>

                      {msg.author.id === "current-user" && (
                        <button
                          className="p-1 rounded-full hover:bg-gray-800 transition-colors"
                          onClick={() => deleteMessage(msg.id)}
                          title="Delete message"
                        >
                          <X className="h-4 w-4 text-gray-400" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <div className="border-t border-gray-800 p-4">
            <div className="flex items-end gap-3">
              <div className="flex-1 bg-gray-900 rounded-lg border border-gray-800 focus-within:border-gray-700 transition-colors overflow-hidden">
                <textarea
                  ref={messageInputRef}
                  className="w-full bg-transparent px-4 pt-3 outline-none resize-none text-gray-200"
                  placeholder="Type a message..."
                  rows={1}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  style={{ minHeight: "40px" }}
                />

                <div className="px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button className="p-1 rounded-full hover:bg-gray-800 transition-colors">
                      <span className="text-lg">😊</span>
                    </button>
                    <button className="p-1 rounded-full hover:bg-gray-800 transition-colors">
                      <span className="text-lg">📎</span>
                    </button>
                  </div>

                  <div>
                    <button
                      className="px-3 py-1 bg-gradient-to-r from-fuchsia-600 to-cyan-600 rounded-md text-sm font-medium hover:from-fuchsia-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
