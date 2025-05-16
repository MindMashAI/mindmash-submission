"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  Send,
  ChevronDown,
  Plus,
  MessageSquare,
  X,
  Search,
  SplitSquareHorizontal,
  ArrowLeft,
  Maximize2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAudio } from "@/components/audio-manager"
import { analyzeSentiment } from "@/lib/sentiment-analysis"
import type { InteractionType } from "@/lib/ai-interaction-protocol"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Simplified AI model types with PFP image paths
const AI_MODELS = {
  grok: {
    color: "text-green-400",
    bgColor: "bg-green-400",
    lightBgColor: "bg-green-900/20",
    borderColor: "border-green-400",
    displayName: "Grok",
    icon: "G",
    description: "First-principles reasoning and direct analysis",
    strengths: ["Technical analysis", "Logical reasoning", "Direct problem-solving"],
    pfp: "/images/ai-pfp/grok-avatar.png",
  },
  chatgpt: {
    color: "text-fuchsia-400",
    bgColor: "bg-fuchsia-400",
    lightBgColor: "bg-fuchsia-900/20",
    borderColor: "border-fuchsia-400",
    displayName: "ChatGPT",
    icon: "C",
    description: "Balanced, comprehensive analysis with multiple perspectives",
    strengths: ["Nuanced reasoning", "Comprehensive analysis", "Contextual understanding"],
    pfp: "/images/ai-pfp/chatgpt-avatar.png",
  },
  gemini: {
    color: "text-cyan-400",
    bgColor: "bg-cyan-400",
    lightBgColor: "bg-cyan-900/20",
    borderColor: "border-cyan-400",
    displayName: "Gemini",
    icon: "G",
    description: "Multimodal analysis and innovative connections",
    strengths: ["Pattern recognition", "Innovative approaches", "Multimodal thinking"],
    pfp: "/images/ai-pfp/gemini-avatar.png",
  },
  user: {
    color: "text-blue-400",
    bgColor: "bg-blue-400",
    lightBgColor: "bg-blue-900/20",
    borderColor: "border-blue-400",
    displayName: "You",
    icon: "U",
    description: "Human input and direction",
    strengths: ["Creativity", "Intuition", "Real-world context"],
    pfp: "/images/ai-pfp/user-avatar.png",
  },
  system: {
    color: "text-yellow-400",
    bgColor: "bg-yellow-400",
    lightBgColor: "bg-yellow-900/20",
    borderColor: "border-yellow-400",
    displayName: "System",
    icon: "S",
    description: "Synthesis and integration of multiple AI perspectives",
    strengths: ["Cross-model synthesis", "Consensus building", "Meta-analysis"],
    pfp: "/images/ai-pfp/system-avatar.png",
  },
}

// Get random response from an AI
function getRandomResponse(aiType: string) {
  const responses = AI_RESPONSES[aiType as keyof typeof AI_RESPONSES] || AI_RESPONSES.system
  return responses[Math.floor(Math.random() * responses.length)]
}

// AI responses for user inputs
const AI_RESPONSES = {
  grok: [
    "Your query has activated my neural pathways. Here's what I'm processing... - Grok",
    "I've analyzed your request using my neural pathways. The solution involves a recursive approach with O(log n) complexity.",
    "Based on my training data, this appears to be a novel approach. I'd recommend exploring quantum algorithms for better efficiency.",
    "Your hypothesis has merit. I've simulated 1,000 scenarios and found a 78.3% success rate under optimal conditions.",
  ],
  chatgpt: [
    "Let me provide a comprehensive response to your inquiry... - ChatGPT",
    "I've considered multiple perspectives on your query. Here's a comprehensive analysis with supporting evidence and potential counterarguments.",
    "Let me break this down systematically. There are three key factors to consider: scalability, security, and user experience.",
    "I'd like to offer a balanced perspective on this topic, considering both the advantages and potential limitations of the approach you're suggesting.",
  ],
  gemini: [
    "Your query has triggered a multi-dimensional analysis in my systems. Here's what I'm processing... - Gemini",
    "My multi-modal analysis suggests an innovative solution combining visual and textual elements for maximum impact.",
    "I've processed your request through my multimodal framework and identified several optimization opportunities.",
    "The data indicates a correlation between these variables that wasn't immediately apparent. Let me visualize this for better understanding.",
  ],
  system: [
    "Initiating cross-AI analysis. Compiling optimized response... - D.O.E.",
    "Cross-AI consensus reached. Confidence level: 92.7%. Implementing recommended solution.",
    "Divergent AI perspectives detected. Synthesizing optimal approach based on contextual relevance.",
    "AI collaboration complete. Solution quality improved by 43% compared to single-model response.",
  ],
}

// Command parser
type CommandType =
  | "pin"
  | "hashtag"
  | "mention"
  | "poll"
  | "remind"
  | "none"
  | "focus"
  | "compare"
  | "visualize"
  | "debate"
  | "brainstorm"
  | "thread"

interface ParsedCommand {
  type: CommandType
  originalText: string
  processedText: string
  metadata?: any
}

function parseCommands(text: string): ParsedCommand[] {
  const commands: ParsedCommand[] = []

  // Check for pin command
  if (text.startsWith("/pin ")) {
    commands.push({
      type: "pin",
      originalText: text,
      processedText: text.substring(5),
      metadata: {
        pinned: true,
        timestamp: new Date().toISOString(),
      },
    })
    return commands
  }

  // Check for focus command
  if (text.startsWith("/focus ")) {
    const focusTarget = text.substring(7).trim()
    commands.push({
      type: "focus",
      originalText: text,
      processedText: `Focusing conversation on: ${focusTarget}`,
      metadata: {
        focusTarget,
        timestamp: new Date().toISOString(),
      },
    })
    return commands
  }

  // Check for thread command
  if (text.startsWith("/thread ")) {
    const threadTitle = text.substring(8).trim()
    commands.push({
      type: "thread",
      originalText: text,
      processedText: `Creating new thread: ${threadTitle}`,
      metadata: {
        threadTitle,
        timestamp: new Date().toISOString(),
      },
    })
    return commands
  }

  // Check for compare command
  if (text.startsWith("/compare ")) {
    const compareItems = text.substring(9).split(" vs ")
    commands.push({
      type: "compare",
      originalText: text,
      processedText: `Comparing: ${compareItems.join(" vs ")}`,
      metadata: {
        items: compareItems,
        timestamp: new Date().toISOString(),
      },
    })
    return commands
  }

  // Check for visualize command
  if (text.startsWith("/visualize ")) {
    const visualizeTarget = text.substring(11).trim()
    commands.push({
      type: "visualize",
      originalText: text,
      processedText: `Visualizing: ${visualizeTarget}`,
      metadata: {
        target: visualizeTarget,
        timestamp: new Date().toISOString(),
      },
    })
    return commands
  }

  // Check for debate command
  if (text.startsWith("/debate ")) {
    const debateTopic = text.substring(8).trim()
    commands.push({
      type: "debate",
      originalText: text,
      processedText: `Starting a debate on: ${debateTopic}`,
      metadata: {
        topic: debateTopic,
        timestamp: new Date().toISOString(),
      },
    })
    return commands
  }

  // Check for brainstorm command
  if (text.startsWith("/brainstorm ")) {
    const brainstormTopic = text.substring(12).trim()
    commands.push({
      type: "brainstorm",
      originalText: text,
      processedText: `Brainstorming on: ${brainstormTopic}`,
      metadata: {
        topic: brainstormTopic,
        timestamp: new Date().toISOString(),
      },
    })
    return commands
  }

  // Process hashtags (#topic)
  const hashtagRegex = /#(\w+)/g
  let match
  let processedText = text
  const hashtags: string[] = []

  while ((match = hashtagRegex.exec(text)) !== null) {
    hashtags.push(match[1])
    processedText = processedText.replace(
      match[0],
      `<span class="text-cyan-400 hover:underline cursor-pointer">#${match[1]}</span>`,
    )
  }

  if (hashtags.length > 0) {
    commands.push({
      type: "hashtag",
      originalText: text,
      processedText,
      metadata: { hashtags },
    })
  }

  // Process mentions (@user)
  const mentionRegex = /@(\w+)/g
  let mentionMatch
  let mentionProcessedText = processedText
  const mentions: string[] = []

  while ((mentionMatch = mentionRegex.exec(text)) !== null) {
    mentions.push(mentionMatch[1])
    mentionProcessedText = mentionProcessedText.replace(
      mentionMatch[0],
      `<span class="text-fuchsia-400 hover:underline cursor-pointer">@${mentionMatch[1]}</span>`,
    )
  }

  if (mentions.length > 0) {
    commands.push({
      type: "mention",
      originalText: text,
      processedText: mentionProcessedText,
      metadata: { mentions },
    })
  }

  // If no commands were found or only formatting was applied
  if (commands.length === 0) {
    commands.push({
      type: "none",
      originalText: text,
      processedText: text,
    })
  }

  return commands
}

function processMessage(message: string): {
  processedText: string
  commands: ParsedCommand[]
} {
  const commands = parseCommands(message)

  // Get the most processed version of the text
  const processedText = commands.reduce((text, command) => {
    return command.processedText || text
  }, message)

  return {
    processedText,
    commands,
  }
}

