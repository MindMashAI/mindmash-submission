"use client"

import { useState, useEffect, useRef } from "react"
import { TrendingUp, Users, Zap, Brain, Network, Filter } from "lucide-react"

interface Cluster {
  id: string
  name: string
  count: number
  growth: number
  type: "neural" | "social" | "innovation" | "research" | "collaboration"
}

interface EnhancedTrendingClustersProps {
  className?: string
  onSelectCluster?: (cluster: Cluster) => void
}

export default function EnhancedTrendingClusters({ className = "", onSelectCluster }: EnhancedTrendingClustersProps) {
  const [clusters, setClusters] = useState<Cluster[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedType, setSelectedType] = useState<Cluster["type"] | "all">("all")
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Load trending clusters
  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      const mockClusters: Cluster[] = [
        { id: "1", name: "Quantum Neural Networks", count: 342, growth: 28, type: "neural" },
        { id: "2", name: "Decentralized Collaboration", count: 287, growth: 15, type: "collaboration" },
        { id: "3", name: "Emergent AI Behaviors", count: 256, growth: 32, type: "innovation" },
        { id: "4", name: "Synthetic Data Generation", count: 198, growth: 12, type: "research" },
        { id: "5", name: "Cross-modal Learning", count: 176, growth: 8, type: "neural" },
        { id: "6", name: "Community-driven Development", count: 154, growth: 18, type: "social" },
        { id: "7", name: "Neuromorphic Computing", count: 132, growth: 22, type: "innovation" },
        { id: "8", name: "Distributed Knowledge Graphs", count: 118, growth: 14, type: "research" },
        { id: "9", name: "Collective Intelligence Systems", count: 105, growth: 19, type: "collaboration" },
        { id: "10", name: "Autonomous Agent Networks", count: 98, growth: 25, type: "neural" },
        { id: "11", name: "Semantic Web Integration", count: 87, growth: 11, type: "research" },
        { id: "12", name: "Swarm Intelligence Models", count: 76, growth: 16, type: "innovation" },
      ]
      setClusters(mockClusters)
      setIsLoading(false)
    }, 1200)

    return () => clearTimeout(timer)
  }, [])

  const filteredClusters =
    selectedType === "all" ? clusters : clusters.filter((cluster) => cluster.type === selectedType)

  const getTypeIcon = (type: Cluster["type"]) => {
    switch (type) {
      case "neural":
        return <Brain className="w-4 h-4" />
      case "social":
        return <Users className="w-4 h-4" />
      case "innovation":
        return <Zap className="w-4 h-4" />
      case "research":
        return <TrendingUp className="w-4 h-4" />
      case "collaboration":
        return <Network className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: Cluster["type"]) => {
    switch (type) {
      case "neural":
        return "text-purple-400 bg-purple-900/20 border-purple-500/30"
      case "social":
        return "text-blue-400 bg-blue-900/20 border-blue-500/30"
      case "innovation":
        return "text-yellow-400 bg-yellow-900/20 border-yellow-500/30"
      case "research":
        return "text-green-400 bg-green-900/20 border-green-500/30"
      case "collaboration":
        return "text-cyan-400 bg-cyan-900/20 border-cyan-500/30"
    }
  }

  // Add custom scrollbar styles to the component
  useEffect(() => {
    if (scrollContainerRef.current) {
      const style = document.createElement("style")
      style.textContent = `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(79, 209, 197, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(79, 209, 197, 0.5);
        }
      `
      document.head.appendChild(style)

      return () => {
        document.head.removeChild(style)
      }
    }
  }, [])

  return (
    <div className={`bg-black/30 border border-cyan-500/20 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-cyan-300 text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Trending Thought Clusters
        </h3>
        <div className="relative group">
          <button className="p-1.5 rounded-md bg-cyan-900/30 text-cyan-400 hover:bg-cyan-900/50 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
          <div className="absolute right-0 mt-2 bg-black/80 backdrop-blur-md border border-cyan-500/30 rounded-md p-2 shadow-lg hidden group-hover:block z-10">
            <div className="flex flex-col gap-1 min-w-[120px]">
              <button
                onClick={() => setSelectedType("all")}
                className={`px-3 py-1.5 text-xs rounded-md transition-colors text-left ${
                  selectedType === "all"
                    ? "bg-cyan-900/50 text-cyan-100 border-l-2 border-cyan-500"
                    : "text-cyan-400 hover:bg-cyan-900/30"
                }`}
              >
                All Clusters
              </button>
              <button
                onClick={() => setSelectedType("neural")}
                className={`px-3 py-1.5 text-xs rounded-md transition-colors text-left flex items-center gap-2 ${
                  selectedType === "neural"
                    ? "bg-purple-900/50 text-purple-100 border-l-2 border-purple-500"
                    : "text-purple-400 hover:bg-purple-900/30"
                }`}
              >
                <Brain className="w-3 h-3" /> Neural
              </button>
              <button
                onClick={() => setSelectedType("innovation")}
                className={`px-3 py-1.5 text-xs rounded-md transition-colors text-left flex items-center gap-2 ${
                  selectedType === "innovation"
                    ? "bg-yellow-900/50 text-yellow-100 border-l-2 border-yellow-500"
                    : "text-yellow-400 hover:bg-yellow-900/30"
                }`}
              >
                <Zap className="w-3 h-3" /> Innovation
              </button>
              <button
                onClick={() => setSelectedType("research")}
                className={`px-3 py-1.5 text-xs rounded-md transition-colors text-left flex items-center gap-2 ${
                  selectedType === "research"
                    ? "bg-green-900/50 text-green-100 border-l-2 border-green-500"
                    : "text-green-400 hover:bg-green-900/30"
                }`}
              >
                <TrendingUp className="w-3 h-3" /> Research
              </button>
              <button
                onClick={() => setSelectedType("social")}
                className={`px-3 py-1.5 text-xs rounded-md transition-colors text-left flex items-center gap-2 ${
                  selectedType === "social"
                    ? "bg-blue-900/50 text-blue-100 border-l-2 border-blue-500"
                    : "text-blue-400 hover:bg-blue-900/30"
                }`}
              >
                <Users className="w-3 h-3" /> Social
              </button>
              <button
                onClick={() => setSelectedType("collaboration")}
                className={`px-3 py-1.5 text-xs rounded-md transition-colors text-left flex items-center gap-2 ${
                  selectedType === "collaboration"
                    ? "bg-cyan-900/50 text-cyan-100 border-l-2 border-cyan-500"
                    : "text-cyan-400 hover:bg-cyan-900/30"
                }`}
              >
                <Network className="w-3 h-3" /> Collaboration
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        <button
          onClick={() => setSelectedType("all")}
          className={`px-2 py-1 text-xs rounded-md transition-colors ${
            selectedType === "all"
              ? "bg-cyan-900/50 text-cyan-100 border border-cyan-500/50"
              : "text-cyan-400 hover:bg-cyan-900/30"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setSelectedType("neural")}
          className={`px-2 py-1 text-xs rounded-md transition-colors ${
            selectedType === "neural"
              ? "bg-purple-900/50 text-purple-100 border border-purple-500/50"
              : "text-purple-400 hover:bg-purple-900/30"
          }`}
        >
          Neural
        </button>
        <button
          onClick={() => setSelectedType("innovation")}
          className={`px-2 py-1 text-xs rounded-md transition-colors ${
            selectedType === "innovation"
              ? "bg-yellow-900/50 text-yellow-100 border border-yellow-500/50"
              : "text-yellow-400 hover:bg-yellow-900/30"
          }`}
        >
          Innovation
        </button>
        <button
          onClick={() => setSelectedType("research")}
          className={`px-2 py-1 text-xs rounded-md transition-colors ${
            selectedType === "research"
              ? "bg-green-900/50 text-green-100 border border-green-500/50"
              : "text-green-400 hover:bg-green-900/30"
          }`}
        >
          Research
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-cyan-900/20 rounded-md"></div>
          ))}
        </div>
      ) : (
        <div
          ref={scrollContainerRef}
          className="space-y-2 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(79, 209, 197, 0.3) rgba(0, 0, 0, 0.2)",
          }}
        >
          {filteredClusters.map((cluster) => (
            <button
              key={cluster.id}
              onClick={() => onSelectCluster && onSelectCluster(cluster)}
              className={`
                w-full flex items-center justify-between p-2 rounded-md border
                transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_8px_rgba(79,209,197,0.3)]
                ${getTypeColor(cluster.type)}
              `}
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-black/30">{getTypeIcon(cluster.type)}</div>
                <span>{cluster.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm opacity-70">{cluster.count} nodes</span>
                <div className="flex items-center gap-1 text-green-400">
                  <TrendingUp className="w-3 h-3" />
                  <span className="text-xs">{cluster.growth}%</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
