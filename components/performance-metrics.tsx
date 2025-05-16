"use client"

import { useState, useEffect } from "react"
import { Activity, Cpu, Zap, Clock } from "lucide-react"

interface PerformanceMetricsProps {
  isVisible: boolean
}

export default function PerformanceMetrics({ isVisible }: PerformanceMetricsProps) {
  const [metrics, setMetrics] = useState({
    responseTime: 0,
    cpuUsage: 0,
    memoryUsage: 0,
    aiEfficiency: 0,
  })

  // Simulate changing metrics
  useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      setMetrics({
        responseTime: Math.random() * 200 + 100, // 100-300ms
        cpuUsage: Math.random() * 30 + 10, // 10-40%
        memoryUsage: Math.random() * 20 + 30, // 30-50%
        aiEfficiency: Math.random() * 20 + 75, // 75-95%
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 left-4 bg-black/90 border border-cyan-900 rounded-md p-3 text-xs z-40 shadow-lg">
      <div className="flex items-center mb-2">
        <Activity className="h-3 w-3 text-cyan-400 mr-1" />
        <span className="text-cyan-400 font-medium">Performance Metrics</span>
      </div>

      <div className="space-y-2">
        <div>
          <div className="flex justify-between mb-1">
            <div className="flex items-center">
              <Clock className="h-3 w-3 text-gray-400 mr-1" />
              <span className="text-gray-400">Response Time</span>
            </div>
            <span className="text-cyan-400">{Math.round(metrics.responseTime)}ms</span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-500 transition-all duration-500"
              style={{ width: `${(metrics.responseTime / 300) * 100}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <div className="flex items-center">
              <Cpu className="h-3 w-3 text-gray-400 mr-1" />
              <span className="text-gray-400">CPU Usage</span>
            </div>
            <span className="text-cyan-400">{Math.round(metrics.cpuUsage)}%</span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 transition-all duration-500"
              style={{ width: `${metrics.cpuUsage}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <div className="flex items-center">
              <Zap className="h-3 w-3 text-gray-400 mr-1" />
              <span className="text-gray-400">AI Efficiency</span>
            </div>
            <span className="text-cyan-400">{Math.round(metrics.aiEfficiency)}%</span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${metrics.aiEfficiency}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}
