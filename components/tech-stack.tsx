"use client"

import { useState } from "react"
import { Code, Layers, Wallet, Database, Brain, Rocket } from "lucide-react"

export default function TechStack() {
  const [activeGroup, setActiveGroup] = useState<string | null>(null)

  const techGroups = [
    {
      name: "Frontend",
      icon: <Code className="h-6 w-6" />,
      color: "bg-gradient-to-r from-blue-500 to-cyan-500",
      technologies: [
        {
          name: "Next.js (App Router)",
          description: "Modern React framework for high-performance Web3 apps",
          icon: "🔄",
        },
        {
          name: "TypeScript + Tailwind CSS",
          description: "Strong typing + utility-first styling for responsive, themed UI",
          icon: "🎨",
        },
        {
          name: "Radix UI + ShadCN",
          description: "Accessible component primitives with custom design system",
          icon: "📐",
        },
      ],
    },
    {
      name: "AI Layer",
      icon: <Brain className="h-6 w-6" />,
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
      technologies: [
        {
          name: "OpenAI GPT-4 Turbo",
          description: "Fast, deep-context reasoning and generation",
          icon: "🧠",
        },
        {
          name: "Grok & Gemini (via APIs)",
          description: "Multi-agent interaction system",
          icon: "🤖",
        },
        {
          name: "Collaborative AI",
          description: "Real-time collaborative chat, feedback scoring, and co-creation",
          icon: "👥",
        },
      ],
    },
    {
      name: "Authentication & Wallets",
      icon: <Wallet className="h-6 w-6" />,
      color: "bg-gradient-to-r from-green-500 to-teal-500",
      technologies: [
        {
          name: "Crossmint",
          description: "Instant onboarding, embedded smart wallets, fiat/NFT minting",
          logoUrl:
            "https://jade-late-crow-559.mypinata.cloud/ipfs/bafkreiblt7infkrc2qbsfdruzij4mxoevgkleq5odhwduzcibkuyhvch6e",
        },
        {
          name: "Solflare (via Solana Wallet Adapter)",
          description: "Self-custody for power users, staking, and token governance",
          logoUrl:
            "https://jade-late-crow-559.mypinata.cloud/ipfs/bafkreidcu55wibsgxbw4yh2j5bpjv4d2ia6sswt2amuvd7fabugh2tvkcq",
        },
        {
          name: "Dual-path System",
          description: "Beginners use Crossmint, Web3 natives connect with Solflare",
          icon: "🛣️",
        },
      ],
    },
    {
      name: "Blockchain & Token",
      icon: <Layers className="h-6 w-6" />,
      color: "bg-gradient-to-r from-indigo-500 to-purple-500",
      technologies: [
        {
          name: "Solana",
          description: "Fast, low-cost chain powering Mash.BiT and NFT economy",
          logoUrl:
            "https://jade-late-crow-559.mypinata.cloud/ipfs/bafkreie6sj4qrzz6ppmblvwb6bz2b3vbdej23kmrn5mwoyaj2tqhhs52kq",
        },
        {
          name: "Mash.BiT (SPL Token)",
          description: "Earned by interacting with AI, used to mint content, tip, unlock premium layers",
          icon: "🪙",
        },
        {
          name: "GOAT SDK + Crossmint SDK",
          description: "NFT minting, wallet ops, token drops",
          icon: "🐐",
        },
      ],
    },
    {
      name: "Backend & Storage",
      icon: <Database className="h-6 w-6" />,
      color: "bg-gradient-to-r from-amber-500 to-orange-500",
      technologies: [
        {
          name: "Python Flask",
          description: "Lightweight backend logic, API endpoints, token distribution engine",
          icon: "🐍",
        },
        {
          name: "Supabase",
          description: "Realtime database for user data, wallet mapping, and reward history",
          logoUrl:
            "https://jade-late-crow-559.mypinata.cloud/ipfs/bafkreihqfls4w5hhppc3wvtz3pj7gl4k73gecpkabcew5lfzu5enrdiw7i",
        },
        {
          name: "IPFS / Arweave (planned)",
          description: "Decentralized storage for minted AI artifacts",
          icon: "💾",
        },
      ],
    },
    {
      name: "DevOps & Deployment",
      icon: <Rocket className="h-6 w-6" />,
      color: "bg-gradient-to-r from-red-500 to-pink-500",
      technologies: [
        {
          name: "Vercel",
          description: "Fast deployment with edge rendering",
          icon: "▲",
        },
        {
          name: "GitHub Actions",
          description: "Automated CI/CD",
          icon: "🔄",
        },
        {
          name: "Custom Sentry Logs",
          description: "Error tracking and AI reliability monitoring (in progress)",
          icon: "📝",
        },
      ],
    },
  ]

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto">
      {/* Title and MashLayer Badge */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Tech Stack</h2>
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-500 rounded-lg blur-lg opacity-75 animate-pulse"></div>
          <div className="relative px-6 py-3 bg-black rounded-lg border border-cyan-500 shadow-lg">
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              MashLayer™ — Our Integration Framework
            </span>
          </div>
        </div>
      </div>

      {/* Tech Stack Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {techGroups.map((group, groupIndex) => (
          <div
            key={groupIndex}
            className={`flex flex-col p-5 rounded-lg bg-gray-900/50 backdrop-blur-sm border transition-all duration-300 cursor-pointer ${
              activeGroup === group.name
                ? "border-white scale-105 shadow-lg shadow-cyan-500/20"
                : "border-gray-800 hover:border-gray-700"
            }`}
            onClick={() => setActiveGroup(activeGroup === group.name ? null : group.name)}
          >
            <div className="flex items-center mb-4">
              <div className={`mr-3 h-10 w-10 rounded-full ${group.color} flex items-center justify-center`}>
                {group.icon}
              </div>
              <h3 className="text-xl font-semibold">{group.name}</h3>
            </div>

            <div className={`space-y-3 ${activeGroup === group.name ? "block" : "hidden"}`}>
              {group.technologies.map((tech, techIndex) => (
                <div key={techIndex} className="flex items-start p-3 bg-black/30 rounded-md border border-gray-800">
                  <div className="flex-shrink-0 mr-3 h-8 w-8 flex items-center justify-center rounded-md bg-gray-800">
                    {tech.logoUrl ? (
                      <img
                        src={tech.logoUrl || "/placeholder.svg"}
                        alt={tech.name}
                        className="h-6 w-6 object-contain"
                      />
                    ) : (
                      <span className="text-lg">{tech.icon}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white">{tech.name}</h4>
                    <p className="text-xs text-gray-400">{tech.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {activeGroup !== group.name && (
              <div className="mt-2">
                <ul className="text-sm text-gray-400">
                  {group.technologies.map((tech, techIndex) => (
                    <li key={techIndex} className="truncate">
                      • {tech.name}
                    </li>
                  ))}
                </ul>
                <div className="mt-2 text-xs text-cyan-400">Click to expand</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Integration Diagram */}
      <div className="mt-8 relative w-full max-w-4xl">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-blue-500/10 rounded-lg blur-xl"></div>
        <div className="relative p-4 flex items-center justify-center">
          <div className="flex flex-wrap justify-center gap-3">
            {techGroups.map((group, index) => (
              <div key={index} className={`px-3 py-1.5 rounded-full text-sm font-medium ${group.color} text-white`}>
                {group.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
