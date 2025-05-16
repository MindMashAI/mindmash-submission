"use client"
import { X, CheckCircle, AlertTriangle, Info } from "lucide-react"

export interface Notification {
  id: string
  type: "success" | "warning" | "info"
  message: string
  duration?: number
}

interface NotificationSystemProps {
  notifications: Notification[]
  onDismiss: (id: string) => void
}

export default function NotificationSystem({ notifications, onDismiss }: NotificationSystemProps) {
  return (
    <div className="fixed top-4 right-4 z-50 w-80 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-center p-3 rounded-md border shadow-md ${
            notification.type === "success"
              ? "bg-green-100 border-green-200 text-green-700"
              : notification.type === "warning"
                ? "bg-yellow-100 border-yellow-200 text-yellow-700"
                : "bg-blue-100 border-blue-200 text-blue-700"
          }`}
        >
          {notification.type === "success" && <CheckCircle className="h-4 w-4 mr-2" />}
          {notification.type === "warning" && <AlertTriangle className="h-4 w-4 mr-2" />}
          {notification.type === "info" && <Info className="h-4 w-4 mr-2" />}
          <div className="flex-1">{notification.message}</div>
          <button onClick={() => onDismiss(notification.id)} className="text-gray-500 hover:text-gray-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
