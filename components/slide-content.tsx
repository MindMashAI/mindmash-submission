"use client"
import Link from "next/link"
import {
  MessageSquare,
  Network,
  Wallet,
  Zap,
  Code,
  Brain,
  Users,
  HelpCircle,
  Terminal,
  CheckCircle,
  Layers,
  Activity,
  FileText,
  Clock,
  ArrowRight,
  Command,
  Cpu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAudio } from "@/components/audio-manager"
import { useMobile } from "@/hooks/use-mobile"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

// Custom X logo 
function XLogo({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

interface SlideContentProps {
  slideIndex: number
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 },
  },
}

export default function SlideContent({ slideIndex }: SlideContentProps) {
  const { isMobile } = useMobile()
  const { playSound } = useAudio()
  const [cursorVisible, setCursorVisible] = useState(true)
  const [typedText, setTypedText] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  // Terminal cursor blink effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev)
    }, 530)

    return () => clearInterval(cursorInterval)
  }, [])

  // Typing animation effect for terminal commands
  useEffect(() => {
    let targetText = ""

    // Different text for each slide
    switch (slideIndex) {
      case 0:
        targetText = "system.boot(mindmash_neural_interface)"
        break
      case 1:
        targetText = "loading problem data..."
        break
      case 2:
        targetText = "executing mindmash protocol..."
        break
      case 3:
        targetText = "feature flags enabled: all systems go"
        break
      case 4:
        targetText = "solana integration: optimal match"
        break
      case 5:
        targetText = "demo environment: initialized"
        break
      case 6:
        targetText = "you → now → public beta → full ecosystem"
        break
      case 7:
        targetText = "ai-culture.exe: redefining digital identity"
        break
      case 8:
        targetText = "mission parameters: accepted"
        break
      case 9:
        targetText = "thank you for joining the neural frontier"
        break
      default:
        targetText = ""
    }

    setTypedText("")
    setIsTyping(true)

    let currentIndex = 0
    const typingInterval = setInterval(() => {
      if (currentIndex < targetText.length) {
        setTypedText(targetText.substring(0, currentIndex + 1))
        currentIndex++
      } else {
        clearInterval(typingInterval)
        setIsTyping(false)
      }
    }, 30)

    return () => clearInterval(typingInterval)
  }, [slideIndex])

  // Slide 1 - Title
  if (slideIndex === 0) {
    return (
      <motion.div
        className={`flex flex-col items-center justify-center text-center px-4 ${isMobile ? "slide-content-mobile py-8" : ""}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-purple-500/10 blur-3xl rounded-full"></div>
          <div className="relative z-10">
            <motion.div
              className={`mb-6 flex items-center justify-center ${isMobile ? "flex-col" : ""}`}
              variants={itemVariants}
            >
              <img
                src="https://jade-late-crow-559.mypinata.cloud/ipfs/bafybeia5skhvck24266qahayvxuhc5k3ez27xnmscrlwfjnwloeal5rdam"
                alt="MindMash.AI Logo"
                className={`${isMobile ? "mb-4 h-16 w-16" : "mr-2 h-20 w-20"}`}
              />
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                MindMash.AI
              </h1>
            </motion.div>
            <motion.h2 className="mb-4 text-xl md:text-2xl font-mono text-cyan-400" variants={itemVariants}>
              &gt; MindMash.AI Neural Interface v1.0.4
            </motion.h2>
            <motion.p className="mb-12 text-xl md:text-2xl text-cyan-300" variants={itemVariants}>
              Where humans and AI think together.
            </motion.p>
            <motion.div className="mt-8 animate-pulse" variants={itemVariants}>
              <p className="text-sm uppercase tracking-widest text-gray-400">Built for the Colosseum Hackathon</p>
            </motion.div>

            <motion.div
              className="mt-8 font-mono text-cyan-400 flex items-center justify-center"
              variants={itemVariants}
            >
              <span className="mr-2">&gt;</span>
              <span>{typedText}</span>
              {cursorVisible && <span className="text-cyan-400 ml-1">▌</span>}
            </motion.div>
          </div>
        </div>
      </motion.div>
    )
  }

  // Slide 3 - Problem: Flat Internet, Fragmented Minds
  if (slideIndex === 1) {
    return (
      <motion.div
        className={`flex flex-col items-center justify-center ${isMobile ? "slide-content-mobile py-8" : ""}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="mb-6 md:mb-8 text-3xl md:text-4xl lg:text-5xl font-mono text-cyan-400 px-4 text-center leading-tight"
            variants={itemVariants}
          >
            &gt; load_problem()
          </motion.h2>
          <motion.div className="mb-6 md:mb-8 text-center px-4" variants={itemVariants}>
            <p className="text-lg md:text-xl font-semibold text-red-400">Flat Internet, Fragmented Minds</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 px-4">
            <motion.div
              className="flex flex-col items-center p-5 md:p-6 rounded-lg bg-gray-900/50 backdrop-blur-sm border border-red-500/30 hover:border-red-500/70 transition-all hover:transform hover:scale-105 cursor-pointer group"
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(249, 115, 22, 0.2)" }}
            >
              <Terminal className="mb-3 md:mb-4 h-10 w-10 md:h-12 md:w-12 text-red-400 group-hover:animate-pulse" />
              <p className="text-center text-base md:text-lg">One-size-fits-all AI tools</p>
            </motion.div>
            <motion.div
              className="flex flex-col items-center p-5 md:p-6 rounded-lg bg-gray-900/50 backdrop-blur-sm border border-red-500/30 hover:border-red-500/70 transition-all hover:transform hover:scale-105 cursor-pointer group"
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(249, 115, 22, 0.2)" }}
            >
              <Users className="mb-3 md:mb-4 h-10 w-10 md:h-12 md:w-12 text-red-400 group-hover:animate-pulse" />
              <p className="text-center text-base md:text-lg">No persistent reputation across platforms</p>
            </motion.div>
            <motion.div
              className="flex flex-col items-center p-5 md:p-6 rounded-lg bg-gray-900/50 backdrop-blur-sm border border-red-500/30 hover:border-red-500/70 transition-all hover:transform hover:scale-105 cursor-pointer group"
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(249, 115, 22, 0.2)" }}
            >
              <Network className="mb-3 md:mb-4 h-10 w-10 md:h-12 md:w-12 text-red-400 group-hover:animate-pulse" />
              <p className="text-center text-base md:text-lg">Passive DAO participation and disposable content</p>
            </motion.div>
          </div>

          <motion.div className="mt-12 relative w-full max-w-3xl mx-auto" variants={itemVariants}>
            <div className="w-full h-64 bg-black/50 rounded-lg border border-red-500/30 overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4/5 h-4/5 relative">
                  <div className="absolute inset-0 flex flex-wrap gap-2 opacity-50">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        className="bg-gray-800/50 rounded p-2 text-xs text-gray-400 border border-gray-700/50 animate-pulse"
                        style={{
                          animationDuration: `${3 + Math.random() * 2}s`,
                          animationDelay: `${Math.random() * 2}s`,
                        }}
                      >
                        {
                          ["AI Response", "User Query", "Content Fragment", "Lost Context", "Broken Thread"][
                            Math.floor(Math.random() * 5)
                          ]
                        }
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-2xl text-red-500 font-bold animate-pulse">FRAGMENTED MINDS</div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-glitch opacity-20"></div>
            </div>
            <div className="mt-4 text-center text-gray-400 font-mono text-sm">
              <span className="text-red-400">ERROR:</span> Neural connections fragmented. Identity context lost.
            </div>
          </motion.div>

          <motion.div className="mt-8 text-center" variants={itemVariants}>
            <div className="inline-block bg-black/30 rounded-lg border border-red-500/30 px-6 py-3">
              <div className="font-mono text-sm text-red-400">
                <span className="mr-2">&gt;</span>
                <span>{typedText}</span>
                {cursorVisible && <span className="text-cyan-400 ml-1">▌</span>}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  // Slide 4 - Solution: One Protocol, Infinite Agents
  if (slideIndex === 2) {
    return (
      <div className={`flex flex-col items-center ${isMobile ? "slide-content-mobile py-8" : "h-full justify-center"}`}>
        <h2 className="mb-6 text-3xl md:text-4xl font-mono text-cyan-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          &gt; execute_mindmash_protocol()
        </h2>
        <div className="mb-6 text-center">
          <h3 className="mb-4 text-2xl font-semibold text-white">One Protocol, Infinite Agents</h3>
        </div>

        <div className="w-full max-w-4xl mx-auto relative">
          <div className="flex flex-col items-center space-y-6">
            {/* Layer diagram */}
            <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4">
              {[
                { name: "SoulSig", desc: "Identity", icon: <Users className="h-8 w-8 text-cyan-400" />, color: "cyan" },
                {
                  name: "SynBots",
                  desc: "AI Agents",
                  icon: <Brain className="h-8 w-8 text-purple-400" />,
                  color: "purple",
                },
                {
                  name: "Collab:Sphere",
                  desc: "Social Layer",
                  icon: <Network className="h-8 w-8 text-pink-400" />,
                  color: "pink",
                },
                {
                  name: "Syndicates",
                  desc: "Governance",
                  icon: <FileText className="h-8 w-8 text-yellow-400" />,
                  color: "yellow",
                },
                {
                  name: "Mash.BiT",
                  desc: "Incentives",
                  icon: <Wallet className="h-8 w-8 text-green-400" />,
                  color: "green",
                },
              ].map((layer, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg bg-gray-900/50 backdrop-blur-sm border border-${layer.color}-500/30 hover:border-${layer.color}-500/70 transition-all hover:transform hover:scale-105 cursor-pointer group flex flex-col items-center`}
                >
                  {layer.icon}
                  <h4 className={`mt-2 text-lg font-bold text-${layer.color}-400`}>{layer.name}</h4>
                  <p className="text-sm text-gray-300">{layer.desc}</p>
                </div>
              ))}
            </div>

            {/* Flow diagram */}
            <div className="w-full h-64 bg-black/30 rounded-lg border border-cyan-500/30 p-4 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg width="100%" height="100%" viewBox="0 0 700 200" className="text-cyan-500">
                  {/* User to SoulSig */}
                  <path
                    d="M80,100 C120,100 120,50 160,50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="animate-dash"
                  />

                  {/* SoulSig to DAO */}
                  <path
                    d="M240,50 C280,50 280,100 320,100"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="animate-dash"
                    style={{ animationDelay: "0.5s" }}
                  />

                  {/* DAO to SynBot */}
                  <path
                    d="M400,100 C440,100 440,150 480,150"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="animate-dash"
                    style={{ animationDelay: "1s" }}
                  />

                  {/* SynBot to Token */}
                  <path
                    d="M540,150 C580,150 580,100 620,100"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="animate-dash"
                    style={{ animationDelay: "1.5s" }}
                  />

                  {/* Nodes */}
                  <circle cx="80" cy="100" r="20" fill="#1e293b" stroke="#06b6d4" strokeWidth="2" />
                  <text x="80" y="100" textAnchor="middle" dominantBaseline="middle" fill="#06b6d4" fontSize="12">
                    User
                  </text>

                  <circle cx="200" cy="50" r="20" fill="#1e293b" stroke="#8b5cf6" strokeWidth="2" />
                  <text x="200" y="50" textAnchor="middle" dominantBaseline="middle" fill="#8b5cf6" fontSize="12">
                    SoulSig
                  </text>

                  <circle cx="360" cy="100" r="20" fill="#1e293b" stroke="#ec4899" strokeWidth="2" />
                  <text x="360" y="100" textAnchor="middle" dominantBaseline="middle" fill="#ec4899" fontSize="12">
                    DAO
                  </text>

                  <circle cx="510" cy="150" r="20" fill="#1e293b" stroke="#a855f7" strokeWidth="2" />
                  <text x="510" y="150" textAnchor="middle" dominantBaseline="middle" fill="#a855f7" fontSize="12">
                    SynBot
                  </text>

                  <circle cx="620" cy="100" r="20" fill="#1e293b" stroke="#10b981" strokeWidth="2" />
                  <text x="620" y="100" textAnchor="middle" dominantBaseline="middle" fill="#10b981" fontSize="12">
                    Token
                  </text>
                </svg>
              </div>

              {/* Animated particles */}
              <div className="absolute inset-0">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute h-1 w-1 rounded-full bg-cyan-500 animate-ping"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDuration: `${1 + Math.random() * 3}s`,
                      animationDelay: `${Math.random() * 2}s`,
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="text-center font-mono text-sm text-cyan-400">
              <p>Protocol initialized. Neural pathways established.</p>
              <p className="mt-1 text-gray-400">user → SoulSig → DAO vote → SynBot action → token reward</p>
            </div>

            <div className="mt-4 text-center">
              <div className="inline-block bg-black/30 rounded-lg border border-cyan-500/30 px-6 py-3">
                <div className="font-mono text-sm text-cyan-400">
                  <span className="mr-2">&gt;</span>
                  <span>{typedText}</span>
                  {cursorVisible && <span className="text-cyan-400 ml-1">▌</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Slide 5 - Core Features
  if (slideIndex === 3) {
    return (
      <div className={`flex flex-col items-center justify-center ${isMobile ? "slide-content-mobile py-8" : ""}`}>
        <h2 className="mb-8 text-3xl md:text-4xl font-mono text-cyan-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          &gt; feature_flags --list
        </h2>

        <div className="w-full max-w-4xl mx-auto bg-black/30 rounded-lg border border-cyan-500/30 p-6 font-mono">
          <div className="space-y-4">
            {[
              {
                name: "SynBot voting + autonomous engagement",
                icon: <CheckCircle className="h-5 w-5 text-green-400" />,
              },
              {
                name: "SoulSig NFT tracking user tone + contributions",
                icon: <CheckCircle className="h-5 w-5 text-green-400" />,
              },
              {
                name: "Collab:Sphere for real-time AI remixing",
                icon: <CheckCircle className="h-5 w-5 text-green-400" />,
              },
              { name: "$3 Vault-based Syndicate governance", icon: <CheckCircle className="h-5 w-5 text-green-400" /> },
              { name: "Mash.BiT incentive layer", icon: <CheckCircle className="h-5 w-5 text-green-400" /> },
              {
                name: "AI Dashboard (voice-to-prompt, emotion-aware tools)",
                icon: <CheckCircle className="h-5 w-5 text-green-400" />,
              },
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-3 group">
                <div className="flex-shrink-0">{feature.icon}</div>
                <div className="text-lg text-cyan-400 group-hover:text-cyan-300 transition-colors">{feature.name}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-4 border-t border-gray-700">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-400">
                System status: <span className="text-green-400">ONLINE</span>
              </div>
              <div className="text-sm text-gray-400">
                <span className="inline-block h-2 w-2 rounded-full bg-cyan-500 animate-pulse mr-2"></span>
                Features loaded successfully
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          <div className="bg-black/30 rounded-lg border border-purple-500/30 p-4">
            <h3 className="text-xl font-mono text-purple-400 mb-4">Protocol Components</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Layers className="h-4 w-4 text-purple-400" />
                <span className="text-gray-300">Multi-layered architecture</span>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-purple-400" />
                <span className="text-gray-300">Real-time collaboration</span>
              </div>
              <div className="flex items-center space-x-2">
                <Cpu className="h-4 w-4 text-purple-400" />
                <span className="text-gray-300">AI-native from the ground up</span>
              </div>
            </div>
          </div>

          <div className="bg-black/30 rounded-lg border border-pink-500/30 p-4">
            <h3 className="text-xl font-mono text-pink-400 mb-4">Integration Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-gray-300">
                  Solana integration: <span className="text-green-400">ACTIVE</span>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-gray-300">
                  Crossmint wallet: <span className="text-green-400">CONNECTED</span>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-gray-300">
                  IPFS agent logs: <span className="text-green-400">SYNCED</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-block bg-black/30 rounded-lg border border-green-500/30 px-6 py-3">
            <div className="font-mono text-sm text-green-400">
              <span className="mr-2">&gt;</span>
              <span>{typedText}</span>
              {cursorVisible && <span className="text-cyan-400 ml-1">▌</span>}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Slide 6 - Why Now + Why Solana
  if (slideIndex === 4) {
    return (
      <motion.div
        className={`flex flex-col items-center justify-center ${isMobile ? "slide-content-mobile py-8" : ""}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="mb-6 md:mb-8 text-3xl md:text-4xl font-mono text-cyan-400 px-4 text-center leading-tight"
            variants={itemVariants}
          >
            &gt; query("Why Solana?")
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
            <motion.div
              className="flex flex-col p-6 rounded-lg bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 hover:border-purple-500/70 transition-all"
              variants={itemVariants}
            >
              <h3 className="text-xl font-semibold text-purple-400 mb-4">Technical Advantages</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Zap className="h-5 w-5 text-purple-400 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">Ultra-fast, low-fee AI calls</span>
                </li>
                <li className="flex items-start">
                  <Code className="h-5 w-5 text-purple-400 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">NFT-based identity primitives</span>
                </li>
                <li className="flex items-start">
                  <Network className="h-5 w-5 text-purple-400 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">IPFS agent logs + Crossmint wallet integration</span>
                </li>
              </ul>

              <div className="mt-6 pt-4 border-t border-gray-700">
                <div className="flex items-center text-sm text-cyan-400">
                  <Terminal className="h-4 w-4 mr-2" />
                  <span>
                    Technical compatibility: <span className="text-green-400">98.7%</span>
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="flex flex-col p-6 rounded-lg bg-gray-900/50 backdrop-blur-sm border border-cyan-500/30 hover:border-cyan-500/70 transition-all"
              variants={itemVariants}
            >
              <h3 className="text-xl font-semibold text-cyan-400 mb-4">Ecosystem Advantages</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Users className="h-5 w-5 text-cyan-400 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">Solana Dev Days</span>
                </li>
                <li className="flex items-start">
                  <Layers className="h-5 w-5 text-cyan-400 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">State compression = real-time collaboration</span>
                </li>
                <li className="flex items-start">
                  <MessageSquare className="h-5 w-5 text-cyan-400 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">Ecosystem demand for social x AI tools</span>
                </li>
              </ul>

              <div className="mt-6 pt-4 border-t border-gray-700">
                <div className="flex items-center text-sm text-cyan-400">
                  <Terminal className="h-4 w-4 mr-2" />
                  <span>
                    Ecosystem alignment: <span className="text-green-400">OPTIMAL</span>
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div className="mt-8 text-center px-4" variants={itemVariants}>
            <div className="inline-block bg-black/30 rounded-lg border border-green-500/30 px-6 py-3">
              <div className="font-mono text-green-400">
                <span className="mr-2">&gt;</span>
                <span>{typedText}</span>
                {cursorVisible && <span className="text-cyan-400 ml-1">▌</span>}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  // Slide 7 - Live Demo Preview
  if (slideIndex === 5) {
    return (
      <div className={`flex flex-col items-center justify-center ${isMobile ? "slide-content-mobile py-8" : ""}`}>
        <h2 className="mb-8 text-3xl md:text-4xl font-mono text-cyan-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          &gt; demo.launch(collabsphere, dashboard)
        </h2>

        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black/30 rounded-lg border border-purple-500/30 p-4 h-80 relative overflow-hidden">
            <h3 className="text-xl font-mono text-purple-400 mb-2">Collab:Sphere</h3>
            <div className="text-sm text-gray-400 mb-4">streaming mashups + prompt creation</div>

            <div className="absolute inset-0 mt-16 flex items-center justify-center">
              <div className="w-4/5 h-4/5 relative">
                <div className="absolute inset-0">
                  <svg width="100%" height="100%" viewBox="0 0 400 300">
                    {/* Network nodes */}
                    {Array.from({ length: 12 }).map((_, i) => {
                      const x = 50 + Math.random() * 300
                      const y = 50 + Math.random() * 200
                      const r = 5 + Math.random() * 10
                      const color = ["#06b6d4", "#8b5cf6", "#ec4899"][Math.floor(Math.random() * 3)]

                      return (
                        <g key={i}>
                          <circle
                            cx={x}
                            cy={y}
                            r={r}
                            fill={color}
                            opacity="0.7"
                            className="animate-pulse"
                            style={{ animationDuration: `${2 + Math.random() * 3}s` }}
                          />

                          {/* Connect to 2-3 other nodes */}
                          {Array.from({ length: 2 + Math.floor(Math.random() * 2) }).map((_, j) => {
                            const targetIndex = (i + j + 1) % 12
                            const targetX = 50 + Math.random() * 300
                            const targetY = 50 + Math.random() * 200

                            return (
                              <line
                                key={`${i}-${j}`}
                                x1={x}
                                y1={y}
                                x2={targetX}
                                y2={targetY}
                                stroke={color}
                                strokeWidth="1"
                                opacity="0.3"
                              />
                            )
                          })}
                        </g>
                      )
                    })}
                  </svg>
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-xl text-purple-400 font-bold animate-pulse">COLLAB:SPHERE</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black/30 rounded-lg border border-cyan-500/30 p-4 h-80 relative overflow-hidden">
            <h3 className="text-xl font-mono text-cyan-400 mb-2">Dashboard</h3>
            <div className="text-sm text-gray-400 mb-4">Data: Nexus, AI Collab Map, SoulSig.ID</div>

            <div className="absolute inset-0 mt-16">
              <div className="grid grid-cols-2 gap-2 p-4 h-full">
                <div className="bg-black/50 rounded border border-purple-500/30 p-2 flex flex-col">
                  <div className="text-xs text-purple-400 mb-2">SynBot Panel</div>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-purple-900/30 border border-purple-500/50 flex items-center justify-center animate-pulse">
                      <Brain className="h-8 w-8 text-purple-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-black/50 rounded border border-pink-500/30 p-2 flex flex-col">
                  <div className="text-xs text-pink-400 mb-2">SoulSig Viewer</div>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-pink-900/30 border border-pink-500/50 flex items-center justify-center animate-pulse">
                      <Users className="h-8 w-8 text-pink-400" />
                    </div>
                  </div>
                </div>

                <div className="col-span-2 bg-black/50 rounded border border-cyan-500/30 p-2 flex flex-col">
                  <div className="text-xs text-cyan-400 mb-2">DAO Votes</div>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="w-full max-w-xs bg-black/70 rounded p-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">Proposal #42</span>
                        <span className="text-green-400">ACTIVE</span>
                      </div>
                      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500" style={{ width: "65%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 w-full max-w-5xl mx-auto bg-black/30 rounded-lg border border-green-500/30 p-4 font-mono">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-2">
              <div className="text-gray-400">Community Status:</div>
              <div className="text-green-400">ACTIVE</div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-center md:space-x-2">
              <div className="text-gray-400">Early Feedback:</div>
              <div className="text-orange-400">🔥 Eager to onboard</div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-end md:space-x-2">
              <div className="text-gray-400">Build Mode:</div>
              <div className="text-cyan-400">PUBLIC</div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-block bg-black/30 rounded-lg border border-cyan-500/30 px-6 py-3">
            <div className="font-mono text-sm text-cyan-400">
              <span className="mr-2">&gt;</span>
              <span>{typedText}</span>
              {cursorVisible && <span className="text-cyan-400 ml-1">▌</span>}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Slide 8 - Post-Hack Plan
  if (slideIndex === 6) {
    return (
      <div className={`flex flex-col items-center justify-center ${isMobile ? "slide-content-mobile py-8" : ""}`}>
        <h2 className="mb-8 text-3xl md:text-4xl font-mono text-cyan-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          &gt; roadmap.upload()
        </h2>

        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-black/30 rounded-lg border border-cyan-500/30 p-6 relative">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute text-xs font-mono text-cyan-500 whitespace-pre"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    transform: `rotate(${Math.random() * 90 - 45}deg)`,
                  }}
                >
                  {`
                  ████████╗██╗███╗   ███╗███████╗██╗     ██╗███╗   ██╗███████╗
                  ╚══██╔══╝██║████╗ ████║██╔════╝██║     ██║████╗  ██║██╔════╝
                     ██║   ██║██╔████╔██║█████╗  ██║     ██║██╔██╗ ██║█████╗  
                     ██║   ██║██║╚██╔╝██║██╔══╝  ██║     ██║██║╚██╗██║██╔══╝  
                     ██║   ██║██║ ╚═╝ ██║███████╗███████╗██║██║ ╚████║███████╗
                     ╚═╝   ╚═╝╚═╝     ╚═╝╚══════╝╚══════╝╚═╝╚═╝  ╚═══╝╚══════╝
                  `}
                </div>
              ))}
            </div>

            <div className="relative z-10">
              <div className="flex flex-col space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-900/30 border border-green-500 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-400">Hackathon launch + working demo</h3>
                    <p className="text-sm text-gray-400">Completed May 2025</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-900/30 border border-cyan-500 flex items-center justify-center">
                    <ArrowRight className="h-4 w-4 text-cyan-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-cyan-400">Solana Accelerate Dev Days + Conference</h3>
                    <p className="text-sm text-gray-400">May 19-24, 2025</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-900/30 border border-yellow-500 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-400">Beta release of MindMash Dashboard</h3>
                    <p className="text-sm text-gray-400">June 2025</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-900/30 border border-cyan-500 flex items-center justify-center">
                    <ArrowRight className="h-4 w-4 text-cyan-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-cyan-400">Solana Incubator Cohort 3 application</h3>
                    <p className="text-sm text-gray-400">September 2025</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-900/30 border border-purple-500 flex items-center justify-center">
                    <Command className="h-4 w-4 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-purple-400">Partnership development</h3>
                    <p className="text-sm text-gray-400">Ongoing</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    Current phase: <span className="text-green-400">HACKATHON</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Next milestone: <span className="text-cyan-400">SOLANA DEV DAYS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="inline-block bg-black/30 rounded-lg border border-cyan-500/30 px-6 py-3">
              <div className="font-mono text-sm text-cyan-400">
                <span className="mr-2">&gt;</span>
                <span>{typedText}</span>
                {cursorVisible && <span className="text-cyan-400 ml-1">▌</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Slide 9 - Vision
  if (slideIndex === 7) {
    return (
      <div className={`flex flex-col items-center justify-center ${isMobile ? "slide-content-mobile py-8" : ""}`}>
        <h2 className="mb-8 text-3xl md:text-4xl font-mono text-cyan-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          &gt; ai-culture.exe
        </h2>

        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-black/30 rounded-lg border border-purple-500/30 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <svg width="100%" height="100%" viewBox="0 0 800 400">
                {/* Neural network background */}
                {Array.from({ length: 30 }).map((_, i) => {
                  const x = Math.random() * 800
                  const y = Math.random() * 400
                  const r = 2 + Math.random() * 4

                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r={r} fill="#8b5cf6" opacity="0.5" />

                      {Array.from({ length: 3 }).map((_, j) => {
                        const targetIndex = (i + j + 1) % 30
                        const targetX = Math.random() * 800
                        const targetY = Math.random() * 400

                        return (
                          <line
                            key={`${i}-${j}`}
                            x1={x}
                            y1={y}
                            x2={targetX}
                            y2={targetY}
                            stroke="#8b5cf6"
                            strokeWidth="1"
                            opacity="0.2"
                          />
                        )
                      })}
                    </g>
                  )
                })}
              </svg>
            </div>

            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-6">
                From meme coins to soulbound agents
              </h3>

              <p className="text-lg md:text-xl text-gray-300 mb-4">From passive feeds to intelligent collaboration.</p>

              <p className="text-xl md:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-8">
                MindMash isn't just an app — it's a new layer of reality for Web3 creators.
              </p>

              <div className="mt-12 flex justify-center">
                <div className="relative w-64 h-64">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-purple-900/50 border-2 border-purple-500 flex items-center justify-center z-10 animate-pulse">
                      <Brain className="h-10 w-10 text-purple-400" />
                    </div>
                  </div>

                  <div className="absolute left-0 top-1/2 -translate-y-1/2">
                    <div
                      className="w-16 h-16 rounded-full bg-cyan-900/50 border-2 border-cyan-500 flex items-center justify-center animate-pulse"
                      style={{ animationDelay: "0.5s" }}
                    >
                      <Users className="h-8 w-8 text-cyan-400" />
                    </div>
                  </div>

                  <div className="absolute right-0 top-1/2 -translate-y-1/2">
                    <div
                      className="w-16 h-16 rounded-full bg-pink-900/50 border-2 border-pink-500 flex items-center justify-center animate-pulse"
                      style={{ animationDelay: "1s" }}
                    >
                      <Network className="h-8 w-8 text-pink-400" />
                    </div>
                  </div>

                  <svg width="100%" height="100%" className="absolute inset-0">
                    <line
                      x1="32"
                      y1="50%"
                      x2="center"
                      y2="50%"
                      stroke="#06b6d4"
                      strokeWidth="2"
                      strokeDasharray="4"
                      className="animate-dash"
                    />
                    <line
                      x1="calc(100% - 32px)"
                      y1="50%"
                      x2="center"
                      y2="50%"
                      stroke="#ec4899"
                      strokeWidth="2"
                      strokeDasharray="4"
                      className="animate-dash"
                      style={{ animationDelay: "0.5s" }}
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="inline-block bg-black/30 rounded-lg border border-purple-500/30 px-6 py-3">
              <div className="font-mono text-sm text-purple-400">
                <span className="mr-2">&gt;</span>
                <span>{typedText}</span>
                {cursorVisible && <span className="text-cyan-400 ml-1">▌</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Slide 10 - Ask
  if (slideIndex === 8) {
    return (
      <div className={`flex flex-col items-center justify-center ${isMobile ? "slide-content-mobile py-8" : ""}`}>
        <h2 className="mb-8 text-3xl md:text-4xl font-mono text-cyan-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          &gt; mission.execute()
        </h2>

        <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "Feedback + testing partners",
              icon: <HelpCircle className="h-12 w-12 text-cyan-400" />,
              description: "Help us refine the protocol and user experience",
              color: "cyan",
            },
            {
              title: "DAO tool integrations",
              icon: <Users className="h-12 w-12 text-purple-400" />,
              description: "Partner with existing DAO tools and communities",
              color: "purple",
            },
            {
              title: "Incubator & VC convos",
              icon: <Wallet className="h-12 w-12 text-pink-400" />,
              description: "Connect with Solana ecosystem partners",
              color: "pink",
            },
            {
              title: "Join our community",
              icon: <MessageSquare className="h-12 w-12 text-green-400" />,
              description: "Be part of the neural frontier",
              color: "green",
            },
          ].map((item, index) => (
            <div
              key={index}
              className={`flex flex-col items-center p-6 rounded-lg bg-gray-900/50 backdrop-blur-sm border border-${item.color}-500/30 hover:border-${item.color}-500/70 transition-all hover:transform hover:scale-105 cursor-pointer group`}
            >
              <div
                className={`mb-4 flex items-center justify-center h-20 w-20 rounded-full bg-${item.color}-900/30 border border-${item.color}-500/50 group-hover:border-${item.color}-400`}
              >
                {item.icon}
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">{item.title}</h3>
              <p className="text-center text-gray-300">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white font-mono rounded-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
            <span className="mr-2">&gt;</span>
            join_mindmash [ENTER]
            {cursorVisible && <span className="text-cyan-400 ml-1">▌</span>}
          </button>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-block bg-black/30 rounded-lg border border-cyan-500/30 px-6 py-3">
            <div className="font-mono text-sm text-cyan-400">
              <span className="mr-2">&gt;</span>
              <span>{typedText}</span>
              {cursorVisible && <span className="text-cyan-400 ml-1">▌</span>}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Slide 11 - Thanks + Tagline
  if (slideIndex === 9) {
    return (
      <div
        className={`flex flex-col items-center justify-center text-center px-4 ${isMobile ? "slide-content-mobile py-8" : ""}`}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-purple-500/10 blur-3xl rounded-full"></div>
          <div className="relative z-10">
            <div className="mb-6 font-mono text-2xl text-cyan-400">&gt; echo "Join the mash."</div>

            <div className={`mb-6 flex items-center justify-center ${isMobile ? "flex-col" : ""}`}>
              <img
                src="https://jade-late-crow-559.mypinata.cloud/ipfs/bafybeia5skhvck24266qahayvxuhc5k3ez27xnmscrlwfjnwloeal5rdam"
                alt="MindMash.AI Logo"
                className={`${isMobile ? "mb-4 h-16 w-16" : "mr-2 h-20 w-20"} animate-pulse`}
              />
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                MindMash.AI
              </h1>
            </div>

            <p className="mb-8 md:mb-12 text-xl md:text-2xl max-w-2xl">
              Thank you for listening. We're live, we're building in public, and the signal is strong.
            </p>

            <div className="mb-8 text-xl md:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              Own your signal. Amplify your voice. Join the mash.
            </div>

            <div className="mt-8 mb-8">
              <Link href="/demo" target="_blank">
                <Button
                  className="px-8 py-6 text-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-105"
                  onClick={() => playSound("/sounds/maximize.mp3")}
                >
                  <Zap className="mr-2 h-6 w-6" />
                  Try Interactive Demo
                </Button>
              </Link>
            </div>

            <div className="mt-8 font-mono text-cyan-400 flex items-center justify-center">
              <span className="mr-2">&gt;</span>
              <span>{typedText}</span>
              {cursorVisible && <span className="text-cyan-400 animate-pulse">▌</span>}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default fallback
  return (
    <div className="flex h-full items-center justify-center">
      <p className="text-xl text-gray-400">Slide content not available</p>
    </div>
  )
}
