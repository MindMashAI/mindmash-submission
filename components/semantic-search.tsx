"use client"

import { useState, useRef, useEffect } from "react"
import { Search, X, Filter, ArrowRight } from "lucide-react"
import { semanticSearch } from "@/lib/thought-cluster-utils"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { useAudio } from "@/components/audio-manager"
import type { ThoughtNode } from "@/types/types"

interface SemanticSearchProps {
  thoughts: ThoughtNode[]
  onSearchResults: (results: ThoughtNode[]) => void
  onClearSearch: () => void
}

export function SemanticSearch({ thoughts, onSearchResults, onClearSearch }: SemanticSearchProps) {
  const [query, setQuery] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    categories: [] as string[],
    sentiment: [] as string[],
    timeRange: "all",
  })
  const [suggestions, setSuggestions] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const { playSound } = useAudio()
  const [hasQuery, setHasQuery] = useState(false)

  // Extract unique categories and sentiments from thoughts
  const categories = Array.from(new Set(thoughts.map((t) => t.category).filter(Boolean)))
  const sentiments = ["positive", "neutral", "negative"]

  // Add CSS for enhanced styling
  useEffect(() => {
    const style = document.createElement("style")
    style.id = "enhanced-neural-search-styles"
    style.textContent = `
      .neural-search-container {
        position: absolute;
        top: 20px;
        left: 20px;
        z-index: 100;
      }
      
      .neural-search-toggle {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.7);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 0 15px rgba(138, 43, 226, 0.4);
      }
      
      .neural-search-toggle:hover {
        background: rgba(20, 20, 20, 0.9);
        border-color: rgba(255, 255, 255, 0.4);
        box-shadow: 0 0 20px rgba(138, 43, 226, 0.6);
      }
      
      .neural-search-toggle.expanded {
        background: rgba(138, 43, 226, 0.3);
        border-color: rgba(138, 43, 226, 0.6);
      }
      
      .neural-search-panel {
        position: absolute;
        top: 0;
        left: 50px;
        background: rgba(0, 0, 0, 0.85);
        border: 1px solid rgba(138, 43, 226, 0.4);
        border-radius: 12px;
        padding: 12px;
        box-shadow: 0 0 25px rgba(138, 43, 226, 0.3);
        backdrop-filter: blur(10px);
        overflow: hidden;
      }
      
      .neural-search-input-container {
        display: flex;
        align-items: center;
        background: rgba(30, 30, 30, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        overflow: hidden;
      }
      
      .neural-search-input {
        flex: 1;
        background: transparent;
        border: none;
        color: white;
        padding: 10px 12px;
        font-size: 14px;
      }
      
      .neural-search-input:focus {
        outline: none;
      }
      
      .neural-search-input::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }
      
      .neural-search-clear,
      .neural-search-filter,
      .neural-search-submit {
        background: transparent;
        border: none;
        color: rgba(255, 255, 255, 0.6);
        padding: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      .neural-search-clear:hover,
      .neural-search-filter:hover,
      .neural-search-submit:hover {
        color: white;
        background: rgba(255, 255, 255, 0.1);
      }
      
      .neural-search-filter.active {
        color: rgba(138, 43, 226, 0.8);
        background: rgba(138, 43, 226, 0.2);
      }
      
      .neural-search-submit {
        background: rgba(138, 43, 226, 0.3);
        border-radius: 0 6px 6px 0;
        padding: 8px 12px;
      }
      
      .neural-search-submit:hover {
        background: rgba(138, 43, 226, 0.5);
      }
      
      .neural-search-spinner {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top: 2px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      .neural-search-suggestions {
        margin-top: 10px;
        background: rgba(20, 20, 20, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        overflow: hidden;
      }
      
      .neural-suggestions-title {
        padding: 8px 12px;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .neural-suggestion-item {
        display: flex;
        align-items: center;
        padding: 8px 12px;
        cursor: pointer;
        transition: all 0.2s ease;
        gap: 8px;
      }
      
      .neural-suggestion-item:hover {
        background: rgba(138, 43, 226, 0.2);
      }
      
      .suggestion-icon {
        color: rgba(138, 43, 226, 0.8);
      }
      
      .suggestion-text {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.8);
      }
      
      .neural-search-filters {
        margin-top: 10px;
        background: rgba(20, 20, 20, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        overflow: hidden;
      }
      
      .neural-filters-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 12px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .neural-filters-header h4 {
        font-size: 13px;
        font-weight: 600;
        margin: 0;
      }
      
      .neural-filters-clear {
        font-size: 12px;
        color: rgba(138, 43, 226, 0.8);
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0;
      }
      
      .neural-filters-clear:hover {
        text-decoration: underline;
      }
      
      .neural-filter-section {
        padding: 10px 12px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      }
      
      .neural-filter-section:last-child {
        border-bottom: none;
      }
      
      .neural-filter-section h5 {
        font-size: 12px;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.7);
        margin: 0 0 8px 0;
      }
      
      .neural-filter-options {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      
      .neural-filter-option {
        font-size: 12px;
        padding: 4px 8px;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.7);
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      .neural-filter-option:hover {
        background: rgba(255, 255, 255, 0.15);
      }
      
      .neural-filter-option.selected {
        background: rgba(138, 43, 226, 0.3);
        color: rgba(255, 255, 255, 0.9);
        border: 1px solid rgba(138, 43, 226, 0.5);
      }
    `

    // Check if style already exists before adding
    if (!document.getElementById("enhanced-neural-search-styles")) {
      document.head.appendChild(style)
    }

    return () => {
      const existingStyle = document.getElementById("enhanced-neural-search-styles")
      if (existingStyle) {
        document.head.removeChild(existingStyle)
      }
    }
  }, [])

  // Toggle search expansion
  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
    if (!isExpanded && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 300)
    }
    playSound("/sounds/button-click.mp3")
  }

  // Toggle filter panel
  const toggleFilters = () => {
    setShowFilters(!showFilters)
    playSound("/sounds/button-click.mp3")
  }

  // Update filter selections
  const toggleFilter = (type: string, value: string) => {
    setFilters((prev) => {
      if (type === "timeRange") {
        return { ...prev, timeRange: value }
      }

      const filterArray = prev[type as keyof typeof prev] as string[]
      if (filterArray.includes(value)) {
        return {
          ...prev,
          [type]: filterArray.filter((item) => item !== value),
        }
      } else {
        return {
          ...prev,
          [type]: [...filterArray, value],
        }
      }
    })
    playSound("/sounds/button-click.mp3")
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      categories: [],
      sentiment: [],
      timeRange: "all",
    })
    playSound("/sounds/button-click.mp3")
  }

  // Handle search submission
  const handleSearch = () => {
    if (!query.trim()) {
      onClearSearch()
      return
    }

    setIsSearching(true)
    playSound("/sounds/feature-select.mp3")

    // Apply semantic search
    let results = semanticSearch(query, thoughts)

    // Apply filters
    if (filters.categories.length > 0) {
      results = results.filter((t) => t.category && filters.categories.includes(t.category))
    }

    if (filters.sentiment.length > 0) {
      results = results.filter((t) => t.sentiment && filters.sentiment.includes(t.sentiment))
    }

    if (filters.timeRange !== "all") {
      const now = new Date()
      const timeFilters: Record<string, number> = {
        today: 24 * 60 * 60 * 1000,
        week: 7 * 24 * 60 * 60 * 1000,
        month: 30 * 24 * 60 * 60 * 1000,
      }

      results = results.filter((t) => {
        // For demo purposes, use simple time checks based on text
        if (filters.timeRange === "today") {
          return t.timestamp.includes("Just now") || t.timestamp.includes("minute") || t.timestamp.includes("hour")
        } else if (filters.timeRange === "week") {
          return !t.timestamp.includes("month") && !t.timestamp.includes("year")
        } else if (filters.timeRange === "month") {
          return !t.timestamp.includes("year")
        }
        return true
      })
    }

    // Send results to parent component
    setTimeout(() => {
      onSearchResults(results)
      setIsSearching(false)

      toast({
        title: `Found ${results.length} results`,
        description: results.length > 0 ? "Showing most relevant thoughts" : "Try a different search term",
      })
    }, 800)
  }

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    handleSearch()
    playSound("/sounds/button-click.mp3")
  }

  // Clear search
  const clearSearch = () => {
    setQuery("")
    onClearSearch()
    playSound("/sounds/button-click.mp3")
  }

  useEffect(() => {
    setHasQuery(query.length >= 2)
  }, [query])

  // Generate search suggestions based on current thoughts
  useEffect(() => {
    let allSuggestions: string[] = []
    if (hasQuery) {
      // Extract keywords from thoughts
      const keywords = new Set<string>()
      thoughts.forEach((thought) => {
        const content = thought.content.toLowerCase()
        if (content.includes(query.toLowerCase())) {
          // Extract words around the query
          const words = content.split(/\s+/)
          const queryIndex = words.findIndex((word) => word.includes(query.toLowerCase()))
          if (queryIndex >= 0) {
            // Get words before and after the query
            const start = Math.max(0, queryIndex - 2)
            const end = Math.min(words.length, queryIndex + 3)
            const phrase = words.slice(start, end).join(" ")
            if (phrase.length > query.length) {
              keywords.add(phrase)
            }
          }
        }
      })

      // Get tags that match the query
      const matchingTags = new Set<string>()
      thoughts.forEach((thought) => {
        if (thought.tags) {
          thought.tags.forEach((tag: string) => {
            if (tag.toLowerCase().includes(query.toLowerCase())) {
              matchingTags.add(tag)
            }
          })
        }
      })

      // Combine suggestions
      allSuggestions = [...Array.from(keywords), ...Array.from(matchingTags)]
    }
    setSuggestions(allSuggestions.slice(0, 5)) // Limit to 5 suggestions
  }, [hasQuery, query, thoughts])

  return (
    <div className="neural-search-container">
      <button
        className={`neural-search-toggle ${isExpanded ? "expanded" : ""}`}
        onClick={toggleExpand}
        aria-label="Toggle search"
      >
        {isExpanded ? <X size={18} /> : <Search size={18} />}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="neural-search-panel"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "320px", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="neural-search-input-container">
              <input
                ref={inputRef}
                type="text"
                className="neural-search-input"
                placeholder="Search thoughts, topics, clusters..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              {query && (
                <button className="neural-search-clear" onClick={clearSearch} aria-label="Clear search">
                  <X size={16} />
                </button>
              )}
              <button
                className={`neural-search-filter ${showFilters ? "active" : ""}`}
                onClick={toggleFilters}
                aria-label="Show filters"
              >
                <Filter size={16} />
              </button>
              <button
                className="neural-search-submit"
                onClick={handleSearch}
                disabled={isSearching}
                aria-label="Search"
              >
                {isSearching ? <div className="neural-search-spinner"></div> : <ArrowRight size={16} />}
              </button>
            </div>

            <AnimatePresence>
              {suggestions.length > 0 && query && (
                <motion.div
                  className="neural-search-suggestions"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <div className="neural-suggestions-title">Suggestions</div>
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="neural-suggestion-item"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <Search size={12} className="suggestion-icon" />
                      <span className="suggestion-text">{suggestion}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  className="neural-search-filters"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <div className="neural-filters-header">
                    <h4>Filter Results</h4>
                    <button className="neural-filters-clear" onClick={clearFilters}>
                      Clear All
                    </button>
                  </div>

                  <div className="neural-filter-section">
                    <h5>Categories</h5>
                    <div className="neural-filter-options">
                      {categories.map((category) => (
                        <div
                          key={category}
                          className={`neural-filter-option ${filters.categories.includes(category) ? "selected" : ""}`}
                          onClick={() => toggleFilter("categories", category)}
                        >
                          {category}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="neural-filter-section">
                    <h5>Sentiment</h5>
                    <div className="neural-filter-options">
                      {sentiments.map((sentiment) => (
                        <div
                          key={sentiment}
                          className={`neural-filter-option ${filters.sentiment.includes(sentiment) ? "selected" : ""}`}
                          onClick={() => toggleFilter("sentiment", sentiment)}
                        >
                          {sentiment}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="neural-filter-section">
                    <h5>Time Range</h5>
                    <div className="neural-filter-options">
                      {["today", "week", "month", "all"].map((timeRange) => (
                        <div
                          key={timeRange}
                          className={`neural-filter-option ${filters.timeRange === timeRange ? "selected" : ""}`}
                          onClick={() => toggleFilter("timeRange", timeRange)}
                        >
                          {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
