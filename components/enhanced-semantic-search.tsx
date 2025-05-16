"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Search, X, Zap } from "lucide-react"

interface EnhancedSemanticSearchProps {
  onSearch?: (query: string) => void
  className?: string
}

export default function EnhancedSemanticSearch({ onSearch, className = "" }: EnhancedSemanticSearchProps) {
  const [query, setQuery] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const styleElement = document.createElement("style")
    styleElement.textContent = `
      @keyframes searchPulse {
        0% { box-shadow: 0 0 5px rgba(0, 255, 255, 0.5), 0 0 10px rgba(0, 255, 255, 0.2); }
        50% { box-shadow: 0 0 15px rgba(0, 255, 255, 0.8), 0 0 20px rgba(0, 255, 255, 0.4); }
        100% { box-shadow: 0 0 5px rgba(0, 255, 255, 0.5), 0 0 10px rgba(0, 255, 255, 0.2); }
      }
    `
    document.head.appendChild(styleElement)

    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsExpanded(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (query.length > 2) {
      setIsLoading(true)
      // Simulate API call for semantic search suggestions
      const timer = setTimeout(() => {
        const mockSuggestions = [
          `Neural networks related to "${query}"`,
          `Thought clusters about "${query}"`,
          `Collaborative spaces discussing "${query}"`,
          `Recent innovations in "${query}"`,
          `Trending discussions on "${query}"`,
        ]
        setSuggestions(mockSuggestions)
        setIsLoading(false)
      }, 500)

      return () => clearTimeout(timer)
    } else {
      setSuggestions([])
    }
  }, [query])

  const handleSearch = () => {
    if (query.trim() && onSearch) {
      onSearch(query)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const clearSearch = () => {
    setQuery("")
    setSuggestions([])
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div
        className={`
          flex items-center bg-black/30 border border-cyan-500/30 rounded-full overflow-hidden
          transition-all duration-300 ease-in-out
          ${isExpanded ? "w-96 animate-[searchPulse_2s_infinite]" : "w-12 h-12 hover:w-96"}
        `}
        onClick={() => !isExpanded && setIsExpanded(true)}
      >
        <div className="flex items-center justify-center w-12 h-12">
          <Search className="w-5 h-5 text-cyan-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsExpanded(true)}
          placeholder="Search the neural network..."
          className={`
            bg-transparent border-none outline-none text-cyan-100 placeholder-cyan-300/50
            transition-all duration-300 ease-in-out w-full pr-10
            ${isExpanded ? "opacity-100" : "opacity-0"}
          `}
        />
        {query && isExpanded && (
          <button onClick={clearSearch} className="absolute right-3 text-cyan-400 hover:text-cyan-200">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isExpanded && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-black/80 border border-cyan-500/30 rounded-lg overflow-hidden z-50 backdrop-blur-sm">
          <div className="p-2">
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-cyan-500"></div>
              </div>
            ) : (
              <ul>
                {suggestions.map((suggestion, index) => (
                  <li key={index}>
                    <button
                      className="w-full text-left p-2 hover:bg-cyan-900/30 text-cyan-100 flex items-center gap-2 rounded transition-colors"
                      onClick={() => {
                        setQuery(suggestion)
                        handleSearch()
                      }}
                    >
                      <Zap className="w-4 h-4 text-cyan-400" />
                      <span>{suggestion}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
