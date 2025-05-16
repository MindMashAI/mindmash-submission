"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SynBotAvatar } from "@/components/synbot-avatar"
import { MessageSquare, X, Minimize, Maximize, Send, Cpu } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "synbot"
  timestamp: Date
}

export function SynBotQuickChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your SynBot assistant. How can I help you with your Syndicate activities today?",
      sender: "synbot",
      timestamp: new Date(),
    },
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate SynBot response
    setTimeout(() => {
      const responses = [
        "I can help you with that! Let me analyze the syndicate data...",
        "Interesting question. Based on your syndicate alignment, I'd recommend exploring the collaborative quests first.",
        "Your syndicate vault is growing steadily. Would you like me to suggest some proposal ideas?",
        "I've detected a pattern in your interactions that aligns well with the Quantum Flow philosophy.",
        "Have you considered participating in the cross-syndicate diplomacy initiative? It could boost your reputation score.",
      ]

      const synbotMessage: Message = {
        id: Date.now().toString(),
        content: responses[Math.floor(Math.random() * responses.length)],
        sender: "synbot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, synbotMessage])
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend()
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 rounded-full w-12 h-12 bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20"
      >
        <MessageSquare className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <div
      className={`fixed ${isMinimized ? "bottom-4 left-4 w-auto h-auto" : "bottom-4 left-4 w-80 sm:w-96 h-96"} z-50 bg-black border border-purple-500/30 rounded-md shadow-lg shadow-purple-500/20 flex flex-col transition-all duration-300`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/80 to-indigo-900/80 p-3 rounded-t-md flex items-center justify-between border-b border-purple-500/30">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-purple-400" />
          <span className="font-medium text-white">SynBot Assistant</span>
        </div>
        <div className="flex items-center gap-1">
          {isMinimized ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-white hover:bg-purple-800/50"
              onClick={() => setIsMinimized(false)}
            >
              <Maximize className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-white hover:bg-purple-800/50"
              onClick={() => setIsMinimized(true)}
            >
              <Minimize className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-gray-400 hover:text-white hover:bg-purple-800/50"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div
            className="flex-1 p-3 overflow-y-auto bg-black/90 space-y-3"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#7e22ce #000" }}
          >
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] ${message.sender === "user" ? "bg-purple-900/40 border border-purple-500/30" : "bg-gray-900/40 border border-gray-700/30"} rounded-lg p-2`}
                >
                  {message.sender === "synbot" && (
                    <div className="flex items-start gap-2">
                      <SynBotAvatar size={32} animated={false} />
                      <div>
                        <div className="text-sm text-white">{message.content}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </div>
                  )}

                  {message.sender === "user" && (
                    <div>
                      <div className="text-sm text-white">{message.content}</div>
                      <div className="text-xs text-gray-500 mt-1 text-right">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-purple-500/30 bg-black/90 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask SynBot something..."
              className="flex-1 bg-gray-900/50 border-gray-700 focus:border-purple-500 text-white"
            />
            <Button
              onClick={handleSend}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              disabled={!input.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
