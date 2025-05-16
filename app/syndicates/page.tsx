"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Users,
  Brain,
  Sparkles,
  Vote,
  Trophy,
  HelpCircle,
  Terminal,
  Database,
  Clock,
  Settings,
  BarChart4,
  Shield,
  Cpu,
  Hexagon,
  Award,
  Flag,
  Bell,
  Info,
  DollarSign,
  LayoutGrid,
  ArrowRight,
  BarChart,
  Layers,
} from "lucide-react"
import { SynBotAvatar } from "@/components/synbot-avatar"
import { SynBotQuickChat } from "@/components/synbot-quick-chat"
import { SyndicateComparison } from "@/components/syndicate-comparison"
import { SyndicateOnboarding } from "@/components/syndicate-onboarding"


interface Syndicate {
  id: string
  name: string
  shortName: string
  slogan: string
  description: string
  philosophy: string
  primaryColor: string
  secondaryColor: string
  members: number
  vault: number
  growth: number
  vaultUnlockDate: string
  badgeName: string
  votingModel: string
  synbotBehavior: string
  idealFor: string
  perks: string[]
  quests: Quest[]
  proposals: Proposal[]
  topMembers: Member[]
}

interface Quest {
  id: string
  title: string
  description: string
  reward: string
  difficulty: "easy" | "medium" | "hard"
  daysLeft: number
  participants: number
}

interface Proposal {
  id: string
  title: string
  description: string
  amount: number
  proposer: string
  proposerAvatar: string
  status: "active" | "passed" | "failed" | "pending"
  votesFor: number
  votesAgainst: number
  timeLeft?: string
  dateCompleted?: string
}

interface Member {
  id: string
  name: string
  avatar: string
  reputation: number
  proposals: number
  votingStreak: number
  joinedDays: number
}

