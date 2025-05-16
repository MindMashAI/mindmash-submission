"use client"
import { X, CheckCircle, AlertTriangle, Info } from "lucide-react"

export interface Notification {
  id: string
  type: "success" | "warning" | "info"
  message: string
  duration?: number
}

interface NotificationSystemProps {
  notifications?: Notification[]
  onDismiss?: (id: string) => void
}

export function NotificationSystem({ notifications = [], onDismiss = () => {} }: NotificationSystemProps) {
  // If notifications is undefined or empty, return null
  if (!notifications || notifications.length === 0) return null

  return (
    <div className="flex flex-col space-y-2 max-w-lg overflow-hidden">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-center px-3 py-2 rounded-md animate-fadeIn bg-black/70 backdrop-filter backdrop-blur-md border shadow-md transition-all duration-300 hover:border-cyan-700 ${
            notification.type === "success"
              ? "border-green-900/50"
              : notification.type === "warning"
                ? "border-yellow-900/50"
                : "border-cyan-900/50"
          }`}
        >
          <div className="mr-2 flex-shrink-0">
            {notification.type === "success" && <CheckCircle className="h-4 w-4 text-green-400" />}
            {notification.type === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-400" />}
            {notification.type === "info" && <Info className="h-4 w-4 text-cyan-400" />}
          </div>
          <div className="flex-1 text-sm max-w-xs">
            <span
              className={`
              ${
                notification.type === "success"
                  ? "text-green-400"
                  : notification.type === "warning"
                    ? "text-yellow-400"
                    : "text-cyan-400"
              }
            `}
            >
              {notification.message}
            </span>
          </div>
          {onDismiss && (
            <button
              onClick={() => onDismiss(notification.id)}
              className="ml-2 text-gray-400 hover:text-white flex-shrink-0 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