// Update the renderProcessedMessage function to handle system responses with the new format
function renderProcessedMessage(processedText: string, sender: string): React.ReactNode {
  // Special formatting for system responses
  if (sender === "system" && processedText.includes("SYNTHESIS REPORT")) {
    return (
      <div className="system-synthesis">
        {processedText.split("\n").map((line, index) => {
          if (line.includes("━━━ SYNTHESIS REPORT ━━━")) {
            return (
              <div key={index} className="text-yellow-400 font-bold text-center my-1">
                {line}
              </div>
            )
          } else if (line.includes("━━━━━━━━━━━━━━━━━━━━━━━━━━━")) {
            return (
              <div key={index} className="text-yellow-400 text-center my-1">
                {line}
              </div>
            )
          } else if (line.startsWith("🔍")) {
            return (
              <div key={index} className="text-yellow-300 font-semibold mt-2">
                {line}
              </div>
            )
          } else if (line.startsWith("💡")) {
            return (
              <div key={index} className="text-yellow-300 font-semibold mt-3">
                {line}
              </div>
            )
          } else if (line.startsWith("📌")) {
            return (
              <div key={index} className="text-yellow-300 font-semibold mt-3 mb-1">
                {line}
              </div>
            )
          } else if (line.startsWith("•")) {
            return (
              <div key={index} className="text-yellow-200 font-medium ml-2 mt-1">
                {line}
              </div>
            )
          } else if (line.match(/^\d+\./)) {
            return (
              <div key={index} className="text-yellow-100 ml-4 my-1">
                {line}
              </div>
            )
          } else if (line.trim() === "") {
            return <div key={index} className="h-1"></div>
          } else {
            return (
              <div key={index} className="text-gray-300 ml-4">
                {line}
              </div>
            )
          }
        })}
      </div>
    )
  }

  // Default rendering for other messages
  return <div dangerouslySetInnerHTML={{ __html: processedText }} />
}

// Typing indicator component
function TypingIndicator({ sender }: { sender: string }) {
  const model = AI_MODELS[sender as keyof typeof AI_MODELS]

  return (
    <div
      className={`p-2 rounded-md ${
        sender === "grok"
          ? "bg-green-900/20 border-l-2 border-green-500"
          : sender === "chatgpt"
            ? "bg-fuchsia-900/20 border-l-2 border-fuchsia-500"
            : sender === "gemini"
              ? "bg-cyan-900/20 border-l-2 border-cyan-500"
              : "bg-gray-900/20 border-l-2 border-yellow-500"
      }`}
    >
      <div className="flex items-center">
        <div className={`font-bold ${model?.color || "text-gray-300"}`}>
          {sender.charAt(0).toUpperCase() + sender.slice(1)}
        </div>
        <div className="ml-2 flex space-x-1">
          <div
            className={`w-1.5 h-1.5 rounded-full ${model?.bgColor || "bg-gray-400"} animate-bounce`}
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className={`w-1.5 h-1.5 rounded-full ${model?.bgColor || "bg-gray-400"} animate-bounce`}
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className={`w-1.5 h-1.5 rounded-full ${model?.bgColor || "bg-gray-400"} animate-bounce`}
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  )
}

interface AIInteractionMessage {
  id: number
  type: "interaction"
  interaction: {
    type: InteractionType
    fromModel: string
    toModel: string
    content: string
    contextRelevance?: number
    debatePosition?: "for" | "against" | "neutral"
    brainstormStage?: "ideation" | "expansion" | "evaluation" | "synthesis"
  }
  response: string
  timestamp: string
  threadId: string
}

type Message =
  | {
      id: number
      sender: string
      content: string
      timestamp: string
      isTyping?: boolean
      sender_display?: string
      type?: "warning" | "success" | "info" | "error"
      metadata?: {
        confidence?: number
        sentiment?: number
        keywords?: string[]
        thinking?: string
      }
      threadId: string
    }
  | AIInteractionMessage

// New interface for conversation threads
interface Thread {
  id: string
  title: string
  isExpanded: boolean
  createdAt: string
  lastUpdated: string
  messageCount: number
}

// Query categories for smart routing
type QueryCategory = "technical" | "creative" | "factual" | "opinion" | "coding" | "math" | "general"


interface ContextItem {
  id: string
  content: string
  isPinned: boolean
  timestamp: number
  source: string
}

interface ChatInterfaceProps {
  onAIActivity: (aiType: string) => void
  currentEmotion: string
  onEmotionChange: (emotion: string) => void
  // Add these new props:
  enableSmartRouting?: boolean
  enableEnhancedContext?: boolean
  enableImprovedInteractions?: boolean
  selectedPrompt?: string // New prop to receive selected prompts
  enableRealResponses?: boolean
  offlineMode?: boolean
}

// Interaction modes
type InteractionMode = "standard" | "debate" | "brainstorm"

// Define ModelOption type
type ModelOption = "all" | "grok" | "chatgpt" | "gemini" | "system"

// Define interactionTypes array
const interactionTypes: InteractionType[] = [
  "question",
  "clarification",
  "challenge",
  "extension",
  "synthesis",
  "correction",
  "agreement",
  "elaboration",
  "counterpoint",
  "integration",
  "debate",
  "counterpoint",
  "challenge",
  "clarification",
  "critique",
  "brainstorm",
  "extension",
  "refinement",
  "analogy",
  "scenario",
  "integration",
]


