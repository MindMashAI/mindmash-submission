"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import NeuralConnectionEffect from "@/components/neural-connection-effect"
import { useAudio } from "@/components/audio-manager"
import { Zap, Users, Shield, Presentation, Code, Database, Sparkles } from "lucide-react"

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLogoHovered, setIsLogoHovered] = useState(false)
  const [isLogoClicked, setIsLogoClicked] = useState(false)
  const logoAnimationRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()
  const { playSound } = useAudio()

  useEffect(() => {
    setIsLoaded(true)
    playSound("/sounds/boot.mp3")

    return () => {
      if (logoAnimationRef.current) {
        clearTimeout(logoAnimationRef.current)
      }
    }
  }, [playSound])

  const handleGetStarted = () => {
    playSound("/sounds/button-click.mp3")
    router.push("/auth")
  }

  const handleViewPitchDeck = () => {
    playSound("/sounds/slide-change.mp3")
    router.push("/") // Link to the root page for pitch deck
  }

  const handleTryDemo = () => {
    playSound("/sounds/button-click.mp3")
    router.push("/auth?demo=true") 
  }

  const handleLogoClick = () => {
    playSound("/sounds/feature-select.mp3")
    setIsLogoClicked(true)

    const pulseAnimation = () => {
      setIsLogoClicked((prev) => !prev)
      logoAnimationRef.current = setTimeout(pulseAnimation, 800)
    }

    pulseAnimation()

    
    setTimeout(() => {
      if (logoAnimationRef.current) {
        clearTimeout(logoAnimationRef.current)
      }
      setIsLogoClicked(false)
    }, 4000)
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-black text-white font-mono overflow-hidden">
      {/* Background effects */}
      <NeuralConnectionEffect className="opacity-30" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6">
        <div
          className="flex items-center cursor-pointer group"
          onMouseEnter={() => setIsLogoHovered(true)}
          onMouseLeave={() => setIsLogoHovered(false)}
          onClick={handleLogoClick}
        >
          <div
            className={`relative w-12 h-12 transition-all duration-300 ${isLogoHovered ? "scale-110" : ""} ${isLogoClicked ? "scale-125" : ""}`}
          >
            <Image
              src="/images/mindmash-logo.png"
              alt="MindMash.AI Logo"
              fill
              className="object-contain"
              style={{
                filter: isLogoHovered || isLogoClicked ? "drop-shadow(0 0 8px rgba(139, 92, 246, 0.8))" : "none",
              }}
            />
          </div>
          <h1
            className={`ml-3 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 transition-all duration-300 ${isLogoHovered ? "tracking-wider" : ""}`}
          >
            MindMash.AI
          </h1>
          {isLogoHovered && (
            <div className="absolute top-full left-0 mt-2 bg-black/80 backdrop-blur-sm border border-purple-500/30 p-2 rounded text-xs text-gray-300 w-48">
              Click to activate neural pulse effect
            </div>
          )}
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="#features" className="text-gray-400 hover:text-cyan-400 transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="text-gray-400 hover:text-cyan-400 transition-colors">
            How It Works
          </Link>
          <Link href="#vision" className="text-gray-400 hover:text-cyan-400 transition-colors">
            Vision
          </Link>
          <Button
            variant="ghost"
            onClick={() => {
              playSound("/sounds/button-click.mp3")
              router.push("/auth")
            }}
            className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/20"
          >
            Sign In
          </Button>
        </nav>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-gray-400"
          onClick={() => playSound("/sounds/button-click.mp3")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </Button>
      </header>

      {/* Hero section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 mb-6">
                The Neural Future of Collaboration
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                MindMash.AI is a real-time, multiplayer platform for collaborative intelligence. We're building the
                operating system for AI-enhanced collective thinking, where humans and AI work together to solve complex
                problems.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleViewPitchDeck}
                  className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-8 py-6 rounded-md text-lg"
                >
                  View Pitch Deck
                  <Presentation className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={handleTryDemo}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800/50 px-8 py-6 rounded-md text-lg"
                >
                  Try Demo
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-[400px] bg-gradient-to-br from-purple-900/30 to-cyan-900/30 rounded-lg border border-purple-500/30 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className={`relative w-40 h-40 transition-all duration-500 ${isLogoClicked ? "scale-125" : "scale-100"}`}
                  >
                    <Image
                      src="/images/mindmash-logo.png"
                      alt="MindMash.AI Logo"
                      fill
                      className="object-contain"
                      style={{
                        filter: isLogoClicked
                          ? "drop-shadow(0 0 15px rgba(139, 92, 246, 0.8))"
                          : "drop-shadow(0 0 8px rgba(139, 92, 246, 0.5))",
                      }}
                    />
                  </div>
                  <div className="absolute inset-0">
                    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <defs>
                        <radialGradient id="brain-glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                          <stop offset="0%" stopColor="rgba(168, 85, 247, 0.4)" />
                          <stop offset="100%" stopColor="rgba(168, 85, 247, 0)" />
                        </radialGradient>
                      </defs>
                      <circle
                        cx="50"
                        cy="50"
                        r={isLogoClicked ? "40" : "30"}
                        fill="url(#brain-glow)"
                        className={isLogoClicked ? "animate-pulse" : ""}
                      />
                    </svg>
                  </div>
                </div>
                {/* Neural connection lines */}
                <svg width="100%" height="100%" className="absolute inset-0">
                  <line
                    x1="30%"
                    y1="30%"
                    x2="50%"
                    y2="50%"
                    stroke={isLogoClicked ? "rgba(139, 92, 246, 0.6)" : "rgba(34, 211, 238, 0.3)"}
                    strokeWidth={isLogoClicked ? "2" : "1"}
                    strokeDasharray="5,5"
                    className={isLogoClicked ? "animate-pulse" : ""}
                  />
                  <line
                    x1="70%"
                    y1="30%"
                    x2="50%"
                    y2="50%"
                    stroke={isLogoClicked ? "rgba(139, 92, 246, 0.6)" : "rgba(34, 211, 238, 0.3)"}
                    strokeWidth={isLogoClicked ? "2" : "1"}
                    strokeDasharray="5,5"
                    className={isLogoClicked ? "animate-pulse" : ""}
                  />
                  <line
                    x1="30%"
                    y1="70%"
                    x2="50%"
                    y2="50%"
                    stroke={isLogoClicked ? "rgba(139, 92, 246, 0.6)" : "rgba(34, 211, 238, 0.3)"}
                    strokeWidth={isLogoClicked ? "2" : "1"}
                    strokeDasharray="5,5"
                    className={isLogoClicked ? "animate-pulse" : ""}
                  />
                  <line
                    x1="70%"
                    y1="70%"
                    x2="50%"
                    y2="50%"
                    stroke={isLogoClicked ? "rgba(139, 92, 246, 0.6)" : "rgba(34, 211, 238, 0.3)"}
                    strokeWidth={isLogoClicked ? "2" : "1"}
                    strokeDasharray="5,5"
                    className={isLogoClicked ? "animate-pulse" : ""}
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution section */}
      <section id="vision" className="relative z-10 py-20 px-6 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">
              The Problem & Our Solution
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              AI is powerful—but it's still a solo experience. We're changing that.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="p-6 bg-gradient-to-br from-gray-900 to-black rounded-lg border border-red-500/30">
              <h3 className="text-2xl font-bold text-red-400 mb-4">The Problem</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">•</span>
                  <p className="text-gray-300">Current AI interactions are isolated, one-to-one experiences</p>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">•</span>
                  <p className="text-gray-300">No way to collaborate with others in real-time using AI</p>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">•</span>
                  <p className="text-gray-300">Knowledge and insights remain siloed</p>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">•</span>
                  <p className="text-gray-300">Limited ability to build on others' AI interactions</p>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-gradient-to-br from-gray-900 to-black rounded-lg border border-green-500/30">
              <h3 className="text-2xl font-bold text-green-400 mb-4">Our Solution</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <p className="text-gray-300">Real-time, multiplayer platform for collaborative intelligence</p>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <p className="text-gray-300">Shared AI workspaces with multiple interaction types</p>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <p className="text-gray-300">Knowledge graph that connects ideas across users</p>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <p className="text-gray-300">Token-based incentives for valuable contributions</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section id="features" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">
              Core Features
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Six key components of the MindMash.AI platform</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="h-8 w-8 text-purple-400" />,
                title: "Multiplayer AI",
                description:
                  "Collaborate with others in real-time using shared AI workspaces. Multiple users can interact with AI simultaneously.",
              },
              {
                icon: <Zap className="h-8 w-8 text-cyan-400" />,
                title: "Interaction Types",
                description: "Choose from different AI interaction modes: debates, brainstorming, critiques, and more.",
              },
              {
                icon: <Database className="h-8 w-8 text-purple-400" />,
                title: "Knowledge Graph",
                description:
                  "All interactions are mapped to a knowledge graph, connecting ideas across users and topics.",
              },
              {
                icon: <Shield className="h-8 w-8 text-cyan-400" />,
                title: "Syndicates",
                description: "Join topic-based groups with shared governance and token incentives for contributions.",
              },
              {
                icon: <Code className="h-8 w-8 text-purple-400" />,
                title: "API & Integrations",
                description: "Connect MindMash to your existing tools and workflows with our developer-friendly API.",
              },
              {
                icon: <Sparkles className="h-8 w-8 text-cyan-400" />,
                title: "Mash.BiT Tokens",
                description:
                  "Earn tokens for valuable contributions, which can be used for governance and premium features.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-gradient-to-br from-gray-900 to-black rounded-lg border border-purple-500/30 hover:border-purple-500/50 transition-colors"
              >
                <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section id="how-it-works" className="relative z-10 py-20 px-6 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">
              Tech Stack
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">The technologies powering MindMash.AI</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Frontend",
                items: ["Next.js", "React", "TypeScript", "TailwindCSS", "WebSockets"],
              },
              {
                title: "Backend",
                items: ["Node.js", "WebSockets", "Redis", "PostgreSQL", "Vector DB"],
              },
              {
                title: "AI & Blockchain",
                items: ["OpenAI API", "Anthropic API", "Solana", "Crossmint SDK", "Knowledge Graphs"],
              },
            ].map((stack, index) => (
              <div
                key={index}
                className="p-6 bg-gradient-to-br from-gray-900 to-black rounded-lg border border-cyan-900/30"
              >
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">
                  {stack.title}
                </h3>
                <ul className="space-y-2">
                  {stack.items.map((item, idx) => (
                    <li key={idx} className="flex items-center">
                      <span className="text-cyan-400 mr-2">•</span>
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 md:p-12 bg-gradient-to-br from-purple-900/30 to-cyan-900/30 rounded-lg border border-purple-500/30">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">
                Ready to Explore MindMash.AI?
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                View our full pitch deck or try the interactive demo.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                onClick={handleViewPitchDeck}
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-8 py-6 rounded-md text-lg"
              >
                View Pitch Deck
                <Presentation className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                onClick={handleTryDemo}
                className="border-gray-700 text-gray-300 hover:bg-gray-800/50 px-8 py-6 rounded-md text-lg"
              >
                Try Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="relative w-8 h-8">
                  <Image src="/images/mindmash-logo.png" alt="MindMash.AI Logo" fill className="object-contain" />
                </div>
                <h3 className="ml-2 text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                  MindMash.AI
                </h3>
              </div>
              <p className="text-gray-500 text-sm">Building the operating system for collaborative intelligence.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Platform</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#features" className="text-gray-500 hover:text-cyan-400 transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="text-gray-500 hover:text-cyan-400 transition-colors">
                    Tech Stack
                  </Link>
                </li>
                <li>
                  <Link href="#vision" className="text-gray-500 hover:text-cyan-400 transition-colors">
                    Vision
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-500 hover:text-cyan-400 transition-colors">
                    Pitch Deck
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-cyan-400 transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-cyan-400 transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Connect</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-500 hover:text-cyan-400 transition-colors">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-cyan-400 transition-colors">
                    Discord
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-500 hover:text-cyan-400 transition-colors">
                    GitHub
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-sm">© 2023 MindMash.AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
