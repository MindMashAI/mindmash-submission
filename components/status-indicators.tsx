"use client"

import { useEffect, useState } from "react"
import { Shield, Cpu, Wifi } from "lucide-react"

interface StatusIndicatorsProps {
  powerLevel: number
}

export default function StatusIndicators({ powerLevel }: StatusIndicatorsProps) {
  const [securityStatus, setSecurityStatus] = useState("optimal")
  const [cpuStatus, setCpuStatus] = useState("normal")
  const [networkStatus, setNetworkStatus] = useState("connected")

  // Simulate changing statuses
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly change security status
      if (Math.random() > 0.9) {
        setSecurityStatus((prev) => (prev === "optimal" ? "scanning" : "optimal"))
      }

      // CPU status based on power level
      setCpuStatus(powerLevel > 90 ? "critical" : powerLevel > 80 ? "high" : powerLevel > 60 ? "normal" : "low")

      // Randomly change network status
      if (Math.random() > 0.95) {
        setNetworkStatus((prev) => (prev === "connected" ? "syncing" : "connected"))
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [powerLevel])

  return (
    <>
      <div className="flex flex-col items-center">
        <Shield
          className={`h-6 w-6 ${securityStatus === "optimal" ? "text-green-400" : "text-yellow-400 animate-pulse"}`}
        />
        <div className="mt-1 px-2 py-1 rounded-full bg-gray-900/70 border border-gray-800">
          <span
            className={`text-[10px] font-mono ${securityStatus === "optimal" ? "text-green-400" : "text-yellow-400"}`}
          >
            {securityStatus.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <Cpu
          className={`h-6 w-6 ${
            cpuStatus === "critical"
              ? "text-red-400 animate-pulse"
              : cpuStatus === "high"
                ? "text-yellow-400"
                : cpuStatus === "normal"
                  ? "text-green-400"
                  : "text-blue-400"
          }`}
        />
        <div className="mt-1 px-2 py-1 rounded-full bg-gray-900/70 border border-gray-800">
          <span
            className={`text-[10px] font-mono ${
              cpuStatus === "critical"
                ? "text-red-400"
                : cpuStatus === "high"
                  ? "text-yellow-400"
                  : cpuStatus === "normal"
                    ? "text-green-400"
                    : "text-blue-400"
            }`}
          >
            {cpuStatus.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <Wifi
          className={`h-6 w-6 ${networkStatus === "connected" ? "text-green-400" : "text-cyan-400 animate-pulse"}`}
        />
        <div className="mt-1 px-2 py-1 rounded-full bg-gray-900/70 border border-gray-800">
          <span
            className={`text-[10px] font-mono ${networkStatus === "connected" ? "text-green-400" : "text-cyan-400"}`}
          >
            {networkStatus.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center mt-auto">
        <div className="h-24 w-6 bg-gray-900/70 rounded-full overflow-hidden relative">
          <div
            className={`absolute bottom-0 w-full transition-all duration-500 rounded-full ${
              powerLevel > 80 ? "bg-green-500" : powerLevel > 50 ? "bg-yellow-500" : "bg-red-500"
            }`}
            style={{ height: `${powerLevel}%` }}
          ></div>
        </div>
        <span className="text-xs font-mono mt-1 text-gray-400">{Math.round(powerLevel)}%</span>
        <span className="text-[10px] text-gray-500">POWER</span>
      </div>
    </>
  )
}
