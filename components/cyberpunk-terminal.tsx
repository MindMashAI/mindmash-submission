"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import TerminalSuggestions from "@/components/terminal-suggestions"

interface CyberpunkTerminalProps {
  history: { type: string; content: string }[]
  input: string
  onInputChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  terminalRef: React.RefObject<HTMLDivElement>
}

export default function CyberpunkTerminal({
  history,
  input,
  onInputChange,
  onSubmit,
  terminalRef,
}: CyberpunkTerminalProps) {
  const [cursorVisible, setCursorVisible] = useState(true)

  // Blinking cursor effect
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev)
    }, 530)

    return () => clearInterval(interval)
  }, [])

  const handleSuggestionSelect = (suggestion: string) => {
    onInputChange(suggestion)
  }

  return (
    <div className="flex-1 flex flex-col bg-black/80 border border-cyan-900/30">
      <div
        ref={terminalRef}
        className="flex-1 p-4 font-mono text-sm overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-gray-900"
      >
        {history.map((entry, index) => (
          <div
            key={index}
            className={`mb-1 ${
              entry.type === "user" ? "text-cyan-400" : entry.type === "error" ? "text-red-400" : "text-green-400"
            }`}
          >
            {entry.content}
          </div>
        ))}
      </div>

      <form onSubmit={onSubmit} className="p-2 border-t border-cyan-900/30 bg-black/90 relative">
        <TerminalSuggestions input={input} onSelectSuggestion={handleSuggestionSelect} />

        <div className="flex items-center">
          <span className="text-cyan-400 font-mono mr-2">{">"}</span>
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-cyan-400 font-mono pr-2"
              placeholder="Type a command..."
              autoFocus
            />
            {input === "" && cursorVisible && <span className="absolute top-0 left-0 h-full w-2 bg-cyan-400/70"></span>}
          </div>
          <Button type="submit" variant="ghost" size="sm" className="text-xs text-cyan-400 hover:bg-cyan-900/30">
            EXEC
          </Button>
        </div>
      </form>
    </div>
  )
}
