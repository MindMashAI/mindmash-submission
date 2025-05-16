"use client"

import { useState, useEffect } from "react"
import { Sparkles, RefreshCw } from "lucide-react"
import { useAudio } from "@/components/audio-manager"

interface AIAssistedThoughtProps {
  onSelect: (content: string) => void
  currentInput: string
  preferredAIModels: string[]
}

// AI suggestions for posts
const AI_SUGGESTIONS = [
  "Share your thoughts on the latest neural interface developments",
  "Ask the community about quantum computing applications in mindmashing",
  "Discuss how MindMash has improved your collaborative workflow",
  "Share your experience with the new thought-to-code conversion feature",
  "Propose a new syndicate focused on augmented reality experiences",
  "Ask for feedback on your latest mindmash project",
  "Share a breakthrough you've had using the platform",
  "Discuss ethical implications of direct neural interfaces",
]

export function AIAssistedThought({ onSelect, currentInput, preferredAIModels }: AIAssistedThoughtProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const { playSound } = useAudio()

  // Generate suggestions when component mounts or when models change
  useEffect(() => {
    generateSuggestions()
  }, [preferredAIModels])

  const generateSuggestions = () => {
    setIsGenerating(true)

    // randomly select 3 suggestions from the predefined list
    const randomSuggestions = [...AI_SUGGESTIONS].sort(() => 0.5 - Math.random()).slice(0, 3)

    // Simulate API delay
    setTimeout(() => {
      setSuggestions(randomSuggestions)
      setIsGenerating(false)
    }, 800)
  }

  const handleSelectSuggestion = (suggestion: string) => {
    playSound("/sounds/button-click.mp3")
    onSelect(suggestion)
  }

  const handleRefresh = () => {
    playSound("/sounds/feature-select.mp3")
    generateSuggestions()
  }

  return (
    <div className="neural-ai-suggestions">
      <div className="neural-ai-suggestions-header">
        <h4 className="text-sm font-bold flex items-center">
          <Sparkles className="h-4 w-4 mr-1 text-cyan-400" />
          AI Thought Suggestions
        </h4>
        <button className="neural-refresh-button" onClick={handleRefresh} disabled={isGenerating}>
          <RefreshCw className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="neural-ai-suggestions-list">
        {isGenerating ? (
          <div className="neural-ai-suggestions-loading">
            <div className="neural-spinner"></div>
            <span>Generating suggestions...</span>
          </div>
        ) : (
          suggestions.map((suggestion, index) => (
            <button key={index} className="neural-ai-suggestion" onClick={() => handleSelectSuggestion(suggestion)}>
              {suggestion}
            </button>
          ))
        )}
      </div>
    </div>
  )
}
