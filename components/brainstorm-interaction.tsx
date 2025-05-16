"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Plus, Check, X, MessageSquare, Download, Sparkles } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Idea {
  id: string
  content: string
  source: string
  avatar: string
  selected: boolean
}

interface BrainstormInteractionProps {
  topic: string
  initialIdeas?: Idea[]
  onComplete?: (selectedIdeas: Idea[]) => void
  onContinue?: () => void
}

export function BrainstormInteraction({
  topic,
  initialIdeas = [],
  onComplete,
  onContinue,
}: BrainstormInteractionProps) {
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas)
  const [loading, setLoading] = useState(false)
  const [phase, setPhase] = useState<"generating" | "selecting" | "complete">("generating")

  // Simulated AI models for brainstorming
  const models = [
    { name: "CreativeAI", avatar: "/images/cyberpunk-avatars/quantum-dreamer.png" },
    { name: "AnalyticalAI", avatar: "/images/cyberpunk-avatars/neural-pioneer.png" },
    { name: "PracticalAI", avatar: "/images/cyberpunk-avatars/code-shaman.png" },
    { name: "InnovativeAI", avatar: "/images/cyberpunk-avatars/tech-visionary.png" },
  ]

  // This would be replaced with actual API calls in a real implementation
  const generateIdeas = async () => {
    setLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate new ideas
    const newIdeas: Idea[] = [
      {
        id: `idea-${Date.now()}`,
        content: "Implement a neural network that adapts to user interaction patterns",
        source: models[0].name,
        avatar: models[0].avatar,
        selected: false,
      },
      {
        id: `idea-${Date.now() + 1}`,
        content: "Create a data visualization dashboard for real-time analytics",
        source: models[1].name,
        avatar: models[1].avatar,
        selected: false,
      },
      {
        id: `idea-${Date.now() + 2}`,
        content: "Develop a modular architecture for easier feature integration",
        source: models[2].name,
        avatar: models[2].avatar,
        selected: false,
      },
    ]

    setIdeas((prev) => [...prev, ...newIdeas])
    setLoading(false)
  }

  const toggleIdeaSelection = (id: string) => {
    setIdeas((prev) => prev.map((idea) => (idea.id === id ? { ...idea, selected: !idea.selected } : idea)))
  }

  const completeSession = () => {
    const selectedIdeas = ideas.filter((idea) => idea.selected)
    onComplete?.(selectedIdeas)
    setPhase("complete")
  }

  const exportIdeas = () => {
    const selectedIdeas = ideas.filter((idea) => idea.selected)
    const text = selectedIdeas.map((idea) => `- ${idea.content} (from ${idea.source})`).join("\n")

    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `brainstorm-${topic.replace(/\s+/g, "-").toLowerCase()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    if (ideas.length === 0) {
      generateIdeas()
    }
  }, [])

  return (
    <Card className="w-full border-2 border-purple-500/20 bg-black/40 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-purple-400">
            <Lightbulb className="mr-2 h-5 w-5 inline-block" />
            AI Brainstorm Session
          </CardTitle>
          <Badge variant="outline" className="bg-purple-950/30 text-purple-400 border-purple-500/50">
            {phase === "generating" ? "Generating Ideas" : phase === "selecting" ? "Select Ideas" : "Complete"}
          </Badge>
        </div>
        <CardDescription className="text-purple-300/70">Collaborative idea generation on: {topic}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {ideas.map((idea) => (
            <div
              key={idea.id}
              className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                phase === "selecting" || phase === "complete"
                  ? idea.selected
                    ? "bg-purple-950/40 border border-purple-400/40"
                    : "bg-gray-950/30 border border-gray-700/30 opacity-60"
                  : "bg-purple-950/20 border border-purple-500/30"
              }`}
            >
              <Avatar className="h-8 w-8 border border-purple-500/50 bg-purple-950/30 mt-0.5">
                <AvatarImage src={idea.avatar || "/placeholder.svg"} alt={idea.source} />
                <AvatarFallback className="text-xs bg-purple-950 text-purple-300">
                  {idea.source.substring(0, 2)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="text-xs font-medium text-purple-400/80 mb-1">{idea.source}</span>

                  {phase === "selecting" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-6 w-6 rounded-full ${
                        idea.selected
                          ? "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
                          : "text-gray-400 hover:bg-gray-800/50"
                      }`}
                      onClick={() => toggleIdeaSelection(idea.id)}
                    >
                      {idea.selected ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                    </Button>
                  )}
                </div>
                <p className="text-sm text-white">{idea.content}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-center py-4">
              <div className="flex space-x-1">
                <div className="h-2 w-2 animate-bounce rounded-full bg-purple-500 [animation-delay:-0.3s]"></div>
                <div className="h-2 w-2 animate-bounce rounded-full bg-purple-500 [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 animate-bounce rounded-full bg-purple-500"></div>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between border-t border-purple-500/20 pt-3">
        {phase === "generating" && (
          <>
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-purple-500/30 bg-transparent text-purple-400 hover:bg-purple-950/50"
              onClick={onContinue}
            >
              <MessageSquare className="mr-1 h-3 w-3" />
              Return to Chat
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs border-purple-500/30 bg-transparent text-purple-400 hover:bg-purple-950/50"
                onClick={() => generateIdeas()}
                disabled={loading}
              >
                <Lightbulb className="mr-1 h-3 w-3" />
                More Ideas
              </Button>

              <Button
                variant="default"
                size="sm"
                className="text-xs bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => setPhase("selecting")}
                disabled={ideas.length === 0}
              >
                <Check className="mr-1 h-3 w-3" />
                Select Ideas
              </Button>
            </div>
          </>
        )}

        {phase === "selecting" && (
          <>
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-purple-500/30 bg-transparent text-purple-400 hover:bg-purple-950/50"
              onClick={() => setPhase("generating")}
            >
              <X className="mr-1 h-3 w-3" />
              Back
            </Button>

            <Button
              variant="default"
              size="sm"
              className="text-xs bg-purple-600 hover:bg-purple-700 text-white"
              onClick={completeSession}
              disabled={!ideas.some((idea) => idea.selected)}
            >
              <Sparkles className="mr-1 h-3 w-3" />
              Complete
            </Button>
          </>
        )}

        {phase === "complete" && (
          <>
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-purple-500/30 bg-transparent text-purple-400 hover:bg-purple-950/50"
              onClick={onContinue}
            >
              <MessageSquare className="mr-1 h-3 w-3" />
              Return to Chat
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="text-xs border-purple-500/30 bg-transparent text-purple-400 hover:bg-purple-950/50"
              onClick={exportIdeas}
            >
              <Download className="mr-1 h-3 w-3" />
              Export Ideas
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}
