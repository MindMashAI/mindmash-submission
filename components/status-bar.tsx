"use client"

import { Power } from "lucide-react"
import { Button } from "@/components/ui/button"

interface StatusBarProps {
  systemStatus: string
  currentSlide: number
  totalSlides: number
  onSystemToggle: () => void
}

export default function StatusBar({ systemStatus, currentSlide, totalSlides, onSystemToggle }: StatusBarProps) {
  return (
    <div className="h-10 border-b border-cyan-900/30 bg-black/60 flex items-center justify-between px-4">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full bg-purple-900/50 border border-purple-500/50 hover:bg-purple-800/70"
          onClick={onSystemToggle}
        >
          <Power className="h-3 w-3 text-purple-400" />
        </Button>
        <div className="text-xs">
          <span className="text-gray-400">SYS:</span>
          <span className={systemStatus === "online" ? "text-green-400" : "text-amber-400"}>
            {" "}
            {systemStatus.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="flex items-center">
        <h1 className="text-lg font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
          MindMash.AI Command Interface
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-xs">
          <span className="text-gray-400">SLIDE:</span>
          <span className="text-cyan-400">
            {" "}
            {currentSlide}/{totalSlides}
          </span>
        </div>
        <div className="text-xs">
          <span className="text-gray-400">TIME:</span>
          <span className="text-cyan-400"> {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  )
}
