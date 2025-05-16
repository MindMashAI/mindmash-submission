"use client"

import { useState, useEffect } from "react"
import { ChevronRight } from "lucide-react"

interface TerminalSuggestionsProps {
  input: string
  onSelectSuggestion: (suggestion: string) => void
}

export default function TerminalSuggestions({ input, onSelectSuggestion }: TerminalSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [visible, setVisible] = useState(false)

  // Available commands
  const commands = [
    "help",
    "clear",
    "next",
    "prev",
    "goto",
    "info",
    "list",
    "status",
    "show_features",
    "show_tech_stack",
    "show_demo",
    "show_roadmap",
    "analyze_problem",
    "show_solution",
    "run_demo",
    "show_metrics",
    "neural_scan",
    "token_status",
    "syndicate_info",
  ]

  useEffect(() => {
    if (!input.trim()) {
      setVisible(false)
      return
    }

    // Filter commands that match the input
    const matchedSuggestions = commands.filter((cmd) => cmd.startsWith(input.toLowerCase())).slice(0, 5) // Limit to 5 suggestions

    setSuggestions(matchedSuggestions)
    setVisible(matchedSuggestions.length > 0)
  }, [input])

  if (!visible) return null

  return (
    <div className="absolute bottom-full left-0 w-full bg-black/90 border border-cyan-900/50 rounded-t-md overflow-hidden">
      {suggestions.map((suggestion, index) => (
        <div
          key={index}
          className="px-3 py-1.5 text-sm font-mono text-cyan-400 hover:bg-cyan-900/30 cursor-pointer flex items-center"
          onClick={() => onSelectSuggestion(suggestion)}
        >
          <ChevronRight className="h-3 w-3 mr-1 text-cyan-600" />
          {suggestion}
        </div>
      ))}
    </div>
  )
}
