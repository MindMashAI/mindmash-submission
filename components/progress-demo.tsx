"use client"

import type React from "react"

import { useState } from "react"
import { Play, Pause, Maximize } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProgressDemo() {
  const [activeDemo, setActiveDemo] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const progressItems = [
    {
      title: "Real-time chat between user + 3 AIs",
      image: "/placeholder.svg?height=200&width=350",
      color: "border-green-500",
      description:
        "Users can chat with GPT-4, Grok, and Gemini simultaneously, with responses appearing in real-time and cross-referencing each other.",
    },
    {
      title: "Working knowledge graph visualization",
      image: "/placeholder.svg?height=200&width=350",
      color: "border-blue-500",
      description:
        "The knowledge graph visualizes connections between concepts, users, and AI responses, allowing for intuitive navigation of complex information.",
    },
    {
      title: "Mash.BiT point system implemented",
      image: "/placeholder.svg?height=200&width=350",
      color: "border-purple-500",
      description:
        "Users earn Mash.BiT tokens for contributing valuable insights, asking good questions, and providing feedback on AI responses.",
    },
    {
      title: "Crossmint wallet + onboarding integrated",
      image: "/placeholder.svg?height=200&width=350",
      color: "border-cyan-500",
      description:
        "New users can create a wallet in seconds without crypto experience, enabling seamless token rewards and NFT distribution.",
    },
    {
      title: "UI tutorial and gamified first-time flow",
      image: "/placeholder.svg?height=200&width=350",
      color: "border-pink-500",
      description:
        "First-time users are guided through an interactive tutorial that teaches them how to use the platform while earning their first tokens.",
    },
    {
      title: "Syndicate formation & governance",
      image: "/placeholder.svg?height=200&width=350",
      color: "border-amber-500",
      description:
        "Users can form specialized learning syndicates with shared goals, pooled resources, and democratic governance for collaborative AI exploration.",
    },
  ]

  const handleDemoClick = (index: number) => {
    setActiveDemo(activeDemo === index ? null : index)
    setIsPlaying(activeDemo !== index)
  }

  const togglePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
      {progressItems.map((item, index) => (
        <div
          key={index}
          className={`flex flex-col p-4 rounded-lg bg-gray-900/50 backdrop-blur-sm border transition-all duration-300 cursor-pointer ${
            activeDemo === index
              ? `${item.color} scale-105 shadow-lg`
              : `${item.color.replace("border", "border-opacity-30")} hover:${item.color}`
          }`}
          onClick={() => handleDemoClick(index)}
        >
          <div className="mb-4 overflow-hidden rounded-md relative">
            <img
              src={item.image || "/placeholder.svg"}
              alt={item.title}
              className={`w-full h-auto object-cover transition-transform ${
                activeDemo === index ? "scale-105" : "hover:scale-105"
              }`}
            />

            {activeDemo === index && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full bg-black/50 border-white/50 hover:bg-black/70"
                  onClick={togglePlayPause}
                >
                  {isPlaying ? <Pause className="h-6 w-6 text-white" /> : <Play className="h-6 w-6 text-white" />}
                </Button>
              </div>
            )}

            <div className="absolute top-2 right-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-black/50 hover:bg-black/70"
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                <Maximize className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>
          <h3 className="text-md font-medium">{item.title}</h3>

          {activeDemo === index && <p className="mt-2 text-sm text-gray-300 animate-fadeIn">{item.description}</p>}
        </div>
      ))}
    </div>
  )
}