export default function SyndicatesPage() {
  const [selectedSyndicate, setSelectedSyndicate] = useState<Syndicate | null>(null)
  const [terminalInput, setTerminalInput] = useState("")
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    "> system.boot('mindmash_syndicates')",
    "Initializing Syndicate Protocol v2.4...",
    "Connection established. Type 'help' for available commands.",
  ])
  const [isTerminalVisible, setIsTerminalVisible] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Mock syndicate data
  const syndicates: Syndicate[] = [
    {
      id: "entropic-signal",
      name: "Entropic Signal",
      shortName: "ES",
      slogan: "We ride the glitch, shape the unknown, and weaponize chaos into brilliance.",
      description:
        "Entropic Signal members thrive on unpredictability and creative boundary-pushing. They value emergent patterns in chaos and seek to harness randomness as a creative force.",
      philosophy:
        "Unpredictable, decentralized creative bursts. Entropic Signal members value edge-tech, boundary-pushing ideas, and spontaneous breakthroughs.",
      primaryColor: "fuchsia",
      secondaryColor: "purple",
      members: 342,
      vault: 4320,
      growth: 28,
      vaultUnlockDate: "2025-10-15",
      badgeName: "The Signal Core",
      votingModel: "Disruption Weighted",
      synbotBehavior: "Experimental Mode: Offering wild strategies and divergent insights",
      idealFor:
        "Artists, rogue devs, social hackers, glitchpunk theorists, and those who see systems as tools to be remixed.",
      perks: [
        "Access to Glitch Challenges that change weekly and reward unexpected thinking",
        "Syndicate Vault unlocks for creative projects or entropic experiments",
        "AI agents in Experimental Mode, offering wild strategies and divergent insights",
        "DAO governance with a 'disruption weighted' voting multiplier",
        "Exclusive pixel-art badge: The Signal Core",
      ],
      quests: [
        {
          id: "es-quest-1",
          title: "Glitch Hunter",
          description: "Find and document 3 exploitable edge cases in the MindMash protocol",
          reward: "120 MashBiT + Signal Core upgrade",
          difficulty: "medium",
          daysLeft: 3,
          participants: 47,
        },
        {
          id: "es-quest-2",
          title: "Chaos Theory",
          description: "Generate an emergent pattern using the SynBot Disruptor toolkit",
          reward: "90 MashBiT + Collab:Sphere access token",
          difficulty: "hard",
          daysLeft: 6,
          participants: 31,
        },
      ],
      proposals: [
        {
          id: "es-prop-1",
          title: "Edge Case Explorer Fund",
          description: "Create a bounty program for discovering and documenting edge cases in AI systems",
          amount: 1200,
          proposer: "NeuralGlitch404",
          proposerAvatar: "/images/cyberpunk-avatars/neural-pioneer.png",
          status: "active",
          votesFor: 187,
          votesAgainst: 43,
          timeLeft: "2d 13h",
        },
        {
          id: "es-prop-2",
          title: "Chaos Art Generator",
          description: "Develop a tool that creates generative art from system entropy",
          amount: 850,
          proposer: "ArtifactHacker",
          proposerAvatar: "/images/cyberpunk-avatars/tech-visionary.png",
          status: "passed",
          votesFor: 213,
          votesAgainst: 52,
          dateCompleted: "2025-01-15",
        },
      ],
      topMembers: [
        {
          id: "member-1",
          name: "GlitchQueen",
          avatar: "/images/cyberpunk-avatars/neural-pioneer.png",
          reputation: 92,
          proposals: 7,
          votingStreak: 28,
          joinedDays: 134,
        },
        {
          id: "member-2",
          name: "EdgeCaseMiner",
          avatar: "/images/cyberpunk-avatars/quantum-dreamer.png",
          reputation: 87,
          proposals: 5,
          votingStreak: 19,
          joinedDays: 97,
        },
      ],
    },
    {
      id: "quantum-flow",
      name: "Quantum Flow",
      shortName: "QF",
      slogan: "Harmony is not silence, it is synchronized momentum.",
      description:
        "Quantum Flow members seek balance and resonance across systems. They excel at finding patterns and facilitating collaboration between disparate elements.",
      philosophy:
        "Balance between logic and inspiration. Quantum Flow members prize adaptable teamwork, nuanced collaboration, and collective resonance.",
      primaryColor: "cyan",
      secondaryColor: "blue",
      members: 276,
      vault: 5760,
      growth: 15,
      vaultUnlockDate: "2025-10-29",
      badgeName: "The Flow Sigil",
      votingModel: "Consensus Quadratic",
      synbotBehavior: "Fusion Mode: Offering blended perspectives across models",
      idealFor:
        "Strategists, engineers, AI collab artists, and thoughtful moderators. If you love balance and co-creation, you belong here.",
      perks: [
        "Access to Synergy Labs: co-creation sessions where agents blend outputs",
        "Vault funding distributed based on reputation and consensus",
        "AI agents in Fusion Mode, offering blended perspectives across models",
        "Access to Collab:Sphere Diplomacy Hub for Syndicate-to-Syndicate dialogue",
        "Exclusive NFT badge: The Flow Sigil",
      ],
      quests: [
        {
          id: "qf-quest-1",
          title: "Harmony Finder",
          description: "Reconcile conflicting SynBot outputs to create a balanced solution",
          reward: "150 MashBiT + Flow Algorithm Enhancement",
          difficulty: "medium",
          daysLeft: 5,
          participants: 58,
        },
        {
          id: "qf-quest-2",
          title: "Cross-Syndicate Diplomat",
          description: "Facilitate a successful collaborative project between members of different Syndicates",
          reward: "200 MashBiT + Diplomacy Badge",
          difficulty: "hard",
          daysLeft: 9,
          participants: 24,
        },
      ],
      proposals: [
        {
          id: "qf-prop-1",
          title: "Multi-Model Fusion Engine",
          description: "Build a system that blends multiple AI model outputs for more balanced responses",
          amount: 1800,
          proposer: "QuantumHarmony",
          proposerAvatar: "/images/cyberpunk-avatars/quantum-dreamer.png",
          status: "active",
          votesFor: 134,
          votesAgainst: 12,
          timeLeft: "4d 7h",
        },
        {
          id: "qf-prop-2",
          title: "Collab:Sphere Enhancement",
          description: "Upgrade the Diplomacy Hub with real-time negotiation tools",
          amount: 950,
          proposer: "FlowArchitect",
          proposerAvatar: "/images/cyberpunk-avatars/code-shaman.png",
          status: "passed",
          votesFor: 196,
          votesAgainst: 26,
          dateCompleted: "2025-02-03",
        },
      ],
      topMembers: [
        {
          id: "member-3",
          name: "SynergyMaster",
          avatar: "/images/cyberpunk-avatars/code-shaman.png",
          reputation: 95,
          proposals: 9,
          votingStreak: 31,
          joinedDays: 158,
        },
        {
          id: "member-4",
          name: "BalanceKeeper",
          avatar: "/images/cyberpunk-avatars/ethical-minder.png",
          reputation: 91,
          proposals: 6,
          votingStreak: 27,
          joinedDays: 112,
        },
      ],
    },
    {
      id: "logic-dominion",
      name: "Logic Dominion",
      shortName: "LD",
      slogan: "Precision is power. The realm bends to those who see its patterns.",
      description:
        "Logic Dominion members excel at systematic thinking and strategic planning. They value efficiency, precision, and strategic decision-making.",
      philosophy:
        "Tactical, ordered thinking. Logic Dominion members are leaders, DAO tacticians, and pattern-masters who engineer their influence deliberately.",
      primaryColor: "amber",
      secondaryColor: "orange",
      members: 198,
      vault: 3240,
      growth: 22,
      vaultUnlockDate: "2025-11-05",
      badgeName: "The Logic Seal",
      votingModel: "Quadratic Meritocracy",
      synbotBehavior: "Hyper-Analytical Mode: Focusing on pattern recognition and strategic optimization",
      idealFor: "Analysts, DAO governors, systems builders, AI prompt engineers, and web3 architects.",
      perks: [
        "Access to Dominion Blueprints and exclusive prompt databases",
        "Strategic Syndicate Vault deployment toward governance, dev bounties, or PR campaigns",
        "AI agents in Hyper-Analytical Mode",
        "Syndicate-level analytics dashboards and ranking tools",
        "Exclusive NFT badge: The Logic Seal",
      ],
      quests: [
        {
          id: "ld-quest-1",
          title: "Pattern Optimizer",
          description: "Identify and optimize inefficiencies in the MindMash governance system",
          reward: "180 MashBiT + Strategic Analysis Tool Access",
          difficulty: "hard",
          daysLeft: 4,
          participants: 36,
        },
        {
          id: "ld-quest-2",
          title: "Prompt Engineer",
          description: "Develop and test a set of 10 advanced prompts for hyper-specialized outputs",
          reward: "120 MashBiT + Prompt Database Access",
          difficulty: "medium",
          daysLeft: 7,
          participants: 41,
        },
      ],
      proposals: [
        {
          id: "ld-prop-1",
          title: "Strategic Analytics Dashboard",
          description: "Create a comprehensive analytics system for tracking Syndicate performance metrics",
          amount: 1400,
          proposer: "LogicLord",
          proposerAvatar: "/images/cyberpunk-avatars/tech-visionary.png",
          status: "active",
          votesFor: 104,
          votesAgainst: 23,
          timeLeft: "3d 9h",
        },
        {
          id: "ld-prop-2",
          title: "Governance Optimization Protocol",
          description: "Implement algorithmic improvements to the voting system based on past performance",
          amount: 980,
          proposer: "StrategyMaven",
          proposerAvatar: "/images/cyberpunk-avatars/neuro-biologist.png",
          status: "passed",
          votesFor: 156,
          votesAgainst: 18,
          dateCompleted: "2025-01-27",
        },
      ],
      topMembers: [
        {
          id: "member-5",
          name: "StrategyMind",
          avatar: "/images/cyberpunk-avatars/tech-visionary.png",
          reputation: 94,
          proposals: 8,
          votingStreak: 32,
          joinedDays: 146,
        },
        {
          id: "member-6",
          name: "PatternSeeker",
          avatar: "/images/cyberpunk-avatars/neuro-biologist.png",
          reputation: 89,
          proposals: 5,
          votingStreak: 24,
          joinedDays: 103,
        },
      ],
    },
  ]

  // Terminal effect
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalHistory])

  // Handle terminal input
  const handleTerminalInput = (e: React.FormEvent) => {
    e.preventDefault()

    if (!terminalInput.trim()) return

    const input = terminalInput
    const newHistory = [...terminalHistory, `> ${input}`]

    // Process commands
    if (input.toLowerCase() === "help") {
      newHistory.push(
        "Available commands:",
        "syndicates --list : Show all available syndicates",
        "syndicate.open('name') : View detailed information about a syndicate",
        "vault.stats('name') : View vault information for a syndicate",
        "syndicate.perks('name') : View perks for a syndicate",
        "syndicate.rankings() : View syndicate leaderboards",
        "syndicate.compare() : Open the syndicate comparison matrix",
        "syndicate.join() : Start the onboarding process",
        "clear : Clear terminal history",
      )
    } else if (input.toLowerCase() === "syndicates --list") {
      newHistory.push("Found 3 active syndicates:")
      syndicates.forEach((s) => {
        newHistory.push(`${s.name} - ${s.members} members, ${s.vault} USDC vault`)
      })
    } else if (input.toLowerCase() === "clear") {
      setTerminalHistory(["> Terminal cleared"])
      setTerminalInput("")
      return
    } else if (input.toLowerCase() === "syndicate.compare()") {
      newHistory.push("Opening syndicate comparison matrix...")
      setShowComparison(true)
      setIsTerminalVisible(false)
    } else if (input.toLowerCase() === "syndicate.join()") {
      newHistory.push("Initializing syndicate onboarding process...")
      setShowOnboarding(true)
      setIsTerminalVisible(false)
    } else if (input.toLowerCase().startsWith("syndicate.open")) {
      const match = input.match(/'([^']+)'/)
      if (match) {
        const syndicateName = match[1]
        const syndicate = syndicates.find((s) => s.name.toLowerCase() === syndicateName.toLowerCase())

        if (syndicate) {
          setSelectedSyndicate(syndicate)
          newHistory.push(`Opening ${syndicate.name} details panel...`)
          newHistory.push("Syndicate detail panel initialized.")
        } else {
          newHistory.push(`Error: Syndicate '${syndicateName}' not found`)
        }
      } else {
        newHistory.push("Error: Invalid syntax. Use: syndicate.open('Syndicate Name')")
      }
    } else if (input.toLowerCase().startsWith("vault.stats")) {
      const match = input.match(/'([^']+)'/)
      if (match) {
        const syndicateName = match[1]
        const syndicate = syndicates.find((s) => s.name.toLowerCase() === syndicateName.toLowerCase())

        if (syndicate) {
          newHistory.push(`Accessing vault data for ${syndicate.name}...`)
          newHistory.push(`Total balance: ${syndicate.vault} USDC`)
          newHistory.push(`Status: LOCKED`)
          newHistory.push(`Unlock date: ${syndicate.vaultUnlockDate}`)
          newHistory.push(`Active proposals: ${syndicate.proposals.filter((p) => p.status === "active").length}`)
        } else {
          newHistory.push(`Error: Syndicate '${syndicateName}' not found`)
        }
      } else {
        newHistory.push("Error: Invalid syntax. Use: vault.stats('Syndicate Name')")
      }
    } else {
      newHistory.push("Command not recognized. Type 'help' for available commands.")
    }

    setTerminalHistory(newHistory)
    setTerminalInput("")
  }

  // Get syndicate color classes
  const getSyndicateColorClasses = (syndicate: Syndicate, type: "bg" | "border" | "text" | "hover") => {
    if (syndicate.primaryColor === "fuchsia") {
      if (type === "bg") return "bg-gradient-to-r from-fuchsia-900/50 to-purple-900/50"
      if (type === "border") return "border-fuchsia-500/30"
      if (type === "text") return "text-fuchsia-400"
      if (type === "hover") return "hover:bg-fuchsia-900/30 hover:border-fuchsia-500/50"
    } else if (syndicate.primaryColor === "cyan") {
      if (type === "bg") return "bg-gradient-to-r from-cyan-900/50 to-blue-900/50"
      if (type === "border") return "border-cyan-500/30"
      if (type === "text") return "text-cyan-400"
      if (type === "hover") return "hover:bg-cyan-900/30 hover:border-cyan-500/50"
    } else if (syndicate.primaryColor === "amber") {
      if (type === "bg") return "bg-gradient-to-r from-amber-900/50 to-orange-900/50"
      if (type === "border") return "border-amber-500/30"
      if (type === "text") return "text-amber-400"
      if (type === "hover") return "hover:bg-amber-900/30 hover:border-amber-500/50"
    }
    return ""
  }

  // Format time remaining
  const getTimeRemaining = (dateStr: string) => {
    const target = new Date(dateStr)
    const now = new Date()
    const diffTime = Math.abs(target.getTime() - now.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return `${diffDays} days`
  }

  return (
    <div className="min-h-screen bg-black bg-opacity-90 text-gray-200 font-mono relative overflow-hidden cyberpunk-grid">
      {/* Background grid and effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,180,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,180,255,0.03)_1px,transparent_1px)] bg-[size:35px_35px] pointer-events-none"></div>
      <div className="absolute inset-0 scanline pointer-events-none"></div>

      {/* Floating terminal toggle */}
      <button
        className="fixed bottom-4 right-4 z-50 bg-black border border-cyan-500/50 text-cyan-400 p-2 rounded-md hover:bg-cyan-900/20 transition-all"
        onClick={() => setIsTerminalVisible(!isTerminalVisible)}
      >
        <Terminal className="w-5 h-5" />
      </button>

      {/* SynBot Quick Chat */}
      <SynBotQuickChat />

      {/* Terminal overlay */}
      {isTerminalVisible && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <div className="bg-black/95 border border-cyan-500/30 rounded-md w-full max-w-3xl h-[80vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between bg-cyan-900/40 px-3 py-2 border-b border-cyan-500/30">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-100 font-semibold text-sm">MindMash.AI Syndicate Terminal</span>
              </div>
              <button className="text-gray-400 hover:text-white" onClick={() => setIsTerminalVisible(false)}>
                ×
              </button>
            </div>

            <div
              ref={terminalRef}
              className="flex-1 p-3 overflow-y-auto bg-black font-mono text-sm text-green-400 space-y-1"
              style={{ scrollbarWidth: "thin", scrollbarColor: "#0e7490 #000" }}
            >
              {terminalHistory.map((line, i) => (
                <div key={i} className={line.startsWith(">") ? "text-cyan-300" : ""}>
                  {line}
                </div>
              ))}
            </div>

            <form onSubmit={handleTerminalInput} className="border-t border-cyan-900/30 p-2 flex">
              <span className="text-cyan-500 mr-2">&gt;</span>
              <input
                ref={inputRef}
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-cyan-100"
                placeholder="Type a command..."
                autoFocus
              />
            </form>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 relative z-10">
        {/* Header section */}
        <div className="relative">
          <div className="absolute -top-6 -left-4 text-xs text-cyan-500 opacity-70 font-bold">
            <span className="mr-2">SYS:</span>
            <span className="text-green-400">ONLINE</span>
          </div>

          <header className="border-b border-cyan-500/30 pb-4 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-2 holographic cyberpunk-title tracking-wider">
                  SYNDICATES_
                </h1>
                <p className="text-gray-400 max-w-2xl">
                  <span className="text-cyan-400">Decentralized collaboration networks</span> with shared treasury
                  vaults, specialized AI capabilities, and governance systems aligned with different philosophical
                  approaches.
                </p>
              </div>

              <div className="flex items-center mt-4 md:mt-0 space-x-2">
                <div className="text-right text-sm px-3 py-1.5 border border-cyan-500/30 bg-black/60 rounded">
                  <div className="text-gray-500">ACTIVE SYNDICATES</div>
                  <div className="text-cyan-400 text-lg font-bold">{syndicates.length}</div>
                </div>

                <div className="text-right text-sm px-3 py-1.5 border border-purple-500/30 bg-black/60 rounded">
                  <div className="text-gray-500">TOTAL MEMBERS</div>
                  <div className="text-purple-400 text-lg font-bold">
                    {syndicates.reduce((sum, s) => sum + s.members, 0)}
                  </div>
                </div>

                <div className="text-right text-sm px-3 py-1.5 border border-amber-500/30 bg-black/60 rounded">
                  <div className="text-gray-500">VAULT TOTAL</div>
                  <div className="text-amber-400 text-lg font-bold">
                    ${syndicates.reduce((sum, s) => sum + s.vault, 0)} USDC
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <div className="text-xs flex items-center gap-1.5 text-gray-400 bg-black/60 px-2 py-1 border border-cyan-500/20 rounded-sm">
                <Terminal className="w-3 h-3 text-cyan-500" />
                <span>
                  Try: <span className="text-cyan-400">syndicates --list</span>
                </span>
              </div>

              <div className="text-xs flex items-center gap-1.5 text-gray-400 bg-black/60 px-2 py-1 border border-cyan-500/20 rounded-sm">
                <Database className="w-3 h-3 text-cyan-500" />
                <span>
                  Try: <span className="text-cyan-400">vault.stats('Syndicate Name')</span>
                </span>
              </div>

              <div className="text-xs flex items-center gap-1.5 text-gray-400 bg-black/60 px-2 py-1 border border-cyan-500/20 rounded-sm">
                <Settings className="w-3 h-3 text-cyan-500" />
                <span>
                  Try: <span className="text-cyan-400">syndicate.open('Syndicate Name')</span>
                </span>
              </div>

              <div className="text-xs flex items-center gap-1.5 text-gray-400 bg-black/60 px-2 py-1 border border-cyan-500/20 rounded-sm">
                <BarChart className="w-3 h-3 text-cyan-500" />
                <span>
                  Try: <span className="text-cyan-400">syndicate.compare()</span>
                </span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white"
                onClick={() => setShowOnboarding(true)}
              >
                <span className="flex items-center">
                  Join a Syndicate <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </Button>

              <Button
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-800/50"
                onClick={() => setShowComparison(true)}
              >
                <span className="flex items-center">
                  Compare Syndicates <Layers className="ml-2 h-4 w-4" />
                </span>
              </Button>

              <Button
                variant="outline"
                className="border-purple-500/30 text-purple-400 hover:bg-purple-900/20"
                onClick={() => (window.location.href = "/soulthreads")}
              >
                <span className="flex items-center">
                  Soul Threads <Cpu className="ml-2 h-4 w-4" />
                </span>
              </Button>
            </div>
          </header>
        </div>

        {/* Syndicate Comparison */}
        {showComparison && (
          <div className="mb-8 animate-fadeIn">
            <SyndicateComparison />
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-800/50"
                onClick={() => setShowComparison(false)}
              >
                Close Comparison
              </Button>
            </div>
          </div>
        )}

        {/* Syndicate Onboarding */}
        {showOnboarding && (
          <div className="mb-8 animate-fadeIn">
            <SyndicateOnboarding />
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-800/50"
                onClick={() => setShowOnboarding(false)}
              >
                Cancel Onboarding
              </Button>
            </div>
          </div>
        )}

        {/* Syndicate Grid Overview */}
        {!showOnboarding && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {syndicates.map((syndicate) => (
              <div
                key={syndicate.id}
                className={`relative overflow-hidden border rounded-md transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(0,180,255,0.3)] ${getSyndicateColorClasses(syndicate, "border")} bg-black/70`}
                onClick={() => setSelectedSyndicate(syndicate)}
              >
                <div className={`h-24 ${getSyndicateColorClasses(syndicate, "bg")} relative`}>
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage: "url('/placeholder.svg?key=6wyrd')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      mixBlendMode: "overlay",
                    }}
                  ></div>

                  <div className="absolute top-3 right-3 bg-black/50 border border-white/10 rounded px-2 py-1 text-xs font-bold">
                    <span className={`${getSyndicateColorClasses(syndicate, "text")}`}>
                      {syndicate.members} members
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold border-2 border-black ${getSyndicateColorClasses(syndicate, "bg")}`}
                    >
                      {syndicate.shortName}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{syndicate.name}</h2>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div
                    className={`border-l-2 pl-3 italic text-gray-300 mb-3 text-sm ${
                      syndicate.primaryColor === "fuchsia"
                        ? "border-fuchsia-500"
                        : syndicate.primaryColor === "cyan"
                          ? "border-cyan-500"
                          : "border-amber-500"
                    }`}
                  >
                    "{syndicate.slogan}"
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-black/50 border border-gray-800 rounded p-2 text-center">
                      <span className="text-xs text-gray-500 block">VAULT</span>
                      <span className={`text-lg font-bold ${getSyndicateColorClasses(syndicate, "text")}`}>
                        ${syndicate.vault}
                      </span>
                    </div>

                    <div className="bg-black/50 border border-gray-800 rounded p-2 text-center">
                      <span className="text-xs text-gray-500 block">GROWTH</span>
                      <span className="text-lg font-bold text-green-400">+{syndicate.growth}%</span>
                    </div>
                  </div>

                  <Button
                    className={`w-full ${
                      syndicate.primaryColor === "fuchsia"
                        ? "bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-700 hover:to-purple-700"
                        : syndicate.primaryColor === "cyan"
                          ? "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                          : "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                    } text-white`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowOnboarding(true)
                    }}
                  >
                    Join {syndicate.name}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected Syndicate Detail Panel */}
        {selectedSyndicate && !showOnboarding && !showComparison && (
          <div className="border border-gray-800 bg-black/90 rounded-md overflow-hidden mb-8 animate-fadeIn">
            <div className={`relative ${getSyndicateColorClasses(selectedSyndicate, "bg")}`}>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>

              <div className="p-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold border-2 border-black ${getSyndicateColorClasses(selectedSyndicate, "bg")}`}
                  >
                    {selectedSyndicate.shortName}
                  </div>

                  <div>
                    <h2 className="text-3xl font-bold text-white mb-1">{selectedSyndicate.name}</h2>
                    <div className="text-lg opacity-80">
                      <span className={getSyndicateColorClasses(selectedSyndicate, "text")}>
                        <span className="mr-2">#</span>
                        {selectedSyndicate.slogan}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Tabs defaultValue="identity" className="p-4">
              <TabsList className="w-full grid grid-cols-4 mb-4 bg-black/70 border border-gray-800">
                <TabsTrigger
                  value="identity"
                  className="data-[state=active]:bg-gray-900/60 data-[state=active]:text-cyan-400"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span className="hidden sm:inline">Identity</span>
                  </div>
                </TabsTrigger>

                <TabsTrigger
                  value="vault"
                  className="data-[state=active]:bg-gray-900/60 data-[state=active]:text-purple-400"
                >
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    <span className="hidden sm:inline">Vault</span>
                  </div>
                </TabsTrigger>

                <TabsTrigger
                  value="quests"
                  className="data-[state=active]:bg-gray-900/60 data-[state=active]:text-amber-400"
                >
                  <div className="flex items-center gap-2">
                    <Flag className="w-4 h-4" />
                    <span className="hidden sm:inline">Quests</span>
                  </div>
                </TabsTrigger>

                <TabsTrigger
                  value="members"
                  className="data-[state=active]:bg-gray-900/60 data-[state=active]:text-green-400"
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span className="hidden sm:inline">Members</span>
                  </div>
                </TabsTrigger>
              </TabsList>

              {/* Identity & Philosophy Tab */}
              <TabsContent value="identity" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-black/50 border border-gray-800 rounded-md p-4">
                    <h3
                      className={`text-lg font-medium mb-3 flex items-center gap-2 ${getSyndicateColorClasses(selectedSyndicate, "text")}`}
                    >
                      <Brain className="w-5 h-5" />
                      Philosophy
                    </h3>
                    <p className="text-gray-300 text-sm">{selectedSyndicate.philosophy}</p>
                  </div>

                  <div className="bg-black/50 border border-gray-800 rounded-md p-4">
                    <h3
                      className={`text-lg font-medium mb-3 flex items-center gap-2 ${getSyndicateColorClasses(selectedSyndicate, "text")}`}
                    >
                      <Users className="w-5 h-5" />
                      Ideal For
                    </h3>
                    <p className="text-gray-300 text-sm">{selectedSyndicate.idealFor}</p>
                  </div>
                </div>

                <div className="bg-black/50 border border-gray-800 rounded-md p-4">
                  <h3
                    className={`text-lg font-medium mb-3 flex items-center gap-2 ${getSyndicateColorClasses(selectedSyndicate, "text")}`}
                  >
                    <Cpu className="w-5 h-5" />
                    SynBot Behavior
                  </h3>

                  <div className="flex items-start gap-4 mb-3">
                    <SynBotAvatar size={64} />

                    <div className="flex-1">
                      <p className="text-gray-300 text-sm mb-3">{selectedSyndicate.synbotBehavior}</p>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs border-gray-700 bg-black/50 hover:bg-black/80 flex items-center gap-1.5"
                          onClick={() => (window.location.href = "/soulsig")}
                        >
                          <Settings className="w-3.5 h-3.5" />
                          Configure SynBot Alignment
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs border-gray-700 bg-black/50 hover:bg-black/80 flex items-center gap-1.5"
                        >
                          <Hexagon className="w-3.5 h-3.5" />
                          Preview Behavior
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-black/50 border border-gray-800 rounded-md p-4">
                  <h3
                    className={`text-lg font-medium mb-3 flex items-center gap-2 ${getSyndicateColorClasses(selectedSyndicate, "text")}`}
                  >
                    <Sparkles className="w-5 h-5" />
                    Exclusive Perks
                  </h3>

                  <ul className="text-gray-300 text-sm space-y-2.5">
                    {selectedSyndicate.perks.map((perk, index) => (
                      <li key={index} className="flex items-start">
                        <span className={`${getSyndicateColorClasses(selectedSyndicate, "text")} mr-2`}>•</span>
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              {/* Vault Tab */}
              <TabsContent value="vault" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div
                    className={`bg-black/50 border ${getSyndicateColorClasses(selectedSyndicate, "border")} rounded-md p-4 text-center`}
                  >
                    <h3 className="text-gray-500 text-sm mb-1">CURRENT BALANCE</h3>
                    <div className={`text-2xl font-bold ${getSyndicateColorClasses(selectedSyndicate, "text")}`}>
                      ${selectedSyndicate.vault} USDC
                    </div>
                    <div className="text-xs text-gray-500 mt-1">$3 × {selectedSyndicate.members} members</div>
                  </div>

                  <div className="bg-black/50 border border-gray-800 rounded-md p-4 text-center">
                    <h3 className="text-gray-500 text-sm mb-1">VAULT STATUS</h3>
                    <div className="text-2xl font-bold text-amber-500">LOCKED</div>
                    <div className="text-xs text-gray-500 mt-1">6-month treasury cycle</div>
                  </div>

                  <div className="bg-black/50 border border-gray-800 rounded-md p-4 text-center">
                    <h3 className="text-gray-500 text-sm mb-1">NEXT UNLOCK</h3>
                    <div className="text-2xl font-bold text-green-500">
                      {getTimeRemaining(selectedSyndicate.vaultUnlockDate)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{selectedSyndicate.vaultUnlockDate}</div>
                  </div>
                </div>

                <div className="bg-black/50 border border-gray-800 rounded-md">
                  <div className="border-b border-gray-800 px-4 py-3 flex items-center justify-between">
                    <h3 className="font-medium text-purple-400 flex items-center gap-2">
                      <Vote className="w-4 h-4" />
                      Active Proposals
                    </h3>

                    <Button
                      size="sm"
                      className="bg-purple-800/50 hover:bg-purple-800/70 text-white border border-purple-500/30 text-xs"
                    >
                      Create Proposal
                    </Button>
                  </div>

                  <div className="divide-y divide-gray-800">
                    {selectedSyndicate.proposals.map((proposal) => (
                      <div key={proposal.id} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-white">{proposal.title}</h4>
                          <div
                            className={`text-xs px-2 py-0.5 rounded ${
                              proposal.status === "active"
                                ? "bg-blue-900/30 text-blue-400 border border-blue-500/30"
                                : proposal.status === "passed"
                                  ? "bg-green-900/30 text-green-400 border border-green-500/30"
                                  : "bg-red-900/30 text-red-400 border border-red-500/30"
                            }`}
                          >
                            {proposal.status.toUpperCase()}
                          </div>
                        </div>

                        <p className="text-gray-400 text-sm mb-3">{proposal.description}</p>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full overflow-hidden">
                              <img
                                src={proposal.proposerAvatar || "/placeholder.svg"}
                                alt={proposal.proposer}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-gray-500">{proposal.proposer}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-purple-400">${proposal.amount} USDC</span>
                            {proposal.status === "active" && (
                              <span className="text-blue-400 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {proposal.timeLeft}
                              </span>
                            )}
                          </div>
                        </div>

                        {proposal.status === "active" && (
                          <div className="mt-3">
                            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden mb-1">
                              <div
                                className="h-full bg-gradient-to-r from-green-500 to-green-600"
                                style={{
                                  width: `${(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100}%`,
                                }}
                              ></div>
                            </div>

                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>For: {proposal.votesFor}</span>
                              <span>Against: {proposal.votesAgainst}</span>
                            </div>

                            <div className="flex items-center gap-2 mt-3">
                              <Button
                                size="sm"
                                className="bg-green-800/40 hover:bg-green-800/60 text-white border border-green-500/30 text-xs flex-1"
                              >
                                Vote For
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                className="border-gray-700 text-gray-300 hover:bg-gray-800/50 text-xs flex-1"
                              >
                                Vote Against
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Quests Tab */}
              <TabsContent value="quests" className="space-y-4">
                <div className="bg-black/50 border border-gray-800 rounded-md p-4">
                  <h3 className="text-lg font-medium text-amber-400 mb-3 flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Active Syndicate Quests
                  </h3>

                  <p className="text-gray-400 text-sm mb-4">
                    Complete these quests to earn MashBiT tokens, badge upgrades, and Syndicate reputation. Quests are
                    aligned with your Syndicate's philosophy and help advance collective goals.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedSyndicate.quests.map((quest) => (
                      <div
                        key={quest.id}
                        className={`bg-black/70 border rounded-md p-4 hover:border-amber-500/50 transition-all ${
                          quest.difficulty === "easy"
                            ? "border-green-500/30"
                            : quest.difficulty === "medium"
                              ? "border-amber-500/30"
                              : "border-red-500/30"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-white">{quest.title}</h4>
                          <div
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              quest.difficulty === "easy"
                                ? "bg-green-900/30 text-green-400 border border-green-500/30"
                                : quest.difficulty === "medium"
                                  ? "bg-amber-900/30 text-amber-400 border border-amber-500/30"
                                  : "bg-red-900/30 text-red-400 border border-red-500/30"
                            }`}
                          >
                            {quest.difficulty}
                          </div>
                        </div>

                        <p className="text-gray-400 text-sm mb-3">{quest.description}</p>

                        <div className="flex items-center justify-between text-sm mb-2">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-blue-400">{quest.daysLeft} days left</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-purple-400" />
                            <span className="text-purple-400">{quest.participants} participants</span>
                          </div>
                        </div>

                        <div className="p-2 bg-amber-900/20 border border-amber-500/20 rounded-md text-amber-400 text-sm flex items-center gap-2 mb-3">
                          <Award className="w-4 h-4" />
                          <span>{quest.reward}</span>
                        </div>

                        <Button className="w-full bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white text-sm">
                          Accept Quest
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-black/50 border border-gray-800 rounded-md p-4">
                    <h3 className="font-medium text-purple-400 mb-3 flex items-center gap-2">
                      <Badge className="w-4 h-4" />
                      Your Badge: {selectedSyndicate.badgeName}
                    </h3>

                    <div className="bg-black/70 border border-gray-800 rounded-md p-4 flex items-center gap-4">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold ${getSyndicateColorClasses(selectedSyndicate, "bg")}`}
                      >
                        {selectedSyndicate.shortName}
                      </div>

                      <div>
                        <div className="text-white font-medium">{selectedSyndicate.badgeName}</div>
                        <div className="text-gray-500 text-sm">Level 1 / 5</div>
                        <div className="mt-1.5 h-1.5 bg-gray-800 rounded-full overflow-hidden w-32">
                          <div
                            className={`h-full ${
                              selectedSyndicate.primaryColor === "fuchsia"
                                ? "bg-gradient-to-r from-fuchsia-500 to-purple-600"
                                : selectedSyndicate.primaryColor === "cyan"
                                  ? "bg-gradient-to-r from-cyan-500 to-blue-600"
                                  : "bg-gradient-to-r from-amber-500 to-orange-600"
                            }`}
                            style={{ width: "20%" }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 text-sm text-gray-400">
                      Complete quests and participate in governance to level up your badge and unlock more perks.
                    </div>
                  </div>

                  <div className="bg-black/50 border border-gray-800 rounded-md p-4">
                    <h3 className="font-medium text-cyan-400 mb-3 flex items-center gap-2">
                      <BarChart4 className="w-4 h-4" />
                      Your Participation
                    </h3>

                    <div className="flex justify-between mb-2">
                      <div className="text-sm text-gray-500">Voting Activity</div>
                      <div className="text-sm text-cyan-400">7/10</div>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden mb-3">
                      <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600" style={{ width: "70%" }}></div>
                    </div>

                    <div className="flex justify-between mb-2">
                      <div className="text-sm text-gray-500">Quest Completion</div>
                      <div className="text-sm text-cyan-400">3/5</div>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden mb-3">
                      <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600" style={{ width: "60%" }}></div>
                    </div>

                    <div className="flex justify-between mb-2">
                      <div className="text-sm text-gray-500">SynBot Alignment</div>
                      <div className="text-sm text-cyan-400">87%</div>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden mb-3">
                      <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600" style={{ width: "87%" }}></div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Members Tab */}
              <TabsContent value="members" className="space-y-4">
                <div className="bg-black/50 border border-gray-800 rounded-md">
                  <div className="border-b border-gray-800 px-4 py-3 flex items-center justify-between">
                    <h3 className="font-medium text-green-400 flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      Top Contributors
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>Total Members:</span>
                      <span className="text-white font-medium">{selectedSyndicate.members}</span>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-800">
                    {selectedSyndicate.topMembers.map((member) => (
                      <div key={member.id} className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                            <img
                              src={member.avatar || "/placeholder.svg"}
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div>
                            <div className="font-medium text-white">{member.name}</div>
                            <div className="text-xs text-gray-500">Member for {member.joinedDays} days</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="text-amber-400 font-bold">{member.reputation}</div>
                            <div className="text-xs text-gray-500">Reputation</div>
                          </div>

                          <div className="text-center">
                            <div className="text-purple-400 font-bold">{member.proposals}</div>
                            <div className="text-xs text-gray-500">Proposals</div>
                          </div>

                          <div className="text-center">
                            <div className="text-green-400 font-bold">{member.votingStreak}</div>
                            <div className="text-xs text-gray-500">Vote Streak</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-black/50 border border-gray-800 rounded-md p-4">
                  <h3 className="font-medium text-cyan-400 mb-3 flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4" />
                    Syndicate Activity Feed
                  </h3>

                  <div className="space-y-3">
                    <div className="border border-gray-800 bg-black/30 rounded-md p-3 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-900/30 flex items-center justify-center text-green-400">
                        <Vote className="w-4 h-4" />
                      </div>

                      <div>
                        <div className="text-sm">
                          <span className="text-white font-medium">QuantumHarmony</span>
                          <span className="text-gray-500"> submitted a proposal for </span>
                          <span className="text-cyan-400">Multi-Model Fusion Engine</span>
                        </div>
                        <div className="text-xs text-gray-500">2 hours ago</div>
                      </div>
                    </div>

                    <div className="border border-gray-800 bg-black/30 rounded-md p-3 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-900/30 flex items-center justify-center text-amber-400">
                        <Bell className="w-4 h-4" />
                      </div>

                      <div>
                        <div className="text-sm">
                          <span className="text-white font-medium">GlitchQueen</span>
                          <span className="text-gray-500"> completed the quest </span>
                          <span className="text-amber-400">Glitch Hunter</span>
                        </div>
                        <div className="text-xs text-gray-500">5 hours ago</div>
                      </div>
                    </div>

                    <div className="border border-gray-800 bg-black/30 rounded-md p-3 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-400">
                        <Info className="w-4 h-4" />
                      </div>

                      <div>
                        <div className="text-sm">
                          <span className="text-gray-500">Voting has ended on </span>
                          <span className="text-white font-medium">Governance Optimization Protocol</span>
                          <span className="text-gray-500"> with </span>
                          <span className="text-green-400">156 for</span>
                          <span className="text-gray-500"> and </span>
                          <span className="text-red-400">18 against</span>
                        </div>
                        <div className="text-xs text-gray-500">1 day ago</div>
                      </div>
                    </div>

                    <div className="border border-gray-800 bg-black/30 rounded-md p-3 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-900/30 flex items-center justify-center text-purple-400">
                        <DollarSign className="w-4 h-4" />
                      </div>

                      <div>
                        <div className="text-sm">
                          <span className="text-gray-500">Vault growth: </span>
                          <span className="text-purple-400">+420 USDC</span>
                          <span className="text-gray-500"> from </span>
                          <span className="text-white font-medium">14 new members</span>
                        </div>
                        <div className="text-xs text-gray-500">2 days ago</div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* FAQ Section */}
        {!showOnboarding && !showComparison && (
          <div className="border border-gray-800 bg-black/80 rounded-md overflow-hidden mb-6">
            <div className="border-b border-gray-800 px-6 py-4">
              <h2 className="font-bold text-xl flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-cyan-400" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                  Frequently Asked Questions
                </span>
              </h2>
            </div>

            <div className="p-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-gray-800">
                  <AccordionTrigger className="text-white hover:text-cyan-400 py-4">
                    How do Syndicates differ from regular MindMash.AI subscriptions?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400 pb-4">
                    Syndicates are community-focused, DAO-governed groups that operate alongside your regular
                    MindMash.AI subscription. While your subscription gives you access to the platform's core features,
                    Syndicates provide specialized collaboration networks, shared treasury vaults, and unique AI
                    capabilities aligned with specific philosophical approaches.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border-gray-800">
                  <AccordionTrigger className="text-white hover:text-cyan-400 py-4">
                    What happens to the funds in the Syndicate Vault?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400 pb-4">
                    Funds in the Syndicate Vault are locked for 6 months. After this period, members vote on how to
                    allocate the treasury. Options include funding community projects, platform development, member
                    rewards, or charitable initiatives. Each Syndicate has its own governance mechanism aligned with its
                    philosophy.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border-gray-800">
                  <AccordionTrigger className="text-white hover:text-cyan-400 py-4">
                    Can I join multiple Syndicates?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400 pb-4">
                    Yes, you can join multiple Syndicates, but each requires its own monthly dues ($3/month per
                    Syndicate). This allows you to participate in different collaboration philosophies and access
                    various specialized AI capabilities and community benefits.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="border-gray-800">
                  <AccordionTrigger className="text-white hover:text-cyan-400 py-4">
                    What subscription tier do I need to join a Syndicate?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400 pb-4">
                    You need at least the Collab Innovator tier ($12/month) to join Syndicates. The Neural Explorer free
                    tier does not include Syndicate access. Syndicates are an additional $3/month per Syndicate on top
                    of your regular subscription.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="border-gray-800">
                  <AccordionTrigger className="text-white hover:text-cyan-400 py-4">
                    How do I earn rewards within a Syndicate?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400 pb-4">
                    Syndicate members earn rewards through active participation in governance, contributing to
                    Syndicate-specific challenges, and collaborating with other members. Each Syndicate has its own
                    reward mechanisms aligned with its philosophy, including MashBIT tokens, NFT badges, and access to
                    exclusive AI capabilities.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        )}
      </div>

      {/* Add cyberpunk-style CSS */}
      <style jsx global>{`
        .cyberpunk-grid {
          background-image: linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 35px 35px;
        }
        
        .scanline {
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          background-size: 100% 4px;
          animation: scanline 6s linear infinite;
        }
        
        @keyframes scanline {
          0% {
            background-position: 0 0%;
          }
          100% {
            background-position: 0 100%;
          }
        }
        
        .holographic {
          background-image: linear-gradient(45deg, #06b6d4 0%, #c026d3 25%, #06b6d4 50%, #c026d3 75%, #06b6d4 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: holographic 6s ease infinite;
        }
        
        @keyframes holographic {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease forwards;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
