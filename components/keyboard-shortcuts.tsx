"use client"

import { useState, useEffect } from "react"
import { Keyboard, ArrowLeft, ArrowRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function KeyboardShortcuts() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  // Show keyboard shortcuts after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)

      // Auto-hide after 10 seconds
      const hideTimer = setTimeout(() => {
        setIsMinimized(true)
      }, 10000)

      return () => clearTimeout(hideTimer)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  if (isMinimized) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="fixed bottom-4 right-4 h-10 w-10 rounded-full bg-black/60 border border-cyan-900/50 z-50 hover:bg-black/80"
        onClick={() => setIsMinimized(false)}
      >
        <Keyboard className="h-5 w-5 text-cyan-400" />
      </Button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 backdrop-blur-md border border-cyan-900/50 rounded-lg p-4 z-50 shadow-lg animate-fadeIn">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-bold text-cyan-400 flex items-center">
          <Keyboard className="h-4 w-4 mr-2" />
          Keyboard Shortcuts
        </h3>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full hover:bg-gray-800"
            onClick={() => setIsMinimized(true)}
          >
            <Minimize className="h-3 w-3 text-gray-400" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full hover:bg-gray-800"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-3 w-3 text-gray-400" />
          </Button>
        </div>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Previous Slide</span>
          <div className="flex items-center space-x-1">
            <kbd className="px-2 py-1 bg-gray-900 rounded border border-gray-700 text-gray-300">
              <ArrowLeft className="h-3 w-3" />
            </kbd>
            <span className="text-gray-500">or</span>
            <kbd className="px-2 py-1 bg-gray-900 rounded border border-gray-700 text-gray-300">
              <ArrowUp className="h-3 w-3" />
            </kbd>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-300">Next Slide</span>
          <div className="flex items-center space-x-1">
            <kbd className="px-2 py-1 bg-gray-900 rounded border border-gray-700 text-gray-300">
              <ArrowRight className="h-3 w-3" />
            </kbd>
            <span className="text-gray-500">or</span>
            <kbd className="px-2 py-1 bg-gray-900 rounded border border-gray-700 text-gray-300">
              <ArrowDown className="h-3 w-3" />
            </kbd>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-300">Toggle Terminal</span>
          <kbd className="px-2 py-1 bg-gray-900 rounded border border-gray-700 text-gray-300">T</kbd>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-300">Execute Command</span>
          <kbd className="px-2 py-1 bg-gray-900 rounded border border-gray-700 text-gray-300">Enter</kbd>
        </div>
      </div>
    </div>
  )
}

function Minimize({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M8 3v3a2 2 0 0 1-2 2H3" />
      <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
      <path d="M3 16h3a2 2 0 0 1 2 2v3" />
      <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
    </svg>
  )
}

function ArrowDown({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </svg>
  )
}

function ArrowUp({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  )
}
