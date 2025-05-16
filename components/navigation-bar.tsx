"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MessageSquare, Users, Zap, Settings, Cpu } from "lucide-react"

export default function NavigationBar() {
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState(pathname || "/")

  const isActive = (path: string) => {
    return activeTab === path
  }

  return (
    <div className="w-full bg-black border border-gray-800 rounded-md overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex-1 flex justify-between">
          <Link
            href="/chatrooms"
            className={`flex flex-col items-center justify-center py-2 px-3 transition-colors ${
              isActive("/chatrooms")
                ? "text-cyan-400 border-t-2 border-cyan-400"
                : "text-gray-400 hover:text-gray-300 border-t-2 border-transparent"
            }`}
            onClick={() => setActiveTab("/chatrooms")}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs mt-1">Chat Rooms</span>
          </Link>

          <Link
            href="/collabsphere"
            className={`flex flex-col items-center justify-center py-2 px-3 transition-colors ${
              isActive("/collabsphere")
                ? "text-purple-400 border-t-2 border-purple-400"
                : "text-gray-400 hover:text-gray-300 border-t-2 border-transparent"
            }`}
            onClick={() => setActiveTab("/collabsphere")}
          >
            <Users className="h-5 w-5" />
            <span className="text-xs mt-1">Collab.Sphere</span>
          </Link>

          <Link
            href="/syndicates"
            className={`flex flex-col items-center justify-center py-2 px-3 transition-colors ${
              isActive("/syndicates")
                ? "text-amber-400 border-t-2 border-amber-400"
                : "text-gray-400 hover:text-gray-300 border-t-2 border-transparent"
            }`}
            onClick={() => setActiveTab("/syndicates")}
          >
            <Zap className="h-5 w-5" />
            <span className="text-xs mt-1">Syndicates</span>
          </Link>

          <Link
            href="/neural-feed"
            className={`flex flex-col items-center justify-center py-2 px-3 transition-colors ${
              isActive("/neural-feed")
                ? "text-green-400 border-t-2 border-green-400"
                : "text-gray-400 hover:text-gray-300 border-t-2 border-transparent"
            }`}
            onClick={() => setActiveTab("/neural-feed")}
          >
            <Cpu className="h-5 w-5" />
            <span className="text-xs mt-1">Neural Feed</span>
          </Link>

          <Link
            href="/profile"
            className={`flex flex-col items-center justify-center py-2 px-3 transition-colors ${
              isActive("/profile")
                ? "text-fuchsia-400 border-t-2 border-fuchsia-400"
                : "text-gray-400 hover:text-gray-300 border-t-2 border-transparent"
            }`}
            onClick={() => setActiveTab("/profile")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span className="text-xs mt-1">Profile</span>
          </Link>

          <Link
            href="/settings"
            className={`flex flex-col items-center justify-center py-2 px-3 transition-colors ${
              isActive("/settings")
                ? "text-gray-200 border-t-2 border-gray-200"
                : "text-gray-400 hover:text-gray-300 border-t-2 border-transparent"
            }`}
            onClick={() => setActiveTab("/settings")}
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs mt-1">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
