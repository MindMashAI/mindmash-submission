"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavigationControlsProps {
  currentSlide: number
  totalSlides: number
  onNavigate: (slideIndex: number) => void
}

export default function NavigationControls({ currentSlide, totalSlides, onNavigate }: NavigationControlsProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onNavigate(currentSlide - 1)}
          disabled={currentSlide === 0}
          className="h-7 w-7 rounded-sm border-cyan-500/50 bg-black/50 hover:bg-cyan-900/30 hover:border-cyan-400"
        >
          <ChevronLeft className="h-4 w-4 text-cyan-400" />
        </Button>

        <span className="text-xs text-cyan-400">
          {currentSlide + 1}/{totalSlides}
        </span>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onNavigate(currentSlide + 1)}
          disabled={currentSlide === totalSlides - 1}
          className="h-7 w-7 rounded-sm border-cyan-500/50 bg-black/50 hover:bg-cyan-900/30 hover:border-cyan-400"
        >
          <ChevronRight className="h-4 w-4 text-cyan-400" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-1.5 justify-center">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => onNavigate(index)}
            className={`h-2 w-2 rounded-full transition-all ${
              currentSlide === index ? "bg-cyan-400" : "bg-cyan-900/50 hover:bg-cyan-700/70"
            }`}
          />
        ))}
      </div>

      <div className="space-y-1">
        {[
          { num: 1, label: "INTRO" },
          { num: 2, label: "MANIFESTO" },
          { num: 3, label: "PROBLEM" },
          { num: 4, label: "SOLUTION" },
          { num: 5, label: "FEATURES" },
          { num: 6, label: "WHY SOLANA" },
          { num: 7, label: "DEMO" },
          { num: 8, label: "POST-HACK PLAN" },
          { num: 9, label: "VISION" },
          { num: 10, label: "ASK" },
          { num: 11, label: "CLOSING" },
        ].map((item) => (
          <button
            key={item.num}
            onClick={() => onNavigate(item.num - 1)}
            className={`w-full text-left text-xs py-0.5 px-1 rounded-sm transition-colors ${
              currentSlide === item.num - 1
                ? "bg-cyan-900/50 text-cyan-400"
                : "hover:bg-gray-800/50 text-gray-400 hover:text-gray-300"
            }`}
          >
            {item.num}. {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}
