"use client"

import type React from "react"

import { useState } from "react"
import { SearchIcon } from "lucide-react"

interface SearchProps {
  placeholder?: string
  onSearch?: (query: string) => void
}

export function Search({ placeholder = "Search...", onSearch }: SearchProps) {
  const [query, setQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) onSearch(query)
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-black/50 border border-gray-700 rounded-md pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
        <SearchIcon className="h-4 w-4" />
      </div>
    </form>
  )
}
