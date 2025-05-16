"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Users, Zap, Hash, ChevronRight } from "lucide-react"
import { useAudio } from "@/components/audio-manager"
import type { ThoughtCluster, ThoughtNode } from "@/types/types"

interface TrendingClustersProps {
  clusters: ThoughtCluster[]
  thoughts: ThoughtNode[]
  onSelectCluster: (clusterId: string) => void
}

export function TrendingClusters({ clusters, thoughts, onSelectCluster }: TrendingClustersProps) {
  const [trendingClusters, setTrendingClusters] = useState<ThoughtCluster[]>([])
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null)
  const [showInsights, setShowInsights] = useState(false)
  const [clusterInsights, setClusterInsights] = useState<any>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<"trending" | "all">("trending")
  const insightsRef = useRef<HTMLDivElement>(null)
  const { playSound } = useAudio()
  const [expandedCluster, setExpandedCluster] = useState<string | null>(null)

  useEffect(() => {
    // Sort clusters by trending score
    const sortedClusters = [...clusters].sort((a, b) => b.trendingScore - a.trendingScore)

    // Add "recently active" flag to clusters with high trending scores
    const enhancedClusters = sortedClusters.map((cluster) => ({
      ...cluster,
      recentlyActive: cluster.trendingScore > 70,
    }))

    setTrendingClusters(enhancedClusters)
  }, [clusters])

  const handleClusterClick = (clusterId: string) => {
    setSelectedCluster(clusterId)
    onSelectCluster(clusterId)
    playSound("/sounds/feature-select.mp3")
  }

  const handleInsightsClick = (cluster: ThoughtCluster, e: React.MouseEvent) => {
    e.stopPropagation()
    setShowInsights(true)

    // Generate insights about the cluster
    const clusterThoughts = thoughts.filter((t) => cluster.posts.includes(t.id))
    const totalLikes = clusterThoughts.reduce((sum, t) => sum + t.likes, 0)
    const totalComments = clusterThoughts.reduce((sum, t) => (t.commentIds?.length || 0) + sum, 0)

    // Calculate most active users
    const userActivity: Record<string, { count: number; name: string }> = {}
    clusterThoughts.forEach((thought) => {
      const userId = thought.author.id
      const userName = thought.author.name

      if (!userActivity[userId]) {
        userActivity[userId] = { count: 0, name: userName }
      }
      userActivity[userId].count++
    })

    const mostActiveUsers = Object.entries(userActivity)
      .map(([id, data]) => ({ id, name: data.name, count: data.count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)

    // Calculate sentiment breakdown
    const sentiments = {
      positive: clusterThoughts.filter((t) => t.sentiment === "positive").length,
      neutral: clusterThoughts.filter((t) => t.sentiment === "neutral").length,
      negative: clusterThoughts.filter((t) => t.sentiment === "negative").length,
    }

    // Calculate engagement over time (mock data for visualization)
    const engagementTrend = [
      { day: "Mon", value: Math.floor(Math.random() * 50) + 10 },
      { day: "Tue", value: Math.floor(Math.random() * 50) + 20 },
      { day: "Wed", value: Math.floor(Math.random() * 50) + 30 },
      { day: "Thu", value: Math.floor(Math.random() * 50) + 40 },
      { day: "Fri", value: Math.floor(Math.random() * 50) + 50 },
      { day: "Sat", value: Math.floor(Math.random() * 50) + 40 },
      { day: "Sun", value: Math.floor(Math.random() * 50) + 60 },
    ]

    const insights = {
      totalThoughts: clusterThoughts.length,
      totalLikes,
      totalComments,
      engagementRate: totalLikes / (clusterThoughts.length || 1),
      mostActiveUsers,
      sentimentBreakdown: sentiments,
      keywords: cluster.tags.map((tag) => tag.replace("#", "")),
      recentlyActive: cluster.recentlyActive || false,
      engagementTrend,
      growthRate: Math.floor(Math.random() * 30) + 10, // Mock growth rate percentage
    }

    setClusterInsights(insights)
    playSound("/sounds/feature-select.mp3")
  }

  const closeInsights = () => {
    setShowInsights(false)
    playSound("/sounds/button-click.mp3")
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
    playSound("/sounds/maximize.mp3")
  }

  const switchTab = (tab: "trending" | "all") => {
    setActiveTab(tab)
    playSound("/sounds/button-click.mp3")
  }

  // Click outside to close insights
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (insightsRef.current && !insightsRef.current.contains(event.target as Node)) {
        setShowInsights(false)
      }
    }

    if (showInsights) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showInsights])

  // Add CSS for enhanced styling
  useEffect(() => {
    const style = document.createElement("style")
    style.id = "enhanced-trending-clusters-styles"
    style.textContent = `
      .trending-clusters {
        position: absolute;
        bottom: 20px;
        right: 20px;
        width: 320px;
        background: rgba(0, 0, 0, 0.85);
        border: 1px solid rgba(138, 43, 226, 0.4);
        border-radius: 12px;
        padding: 16px;
        color: white;
        z-index: 100;
        box-shadow: 0 0 25px rgba(138, 43, 226, 0.3);
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
        max-height: calc(100vh - 120px);
        display: flex;
        flex-direction: column;
      }
      
      .trending-clusters.expanded {
        width: 480px;
        height: calc(100vh - 120px);
      }
      
      .clusters-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .clusters-header-left {
        display: flex;
        align-items: center;
      }
      
      .trending-icon {
        color: #ff6b6b;
        margin-right: 8px;
      }
      
      .clusters-header h3 {
        font-size: 16px;
        font-weight: 600;
        margin: 0;
      }
      
      .clusters-tabs {
        display: flex;
        margin-bottom: 12px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .clusters-tab {
        padding: 8px 16px;
        font-size: 14px;
        cursor: pointer;
        color: rgba(255, 255, 255, 0.6);
        border-bottom: 2px solid transparent;
        transition: all 0.2s ease;
      }
      
      .clusters-tab.active {
        color: rgba(138, 43, 226, 1);
        border-bottom: 2px solid rgba(138, 43, 226, 1);
      }
      
      .clusters-list {
        overflow-y: auto;
        flex: 1;
        scrollbar-width: thin;
        scrollbar-color: rgba(138, 43, 226, 0.5) rgba(0, 0, 0, 0.2);
      }
      
      .clusters-list::-webkit-scrollbar {
        width: 6px;
      }
      
      .clusters-list::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 3px;
      }
      
      .clusters-list::-webkit-scrollbar-thumb {
        background-color: rgba(138, 43, 226, 0.5);
        border-radius: 3px;
      }
      
      .cluster-item {
        display: flex;
        align-items: center;
        padding: 12px;
        margin-bottom: 8px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
        overflow: hidden;
      }
      
      .cluster-item:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }
      
      .cluster-item.selected {
        background: rgba(138, 43, 226, 0.15);
        border-color: rgba(138, 43, 226, 0.5);
      }
      
      .cluster-item::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: var(--heat);
        background: linear-gradient(90deg, transparent, var(--heat-color));
        opacity: 0.15;
        z-index: 0;
      }
      
      .cluster-rank {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 600;
        margin-right: 12px;
        flex-shrink: 0;
        z-index: 1;
      }
      
      .cluster-content {
        flex: 1;
        z-index: 1;
      }
      
      .cluster-name {
        font-weight: 500;
        margin-bottom: 4px;
        display: flex;
        align-items: center;
      }
      
      .cluster-badge {
        font-size: 10px;
        padding: 2px 6px;
        border-radius: 10px;
        margin-left: 8px;
      }
      
      .cluster-badge.active {
        background: rgba(255, 87, 51, 0.2);
        color: #ff5733;
      }
      
      .cluster-stats {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
        margin-bottom: 6px;
      }
      
      .cluster-stat {
        display: flex;
        align-items: center;
      }
      
      .cluster-heat-indicator {
        height: 4px;
        border-radius: 2px;
      }
      
      .cluster-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
      }
      
      .cluster-tag {
        font-size: 10px;
        padding: 2px 6px;
        background: rgba(138, 43, 226, 0.2);
        color: rgba(138, 43, 226, 1);
        border-radius: 4px;
      }
      
      .cluster-insights-button {
        background: transparent;
        border: none;
        color: rgba(255, 255, 255, 0.6);
        padding: 8px;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.2s ease;
        z-index: 1;
        margin-left: 8px;
      }
      
      .cluster-insights-button:hover {
        color: white;
        background: rgba(255, 255, 255, 0.1);
      }
      
      .cluster-insights-modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90%;
        max-width: 600px;
        max-height: 90vh;
        background: rgba(0, 0, 0, 0.95);
        border: 1px solid rgba(138, 43, 226, 0.6);
        border-radius: 16px;
        padding: 20px;
        z-index: 1000;
        box-shadow: 0 0 30px rgba(138, 43, 226, 0.4);
        backdrop-filter: blur(20px);
        overflow-y: auto;
        display: flex;
        flex-direction: column;
      }
      
      .insights-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
        padding-bottom: 16px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .insights-header h3 {
        font-size: 18px;
        font-weight: 600;
        margin: 0;
        display: flex;
        align-items: center;
      }
      
      .insights-close {
        background: transparent;
        border: none;
        color: rgba(255, 255, 255, 0.6);
        font-size: 24px;
        cursor: pointer;
        transition: all 0.2s ease;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .insights-close:hover {
        color: white;
        background: rgba(255, 255, 255, 0.1);
      }
      
      .insights-content {
        flex: 1;
        overflow-y: auto;
      }
      
      .insights-overview {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;
        margin-bottom: 24px;
      }
      
      .insight-stat {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        padding: 16px;
        text-align: center;
      }
      
      .stat-value {
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 4px;
        background: linear-gradient(90deg, #9c27b0, #3f51b5);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      
      .stat-label {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
      }
      
      .insights-section {
        margin-bottom: 24px;
      }
      
      .insights-section h4 {
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 12px;
        color: rgba(255, 255, 255, 0.9);
      }
      
      .insights-users {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
      }
      
      .insight-user {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        padding: 12px;
        text-align: center;
      }
      
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(138, 43, 226, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 8px;
        font-weight: 600;
      }
      
      .user-name {
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 4px;
      }
      
      .user-count {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
      }
      
      .sentiment-bar {
        display: flex;
        height: 8px;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 8px;
      }
      
      .sentiment-positive {
        background: #4ade80;
        height: 100%;
      }
      
      .sentiment-neutral {
        background: #94a3b8;
        height: 100%;
      }
      
      .sentiment-negative {
        background: #f87171;
        height: 100%;
      }
      
      .sentiment-legend {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
      }
      
      .legend-item {
        display: flex;
        align-items: center;
      }
      
      .legend-item::before {
        content: '';
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-right: 4px;
      }
      
      .legend-item.positive::before {
        background: #4ade80;
      }
      
      .legend-item.neutral::before {
        background: #94a3b8;
      }
      
      .legend-item.negative::before {
        background: #f87171;
      }
      
      .keywords-cloud {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        padding: 12px;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 8px;
      }
      
      .keyword {
        padding: 4px 10px;
        background: rgba(138, 43, 226, 0.2);
        color: rgba(138, 43, 226, 1);
        border-radius: 4px;
        transition: all 0.2s ease;
      }
      
      .keyword:hover {
        background: rgba(138, 43, 226, 0.3);
        transform: scale(1.05);
      }
      
      .insights-alert {
        display: flex;
        align-items: center;
        padding: 12px;
        background: rgba(255, 87, 51, 0.1);
        border-left: 3px solid #ff5733;
        border-radius: 4px;
        margin-top: 16px;
        color: rgba(255, 255, 255, 0.9);
      }
      
      .engagement-chart {
        height: 150px;
        margin-top: 12px;
        padding: 16px;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 8px;
      }
      
      .chart-bars {
        display: flex;
        align-items: flex-end;
        height: 100px;
        gap: 12px;
      }
      
      .chart-bar {
        flex: 1;
        background: linear-gradient(180deg, rgba(138, 43, 226, 1), rgba(138, 43, 226, 0.4));
        border-radius: 4px 4px 0 0;
        transition: all 0.3s ease;
      }
      
      .chart-bar:hover {
        background: linear-gradient(180deg, rgba(138, 43, 226, 1), rgba(138, 43, 226, 0.6));
        transform: scaleY(1.05);
        transform-origin: bottom;
      }
      
      .chart-labels {
        display: flex;
        justify-content: space-between;
        margin-top: 8px;
        font-size: 10px;
        color: rgba(255, 255, 255, 0.6);
      }
      
      .chart-label {
        flex: 1;
        text-align: center;
      }
      
      .growth-indicator {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        margin-top: 12px;
      }
      
      .growth-value {
        font-size: 18px;
        font-weight: 600;
        color: #4ade80;
      }
      
      .growth-label {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.8);
      }
      
      .expand-button {
        background: transparent;
        border: none;
        color: rgba(255, 255, 255, 0.6);
        cursor: pointer;
        transition: all 0.2s ease;
        padding: 4px;
        border-radius: 4px;
      }
      
      .expand-button:hover {
        color: white;
        background: rgba(255, 255, 255, 0.1);
      }

      .neural-trending-clusters-component {
        /* Add your styles here */
      }

      .neural-section-title {
        /* Add your styles here */
      }

      .neural-clusters-list {
        /* Add your styles here */
      }

      .neural-cluster-item-advanced {
        /* Add your styles here */
      }

      .neural-cluster-header {
        /* Add your styles here */
      }

      .neural-cluster-name-container {
        /* Add your styles here */
      }

      .neural-cluster-icon {
        /* Add your styles here */
      }

      .neural-cluster-name {
        /* Add your styles here */
      }

      .neural-cluster-stats {
        /* Add your styles here */
      }

      .neural-cluster-count {
        /* Add your styles here */
      }

      .neural-trending-score {
        /* Add your styles here */
      }

      .neural-cluster-expand {
        /* Add your styles here */
      }

      .neural-cluster-details {
        /* Add your styles here */
      }

      .neural-cluster-tags {
        /* Add your styles here */
      }

      .neural-tag {
        /* Add your styles here */
      }

      .neural-cluster-thoughts {
        /* Add your styles here */
      }

      .neural-cluster-thought {
        /* Add your styles here */
      }

      .neural-thought-preview {
        /* Add your styles here */
      }

      .neural-cluster-focus-button {
        /* Add your styles here */
      }
    `

    // Check if style already exists before adding
    if (!document.getElementById("enhanced-trending-clusters-styles")) {
      document.head.appendChild(style)
    }

    return () => {
      const existingStyle = document.getElementById("enhanced-trending-clusters-styles")
      if (existingStyle) {
        document.head.removeChild(existingStyle)
      }
    }
  }, [])

  const handleExpandCluster = (clusterId: string) => {
    setExpandedCluster(expandedCluster === clusterId ? null : clusterId)
    playSound("/sounds/button-click.mp3")
  }

  const handleSelectCluster = (clusterId: string) => {
    onSelectCluster(clusterId)
    playSound("/sounds/feature-select.mp3")
  }

  // Get trending clusters sorted by score
  const trendingClustersSorted = [...clusters].sort((a, b) => b.trendingScore - a.trendingScore)

  // Get thoughts for a specific cluster
  const getClusterThoughts = (clusterId: string) => {
    return thoughts.filter((thought) => thought.clusterId === clusterId)
  }

  return (
    <div className="neural-trending-clusters-component">
      <h3 className="neural-section-title">
        <Users className="h-4 w-4 mr-2" />
        Trending Thought Clusters
      </h3>

      <div className="neural-clusters-list">
        {trendingClustersSorted.map((cluster) => (
          <div key={cluster.id} className="neural-cluster-item-advanced">
            <div className="neural-cluster-header" onClick={() => handleExpandCluster(cluster.id)}>
              <div className="neural-cluster-name-container">
                <div className="neural-cluster-icon">
                  <Hash className="h-4 w-4" />
                </div>
                <div className="neural-cluster-name">{cluster.name}</div>
              </div>

              <div className="neural-cluster-stats">
                <span className="neural-cluster-count">{cluster.posts.length} thoughts</span>
                <span className="neural-trending-score">
                  <Zap className="h-3 w-3 mr-1" />
                  {cluster.trendingScore}
                </span>
                <ChevronRight
                  className={`h-4 w-4 neural-cluster-expand ${expandedCluster === cluster.id ? "expanded" : ""}`}
                />
              </div>
            </div>

            {expandedCluster === cluster.id && (
              <div className="neural-cluster-details">
                <div className="neural-cluster-tags">
                  {cluster.tags.map((tag, i) => (
                    <span key={i} className="neural-tag">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="neural-cluster-thoughts">
                  {getClusterThoughts(cluster.id)
                    .filter((t) => !t.isComment)
                    .slice(0, 3)
                    .map((thought) => (
                      <div key={thought.id} className="neural-cluster-thought">
                        <div className="neural-thought-preview">
                          {thought.content.length > 60 ? `${thought.content.substring(0, 60)}...` : thought.content}
                        </div>
                      </div>
                    ))}
                </div>

                <button className="neural-cluster-focus-button" onClick={() => handleSelectCluster(cluster.id)}>
                  Focus on this cluster
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
