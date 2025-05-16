"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"

interface TerminalInterfaceProps {
  slideContent: {
    title: string
    description: string
    commands: string[]
  }
}

export default function TerminalInterface({ slideContent }: TerminalInterfaceProps) {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<{ type: string; content: string }[]>([
    { type: "system", content: "MindMash.AI Neural Terminal v1.0.4" },
    { type: "system", content: "Type 'help' for available commands." },
    { type: "system", content: `Current context: ${slideContent.title}` },
  ])
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Scroll to bottom when history changes
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  useEffect(() => {
    // Update terminal when slide changes
    setHistory((prev) => [
      ...prev,
      { type: "system", content: "---" },
      { type: "system", content: `Context switched to: ${slideContent.title}` },
      { type: "system", content: slideContent.description },
    ])
  }, [slideContent])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Play sound with error handling
    try {
      const audio = new Audio("/sounds/terminal-command.mp3")
      audio.volume = 0.2
      audio.play().catch((e) => {
        // Silently handle play errors
        console.log("Terminal command sound unavailable")
      })
    } catch (e) {
      // Fallback for environments where Audio is not available
      console.log("Audio not supported")
    }

    // Add user input to history
    setHistory((prev) => [...prev, { type: "user", content: `${">"}${" "}${input}` }])

    // Process command
    processCommand(input)

    // Clear input
    setInput("")
  }

  const processCommand = (cmd: string) => {
    const command = cmd.toLowerCase().trim()

    // Help command
    if (command === "help") {
      setHistory((prev) => [
        ...prev,
        { type: "system", content: "Available commands:" },
        { type: "system", content: "- help: Show this help message" },
        { type: "system", content: "- clear: Clear terminal history" },
        { type: "system", content: "- info: Show information about current slide" },
        { type: "system", content: "- commands: Show available commands for current context" },
        ...slideContent.commands.map((cmd) => ({
          type: "system",
          content: `- ${cmd}: Execute ${cmd.replace(/_/g, " ")} command`,
        })),
      ])
      return
    }

    // Clear command
    if (command === "clear") {
      setHistory([
        { type: "system", content: "MindMash.AI Neural Terminal v1.0.4" },
        { type: "system", content: `Current context: ${slideContent.title}` },
      ])
      return
    }

    // Info command
    if (command === "info") {
      setHistory((prev) => [
        ...prev,
        { type: "system", content: `Title: ${slideContent.title}` },
        { type: "system", content: `Description: ${slideContent.description}` },
      ])
      return
    }

    // Commands command
    if (command === "commands") {
      setHistory((prev) => [
        ...prev,
        { type: "system", content: "Available context commands:" },
        ...slideContent.commands.map((cmd) => ({
          type: "system",
          content: `- ${cmd}: Execute ${cmd.replace(/_/g, " ")} command`,
        })),
      ])
      return
    }

    // Check if command is in available commands
    if (slideContent.commands.includes(command)) {
      setHistory((prev) => [
        ...prev,
        { type: "system", content: `Executing ${command.replace(/_/g, " ")}...` },
        {
          type: "system",
          content: `Command executed successfully. Data retrieved for ${slideContent.title.toLowerCase()}.`,
        },
      ])
      return
    }

    // Unknown command
    setHistory((prev) => [
      ...prev,
      { type: "error", content: `Unknown command: ${command}` },
      { type: "system", content: "Type 'help' for available commands." },
    ])
  }

  return (
    <div className="flex flex-col h-full">
      <div ref={terminalRef} className="flex-1 p-4 font-mono text-sm overflow-y-auto bg-black/80 text-green-400">
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
      <form onSubmit={handleSubmit} className="p-2 border-t border-gray-800 bg-black/90">
        <div className="flex items-center">
          <span className="text-cyan-400 font-mono mr-2">{">"}</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-cyan-400 font-mono"
            placeholder="Type a command..."
            autoFocus
          />
          <Button type="submit" variant="ghost" size="sm" className="text-xs text-cyan-400 hover:bg-cyan-900/30">
            EXEC
          </Button>
        </div>
      </form>
    </div>
  )
}
