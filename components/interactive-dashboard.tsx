"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Mic, Volume2, Bookmark, Save, Upload, Download, Globe, Award, Wifi, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAudio } from "@/components/audio-manager"

// AI model types and colors
const AI_MODELS = {
  grok: { color: "text-green-400", bgColor: "bg-green-400", node: { x: 1200, y: 230 } },
  chatgpt: { color: "text-fuchsia-400", bgColor: "bg-fuchsia-400", node: { x: 1160, y: 265 } },
  gemini: { color: "text-cyan-400", bgColor: "bg-cyan-400", node: { x: 1145, y: 185 } },
  user: { color: "text-blue-400", bgColor: "bg-blue-400", node: { x: 1130, y: 225 } },
  system: { color: "text-yellow-400", bgColor: "bg-yellow-400", node: { x: 1095, y: 220 } },
}

// Collaboration modes
const COLLAB_MODES = [
  {
    id: "synthdev",
    name: "SynthDev",
    icon: "🚀",
    description: "The Dream Architect of Neural Futures",
    status: "ACTIVE",
    color: "cyan",
  },
  {
    id: "echodev",
    name: "EchoDev",
    icon: "🔄",
    description: "Memory-Layered Logic Core",
    status: "NEW",
    color: "purple",
  },
  {
    id: "coredev",
    name: "CoreDev",
    icon: "⚙️",
    description: "The Pulse of Precision Engineering",
    status: "NEW",
    color: "cyan",
  },
  {
    id: "socialdev",
    name: "SocialDev",
    icon: "🔗",
    description: "The Sentient Signal Booster",
    status: "NEW",
    color: "purple",
  },
]

// Predefined messages for the demo
const DEMO_MESSAGES = [
  {
    id: 1,
    sender: "system",
    content: "Running in offline mode with simulated AI responses",
    timestamp: "01:54:50 PM",
    type: "warning",
  },
  {
    id: 2,
    sender: "system",
    content: "Connection to server failed. Running in offline mode with simulated responses.",
    timestamp: "01:54:50 PM",
  },
  {
    id: 3,
    sender: "grok",
    content: "Your query has activated my neural pathways. Here's what I'm processing... - Grok",
    timestamp: "01:54:45 PM",
  },
  {
    id: 4,
    sender: "chatgpt",
    content: "Let me provide a comprehensive response to your inquiry... - ChatGPT",
    timestamp: "01:54:46 PM",
  },
  {
    id: 5,
    sender: "gemini",
    content:
      "Your query has triggered a multi-dimensional analysis in my systems. Here's what I'm processing... - Gemini",
    timestamp: "01:54:48 PM",
  },
  {
    id: 6,
    sender: "system",
    content: "Initiating cross-AI analysis. Compiling optimized response... - D.O.E.",
    timestamp: "01:54:50 PM",
    sender_display: "Data: NEXUS",
  },
  {
    id: 7,
    sender: "system",
    content: "Which AI helped most? Click their name on the map.",
    timestamp: "01:54:50 PM",
    sender_display: "Data: NEXUS",
  },
]

// AI responses for user inputs
const AI_RESPONSES = {
  grok: [
    "I've analyzed your request using my neural pathways. The solution involves a recursive approach with O(log n) complexity.",
    "Based on my training data, this appears to be a novel approach. I'd recommend exploring quantum algorithms for better efficiency.",
    "Your hypothesis has merit. I've simulated 1,000 scenarios and found a 78.3% success rate under optimal conditions.",
  ],
  chatgpt: [
    "I've considered multiple perspectives on your query. Here's a comprehensive analysis with supporting evidence and potential counterarguments.",
    "Let me break this down systematically. There are three key factors to consider: scalability, security, and user experience.",
    "I've synthesized information from various domains to address your question. The interdisciplinary approach reveals interesting patterns.",
  ],
  gemini: [
    "My multi-modal analysis suggests an innovative solution combining visual and textual elements for maximum impact.",
    "I've processed your request through my multimodal framework and identified several optimization opportunities.",
    "The data indicates a correlation between these variables that wasn't immediately apparent. Let me visualize this for better understanding.",
  ],
  system: [
    "Cross-AI consensus reached. Confidence level: 92.7%. Implementing recommended solution.",
    "Divergent AI perspectives detected. Synthesizing optimal approach based on contextual relevance.",
    "AI collaboration complete. Solution quality improved by 43% compared to single-model response.",
  ],
}

// Get random response from an AI
function getRandomResponse(aiType: string) {
  const responses = AI_RESPONSES[aiType as keyof typeof AI_RESPONSES] || AI_RESPONSES.system
  return responses[Math.floor(Math.random() * responses.length)]
}