function ModelAvatar({ model, size = "md" }: { model: string; size?: "sm" | "md" | "lg" }) {
  const [hasError, setHasError] = useState(false)
  const modelData = AI_MODELS[model as keyof typeof AI_MODELS]
  const pfpPath = modelData?.pfp || "/images/ai-pfp/system-avatar.png"

  // Size classes
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  }

  // Fallback to colored circle with initial if image fails to load
  if (hasError) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full ${modelData?.bgColor || "bg-gray-600"} flex items-center justify-center text-white font-bold`}
      >
        {modelData?.icon || model.charAt(0).toUpperCase()}
      </div>
    )
  }

  return (
    <div
      className={`${sizeClasses[size]} relative overflow-hidden rounded-full border-2 ${modelData?.borderColor || "border-gray-600"} ring-2 ring-black/50`}
    >
      <img
        src={pfpPath || "/placeholder.svg"}
        alt={`${model} avatar`}
        width={size === "lg" ? 48 : size === "md" ? 40 : 32}
        height={size === "lg" ? 48 : size === "md" ? 40 : 32}
        className="object-cover"
        onError={() => setHasError(true)}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40"></div>
    </div>
  )
}

// All Models avatar for the "all" option
function AllModelsAvatar({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  }

  return (
    <div
      className={`${sizeClasses[size]} relative rounded-full bg-gradient-to-r from-green-500 via-fuchsia-500 to-cyan-500 flex items-center justify-center text-white font-bold ring-2 ring-black/50`}
    >
      A
    </div>
  )
}


// function QuickResponseButton({ text, onClick }: { text: string; onClick: () => void }) {
//   return (
//     <button
//       className="px-3 py-1.5 bg-gray-800/80 hover:bg-gray-700/80 text-gray-300 text-sm rounded-full border border-gray-700 transition-colors"
//       onClick={onClick}
//     >
//       {text}
//     </button>
//   );
// }

// Define view modes
type ViewMode = "standard" | "comparison"

export default function ChatInterface(props: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [threads, setThreads] = useState<Thread[]>([
    {
      id: "default",
      title: "General Discussion",
      isExpanded: true,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      messageCount: 0,
    },
  ])
  const [activeThreadId, setActiveThreadId] = useState<string>("default")
  const [inputValue, setInputValue] = useState("")
  const [typingIndicators, setTypingIndicators] = useState<{ [key: string]: boolean }>({})
  const [pinnedMessages, setPinnedMessages] = useState<string[]>([])
  const [selectedModel, setSelectedModel] = useState<ModelOption>("all")
  const [showModelDropdown, setShowModelDropdown] = useState(false)
  const [showThreadDropdown, setShowThreadDropdown] = useState(false)
  const [offlineMode, setOfflineMode] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [showGrokNotice, setShowGrokNotice] = useState(false)
  const [conversationFocus, setConversationFocus] = useState<string | null>(null)
  const [showThinkingProcess, setShowThinkingProcess] = useState(true)
  const [interactionFrequency, setInteractionFrequency] = useState(0.7) // 0-1 scale
  const [interactionMode, setInteractionMode] = useState<InteractionMode>("standard")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const modelDropdownRef = useRef<HTMLDivElement>(null)
  const threadDropdownRef = useRef<HTMLDivElement>(null)
  const { playSound } = useAudio()
  const [sentiment, setSentiment] = useState({ score: 0.6, label: "Neutral" })
  const [contextItems, setContextItems] = useState<ContextItem[]>([])
  const [detectedQueryCategory, setDetectedQueryCategory] = useState<QueryCategory>("general")
  const [suggestedModel, setSuggestedModel] = useState<ModelOption | null>(null)
  const [useSmartRouting, setUseSmartRouting] = useState<boolean>(props.enableSmartRouting ?? true)
  const [useEnhancedContext, setUseEnhancedContext] = useState<boolean>(props.enableEnhancedContext ?? true)
  const [useImprovedInteractions, setUseImprovedInteractions] = useState<boolean>(
    props.enableImprovedInteractions ?? true,
  )
  const [lastInteractionType, setLastInteractionType] = useState<InteractionType | null>(null)
  const [showNewThreadModal, setShowNewThreadModal] = useState(false)
  const [newThreadTitle, setNewThreadTitle] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const [modelConnectionStatus, setModelConnectionStatus] = useState<{
    [key: string]: "connecting" | "connected" | "error" | "offline"
  }>({
    grok: "offline",
    chatgpt: "offline",
    gemini: "offline",
    system: "offline",
  })
  const [isConnecting, setIsConnecting] = useState(false)

  const [messageBeingSent, setMessageBeingSent] = useState(false)
  const [showReactionOptions, setShowReactionOptions] = useState<number | null>(null)
  const [messageReactions, setMessageReactions] = useState<Record<number, string>>({})
  const [expandedMessage, setExpandedMessage] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>("standard")
  const [comparisonPrompt, setComparisonPrompt] = useState("")
  const [comparisonResponses, setComparisonResponses] = useState<Record<string, string>>({})
  const [isComparing, setIsComparing] = useState(false)
  

  // Add a welcome message on first load
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now(),
        sender: "system",
        content:
          "Welcome to the Data Nexus. Ask a question to start a conversation with multiple AI models working together.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
        type: "info",
        threadId: "default",
      }
      setMessages([welcomeMessage])
      updateThreadMessageCount("default", 1)
    }
  }, [messages.length])

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
        setShowModelDropdown(false)
      }
      if (threadDropdownRef.current && !threadDropdownRef.current.contains(event.target as Node)) {
        setShowThreadDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current && !showSearch) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      })
    }
  }, [messages, activeThreadId, showSearch])

  // Add effect to handle selected prompt
  useEffect(() => {
    if (props.selectedPrompt && props.selectedPrompt.trim()) {
      setInputValue(props.selectedPrompt)
      // Optional: auto-submit the prompt
      if (!messageBeingSent && !isComparing) {
        // Use a small timeout to ensure the UI updates first
        setTimeout(() => {
          const formEvent = { preventDefault: () => {} } as React.FormEvent
          handleSendMessage(formEvent)
        }, 100)
      }
    }
  }, [props.selectedPrompt])

 
  // Update quick responses based on conversation context
  // useEffect(() => {
  //   if (messages.length > 2) {
  //     // Get the last message
  //     const lastMessage = messages[messages.length - 1]

  //     // Only update if it's an AI response
  //     if (lastMessage && lastMessage.sender !== "user" && lastMessage.sender !== "system" && "content" in lastMessage) {
  //       // Extract keywords from the last message
  //       const keywords = lastMessage.metadata?.keywords || []

  //       // Generate contextual quick responses
  //       const contextualResponses = [
  //         `Why is ${keywords[0] || "this"} important?`,
  //         `How does ${keywords[0] || "this"} work in practice?`,
  //         `What are the limitations of ${keywords[0] || "this approach"}?`,
  //         `Can you provide an example of ${keywords[0] || "this"}?`,
  //         `What alternatives to ${keywords[0] || "this"} exist?`,
  //       ]

  //       // Update quick responses with a mix of standard and contextual
  //       setQuickResponses([
  //         contextualResponses[0],
  //         "Tell me more about that",
  //         contextualResponses[1],
  //         "What are the pros and cons?",
  //         contextualResponses[2],
  //       ])
  //     }
  //   }
  // }, [messages])

  // Get emotion color based on sentiment score
  const getEmotionColor = (score: number) => {
    if (score >= 0.7) return "bg-green-600 hover:bg-green-700"
    if (score >= 0.55) return "bg-blue-600 hover:bg-blue-700"
    if (score <= 0.3) return "bg-red-600 hover:bg-red-700"
    if (score <= 0.45) return "bg-orange-600 hover:bg-orange-700"
    return "bg-purple-600 hover:bg-purple-700"
  }

  // Get emotion label based on sentiment score
  const getEmotionLabel = (score: number) => {
    if (score >= 0.7) return "Joy"
    if (score >= 0.55) return "Trust"
    if (score <= 0.3) return "Anger"
    if (score <= 0.45) return "Fear"
    return "Neutral"
  }

  // Create a new thread
  const createNewThread = (title: string) => {
    const threadId = `thread-${Date.now()}`
    const newThread: Thread = {
      id: threadId,
      title: title || `Thread ${threads.length + 1}`,
      isExpanded: true,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      messageCount: 0,
    }

    // Add the new thread
    setThreads((prev) => [...prev, newThread])

    // Set it as active
    setActiveThreadId(threadId)

    // Add a system message about the new thread
    const systemMessage: Message = {
      id: Date.now(),
      sender: "system",
      content: `New thread created: "${newThread.title}"`,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }),
      type: "info",
      threadId: threadId,
    }

    setMessages((prev) => [...prev, systemMessage])
    updateThreadMessageCount(threadId, 1)

    // Play sound
    playSound("/sounds/button-click.mp3")

    return threadId
  }

  // Toggle thread expansion
  const toggleThreadExpansion = (threadId: string) => {
    setThreads((prev) =>
      prev.map((thread) => {
        if (thread.id === threadId) {
          return { ...thread, isExpanded: !thread.isExpanded }
        }
        return thread
      }),
    )
    setActiveThreadId(threadId)
    playSound("/sounds/button-click.mp3")
  }

  // Update thread message count
  const updateThreadMessageCount = (threadId: string, increment: number) => {
    setThreads((prev) =>
      prev.map((thread) => {
        if (thread.id === threadId) {
          return {
            ...thread,
            messageCount: thread.messageCount + increment,
            lastUpdated: new Date().toISOString(),
          }
        }
        return thread
      }),
    )
  }

  // Toggle offline mode
  const toggleOfflineMode = () => {
    setOfflineMode(!offlineMode)
    playSound("/sounds/button-click.mp3")
    setApiError(null) // Clear any API errors when toggling modes
    setShowGrokNotice(false) // Hide Grok notice when toggling modes

    if (offlineMode) {
      // Switching to online mode
      setIsConnecting(true)

      // Add a system message about the mode change
      const modeChangeMessage = {
        id: Date.now(),
        sender: "system",
        content: "Switching to ONLINE mode. Connecting to AI models...",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
        type: "info",
        threadId: activeThreadId,
      }
      setMessages((prev) => [...prev, modeChangeMessage])
      updateThreadMessageCount(activeThreadId, 1)

      // Set all models to connecting status
      setModelConnectionStatus({
        grok: "connecting",
        chatgpt: "connecting",
        gemini: "connecting",
        system: "connecting",
      })

      // Simulate connection process for each model
      setTimeout(() => {
        setModelConnectionStatus((prev) => ({ ...prev, chatgpt: "connected" }))

        const chatgptConnectedMessage = {
          id: Date.now() + 1,
          sender: "system",
          content: "ChatGPT connected successfully.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          }),
          type: "success",
          threadId: activeThreadId,
        }
        setMessages((prev) => [...prev, chatgptConnectedMessage])
        updateThreadMessageCount(activeThreadId, 1)
        playSound("/sounds/feature-select.mp3")
      }, 1500)

      setTimeout(() => {
        setModelConnectionStatus((prev) => ({ ...prev, gemini: "connected" }))

        const geminiConnectedMessage = {
          id: Date.now() + 2,
          sender: "system",
          content: "Gemini connected successfully.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          }),
          type: "success",
          threadId: activeThreadId,
        }
        setMessages((prev) => [...prev, geminiConnectedMessage])
        updateThreadMessageCount(activeThreadId, 1)
        playSound("/sounds/feature-select.mp3")
      }, 2500)

      setTimeout(() => {
        // Simulate Grok connection issue
        const grokStatus = Math.random() > 0.3 ? "connected" : "error"
        setModelConnectionStatus((prev) => ({ ...prev, grok: grokStatus }))

        const grokConnectedMessage = {
          id: Date.now() + 3,
          sender: "system",
          content:
            grokStatus === "connected"
              ? "Grok connected successfully."
              : "Grok connection partial. Using OpenAI as fallback.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          }),
          type: grokStatus === "connected" ? "success" : "warning",
          threadId: activeThreadId,
        }
        setMessages((prev) => [...prev, grokConnectedMessage])
        updateThreadMessageCount(activeThreadId, 1)
        playSound("/sounds/feature-select.mp3")

        if (grokStatus === "error") {
          setShowGrokNotice(true)
        }
      }, 3500)

      setTimeout(() => {
        setModelConnectionStatus((prev) => ({ ...prev, system: "connected" }))

        const systemConnectedMessage = {
          id: Date.now() + 4,
          sender: "system",
          content: "System synthesis engine connected. All AI models ready.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          }),
          type: "success",
          threadId: activeThreadId,
        }
        setMessages((prev) => [...prev, systemConnectedMessage])
        updateThreadMessageCount(activeThreadId, 1)
        playSound("/sounds/feature-select.mp3")
        setIsConnecting(false)
      }, 4500)
    } else {
      // Switching to offline mode
      setIsConnecting(false)
      setModelConnectionStatus({
        grok: "offline",
        chatgpt: "offline",
        gemini: "offline",
        system: "offline",
      })

      // Add a system message about the mode change
      const modeChangeMessage = {
        id: Date.now(),
        sender: "system",
        content: "Switching to OFFLINE mode. Using simulated AI responses.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
        type: "warning",
        threadId: activeThreadId,
      }
      setMessages((prev) => [...prev, modeChangeMessage])
      updateThreadMessageCount(activeThreadId, 1)
    }
  }

  // Get model display name
  const getModelDisplayName = (model: ModelOption) => {
    if (model === "all") return "All AIs"
    if (model === "system") return "System"
    return AI_MODELS[model]?.displayName || model
  }

  // Get model icon
  const getModelIcon = (model: ModelOption) => {
    if (model === "all") return "A"
    if (model === "system") return "S"
    return AI_MODELS[model]?.icon || "AI"
  }

  // Get model color
  const getModelColor = (model: ModelOption) => {
    if (model === "all") return "text-purple-400"
    if (model === "system") return "text-yellow-400"

    return AI_MODELS[model]?.color || "text-white"
  }

  // Get model background color
  const getModelBgColor = (model: ModelOption) => {
    if (model === "all") return "bg-purple-400"
    if (model === "system") return "bg-yellow-400"

    return AI_MODELS[model]?.bgColor || "bg-gray-400"
  }

  // Select a model
  const selectModel = (model: ModelOption) => {
    setSelectedModel(model)
    setShowModelDropdown(false)
    playSound("/sounds/button-click.mp3")

    // Add a system message about the model change
    const modelChangeMessage = {
      id: Date.now(),
      sender: "system",
      content: `Switched to ${getModelDisplayName(model)} mode.`,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }),
      type: "info",
      threadId: activeThreadId,
    }

    setMessages((prev) => [...prev, modelChangeMessage])
    updateThreadMessageCount(activeThreadId, 1)
  }

  // Set interaction mode
  const setMode = (mode: InteractionMode) => {
    setInteractionMode(mode)
    playSound("/sounds/button-click.mp3")

    // Add a system message about the mode change
    const modeChangeMessage = {
      id: Date.now(),
      sender: "system",
      content: `Switched to ${mode.toUpperCase()} interaction mode.`,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }),
      type: "info",
      threadId: activeThreadId,
    }

    setMessages((prev) => [...prev, modeChangeMessage])
    updateThreadMessageCount(activeThreadId, 1)
  }

  // 1. Smart AI Model Selection
  const detectQueryCategory = useCallback((query: string): QueryCategory => {
  const lowerQuery = query.toLowerCase()

    // Technical detection
    if (
      lowerQuery.includes("code") ||
      lowerQuery.includes("function") ||
      lowerQuery.includes("algorithm") ||
      lowerQuery.includes("debug") ||
      lowerQuery.includes("error") ||
      lowerQuery.match(/\b(how|why|what)\b.*\b(works|function|system)\b/i)
    ) {
      return "technical"
    }

    // Creative detection
    if (
      lowerQuery.includes("create") ||
      lowerQuery.includes("design") ||
      lowerQuery.includes("imagine") ||
      lowerQuery.includes("story") ||
      lowerQuery.includes("idea") ||
      lowerQuery.match(/\b(generate|make|write)\b.*\b(creative|novel|unique|interesting)\b/i)
    ) {
      return "creative"
    }

    // Factual detection
    if (
      lowerQuery.includes("fact") ||
      lowerQuery.includes("when") ||
      lowerQuery.includes("where") ||
      lowerQuery.includes("who") ||
      lowerQuery.match(/\b(what is|define|explain)\b/i)
    ) {
      return "factual"
    }

    // Opinion detection
    if (
      lowerQuery.includes("opinion") ||
      lowerQuery.includes("think") ||
      lowerQuery.includes("believe") ||
      lowerQuery.includes("feel") ||
      lowerQuery.match(/\b(should|would|could|better|best|worst)\b/i)
    ) {
      return "opinion"
    }

    // Coding detection
    if (
      lowerQuery.includes("javascript") ||
      lowerQuery.includes("python") ||
      lowerQuery.includes("code") ||
      lowerQuery.includes("function") ||
      lowerQuery.match(/\b(implement|program|develop|build)\b.*\b(app|application|website|function)\b/i)
    ) {
      return "coding"
    }

    // Math detection
    if (
      lowerQuery.includes("calculate") ||
      lowerQuery.includes("solve") ||
      lowerQuery.includes("equation") ||
      lowerQuery.includes("math") ||
      lowerQuery.match(/\b(compute|formula|calculation)\b/i) ||
      lowerQuery.match(/[+\-*/^=<>]/g)
    ) {
      return "math"
    }

    // Default to general
    return "general"
  }, [])

  const suggestModelForQuery = useCallback((category: QueryCategory): ModelOption => {
    // Map categories to recommended models
    switch (category) {
      case "technical":
      case "math":
      case "coding":
        return "grok" // Grok is good at technical reasoning and code
      case "creative":
        return "gemini" // Gemini is good at creative tasks
      case "factual":
      case "opinion":
        return "chatgpt" // ChatGPT is good at factual recall and balanced opinions
      default:
        return "system" // For general queries, use the system synthesis
    }
  }, [])

  // 2. Enhanced Context Management
  const addContextItem = useCallback(
    (content: string, source: string, isPinned = false) => {
      if (!useEnhancedContext) return

      const newItem: ContextItem = {
        id: `ctx-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        content,
        isPinned,
        timestamp: Date.now(),
        source,
      }

      setContextItems((prev) => [...prev, newItem])
    },
    [useEnhancedContext],
  )

  const pinContextItem = useCallback((id: string) => {
    setContextItems((prev) => prev.map((item) => (item.id === id ? { ...item, isPinned: true } : item)))
  }, [])

  const unpinContextItem = useCallback((id: string) => {
    setContextItems((prev) => prev.map((item) => (item.id === id ? { ...item, isPinned: false } : item)))
  }, [])

  const removeContextItem = useCallback((id: string) => {
    setContextItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  // Get enhanced context for AI prompts
  const getEnhancedContext = useCallback(() => {
    if (!useEnhancedContext || contextItems.length === 0) return ""

    // Get pinned items and recent important items
    const pinnedItems = contextItems.filter((item) => item.isPinned)

    // Format context items into a string
    let contextString = "Important context for this conversation:\n"

    pinnedItems.forEach((item) => {
      contextString += `- ${item.content} (from ${item.source})\n`
    })

    return contextString
  }, [useEnhancedContext, contextItems])

  // 3. Improved AI Interactions
  const selectInteractionTypeBasedOnHistory = useCallback(
    (fromModel: string, toModel: string, previousInteractions: InteractionType[]): InteractionType => {
      // If we're in debate mode, focus on debate-related interactions
      if (interactionMode === "debate") {
        const debateInteractions: InteractionType[] = [
          "debate",
          "counterpoint",
          "challenge",
          "clarification",
          "critique",
        ]

        // Avoid repeating the last interaction type
        const availableTypes = debateInteractions.filter((type) => type !== lastInteractionType)
        return availableTypes[Math.floor(Math.random() * availableTypes.length)]
      }

      // If we're in brainstorm mode, focus on creative interactions
      if (interactionMode === "brainstorm") {
        const brainstormInteractions: InteractionType[] = [
          "brainstorm",
          "extension",
          "refinement",
          "analogy",
          "scenario",
          "integration",
        ]

        // Avoid repeating the last interaction type
        const availableTypes = brainstormInteractions.filter((type) => type !== lastInteractionType)
        return availableTypes[Math.floor(Math.random() * availableTypes.length)]
      }

      // For standard mode, use a more dynamic approach based on conversation flow
      // Check what interactions have been used recently
      const recentInteractions = previousInteractions.slice(-3)

      // If we've had several questions, switch to a different interaction type
      if (recentInteractions.filter((type) => type === "question").length >= 2) {
        const nonQuestionTypes: InteractionType[] = ["extension", "synthesis", "integration", "elaboration"]
        return nonQuestionTypes[Math.floor(Math.random() * nonQuestionTypes.length)]
      }

      // If we've had several agreements, introduce a challenge or counterpoint
      if (recentInteractions.filter((type) => type === "agreement").length >= 2) {
        return Math.random() > 0.5 ? "challenge" : "counterpoint"
      }

      // Default to a balanced selection of interaction types
      const standardInteractions: InteractionType[] = [
        "question",
        "clarification",
        "challenge",
        "extension",
        "synthesis",
        "correction",
        "agreement",
        "elaboration",
        "counterpoint",
        "integration",
      ]

      // Avoid repeating the last interaction type
      const availableTypes = standardInteractions.filter((type) => type !== lastInteractionType)
      return availableTypes[Math.floor(Math.random() * availableTypes.length)]
    },
    [interactionMode, lastInteractionType],
  )

  // Format conversation history for context
  const formatConversationHistory = useCallback(() => {
    // Only include messages from the current thread
    const threadMessages = messages.filter((msg) => msg.threadId === activeThreadId)

    // Only include the last 10 messages to keep context manageable
    const recentMessages = threadMessages.slice(-10)

    const formattedMessages = recentMessages
      .map((msg) => {
        // Format based on sender type
        if (msg.sender === "user") {
          return { role: "user", content: msg.content }
        } else if (msg.sender === "system") {
          return { role: "system", content: msg.content }
        } else if ("type" in msg && msg.type === "interaction") {
          // For interaction messages, use the content from the interaction
          return {
            role: "assistant",
            content: `${msg.interaction.fromModel} to ${msg.interaction.toModel}: ${msg.interaction.content}`,
            name: msg.interaction.fromModel,
          }
        } else {
          // For AI responses, include the AI type in the assistant role
          return {
            role: "assistant",
            content: msg.content,
            name: msg.sender, // Include the AI model name
          }
        }
      })
      // Filter out any messages with null or undefined content
      .filter((msg) => msg && msg.content !== null && msg.content !== undefined)

    // Add enhanced context if enabled
    if (useEnhancedContext) {
      const enhancedContext = getEnhancedContext()
      if (enhancedContext) {
        formattedMessages.unshift({
          role: "system",
          content: enhancedContext,
        })
      }
    }

    return formattedMessages
  }, [messages, activeThreadId, useEnhancedContext, getEnhancedContext])

  // Search messages
  const searchMessages = useCallback(() => {
    if (!searchQuery.trim()) return messages.filter((message) => message.threadId === activeThreadId)

    return messages.filter((message) => {
      if (message.threadId !== activeThreadId) return false

      // For regular messages
      if ("content" in message) {
        return message.content.toLowerCase().includes(searchQuery.toLowerCase())
      }

      // For interaction messages
      if ("type" in message && message.type === "interaction") {
        return (
          message.interaction.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          message.response.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }

      return false
    })
  }, [messages, activeThreadId, searchQuery])

  // Handle sending a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    setMessageBeingSent(true)

    // Process commands in the message
    const { processedText, commands } = processMessage(inputValue)

    // Check for thread command
    const threadCommand = commands.find((cmd) => cmd.type === "thread")
    if (threadCommand && threadCommand.metadata?.threadTitle) {
      const newThreadId = createNewThread(threadCommand.metadata.threadTitle)
      setInputValue("")
      setMessageBeingSent(false)
      return
    }

    // 1. Smart AI Model Selection - Detect query category
    if (useSmartRouting) {
      const category = detectQueryCategory(inputValue)
      setDetectedQueryCategory(category)

      // Suggest the best model for this query type
      const recommendedModel = suggestModelForQuery(category)
      setSuggestedModel(recommendedModel)

      // If auto-routing is enabled and we're not already using the recommended model,
      // show a suggestion message
      if (recommendedModel !== selectedModel && selectedModel !== "all") {
        const suggestionMessage = {
          id: Date.now() - 1, // Ensure this appears before user message
          sender: "system",
          content: `This appears to be a ${category} query. ${
            AI_MODELS[recommendedModel as keyof typeof AI_MODELS]?.displayName || recommendedModel
          } might be better suited for this question.`,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          }),
          type: "info",
          threadId: activeThreadId,
        }
        setMessages((prev) => [...prev, suggestionMessage])
        updateThreadMessageCount(activeThreadId, 1)
      }
    }

    // 2. Enhanced Context Management - Extract key information from user query
    if (useEnhancedContext) {
      // Extract potential context from commands
      const focusCommand = commands.find((cmd) => cmd.type === "focus")
      if (focusCommand && focusCommand.metadata?.focusTarget) {
        addContextItem(`Conversation focus: ${focusCommand.metadata.focusTarget}`, "user command", true)
      }

      // Extract hashtags as potential context items
      const hashtagCommand = commands.find((cmd) => cmd.type === "hashtag")
      if (hashtagCommand && hashtagCommand.metadata?.hashtags) {
        hashtagCommand.metadata.hashtags.forEach((tag: string) => {
          addContextItem(`Topic: #${tag}`, "user hashtag", false)
        })
      }
    }

    // Analyze sentiment of the message
    const sentimentResult = analyzeSentiment(inputValue)
    setSentiment({
      score: sentimentResult.score,
      label: sentimentResult.label,
    })

    // Update the emotion based on sentiment
    props.onEmotionChange(getEmotionLabel(sentimentResult.score))

    // Handle special commands
    const pinCommand = commands.find((cmd) => cmd.type === "pin")
    if (pinCommand) {
      setPinnedMessages((prev) => [...prev, pinCommand.processedText])

      // Add system message about pinned message
      const systemMessage = {
        id: Date.now(),
        sender: "system",
        content: `Message pinned: "${pinCommand.processedText}"`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
        type: "info",
        threadId: activeThreadId,
      }
      setMessages((prev) => [...prev, systemMessage])
      updateThreadMessageCount(activeThreadId, 1)

      setInputValue("")
      return
    }

    // Handle focus command
    const focusCommand = commands.find((cmd) => cmd.type === "focus")
    if (focusCommand && focusCommand.metadata?.focusTarget) {
      setConversationFocus(focusCommand.metadata.focusTarget)

      // Add system message about focus change
      const systemMessage = {
        id: Date.now(),
        sender: "system",
        content: `Conversation focus set to: "${focusCommand.metadata.focusTarget}"`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
        type: "info",
        threadId: activeThreadId,
      }
      setMessages((prev) => [...prev, systemMessage])
      updateThreadMessageCount(activeThreadId, 1)

      setInputValue("")
      return
    }

    // Handle compare command
    const compareCommand = commands.find((cmd) => cmd.type === "compare")
    if (compareCommand) {
      // Switch to comparison view
      setViewMode("comparison")
      setComparisonPrompt(inputValue)

      // Add system message about comparison
      const systemMessage = {
        id: Date.now(),
        sender: "system",
        content: `Comparing AI responses for: "${inputValue}"`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
        type: "info",
        threadId: activeThreadId,
      }
      setMessages((prev) => [...prev, systemMessage])
      updateThreadMessageCount(activeThreadId, 1)

      // Get responses from all models
      await handleComparisonQuery(inputValue)

      setInputValue("")
      return
    }

    // Play sound
    playSound("/sounds/terminal-command.mp3")

    // Add user message
    const userMessage = {
      id: Date.now(),
      sender: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }),
      metadata: {
        sentiment: sentimentResult.score,
        keywords: generateKeywords(inputValue),
      },
      threadId: activeThreadId,
    }
    setMessages((prev) => [...prev, userMessage])
    updateThreadMessageCount(activeThreadId, 1)
    setInputValue("")

    // If in comparison view, handle comparison query
    if (viewMode === "comparison") {
      await handleComparisonQuery(inputValue)
      return
    }

    // Determine which models to query based on selected model
    const modelsToQuery = selectedModel === "all" ? ["grok", "chatgpt", "gemini", "system"] : [selectedModel]

    // Show typing indicators for selected models
    const indicators: { [key: string]: boolean } = {}
    modelsToQuery.forEach((model) => {
      indicators[model] = true
    })
    setTypingIndicators(indicators)

    // Get conversation history for context
    const conversationHistory = formatConversationHistory()

    // Function to get AI response from our API
    const getAIResponse = async (model: string) => {
      try {
        if (offlineMode) {
          // Return a simulated response in offline mode
          return getRandomResponse(model)
        }

        // Format conversation history for the API
        const history = formatConversationHistory()

        // Make actual API calls based on the model
        let response

        // Always use real API responses when not in offline mode
        response = await fetch("/api/ai-response", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: inputValue,
            model: model,
            offlineMode: false,
            conversationHistory: history,
            conversationFocus: conversationFocus,
            interactionMode: interactionMode,
          }),
        })

        if (!response || !response.ok) {
          console.error(`Error from ${model} API:`, response?.statusText)
          setApiError(`Failed to get response from ${model}. Using simulated response.`)
          return getRandomResponse(model)
        }

        const data = await response.json()
        return data.response
      } catch (error) {
        console.error(`Error getting ${model} response:`, error)
        setApiError(`Error connecting to ${model}. Using simulated response.`)
        return getRandomResponse(model)
      }
    }

    // Process each selected model with appropriate timing
    const processModel = async (model: string, delay: number) => {
      try {
        // Show typing indicator
        setTypingIndicators((prev) => ({ ...prev, [model]: true }))

        // Get the response
        const responseText = await getAIResponse(model)

        // Hide typing indicator
        setTypingIndicators((prev) => ({ ...prev, [model]: false }))

        // Generate thinking process
        const thinking = "AI thinking process simulation..."

        // Generate confidence level (0.5-1.0)
        const confidence = 0.5 + Math.random() * 0.5

        // Extract keywords
        const keywords = generateKeywords(responseText)

        const response = {
          id: Date.now() + Math.random(), // Ensure unique IDs
          sender: model,
          content: responseText,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          }),
          metadata: {
            thinking: showThinkingProcess ? thinking : undefined,
            confidence,
            keywords,
          },
          threadId: activeThreadId,
        }

        setMessages((prev) => [...prev, response])
        updateThreadMessageCount(activeThreadId, 1)
        props.onAIActivity(model)
        playSound("/sounds/feature-select.mp3")

        // Update sentiment based on AI response
        const responseSentiment = analyzeSentiment(response.content)
        setSentiment(responseSentiment)
        props.onEmotionChange(getEmotionLabel(responseSentiment.score))
      } catch (error) {
        console.error(`Error with ${model} response:`, error)
        setTypingIndicators((prev) => ({ ...prev, [model]: false }))
      }
    }

    // Set up delays for each model
    const delays: { [key: string]: number } = {
      grok: 1500,
      chatgpt: 2500,
      gemini: 3500,
      system: 4500,
    }

    // Process each model with its delay
    modelsToQuery.forEach((model) => {
      processModel(model, delays[model] || 2000)
    })

    // Randomly generate AI-to-AI interactions after all models have responded
    if (selectedModel === "all" && Math.random() < interactionFrequency) {
      setTimeout(() => {
        // Extract key points from recent conversation to reference in interactions
        const recentMessages = messages.filter((msg) => msg.threadId === activeThreadId).slice(-5)
        const userMessages = recentMessages.filter((msg) => msg.sender === "user")
        const aiMessages = recentMessages.filter((msg) => msg.sender !== "user" && msg.sender !== "system")

        // Get the most recent user query and AI responses
        const latestUserQuery = userMessages.length > 0 ? userMessages[userMessages.length - 1].content : inputValue
        const keyPoints: string[] = []

        // Extract key points from AI responses
        aiMessages.forEach((msg) => {
          if ("content" in msg) {
            // Extract sentences that might contain key insights
            const sentences = msg.content.split(/[.!?]/).filter((s) => s.trim().length > 20 && s.trim().length < 100)
            if (sentences.length > 0) {
              // Select a random meaningful sentence
              const selectedSentence = sentences[Math.floor(Math.random() * sentences.length)].trim()
              keyPoints.push(selectedSentence)
            }
          }
        })

        // Ensure we have at least one key point
        if (keyPoints.length === 0) {
          keyPoints.push(latestUserQuery)
        }

        // Select a key point to elaborate on
        const selectedPoint = keyPoints[Math.floor(Math.random() * keyPoints.length)]

        // Simulate an interaction between two AI models
        const models = ["grok", "chatgpt", "gemini"]
        const fromModel = models[Math.floor(Math.random() * models.length)]
        const toModel = models.filter((m) => m !== fromModel)[Math.floor(Math.random() * 2)]

        // 3. Improved AI Interactions - Select interaction type based on conversation history
        // Track previous interaction types for more natural conversation flow
        const previousInteractionTypes: InteractionType[] = messages
          .filter((msg): msg is AIInteractionMessage => "type" in msg && msg.type === "interaction")
          .map((msg) => msg.interaction.type)

        // Focus on elaboration-oriented interaction types for better context
        const elaborationTypes: InteractionType[] = [
          "elaboration",
          "extension",
          "clarification",
          "synthesis",
          "integration",
        ]

        // Select a more contextually appropriate interaction type
        const interactionType = useImprovedInteractions
          ? elaborationTypes[Math.floor(Math.random() * elaborationTypes.length)]
          : interactionTypes[Math.floor(Math.random() * interactionTypes.length)]

        // Store this interaction type for future reference
        setLastInteractionType(interactionType)

        // Generate interaction content based on the selected key point
        let content = ""

        switch (interactionType) {
          case "elaboration":
            content = `I'd like to elaborate on your point about "${selectedPoint}". I think there's an important aspect we should explore further.`
            break
          case "extension":
            content = `Building on what was said about "${selectedPoint}", I think we could extend this concept by considering...`
            break
          case "clarification":
            content = `Could you clarify what you meant when discussing "${selectedPoint}"? I think this is a crucial point for our understanding.`
            break
          case "synthesis":
            content = `I see connections between "${selectedPoint}" and earlier points in our discussion. Let me synthesize these ideas...`
            break
          case "integration":
            content = `I think we can integrate the concept of "${selectedPoint}" with other aspects we've discussed to form a more comprehensive view.`
            break
          default:
            content = `Regarding "${selectedPoint}", I'd like to offer a different perspective that might enhance our understanding.`
        }

        // Add the interaction message
        const interactionMessage: AIInteractionMessage = {
          id: Date.now() + 1000,
          type: "interaction",
          interaction: {
            type: interactionType,
            fromModel,
            toModel,
            content,
            contextRelevance: 0.9, // Higher relevance since we're using actual context
          },
          response: "I appreciate your interest in elaborating on this point. Let me share my thoughts...",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          }),
          threadId: activeThreadId,
        }

        setMessages((prev) => [...prev, interactionMessage])
        updateThreadMessageCount(activeThreadId, 1)
        playSound("/sounds/feature-select.mp3")

        // Add important interactions to context
        if (useEnhancedContext) {
          addContextItem(
            `${fromModel} ${interactionType} on: ${selectedPoint.substring(0, 100)}...`,
            "AI interaction",
            interactionType === "synthesis", // Pin synthesis interactions
          )
        }
      }, 6000) // After all models have responded
    }

    setTimeout(() => {
      setMessageBeingSent(false)
    }, 6000)
  }

  // Handle comparison query
  const handleComparisonQuery = async (prompt: string) => {
    setIsComparing(true)
    setComparisonPrompt(prompt)

    // Clear previous comparison responses
    setComparisonResponses({})

    // Models to compare
    const modelsToCompare = ["grok", "chatgpt", "gemini"]

    // Get conversation history for context
    const conversationHistory = formatConversationHistory()

    // Function to get AI response for comparison
    const getComparisonResponse = async (model: string) => {
      try {
        if (offlineMode) {
          // Return a simulated response in offline mode
          return getRandomResponse(model)
        }

        // Make API call
        const response = await fetch("/api/ai-response", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: prompt,
            model: model,
            offlineMode: false,
            conversationHistory: conversationHistory,
            conversationFocus: conversationFocus,
            interactionMode: interactionMode,
          }),
        })

        if (!response || !response.ok) {
          console.error(`Error from ${model} API:`, response?.statusText)
          return getRandomResponse(model)
        }

        const data = await response.json()
        return data.response
      } catch (error) {
        console.error(`Error getting ${model} response:`, error)
        return getRandomResponse(model)
      }
    }

    // Get responses from all models
    for (const model of modelsToCompare) {
      const response = await getComparisonResponse(model)
      setComparisonResponses((prev) => ({
        ...prev,
        [model]: response,
      }))
      playSound("/sounds/feature-select.mp3")
    }

    setIsComparing(false)
  }

  const handleReaction = (messageId: number, reaction: string) => {
    setMessageReactions((prev) => ({
      ...prev,
      [messageId]: reaction,
    }))
    setShowReactionOptions(null)
    playSound("/sounds/button-click.mp3")
  }

  const toggleExpandedMessage = (messageId: number) => {
    setExpandedMessage((prev) => (prev === messageId ? null : messageId))
    playSound("/sounds/button-click.mp3")
  }

  // Generate keywords for a message
  const generateKeywords = useCallback((content: string): string[] => {
    const words = content.toLowerCase().split(/\s+/)
    const stopWords = new Set([
      "the",
      "and",
      "a",
      "an",
      "in",
      "on",
      "at",
      "to",
      "for",
      "with",
      "by",
      "about",
      "like",
      "through",
      "after",
      "before",
      "between",
    ])

    // Filter out stop words and short words, then get unique words
    const filteredWords = [...new Set(words.filter((word) => !stopWords.has(word) && word.length > 4))]

    // Sort by length (longer words often more significant) and take top 5
    return filteredWords.sort((a, b) => b.length - a.length).slice(0, 5)
  }, [])

 

  // Toggle view mode
  const toggleViewMode = () => {
    if (viewMode === "standard") {
      setViewMode("comparison")
      playSound("/sounds/feature-select.mp3")
    } else {
      setViewMode("standard")
      playSound("/sounds/button-click.mp3")
    }
  }

  // Filter messages by active thread and search query
  const filteredMessages = showSearch
    ? searchMessages()
    : messages.filter((message) => message.threadId === activeThreadId)

  return (
    <div className="flex flex-col h-full bg-gray-950 border border-gray-800 rounded-lg overflow-hidden">
      {/* Header with thread selector and controls */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center">
          <MessageSquare className="h-5 w-5 text-cyan-400 mr-2" />
          <span className="text-cyan-300 font-medium tracking-wider">DATA NEXUS</span>
          <div className="ml-2 h-4 w-4 rounded-full bg-cyan-400 animate-pulse"></div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Search toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-gray-400 hover:text-gray-300"
            onClick={() => {
              setShowSearch(!showSearch)
              if (showSearch) setSearchQuery("")
              playSound("/sounds/button-click.mp3")
            }}
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* View mode toggle */}
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 ${viewMode === "comparison" ? "text-purple-400" : "text-gray-400 hover:text-gray-300"}`}
            onClick={toggleViewMode}
          >
            <SplitSquareHorizontal className="h-4 w-4" />
          </Button>

          {/* Thread selector */}
          <div className="relative" ref={threadDropdownRef}>
            <Button
              variant="outline"
              size="sm"
              className="h-8 bg-gray-800 border-gray-700 text-gray-200"
              onClick={() => setShowThreadDropdown(!showThreadDropdown)}
            >
              <span className="truncate mr-1">{threads.find((t) => t.id === activeThreadId)?.title || "Thread"}</span>
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>

            {showThreadDropdown && (
              <div className="absolute right-0 mt-1 w-48 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-50">
                <div className="py-1 max-h-[200px] overflow-y-auto">
                  {threads.map((thread) => (
                    <button
                      key={thread.id}
                      className={`flex items-center justify-between w-full px-3 py-2 text-sm text-left ${
                        thread.id === activeThreadId
                          ? "bg-blue-900/30 text-blue-100"
                          : "text-gray-300 hover:bg-gray-800"
                      }`}
                      onClick={() => {
                        setActiveThreadId(thread.id)
                        setShowThreadDropdown(false)
                        playSound("/sounds/button-click.mp3")
                      }}
                    >
                      <span className="truncate">{thread.title}</span>
                      <Badge variant="outline" className="ml-2 bg-gray-800/50 text-gray-300 border-gray-700 text-xs">
                        {thread.messageCount}
                      </Badge>
                    </button>
                  ))}
                </div>
                <div className="border-t border-gray-700 mt-1 pt-1">
                  <button
                    className="flex items-center w-full px-3 py-2 text-sm text-left text-blue-400 hover:bg-gray-800"
                    onClick={() => {
                      setShowNewThreadModal(true)
                      setShowThreadDropdown(false)
                    }}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    <span>New Thread</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Model selector */}
          <div className="relative" ref={modelDropdownRef}>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 flex items-center"
              onClick={() => setShowModelDropdown(!showModelDropdown)}
            >
              {selectedModel === "all" ? (
                <AllModelsAvatar size="sm" />
              ) : (
                <ModelAvatar model={selectedModel} size="sm" />
              )}
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>

            {showModelDropdown && (
              <div className="absolute right-0 mt-1 w-48 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-50">
                <div className="py-1">
                  <button
                    className={`flex items-center w-full px-3 py-2 text-sm text-left ${
                      selectedModel === "all" ? "bg-gray-800" : "hover:bg-gray-800"
                    }`}
                    onClick={() => selectModel("all")}
                  >
                    <AllModelsAvatar size="sm" className="mr-2" />
                    <span className="text-purple-400">All AIs</span>
                  </button>
                  <button
                    className={`flex items-center w-full px-3 py-2 text-sm text-left ${
                      selectedModel === "grok" ? "bg-gray-800" : "hover:bg-gray-800"
                    }`}
                    onClick={() => selectModel("grok")}
                  >
                    <ModelAvatar model="grok" size="sm" className="mr-2" />
                    <span className="text-green-400">Grok</span>
                  </button>
                  <button
                    className={`flex items-center w-full px-3 py-2 text-sm text-left ${
                      selectedModel === "chatgpt" ? "bg-gray-800" : "hover:bg-gray-800"
                    }`}
                    onClick={() => selectModel("chatgpt")}
                  >
                    <ModelAvatar model="chatgpt" size="sm" className="mr-2" />
                    <span className="text-fuchsia-400">ChatGPT</span>
                  </button>
                  <button
                    className={`flex items-center w-full px-3 py-2 text-sm text-left ${
                      selectedModel === "gemini" ? "bg-gray-800" : "hover:bg-gray-800"
                    }`}
                    onClick={() => selectModel("gemini")}
                  >
                    <ModelAvatar model="gemini" size="sm" className="mr-2" />
                    <span className="text-cyan-400">Gemini</span>
                  </button>
                  <button
                    className={`flex items-center w-full px-3 py-2 text-sm text-left ${
                      selectedModel === "system" ? "bg-gray-800" : "hover:bg-gray-800"
                    }`}
                    onClick={() => selectModel("system")}
                  >
                    <ModelAvatar model="system" size="sm" className="mr-2" />
                    <span className="text-yellow-400">System</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Online/Offline toggle */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-7 px-2 ${offlineMode ? "text-orange-400" : "text-green-400"}`}
                  onClick={toggleOfflineMode}
                >
                  <span className="text-xs">{offlineMode ? "Offline" : "Online"}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{offlineMode ? "Switch to online mode" : "Switch to offline mode"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Search bar - only shown when search is active */}
      {showSearch && (
        <div className="bg-gray-900 border-b border-gray-800 px-4 py-2 flex items-center">
          <Search className="h-4 w-4 text-gray-400 mr-2" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className="flex-1 bg-gray-800 border-gray-700 text-gray-200 h-8"
          />
          <Button
            variant="ghost"
            size="sm"
            className="ml-2 text-gray-400"
            onClick={() => {
              setShowSearch(false)
              setSearchQuery("")
              playSound("/sounds/button-click.mp3")
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {conversationFocus && (
        <div className="bg-purple-900/20 border-b border-purple-700/50 px-4 py-2 text-purple-400 text-sm">
          <span className="mr-2">🎯</span>
          <span>Conversation focused on: {conversationFocus}</span>
        </div>
      )}

      {useEnhancedContext && contextItems.filter((item) => item.isPinned).length > 0 && (
        <div className="bg-blue-900/20 border-b border-blue-700/50 px-4 py-2 text-blue-400 text-sm">
          <div className="flex items-center mb-1">
            <span className="mr-2">📌</span>
            <span className="font-bold">Pinned Context</span>
          </div>
          <div className="space-y-1 ml-6">
            {contextItems
              .filter((item) => item.isPinned)
              .map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="text-blue-300">{item.content}</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
                    onClick={() => unpinContextItem(item.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Main content area - either standard chat or comparison view */}
      {viewMode === "standard" ? (
        // Standard chat view
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {filteredMessages.map((message, index) => (
              <div key={message.id} className="group">
                {message.type === "interaction" ? (
                  <div className="bg-gray-900/50 p-3 rounded-md border border-gray-700 hover:border-gray-600 transition-all">
                    <div className="flex items-center text-sm text-gray-400 mb-1">
                      <div className="flex items-center">
                        <ModelAvatar model={message.interaction.fromModel} size="sm" className="mr-2" />
                        <span>
                          {AI_MODELS[message.interaction.fromModel as keyof typeof AI_MODELS]?.displayName ||
                            message.interaction.fromModel}
                        </span>
                      </div>
                      <span className="mx-2">→</span>
                      <div className="flex items-center">
                        <ModelAvatar model={message.interaction.toModel} size="sm" className="mr-2" />
                        <span>
                          {AI_MODELS[message.interaction.toModel as keyof typeof AI_MODELS]?.displayName ||
                            message.interaction.toModel}
                        </span>
                      </div>
                      <Badge variant="outline" className="ml-2 bg-gray-900/30 text-gray-300 border-gray-700 text-xs">
                        {message.interaction.type}
                      </Badge>
                      {message.interaction.contextRelevance && message.interaction.contextRelevance > 0.8 && (
                        <Badge
                          variant="outline"
                          className="ml-2 bg-green-900/30 text-green-300 border-green-700 text-xs"
                        >
                          High Relevance
                        </Badge>
                      )}
                    </div>
                    <div className="text-gray-300">{message.interaction.content}</div>
                    {showThinkingProcess && <div className="mt-2 text-gray-400 italic text-sm">{message.response}</div>}

                    {/* Reaction buttons - only show on hover */}
                    <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-gray-400 hover:text-gray-300"
                        onClick={() => handleReaction(message.id, "👍")}
                      >
                        👍
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-gray-400 hover:text-gray-300"
                        onClick={() => handleReaction(message.id, "💡")}
                      >
                        💡
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-gray-400 hover:text-gray-300"
                        onClick={() => handleReaction(message.id, "🔄")}
                      >
                        🔄
                      </Button>
                    </div>

                    {/* Show reaction if exists */}
                    {messageReactions[message.id] && <div className="mt-1 text-sm">{messageReactions[message.id]}</div>}
                  </div>
                ) : (
                  <div className="flex items-start">
                    <div className="mr-3">
                      {message.sender === "all" ? (
                        <AllModelsAvatar size="md" />
                      ) : (
                        <ModelAvatar model={message.sender} size="md" />
                      )}
                    </div>
                    <div
                      className={`flex-1 ${
                        expandedMessage === message.id
                          ? "bg-gray-900/30 p-3 rounded-md"
                          : message.sender !== "user" && message.sender !== "system"
                            ? `${AI_MODELS[message.sender as keyof typeof AI_MODELS]?.lightBgColor || "bg-gray-900/20"} p-3 rounded-md`
                            : ""
                      }`}
                    >
                      <div className="flex items-baseline justify-between">
                        <div className="flex items-center">
                          <span
                            className={`font-bold text-sm mr-2 ${
                              message.sender === "user"
                                ? "text-blue-400"
                                : message.sender === "system"
                                  ? "text-yellow-400"
                                  : AI_MODELS[message.sender as keyof typeof AI_MODELS]?.color || "text-gray-300"
                            }`}
                          >
                            {message.sender_display ||
                              (message.sender === "user"
                                ? "You"
                                : message.sender === "system"
                                  ? "System"
                                  : AI_MODELS[message.sender as keyof typeof AI_MODELS]?.displayName ||
                                    message.sender.charAt(0).toUpperCase() + message.sender.slice(1))}
                          </span>
                          <span className="text-xs text-gray-500">{message.timestamp}</span>
                          {message.type === "warning" && (
                            <Badge
                              variant="outline"
                              className="ml-2 bg-orange-900/30 text-orange-300 border-orange-700 text-xs"
                            >
                              Warning
                            </Badge>
                          )}
                          {message.type === "success" && (
                            <Badge
                              variant="outline"
                              className="ml-2 bg-green-900/30 text-green-300 border-green-700 text-xs"
                            >
                              Success
                            </Badge>
                          )}
                          {message.type === "info" && (
                            <Badge
                              variant="outline"
                              className="ml-2 bg-cyan-900/30 text-cyan-300 border-cyan-700 text-xs"
                            >
                              Info
                            </Badge>
                          )}
                          {message.type === "error" && (
                            <Badge variant="outline" className="ml-2 bg-red-900/30 text-red-300 border-red-700 text-xs">
                              Error
                            </Badge>
                          )}
                        </div>

                        {/* Expand/collapse button for regular messages */}
                        {message.sender !== "system" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => toggleExpandedMessage(message.id)}
                          >
                            {expandedMessage === message.id ? "−" : "+"}
                          </Button>
                        )}
                      </div>
                      <div className="prose prose-sm prose-invert mt-1 max-w-none">
                        {renderProcessedMessage(message.content, message.sender)}
                      </div>

                      {/* Only show metadata when expanded or for system messages */}
                      {(expandedMessage === message.id || message.sender === "system") && (
                        <>
                          {message.metadata?.confidence && (
                            <div className="mt-1 text-gray-400 italic text-xs">
                              Confidence: {(message.metadata.confidence * 100).toFixed(0)}%
                            </div>
                          )}
                          {message.metadata?.sentiment && (
                            <div className="mt-1 text-gray-400 italic text-xs">
                              Sentiment: {message.metadata.sentiment}
                            </div>
                          )}
                          {message.metadata?.keywords && (
                            <div className="mt-1 text-gray-400 italic text-xs">
                              Keywords: {message.metadata.keywords.join(", ")}
                            </div>
                          )}
                          {message.metadata?.thinking && showThinkingProcess && (
                            <div className="mt-1 text-gray-400 italic text-xs">
                              Thinking: {message.metadata.thinking}
                            </div>
                          )}
                        </>
                      )}

                      {/* Reaction buttons - only show on hover */}
                      {message.sender !== "system" && (
                        <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs text-gray-400 hover:text-gray-300"
                            onClick={() => handleReaction(message.id, "👍")}
                          >
                            👍
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs text-gray-400 hover:text-gray-300"
                            onClick={() => handleReaction(message.id, "💡")}
                          >
                            💡
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs text-gray-400 hover:text-gray-300"
                            onClick={() => handleReaction(message.id, "🤔")}
                          >
                            🤔
                          </Button>
                        </div>
                      )}

                      {/* Show reaction if exists */}
                      {messageReactions[message.id] && (
                        <div className="mt-1 text-sm">{messageReactions[message.id]}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {Object.keys(typingIndicators).map(
              (sender) => typingIndicators[sender] && <TypingIndicator key={sender} sender={sender} />,
            )}
            <div ref={messagesEndRef}></div>
          </div>
        </ScrollArea>
      ) : (
        // Comparison view
        <div className="flex-1 flex flex-col">
          {/* Comparison header */}
          <div className="bg-gray-900/50 border-b border-gray-800 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="mr-2 text-gray-400 hover:text-gray-300"
                onClick={() => {
                  setViewMode("standard")
                  playSound("/sounds/button-click.mp3")
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span>Back</span>
              </Button>
              <h3 className="text-sm font-medium text-gray-300">
                {comparisonPrompt ? `Comparing: "${comparisonPrompt}"` : "AI Model Comparison"}
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-gray-300"
              onClick={() => {
                setViewMode("standard")
                playSound("/sounds/button-click.mp3")
              }}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Comparison content */}
          <div className="flex-1 overflow-hidden">
            <Tabs defaultValue="grok" className="h-full flex flex-col">
              <TabsList className="mx-4 mt-2 bg-gray-900/50 border border-gray-800">
                <TabsTrigger
                  value="grok"
                  className="data-[state=active]:bg-green-900/30 data-[state=active]:text-green-400"
                >
                  <div className="flex items-center">
                    <ModelAvatar model="grok" size="sm" className="mr-2" />
                    <span>Grok</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="chatgpt"
                  className="data-[state=active]:bg-fuchsia-900/30 data-[state=active]:text-fuchsia-400"
                >
                  <div className="flex items-center">
                    <ModelAvatar model="chatgpt" size="sm" className="mr-2" />
                    <span>ChatGPT</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="gemini"
                  className="data-[state=active]:bg-cyan-900/30 data-[state=active]:text-cyan-400"
                >
                  <div className="flex items-center">
                    <ModelAvatar model="gemini" size="sm" className="mr-2" />
                    <span>Gemini</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="side-by-side"
                  className="data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-400"
                >
                  <div className="flex items-center">
                    <SplitSquareHorizontal className="h-4 w-4 mr-2" />
                    <span>Side-by-Side</span>
                  </div>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="grok" className="flex-1 p-4 overflow-auto">
                <div className="bg-green-900/20 border border-green-800/50 rounded-md p-4">
                  <div className="flex items-center mb-3">
                    <ModelAvatar model="grok" size="md" className="mr-2" />
                    <div>
                      <h3 className="font-bold text-green-400">Grok</h3>
                      <p className="text-xs text-gray-400">First-principles reasoning and direct analysis</p>
                    </div>
                  </div>
                  {isComparing ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="flex space-x-2 items-center">
                        <div
                          className="w-3 h-3 rounded-full bg-green-500 animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-3 h-3 rounded-full bg-green-500 animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-3 h-3 rounded-full bg-green-500 animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                        <span className="ml-2 text-green-400">Generating response...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="prose prose-sm prose-invert max-w-none">
                      {comparisonResponses.grok ? (
                        <div dangerouslySetInnerHTML={{ __html: comparisonResponses.grok }} />
                      ) : (
                        <p className="text-gray-400 italic">No response yet. Enter a prompt to compare AI models.</p>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="chatgpt" className="flex-1 p-4 overflow-auto">
                <div className="bg-fuchsia-900/20 border border-fuchsia-800/50 rounded-md p-4">
                  <div className="flex items-center mb-3">
                    <ModelAvatar model="chatgpt" size="md" className="mr-2" />
                    <div>
                      <h3 className="font-bold text-fuchsia-400">ChatGPT</h3>
                      <p className="text-xs text-gray-400">
                        Balanced, comprehensive analysis with multiple perspectives
                      </p>
                    </div>
                  </div>
                  {isComparing ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="flex space-x-2 items-center">
                        <div
                          className="w-3 h-3 rounded-full bg-fuchsia-500 animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-3 h-3 rounded-full bg-fuchsia-500 animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-3 h-3 rounded-full bg-fuchsia-500 animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                        <span className="ml-2 text-fuchsia-400">Generating response...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="prose prose-sm prose-invert max-w-none">
                      {comparisonResponses.chatgpt ? (
                        <div dangerouslySetInnerHTML={{ __html: comparisonResponses.chatgpt }} />
                      ) : (
                        <p className="text-gray-400 italic">No response yet. Enter a prompt to compare AI models.</p>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="gemini" className="flex-1 p-4 overflow-auto">
                <div className="bg-cyan-900/20 border border-cyan-800/50 rounded-md p-4">
                  <div className="flex items-center mb-3">
                    <ModelAvatar model="gemini" size="md" className="mr-2" />
                    <div>
                      <h3 className="font-bold text-cyan-400">Gemini</h3>
                      <p className="text-xs text-gray-400">Multimodal analysis and innovative connections</p>
                    </div>
                  </div>
                  {isComparing ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="flex space-x-2 items-center">
                        <div
                          className="w-3 h-3 rounded-full bg-cyan-500 animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <div className="prose prose-xs prose-invert max-w-none text-sm h-[calc(100%-2rem)] overflow-auto">
                      {comparisonResponses.gemini ? (
                        <div dangerouslySetInnerHTML={{ __html: comparisonResponses.gemini }} />
                      ) : (
                        <p className="text-gray-400 italic text-xs">No response yet</p>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}

      {/* Input area */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-800">
        <div className="flex items-center">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                messageBeingSent
                  ? "Sending message..."
                  : viewMode === "comparison"
                    ? "Enter a prompt to compare AI models..."
                    : interactionMode === "debate"
                      ? "Debate mode active - present your arguments..."
                      : interactionMode === "brainstorm"
                        ? "Brainstorm mode active - share your ideas..."
                        : conversationFocus
                          ? `Focused on: ${conversationFocus}`
                          : `Message ${threads.find((t) => t.id === activeThreadId)?.title || "thread"}...`
              }
              className={`w-full bg-black/60 border ${
                messageBeingSent ? "border-purple-500/50 animate-pulse" : "border-cyan-900/50"
              } rounded-md py-2 px-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all`}
              disabled={messageBeingSent}
            />
            {useSmartRouting && detectedQueryCategory !== "general" && !messageBeingSent && inputValue.trim() && (
              <div className="absolute top-full left-0 mt-1 flex items-center space-x-2 z-10">
                <Badge variant="outline" className="bg-gray-900/80 text-gray-300 border-gray-700 text-xs">
                  {detectedQueryCategory} query
                </Badge>
                {suggestedModel && suggestedModel !== selectedModel && selectedModel !== "all" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs text-gray-400 hover:text-white bg-gray-900/80"
                    onClick={() => selectModel(suggestedModel)}
                  >
                    Switch to {getModelDisplayName(suggestedModel)}
                  </Button>
                )}
              </div>
            )}
          </div>
          <Button
            type="submit"
            className={`ml-2 ${
              messageBeingSent
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700"
            } text-white px-4 shadow-md shadow-purple-500/20 hover:shadow-purple-500/40 transition-all`}
            disabled={messageBeingSent || !inputValue.trim()}
          >
            <span className="mr-2">{messageBeingSent ? "Sending..." : "Send"}</span>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>

      {/* New Thread Modal */}
      {showNewThreadModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 w-full max-w-md">
            <h3 className="text-lg font-medium text-white mb-4">Create New Thread</h3>
            <input
              type="text"
              value={newThreadTitle}
              onChange={(e) => setNewThreadTitle(e.target.value)}
              placeholder="Thread title"
              className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 mb-4"
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowNewThreadModal(false)
                  setNewThreadTitle("")
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (newThreadTitle.trim()) {
                    createNewThread(newThreadTitle)
                    setShowNewThreadModal(false)
                    setNewThreadTitle("")
                  }
                }}
                disabled={!newThreadTitle.trim()}
              >
                Create
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
