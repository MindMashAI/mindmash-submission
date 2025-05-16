"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"

export default function Roadmap() {
  const [expandedItem, setExpandedItem] = useState<number | null>(null)

  const roadmapItems = [
    {
      phase: "Phase 1",
      title: "Ideation & Team Formation",
      dates: "April 4 – April 10",
      status: "completed",
      emoji: "✅",
      details: [
        "Finalize core concept, theme, and architecture",
        "Lock tech stack: Solana, GPT-4, Grok, Gemini, Crossmint, GOAT SDK",
        "Team onboarding & role assignment",
        "NDAs signed + communication channel setup",
      ],
    },
    {
      phase: "Phase 2",
      title: "Core MVP Development",
      dates: "April 11 – April 24",
      status: "current",
      emoji: "🚧",
      details: [
        "Build real-time AI chat (multi-model collaboration)",
        "Design Mash.BiT token logic + basic wallet integration",
        "Scaffold backend (Flask + Supabase)",
        "Crossmint + GOAT SDK integration",
        "Frontend base UI (Next.js + Tailwind) with cyberpunk theme",
      ],
    },
    {
      phase: "Phase 3",
      title: "Interactive Systems & UX Polish",
      dates: "April 25 – May 6",
      status: "upcoming",
      emoji: "🎮",
      details: [
        "Implement AI Collaboration Map and feedback system",
        "Build onboarding flow with 8-bit pixel tutorial screens",
        "Finalize token rewards + redemption system",
        "Polish UI/UX, add animations, audio, and feel",
        "Cross-device QA testing",
      ],
    },
    {
      phase: "Phase 4",
      title: "Final Testing & Submission",
      dates: "May 7 – May 15",
      status: "upcoming",
      emoji: "📸",
      details: [
        "Full QA + final polish",
        "Record demo walkthrough + build pitch deck",
        "Deploy live version (Vercel + backend hosting)",
        "Submit to Colosseum Hackathon",
        "Launch X + community announcement",
      ],
    },
  ]

  const handleItemClick = (index: number) => {
    setExpandedItem(expandedItem === index ? null : index)
  }

  return (
    <div className="max-w-4xl h-[calc(100vh-240px)] flex flex-col">
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-gray-900">
        <div className="relative">
          {roadmapItems.map((item, index) => (
            <div
              key={index}
              className={`flex mb-8 relative transition-all duration-300 ${expandedItem === index ? "scale-105" : ""}`}
              onClick={() => handleItemClick(index)}
            >
              <div className="mr-4 flex flex-col items-center">
                <div className="h-10 w-10 flex items-center justify-center text-xl">{item.emoji}</div>
                {index < roadmapItems.length - 1 && (
                  <div className="w-0.5 h-full bg-gray-700 absolute top-10 left-5 -ml-[1px]" />
                )}
              </div>
              <div
                className={`p-4 rounded-lg cursor-pointer transition-all flex-1 ${
                  expandedItem === index
                    ? item.status === "completed"
                      ? "bg-green-900/30 border-2 border-green-500"
                      : item.status === "current"
                        ? "bg-yellow-900/30 border-2 border-yellow-500"
                        : "bg-gray-800/70 border-2 border-gray-500"
                    : item.status === "completed"
                      ? "bg-green-900/20 border border-green-700 hover:border-green-500"
                      : item.status === "current"
                        ? "bg-yellow-900/20 border border-yellow-700 hover:border-yellow-500"
                        : "bg-gray-900/50 border border-gray-800 hover:border-gray-600"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span
                      className={`text-sm font-mono ${
                        item.status === "completed"
                          ? "text-green-400"
                          : item.status === "current"
                            ? "text-yellow-400"
                            : "text-gray-400"
                      }`}
                    >
                      {item.phase}
                    </span>
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  </div>
                  <span className="text-xs font-mono text-cyan-400 bg-black/30 px-2 py-1 rounded-md border border-cyan-900/50">
                    {item.dates}
                  </span>
                </div>

                <div className="mt-4 pt-2 border-t border-gray-700">
                  <ul className="space-y-2">
                    {item.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start">
                        <ChevronRight className="h-4 w-4 text-cyan-400 mt-1 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 text-center border-t border-gray-800 pt-6">
        <p className="text-lg text-purple-400 font-semibold">
          🟣 MindMash.AI is more than a hackathon project — it's a neural frontier.
        </p>
        <div className="mt-4 text-sm text-cyan-400 font-mono">
          #MindMashAI #ColosseumHackathon #Solana #GPT4 #Crossmint #Web3AI #MashBiT
        </div>
      </div>
    </div>
  )
}