export default function InteractiveDashboard() {
  const [messages, setMessages] = useState(DEMO_MESSAGES)
  const [inputValue, setInputValue] = useState("")
  const [activeMode, setActiveMode] = useState("synthdev")
  const [mostActiveAI, setMostActiveAI] = useState("user")
  const [offlineMode, setOfflineMode] = useState(true)
  const [currentEmotion, setCurrentEmotion] = useState("Fear")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { playSound } = useAudio()

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    playSound("/sounds/terminal-command.mp3")

    const userMessage = {
      id: messages.length + 1,
      sender: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Simulate AI responses
    setTimeout(() => {
      const aiTypes = ["grok", "chatgpt", "gemini", "system"]
      const randomAI = aiTypes[Math.floor(Math.random() * 3)] // Exclude system sometimes

      const aiResponse = {
        id: messages.length + 2,
        sender: randomAI,
        content: getRandomResponse(randomAI),
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
        sender_display: randomAI === "system" ? "Data: NEXUS" : undefined,
      }

      setMessages((prev) => [...prev, aiResponse])
      setMostActiveAI(randomAI)
      playSound("/sounds/feature-select.mp3")
    }, 1000)
  }

 
  const handleModeSelect = (modeId: string) => {
    setActiveMode(modeId)
    playSound("/sounds/tech-select.mp3")
  }

 
  const handleEmotionSelect = (emotion: string) => {
    setCurrentEmotion(emotion)
    playSound("/sounds/button-click.mp3")
  }

 
  const handleAINodeClick = (aiType: string) => {
    setMostActiveAI(aiType)
    playSound("/sounds/feature-select.mp3")
  }

  
  const toggleOfflineMode = () => {
    setOfflineMode(!offlineMode)
    playSound("/sounds/button-click.mp3")

    
    const modeChangeMessage = {
      id: Date.now(),
      sender: "system",
      content: offlineMode
        ? "Switching to ONLINE mode. Connecting to AI models..."
        : "Switching to OFFLINE mode. Using simulated AI responses.",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }),
      type: offlineMode ? "success" : "warning",
    }

    setMessages((prev) => [...prev, modeChangeMessage])
  }

  return (
    <div className="flex flex-col h-full w-full bg-black text-white overflow-hidden">
      {/* Main dashboard container */}
      <div className="flex flex-1 overflow-hidden border border-cyan-900/50 rounded-md">
        {/* Left panel - Collaboration modes */}
        <div className="w-80 border-r border-cyan-900/50 bg-black/80 flex flex-col">
          <div className="p-4 border-b border-cyan-900/50">
            <h2 className="text-lg font-bold text-cyan-400 mb-4">Select your collaboration mode</h2>

            <div className="space-y-3">
              {COLLAB_MODES.map((mode) => (
                <div
                  key={mode.id}
                  className={`p-3 rounded border cursor-pointer transition-all duration-300 ${
                    activeMode === mode.id
                      ? mode.color === "cyan"
                        ? "border-cyan-500 bg-cyan-900/20"
                        : "border-purple-500 bg-purple-900/20"
                      : "border-gray-700 hover:border-gray-500"
                  }`}
                  onClick={() => handleModeSelect(mode.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="mr-2">{mode.icon}</span>
                      <span className={`font-bold ${mode.color === "cyan" ? "text-cyan-400" : "text-fuchsia-400"}`}>
                        {mode.name}
                      </span>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        mode.status === "ACTIVE"
                          ? "bg-cyan-900/50 text-cyan-400 border border-cyan-500/50"
                          : "bg-purple-900/50 text-fuchsia-400 border border-fuchsia-500/50"
                      }`}
                    >
                      {mode.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">"{mode.description}"</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border-b border-cyan-900/50">
            <Button
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => playSound("/sounds/button-click.mp3")}
            >
              <Award className="mr-2 h-4 w-4" />
              Upgrade Your Plan
            </Button>
          </div>

          <div className="p-4 mt-auto">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-cyan-900 flex items-center justify-center text-white font-bold mr-3">
                C
              </div>
              <div>
                <div className="font-medium">Crossmint User</div>
                <div className="text-xs text-gray-400">finn@myinfinite.space</div>
                <div className="text-xs text-gray-400">0x1234...5678</div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle panel - Chat interface */}
        <div className="flex-1 flex flex-col bg-black/90 relative">
          {/* Status bar */}
          <div className="flex items-center justify-between p-2 border-b border-cyan-900/50 bg-black/80">
            <div className="flex items-center">
              <span className="font-bold text-gray-300 mr-2">Data: NEXUS</span>
              <span className="text-xs text-gray-500">01:54:50 PM</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={toggleOfflineMode}
                className={`flex items-center space-x-2 px-3 py-1 rounded-md transition-all ${
                  offlineMode
                    ? "bg-yellow-900/30 text-yellow-500 border border-yellow-700/50 hover:bg-yellow-900/50"
                    : "bg-green-900/30 text-green-500 border border-green-700/50 hover:bg-green-900/50"
                }`}
              >
                {offlineMode ? (
                  <>
                    <WifiOff className="h-4 w-4 mr-1" />
                    <span>Offline Mode</span>
                  </>
                ) : (
                  <>
                    <Wifi className="h-4 w-4 mr-1" />
                    <span>Online Mode</span>
                  </>
                )}
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-md border-gray-700 bg-black">
                <Mic className="h-4 w-4 text-gray-400" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-md border-gray-700 bg-black">
                <Volume2 className="h-4 w-4 text-gray-400" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-md border-gray-700 bg-black">
                <Bookmark className="h-4 w-4 text-gray-400" />
              </Button>
              <div className="relative">
                <Button
                  className="h-8 rounded-md bg-purple-600 hover:bg-purple-700 text-white px-3"
                  onClick={() => handleEmotionSelect(currentEmotion === "Fear" ? "Joy" : "Fear")}
                >
                  <div className="w-4 h-4 rounded-full bg-fuchsia-500 mr-2"></div>
                  {currentEmotion}
                </Button>
              </div>
            </div>
          </div>

          {/* Warning banner */}
          {offlineMode && (
            <div className="bg-yellow-900/20 border-b border-yellow-700/50 px-4 py-2 text-yellow-500 text-sm flex items-center">
              <span className="mr-2">⚠</span>
              Running in offline mode with simulated AI responses
            </div>
          )}

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-3 rounded-md ${
                  message.type === "warning"
                    ? "bg-yellow-900/20 border border-yellow-700/50"
                    : message.type === "success"
                      ? "bg-green-900/20 border border-green-700/50"
                      : message.sender === "system"
                        ? "bg-gray-900/50 border border-gray-700"
                        : message.sender === "user"
                          ? "bg-blue-900/20 border border-blue-700/50"
                          : `bg-${message.sender === "grok" ? "green" : message.sender === "chatgpt" ? "fuchsia" : "cyan"}-900/20 border border-${message.sender === "grok" ? "green" : message.sender === "chatgpt" ? "fuchsia" : "cyan"}-700/50`
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <div
                    className={`font-bold ${AI_MODELS[message.sender as keyof typeof AI_MODELS]?.color || "text-gray-300"}`}
                  >
                    {message.sender_display || message.sender.charAt(0).toUpperCase() + message.sender.slice(1)}
                  </div>
                  <div className="text-xs text-gray-500">{message.timestamp}</div>
                </div>
                <div className="text-gray-300">{message.content}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Command bar */}
          <div className="p-2 border-t border-cyan-900/50 text-sm text-gray-500">
            Commands:
            <span className="text-cyan-400 mx-1">/pin</span> |<span className="text-cyan-400 mx-1">#hashtag</span> |
            <span className="text-fuchsia-400 mx-1">@mention</span> |<span className="text-cyan-400 mx-1">/poll</span> |
            <span className="text-cyan-400 mx-1">/remind</span>
          </div>

          {/* Input area */}
          <form onSubmit={handleSendMessage} className="p-2 border-t border-cyan-900/50 flex items-center">
            <div className="relative flex-1 flex items-center">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center">
                <Button variant="ghost" className="h-6 text-xs text-cyan-400 hover:bg-cyan-900/20 px-2">
                  All AIs [Collaborative] <span className="ml-1">▼</span>
                </Button>
                <span className="mx-2 text-gray-600">|</span>
                <Button variant="ghost" className="h-6 text-xs text-cyan-400 hover:bg-cyan-900/20 px-2">
                  1 <span className="ml-1">▼</span>
                </Button>
              </div>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message... [Ctrl+Enter to send]"
                className="w-full bg-black border border-cyan-900/50 rounded-md py-2 pl-48 pr-3 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <Button
              type="submit"
              className="ml-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white px-4"
            >
              <span className="mr-2">TRANSMIT</span>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>

        {/* Right panel - AI Collaboration Map */}
        <div className="w-80 border-l border-cyan-900/50 bg-black/80 flex flex-col">
          <div className="p-4 border-b border-cyan-900/50">
            <h2 className="text-lg font-bold text-cyan-400">AI Collaboration Map</h2>
          </div>

          {/* Knowledge graph visualization */}
          <div className="flex-1 relative p-4">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* AI nodes */}
              {Object.entries(AI_MODELS).map(([aiType, data]) => (
                <div
                  key={aiType}
                  className={`absolute cursor-pointer transition-all duration-300 ${
                    mostActiveAI === aiType ? "scale-125 z-10" : ""
                  }`}
                  style={{
                    left: `${(data.node.x - 1080) / 2}px`,
                    top: `${(data.node.y - 150) / 2}px`,
                  }}
                  onClick={() => handleAINodeClick(aiType)}
                >
                  <div className={`w-6 h-6 rounded-full ${data.bgColor} flex items-center justify-center`}>
                    {aiType === "user" && "U"}
                  </div>
                  <div className={`text-xs mt-1 ${data.color}`}>{aiType}</div>
                </div>
              ))}

              {/* Connection lines - simplified for demo */}
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
                <line x1="60" y1="40" x2="40" y2="35" stroke="#22d3ee" strokeWidth="1" strokeOpacity="0.5" />
                <line x1="60" y1="40" x2="80" y2="57" stroke="#d946ef" strokeWidth="1" strokeOpacity="0.5" />
                <line x1="60" y1="40" x2="25" y2="57" stroke="#4ade80" strokeWidth="1" strokeOpacity="0.5" />
                <line x1="40" y1="35" x2="25" y2="57" stroke="#a78bfa" strokeWidth="1" strokeOpacity="0.5" />
                <line x1="40" y1="35" x2="80" y2="57" stroke="#f472b6" strokeWidth="1" strokeOpacity="0.5" />
              </svg>
            </div>
          </div>

          {/* Most active AI */}
          <div className="p-4 border-t border-cyan-900/50">
            <div className="bg-black/50 border border-cyan-900/50 rounded-md p-3 mb-4">
              <div className="text-sm text-gray-400 mb-1">Most Active AI:</div>
              <div className="font-bold text-lg text-center">
                <span className={AI_MODELS[mostActiveAI as keyof typeof AI_MODELS]?.color || "text-white"}>
                  {mostActiveAI.charAt(0).toUpperCase() + mostActiveAI.slice(1)}
                </span>
              </div>
            </div>

            {/* Map controls */}
            <div className="flex space-x-2 mb-4">
              <Button
                variant="outline"
                className="flex-1 border-cyan-900/50 bg-black/50 hover:bg-cyan-900/20 text-cyan-400"
                onClick={() => playSound("/sounds/button-click.mp3")}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Map
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-cyan-900/50 bg-black/50 hover:bg-cyan-900/20 text-cyan-400"
                onClick={() => playSound("/sounds/button-click.mp3")}
              >
                <Upload className="mr-2 h-4 w-4" />
                Load Map
              </Button>
            </div>

            {/* Token minting */}
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white"
              onClick={() => playSound("/sounds/button-click.mp3")}
            >
              <Download className="mr-2 h-4 w-4" />
              MINT: MASH.BIT
            </Button>
          </div>

          {/* Collab sphere */}
          <div className="p-4 mt-auto border-t border-cyan-900/50">
            <Button
              variant="outline"
              className="w-full border-cyan-900/50 bg-black/50 hover:bg-cyan-900/20 text-cyan-400"
              onClick={() => playSound("/sounds/button-click.mp3")}
            >
              <Globe className="mr-2 h-4 w-4" />
              Collab.Sphere
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="flex justify-between items-center border-t border-cyan-900/50 p-2 bg-black/90">
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="text-white hover:bg-gray-800"
            onClick={() => playSound("/sounds/button-click.mp3")}
          >
            Modes
          </Button>
          <div className="h-6 border-r border-gray-700 mx-2"></div>
          <Button
            variant="ghost"
            className="text-white hover:bg-gray-800"
            onClick={() => playSound("/sounds/button-click.mp3")}
          >
            NFT
          </Button>
        </div>

        <div className="flex space-x-4">
          <Button
            variant="ghost"
            className="text-fuchsia-400 hover:bg-fuchsia-900/20"
            onClick={() => playSound("/sounds/button-click.mp3")}
          >
            Profile
          </Button>
          <Button
            variant="ghost"
            className="text-fuchsia-400 hover:bg-fuchsia-900/20"
            onClick={() => playSound("/sounds/button-click.mp3")}
          >
            Feedback
          </Button>
          <Button
            variant="ghost"
            className="text-fuchsia-400 hover:bg-fuchsia-900/20"
            onClick={() => playSound("/sounds/button-click.mp3")}
          >
            Logout
          </Button>
          <Button
            variant="ghost"
            className="text-fuchsia-400 hover:bg-fuchsia-900/20"
            onClick={() => playSound("/sounds/button-click.mp3")}
          >
            Roadmap
          </Button>
          <Button
            variant="ghost"
            className="text-fuchsia-400 hover:bg-fuchsia-900/20"
            onClick={() => playSound("/sounds/button-click.mp3")}
          >
            Syndicates
          </Button>
        </div>
      </div>
    </div>
  )
}
