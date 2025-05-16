"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, CheckCircle, Info, X } from "lucide-react"

interface Alert {
  id: number
  type: "info" | "warning" | "success" | "error"
  message: string
  timeout: number
}

export default function SystemAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [nextId, setNextId] = useState(1)

  const addAlert = (type: Alert["type"], message: string, timeout = 5000) => {
    const id = nextId
    setNextId(id + 1)

    setAlerts((prev) => [...prev, { id, type, message, timeout }])

    if (timeout > 0) {
      setTimeout(() => {
        removeAlert(id)
      }, timeout)
    }
  }

  const removeAlert = (id: number) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
  }

  // Demo alerts
  useEffect(() => {
    // Initial system alert
    setTimeout(() => {
      addAlert("info", "Neural interface initialized", 4000)
    }, 2000)

    // Random system alerts
    const alertMessages = [
      { type: "info" as const, message: "AI model synchronization complete" },
      { type: "info" as const, message: "Knowledge graph updated" },
      { type: "success" as const, message: "Mash.BiT tokens minted successfully" },
      { type: "warning" as const, message: "Network latency detected" },
      { type: "info" as const, message: "New syndicate member joined" },
      { type: "success" as const, message: "Crossmint wallet integration verified" },
      { type: "warning" as const, message: "System resources optimizing" },
    ]

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const randomAlert = alertMessages[Math.floor(Math.random() * alertMessages.length)]
        addAlert(randomAlert.type, randomAlert.message, 4000)
      }
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed top-12 right-4 z-50 w-80 space-y-2 pointer-events-none">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`
            flex items-center p-3 rounded-md border backdrop-blur-md shadow-lg pointer-events-auto
            animate-slideInRight
            ${alert.type === "info" ? "bg-cyan-900/70 border-cyan-500/50 text-cyan-100" : ""}
            ${alert.type === "warning" ? "bg-yellow-900/70 border-yellow-500/50 text-yellow-100" : ""}
            ${alert.type === "success" ? "bg-green-900/70 border-green-500/50 text-green-100" : ""}
            ${alert.type === "error" ? "bg-red-900/70 border-red-500/50 text-red-100" : ""}
          `}
        >
          <div className="mr-3">
            {alert.type === "info" && <Info className="h-5 w-5 text-cyan-400" />}
            {alert.type === "warning" && <AlertTriangle className="h-5 w-5 text-yellow-400" />}
            {alert.type === "success" && <CheckCircle className="h-5 w-5 text-green-400" />}
            {alert.type === "error" && <AlertTriangle className="h-5 w-5 text-red-400" />}
          </div>
          <div className="flex-1 text-sm font-mono">{alert.message}</div>
          <button onClick={() => removeAlert(alert.id)} className="ml-2 text-gray-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
