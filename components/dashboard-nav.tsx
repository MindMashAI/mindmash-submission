"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Brain, Users, Zap, MessageSquare, Settings, HelpCircle, Wallet } from "lucide-react"
import { useAudio } from "@/components/audio-manager"

export default function DashboardNav() {
  const pathname = usePathname()
  const { playSound } = useAudio()
  const [expanded, setExpanded] = useState(true)

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <Brain className="h-5 w-5" />,
    },
    {
      name: "Community",
      href: "/community",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Wallet",
      href: "/solflare",
      icon: <Wallet className="h-5 w-5" />,
    },
    {
      name: "Thought Mining",
      href: "/mining",
      icon: <Zap className="h-5 w-5" />,
    },
    {
      name: "Neural Chat",
      href: "/chat",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
    {
      name: "Help",
      href: "/help",
      icon: <HelpCircle className="h-5 w-5" />,
    },
  ]

  return (
    <div
      className={`bg-gradient-to-br from-gray-900 to-black rounded-lg border border-cyan-900/30 p-3 ${expanded ? "w-60" : "w-16"} transition-all duration-300`}
    >
      <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            setExpanded(!expanded)
            playSound("/sounds/button-click.mp3")
          }}
          className="text-gray-500 hover:text-cyan-400 transition-colors"
        >
          {expanded ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6"></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          )}
        </button>
      </div>
      <nav>
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => playSound("/sounds/button-click.mp3")}
                  className={`flex items-center p-2 rounded-md transition-colors ${
                    isActive ? "bg-cyan-900/20 text-cyan-400" : "text-gray-400 hover:bg-gray-800/50 hover:text-cyan-400"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {expanded && <span>{item.name}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
