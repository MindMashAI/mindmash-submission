"use client"

import { useState, useEffect } from "react"
import { Activity, BarChart, Gauge } from "lucide-react"

interface DashboardControlsProps {
  currentSlide: number
  totalSlides: number
}

export default function DashboardControls({ currentSlide, totalSlides }: DashboardControlsProps) {
  const [systemLoad, setSystemLoad] = useState(65)
  const [memoryUsage, setMemoryUsage] = useState(42)
  const [networkActivity, setNetworkActivity] = useState(28)

  // Simulate fluctuating system metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemLoad((prev) => Math.min(95, Math.max(40, prev + (Math.random() * 10 - 5))))
      setMemoryUsage((prev) => Math.min(80, Math.max(30, prev + (Math.random() * 8 - 4))))
      setNetworkActivity((prev) => Math.min(70, Math.max(10, prev + (Math.random() * 15 - 7.5))))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Increase system load when changing slides
  useEffect(() => {
    setSystemLoad((prev) => Math.min(95, prev + 15))
    setNetworkActivity((prev) => Math.min(70, prev + 20))

    const timeout = setTimeout(() => {
      setSystemLoad((prev) => Math.max(40, prev - 15))
      setNetworkActivity((prev) => Math.max(10, prev - 20))
    }, 1000)

    return () => clearTimeout(timeout)
  }, [currentSlide])

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="flex flex-col items-center">
        <Gauge className="h-6 w-6 text-cyan-400 mb-1" />
        <div className="h-24 w-6 bg-gray-900/70 rounded-full overflow-hidden relative">
          <div
            className={`absolute bottom-0 w-full transition-all duration-500 rounded-full ${
              systemLoad > 80 ? "bg-red-500" : systemLoad > 60 ? "bg-yellow-500" : "bg-green-500"
            }`}
            style={{ height: `${systemLoad}%` }}
          ></div>
        </div>
        <span className="text-xs font-mono mt-1 text-cyan-400">{Math.round(systemLoad)}%</span>
        <span className="text-[10px] text-gray-500">SYS</span>
      </div>

      <div className="flex flex-col items-center">
        <BarChart className="h-6 w-6 text-purple-400 mb-1" />
        <div className="h-24 w-6 bg-gray-900/70 rounded-full overflow-hidden relative">
          <div
            className="absolute bottom-0 w-full bg-purple-500 transition-all duration-500 rounded-full"
            style={{ height: `${memoryUsage}%` }}
          ></div>
        </div>
        <span className="text-xs font-mono mt-1 text-purple-400">{Math.round(memoryUsage)}%</span>
        <span className="text-[10px] text-gray-500">MEM</span>
      </div>

      <div className="flex flex-col items-center">
        <Activity className="h-6 w-6 text-pink-400 mb-1" />
        <div className="h-24 w-6 bg-gray-900/70 rounded-full overflow-hidden relative">
          <div
            className="absolute bottom-0 w-full bg-pink-500 transition-all duration-500 rounded-full"
            style={{ height: `${networkActivity}%` }}
          ></div>
        </div>
        <span className="text-xs font-mono mt-1 text-pink-400">{Math.round(networkActivity)}%</span>
        <span className="text-[10px] text-gray-500">NET</span>
      </div>

      <div className="text-xs font-mono text-gray-400 rotate-90 whitespace-nowrap mt-4">
        SLIDE {currentSlide + 1}/{totalSlides}
      </div>
    </div>
  )
}
