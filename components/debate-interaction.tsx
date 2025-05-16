"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRightLeft, ThumbsUp, ThumbsDown, MessageSquare, Copy } from "lucide-react"

interface DebateMessage {
  id: string
  content: string
  perspective: "for" | "against"
  model: string
  timestamp: Date
}

interface DebateInteractionProps {
  topic: string
  initialMessages?: DebateMessage[]
  onVote?: (messageId: string, vote: "up" | "down") => void
  onContinue?: () => void
}

export function DebateInteraction({ topic, initialMessages = [], onVote, onContinue }: DebateInteractionProps) {
  const [messages, setMessages] = useState<DebateMessage[]>(initialMessages)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  // Simulated models for the debate
  const models = {
    for: {
      name: "OptiBot",
      avatar: "/images/cyberpunk-avatars/tech-visionary.png",
    },
    against: {
      name: "CritiBot",
      avatar: "/images/cyberpunk-avatars/ethical-minder.png",
    },
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  // This would be replaced with actual API calls in a real implementation
  const simulateDebate = async () => {
    setLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Add new messages
    const newMessages: DebateMessage[] = [
      {
        id: `for-${Date.now()}`,
        content:
          "The technology presents significant advantages in efficiency and innovation that outweigh potential risks.",
        perspective: "for",
        model: models.for.name,
        timestamp: new Date(),
      },
      {
        id: `against-${Date.now() + 1}`,
        content: "We must consider the ethical implications and unintended consequences before widespread adoption.",
        perspective: "against",
        model: models.against.name,
        timestamp: new Date(),
      },
    ]

    setMessages((prev) => [...prev, ...newMessages])
    setLoading(false)
  }

  useEffect(() => {
    if (messages.length === 0) {
      simulateDebate()
    }
  }, [])

  return (
    <Card className="w-full border-2 border-amber-500/20 bg-black/40 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-amber-500">
            <ArrowRightLeft className="mr-2 h-5 w-5 inline-block" />
            AI Debate Mode
          </CardTitle>
          <Badge variant="outline" className="bg-amber-950/30 text-amber-400 border-amber-500/50">
            Experimental
          </Badge>
        </div>
        <CardDescription className="text-amber-300/70">Two AI perspectives debating: {topic}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.perspective === "for" ? "justify-start" : "justify-end"}`}
          >
            {message.perspective === "for" && (
              <Avatar className="h-8 w-8 border border-green-500/50 bg-green-950/30">
                <AvatarImage src={models.for.avatar || "/placeholder.svg"} alt={models.for.name} />
                <AvatarFallback className="text-xs bg-green-950 text-green-300">OB</AvatarFallback>
              </Avatar>
            )}

            <div
              className={`relative max-w-[80%] rounded-lg p-3 text-sm ${
                message.perspective === "for"
                  ? "bg-green-950/30 border border-green-500/30 text-green-100"
                  : "bg-red-950/30 border border-red-500/30 text-red-100"
              }`}
            >
              <div className="flex justify-between items-start gap-2 mb-1">
                <span className="font-semibold text-xs">
                  {message.perspective === "for" ? models.for.name : models.against.name}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 rounded-full hover:bg-white/10"
                  onClick={() => copyToClipboard(message.content, message.id)}
                >
                  {copied === message.id ? <span className="text-[10px]">Copied!</span> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
              <p>{message.content}</p>

              <div className="mt-2 flex items-center justify-end gap-1 text-xs opacity-70">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full hover:bg-white/10"
                  onClick={() => onVote?.(message.id, "up")}
                >
                  <ThumbsUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full hover:bg-white/10"
                  onClick={() => onVote?.(message.id, "down")}
                >
                  <ThumbsDown className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {message.perspective === "against" && (
              <Avatar className="h-8 w-8 border border-red-500/50 bg-red-950/30">
                <AvatarImage src={models.against.avatar || "/placeholder.svg"} alt={models.against.name} />
                <AvatarFallback className="text-xs bg-red-950 text-red-300">CB</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex justify-center py-4">
            <div className="flex space-x-1">
              <div className="h-2 w-2 animate-bounce rounded-full bg-amber-500 [animation-delay:-0.3s]"></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-amber-500 [animation-delay:-0.15s]"></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-amber-500"></div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between border-t border-amber-500/20 pt-3">
        <Button
          variant="outline"
          size="sm"
          className="text-xs border-amber-500/30 bg-transparent text-amber-400 hover:bg-amber-950/50"
          onClick={onContinue}
        >
          <MessageSquare className="mr-1 h-3 w-3" />
          Return to Chat
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="text-xs border-amber-500/30 bg-transparent text-amber-400 hover:bg-amber-950/50"
          onClick={() => simulateDebate()}
          disabled={loading}
        >
          <ArrowRightLeft className="mr-1 h-3 w-3" />
          Continue Debate
        </Button>
      </CardFooter>
    </Card>
  )
}
