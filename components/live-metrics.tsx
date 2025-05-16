"use client"

import { useState, useEffect } from "react"
import { Activity } from "lucide-react"

export default function LiveMetrics() {
  const [metrics, setMetrics] = useState({
    aiSyncRate: 92,
    tokenVelocity: 68,
    userActivity: 45,
    syndicateGrowth: 83,
  })

  // Simulate live metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        aiSyncRate: Math.min(99, Math.max(85, metrics.aiSyncRate + (Math.random() * 6 - 3))),
        tokenVelocity: Math.min(90, Math.max(50, metrics.tokenVelocity + (Math.random() * 8 - 4))),
        userActivity: Math.min(80, Math.max(30, metrics.userActivity + (Math.random() * 10 - 5))),
        syndicateGrowth: Math.min(95, Math.max(70, metrics.syndicateGrowth + (Math.random() * 5 - 2.5))),
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [metrics])

  return (
    <div className="border border-cyan-900/30 bg-black/60 rounded-sm">
      <div className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 px-2 py-1 border-b border-cyan-900/30">
        <h3 className="text-xs font-bold text-cyan-400 flex items-center">
          <Activity className="h-3 w-3 mr-1" /> LIVE METRICS
        </h3>
      </div>
      <div className="p-3 space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>AI SYNC RATE</span>
            <span className="text-cyan-400">{Math.round(metrics.aiSyncRate)}%</span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${metrics.aiSyncRate}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>TOKEN VELOCITY</span>
            <span className="text-purple-400">{Math.round(metrics.tokenVelocity)}%</span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${metrics.tokenVelocity}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>USER ACTIVITY</span>
            <span className="text-green-400">{Math.round(metrics.userActivity)}%</span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${metrics.userActivity}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>SYNDICATE GROWTH</span>
            <span className="text-pink-400">{Math.round(metrics.syndicateGrowth)}%</span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-pink-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${metrics.syndicateGrowth}%` }}
            ></div>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500 mt-2">
          <span className="animate-pulse">● </span>
          REAL-TIME DATA STREAM
          <span className="animate-pulse"> ●</span>
        </div>
      </div>
    </div>
  )
}
