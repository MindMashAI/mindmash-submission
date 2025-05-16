"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useAudio } from "@/components/audio-manager"
import { Sparkles, Palette, Cpu, Braces, RefreshCw, Check, ChevronUp, ChevronDown } from "lucide-react"
import Image from "next/image"

export default function MashbotMinter() {
  const { playSound } = useAudio()
  const [step, setStep] = useState(1)
  const [selectedBot, setSelectedBot] = useState<number | null>(null)
  const [selectedPersonality, setSelectedPersonality] = useState<number | null>(null)
  const [customizing, setCustomizing] = useState(false)
  const [minting, setMinting] = useState(false)
  const [mintComplete, setMintComplete] = useState(false)
  const [botName, setBotName] = useState("")

  // Ref for the scrollable container
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Bot templates
  const botTemplates = [
    {
      id: 1,
      name: "Synth-X",
      image: "/images/nft/mindmash-nft-1.png",
      color: "from-cyan-500 to-blue-500",
      description: "Technical specialist with advanced problem-solving capabilities",
    },
    {
      id: 2,
      name: "Nova",
      image: "/images/nft/mindmash-nft-2.png",
      color: "from-purple-500 to-pink-500",
      description: "Creative assistant focused on generating innovative ideas",
    },
    {
      id: 3,
      name: "Quantum",
      image: "/images/nft/mindmash-nft-3.png",
      color: "from-green-500 to-emerald-500",
      description: "Analytical expert specializing in data interpretation",
    },
    {
      id: 4,
      name: "Nexus",
      image: "/images/nft/mindmash-nft-4.png",
      color: "from-amber-500 to-orange-500",
      description: "Collaborative coordinator that excels at synthesizing information",
    },
  ]

  // Personality traits
  const personalityTraits = [
    {
      id: 1,
      name: "Logical",
      icon: <Braces className="h-5 w-5" />,
      color: "bg-blue-500",
      description: "Precise, methodical, and detail-oriented approach",
    },
    {
      id: 2,
      name: "Creative",
      icon: <Sparkles className="h-5 w-5" />,
      color: "bg-purple-500",
      description: "Imaginative, innovative, and thinks outside the box",
    },
    {
      id: 3,
      name: "Analytical",
      icon: <Cpu className="h-5 w-5" />,
      color: "bg-green-500",
      description: "Data-driven, insightful, and pattern-recognizing",
    },
    {
      id: 4,
      name: "Adaptive",
      icon: <Palette className="h-5 w-5" />,
      color: "bg-amber-500",
      description: "Flexible, context-aware, and quick to adjust",
    },
  ]

  // Scroll functions
  const scrollUp = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        top: -100,
        behavior: "smooth",
      })
    }
  }

  const scrollDown = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        top: 100,
        behavior: "smooth",
      })
    }
  }

  const handleSelectBot = (id: number) => {
    setSelectedBot(id)
    playSound("/sounds/tech-select.mp3")

    // Auto-advance after selection
    setTimeout(() => {
      setStep(2)
      // Reset scroll position when changing steps
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0
      }
    }, 500)
  }

  const handleSelectPersonality = (id: number) => {
    setSelectedPersonality(id)
    playSound("/sounds/tech-select.mp3")

    // Auto-advance after selection
    setTimeout(() => {
      setStep(3)
      // Reset scroll position when changing steps
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0
      }
    }, 500)
  }

  const handleCustomize = () => {
    setCustomizing(true)
    playSound("/sounds/button-click.mp3")
  }

  const handleMint = () => {
    if (!botName) {
      setBotName(getSelectedBot()?.name || "MashBot")
    }

    setMinting(true)
    playSound("/sounds/feature-select.mp3")

    // Simulate minting process
    setTimeout(() => {
      setMinting(false)
      setMintComplete(true)
      // Reset scroll position
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0
      }
    }, 2500)
  }

  const getSelectedBot = () => {
    return botTemplates.find((bot) => bot.id === selectedBot) || null
  }

  const getSelectedPersonality = () => {
    return personalityTraits.find((trait) => trait.id === selectedPersonality) || null
  }

  const currentStep = step

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">
        Mint Your Mash.BoT NFT
      </h2>

      {/* Step indicators */}
      <div className="flex flex-col items-center mb-6">
        <div className="flex items-center justify-center space-x-4 mb-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === 1
                ? "bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white"
                : "bg-gray-800 text-gray-400"
            }`}
          >
            1
          </div>
          <div className="w-6 h-0.5 bg-gray-700"></div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === 2
                ? "bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white"
                : "bg-gray-800 text-gray-400"
            }`}
          >
            2
          </div>
          <div className="w-6 h-0.5 bg-gray-700"></div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === 3
                ? "bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white"
                : "bg-gray-800 text-gray-400"
            }`}
          >
            3
          </div>
        </div>
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
          <div className={currentStep === 1 ? "text-fuchsia-400" : ""}>Select Bot</div>
          <div className="w-6"></div>
          <div className={currentStep === 2 ? "text-fuchsia-400" : ""}>Choose Personality</div>
          <div className="w-6"></div>
          <div className={currentStep === 3 ? "text-fuchsia-400" : ""}>Customize & Mint</div>
        </div>
      </div>

      {/* Scroll buttons */}
      <div className="flex justify-end mb-2 space-x-2">
        <button
          onClick={scrollUp}
          className="bg-gray-800 hover:bg-gray-700 text-cyan-400 p-1 rounded"
          aria-label="Scroll up"
        >
          <ChevronUp size={16} />
        </button>
        <button
          onClick={scrollDown}
          className="bg-gray-800 hover:bg-gray-700 text-cyan-400 p-1 rounded"
          aria-label="Scroll down"
        >
          <ChevronDown size={16} />
        </button>
      </div>

      {/* Scrollable content area with fixed height and direct styling */}
      <div
        ref={scrollContainerRef}
        style={{
          height: "380px",
          overflowY: "auto",
          border: "1px solid rgba(8, 145, 178, 0.3)",
          borderRadius: "0.375rem",
          padding: "16px",
          marginBottom: "16px",
        }}
      >
        {/* Step 1: Select Bot Template */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-300">Choose your Mash.BoT base model:</p>
            <div className="grid grid-cols-2 gap-3">
              {botTemplates.map((bot) => (
                <div
                  key={bot.id}
                  className={`p-3 rounded-md cursor-pointer transition-all duration-300 hover:scale-105 ${
                    selectedBot === bot.id
                      ? `border-2 bg-gradient-to-br ${bot.color} bg-opacity-20`
                      : "border border-gray-700 hover:border-gray-500 bg-black/40"
                  }`}
                  onClick={() => handleSelectBot(bot.id)}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-r ${bot.color} mb-2 flex items-center justify-center`}
                    >
                      <Image
                        src={bot.image || "/placeholder.svg"}
                        alt="MindMash NFT"
                        width={48}
                        height={48}
                        className="rounded-lg shadow-glow"
                      />
                    </div>
                    <h3 className="font-bold text-white">{bot.name}</h3>
                    <p className="text-xs text-gray-300 mt-1 text-center">{bot.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add extra content to ensure scrolling */}
            <div className="mt-8 pt-8 border-t border-gray-800">
              <h4 className="text-sm font-bold text-cyan-400 mb-2">About Mash.BoT NFTs</h4>
              <p className="text-xs text-gray-400 mb-4">
                Mash.BoT NFTs are unique AI assistants that join your collaborative AI chats. Each bot has its own
                personality and specialization, making it perfect for different types of tasks and interactions.
              </p>
              <p className="text-xs text-gray-400 mb-4">
                As NFTs, they can be traded, upgraded, and customized over time. The more you interact with your
                Mash.BoT, the more it learns and adapts to your specific needs and preferences.
              </p>
              <p className="text-xs text-gray-400">
                Choose a base model that aligns with your primary use case, then customize it with a personality trait
                that complements your working style.
              </p>
            </div>

            {/* Add even more content to force scrolling */}
            <div className="mt-8 pt-8 border-t border-gray-800">
              <h4 className="text-sm font-bold text-cyan-400 mb-2">Benefits of AI Assistants</h4>
              <p className="text-xs text-gray-400 mb-4">
                AI assistants can dramatically improve your productivity by automating routine tasks, providing
                intelligent suggestions, and helping you focus on what matters most.
              </p>
              <p className="text-xs text-gray-400 mb-4">
                Each Mash.BoT has been trained on a vast corpus of data, enabling it to assist with a wide range of
                tasks from creative writing to technical problem-solving.
              </p>
              <p className="text-xs text-gray-400 mb-4">
                The unique combination of base model and personality trait creates a customized experience tailored to
                your specific needs and working style.
              </p>
              <p className="text-xs text-gray-400">
                As you interact with your Mash.BoT, it learns from your preferences and adapts to become an even more
                effective collaborator over time.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Select Personality */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-300">Choose a personality trait:</p>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-cyan-400 hover:bg-cyan-900/20"
                onClick={() => {
                  setStep(1)
                  if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTop = 0
                  }
                }}
              >
                Back
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {personalityTraits.map((trait) => (
                <div
                  key={trait.id}
                  className={`p-3 rounded-md cursor-pointer transition-all duration-300 hover:scale-105 ${
                    selectedPersonality === trait.id
                      ? `border-2 border-${trait.color.replace("bg-", "")}`
                      : "border border-gray-700 hover:border-gray-500 bg-black/40"
                  } bg-black/40`}
                  onClick={() => handleSelectPersonality(trait.id)}
                >
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full ${trait.color} mb-2 flex items-center justify-center`}>
                      {trait.icon}
                    </div>
                    <h3 className="font-bold text-white">{trait.name}</h3>
                    <p className="text-xs text-gray-300 mt-1 text-center">{trait.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add extra content to ensure scrolling */}
            <div className="mt-8 pt-8 border-t border-gray-800">
              <h4 className="text-sm font-bold text-cyan-400 mb-2">Personality Traits Explained</h4>
              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-semibold text-blue-400">Logical</h5>
                  <p className="text-xs text-gray-400">
                    Logical Mash.BoTs excel at structured problem-solving, data analysis, and systematic approaches.
                    They're perfect for technical challenges, debugging, and situations requiring precise, methodical
                    thinking.
                  </p>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-purple-400">Creative</h5>
                  <p className="text-xs text-gray-400">
                    Creative Mash.BoTs specialize in generating novel ideas, thinking outside conventional boundaries,
                    and making unexpected connections. They're ideal for brainstorming, content creation, and innovative
                    solution design.
                  </p>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-green-400">Analytical</h5>
                  <p className="text-xs text-gray-400">
                    Analytical Mash.BoTs focus on data interpretation, pattern recognition, and evidence-based insights.
                    They excel at research tasks, trend analysis, and extracting meaningful conclusions from complex
                    information.
                  </p>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-amber-400">Adaptive</h5>
                  <p className="text-xs text-gray-400">
                    Adaptive Mash.BoTs are flexible, context-aware, and quick to adjust to changing requirements.
                    They're perfect for dynamic environments, multidisciplinary projects, and situations requiring
                    versatile approaches.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Customize and Mint */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-300">Customize your Mash.BoT:</p>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-cyan-400 hover:bg-cyan-900/20"
                onClick={() => {
                  setStep(2)
                  if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTop = 0
                  }
                }}
              >
                Back
              </Button>
            </div>

            {mintComplete ? (
              <div className="bg-black/60 border border-green-500/50 rounded-md p-4 text-center">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-3">
                  <Check className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Mash.BoT Minted!</h3>
                <p className="text-sm text-gray-300 mb-4">Your custom AI assistant is ready to collaborate with you.</p>
                <div className="bg-black/40 border border-gray-700 rounded-md p-3 mb-4">
                  <div className="flex items-center justify-center">
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-r ${getSelectedBot()?.color} mr-3 flex items-center justify-center`}
                    >
                      <Image
                        src={getSelectedBot()?.image || "/placeholder.svg"}
                        alt="MindMash NFT"
                        width={32}
                        height={32}
                        className="rounded-lg shadow-glow"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{botName}</h4>
                      <p className="text-xs text-gray-400">
                        {getSelectedPersonality()?.name} • {getSelectedBot()?.name} Base
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white"
                  onClick={() => {
                    setStep(1)
                    setSelectedBot(null)
                    setSelectedPersonality(null)
                    setMintComplete(false)
                    setBotName("")
                    if (scrollContainerRef.current) {
                      scrollContainerRef.current.scrollTop = 0
                    }
                  }}
                >
                  Mint Another Mash.BoT
                </Button>
              </div>
            ) : (
              <>
                <div className="bg-black/60 border border-gray-700 rounded-md p-4">
                  <div className="flex items-center mb-4">
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-r ${getSelectedBot()?.color} mr-3 flex items-center justify-center`}
                    >
                      <Image
                        src={getSelectedBot()?.image || "/placeholder.svg"}
                        alt="MindMash NFT"
                        width={48}
                        height={48}
                        className="rounded-lg shadow-glow"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{getSelectedBot()?.name}</h3>
                      <p className="text-xs text-gray-400">{getSelectedPersonality()?.name} Personality</p>
                      <div className="flex items-center mt-1">
                        <div className={`w-3 h-3 rounded-full ${getSelectedPersonality()?.color} mr-1`}></div>
                        <span className="text-xs text-gray-300">Unique NFT Assistant</span>
                      </div>
                    </div>
                  </div>

                  {customizing ? (
                    <div className="space-y-6 bot-customizer">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Bot Name</label>
                        <input
                          type="text"
                          value={botName}
                          onChange={(e) => setBotName(e.target.value)}
                          placeholder={getSelectedBot()?.name || "Enter name"}
                          className="w-full bg-black/60 border border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full border-gray-700 text-gray-300 hover:bg-gray-800/50"
                      onClick={handleCustomize}
                    >
                      <Palette className="h-4 w-4 mr-2" />
                      Customize
                    </Button>
                  )}
                </div>

                <div className="bg-black/60 border border-gray-700 rounded-md p-4">
                  <h4 className="text-sm font-bold text-white mb-2">Bot Capabilities</h4>
                  <ul className="space-y-2 text-xs">
                    <li className="flex items-start">
                      <div className="bg-cyan-900/30 p-1 rounded-full mr-2 mt-0.5">
                        <Check className="h-3 w-3 text-cyan-400" />
                      </div>
                      <span className="text-gray-300">Joins your collaborative AI chats</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-cyan-900/30 p-1 rounded-full mr-2 mt-0.5">
                        <Check className="h-3 w-3 text-cyan-400" />
                      </div>
                      <span className="text-gray-300">
                        Specializes in {getSelectedPersonality()?.name.toLowerCase()} approaches
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-cyan-900/30 p-1 rounded-full mr-2 mt-0.5">
                        <Check className="h-3 w-3 text-cyan-400" />
                      </div>
                      <span className="text-gray-300">Learns from your interactions over time</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-cyan-900/30 p-1 rounded-full mr-2 mt-0.5">
                        <Check className="h-3 w-3 text-cyan-400" />
                      </div>
                      <span className="text-gray-300">Tradeable NFT with unique properties</span>
                    </li>
                  </ul>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white"
                  onClick={handleMint}
                  disabled={minting}
                >
                  {minting ? (
                    <span className="flex items-center">
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Minting...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Sparkles className="h-4 w-4 mr-2" /> Mint Mash.BoT NFT
                    </span>
                  )}
                </Button>
              </>
            )}

            {/* Add extra content to ensure scrolling */}
            <div className="mt-8 pt-8 border-t border-gray-800">
              <h4 className="text-sm font-bold text-cyan-400 mb-2">NFT Benefits</h4>
              <p className="text-xs text-gray-400 mb-4">
                Your Mash.BoT NFT comes with several benefits in the MindMash.AI ecosystem:
              </p>
              <ul className="space-y-2 text-xs text-gray-400">
                <li className="flex items-start">
                  <div className="bg-cyan-900/30 p-1 rounded-full mr-2 mt-0.5">
                    <Check className="h-3 w-3 text-cyan-400" />
                  </div>
                  <span>Exclusive access to premium AI collaboration features</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-cyan-900/30 p-1 rounded-full mr-2 mt-0.5">
                    <Check className="h-3 w-3 text-cyan-400" />
                  </div>
                  <span>Ability to join specialized syndicates for collaborative learning</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-cyan-900/30 p-1 rounded-full mr-2 mt-0.5">
                    <Check className="h-3 w-3 text-cyan-400" />
                  </div>
                  <span>Enhanced Mash.BiT token earning potential</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-cyan-900/30 p-1 rounded-full mr-2 mt-0.5">
                    <Check className="h-3 w-3 text-cyan-400" />
                  </div>
                  <span>Tradeable asset with growing utility in the ecosystem</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Bottom section with upgrade button and user info */}
      <div className="mt-auto pt-4 border-t border-gray-800">
        <Button
          className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white"
          onClick={() => playSound("/sounds/button-click.mp3")}
        >
          <span className="mr-2">⭐</span>
          Upgrade Your Plan
        </Button>

        <div className="mt-3">
          <div className="flex items-center p-2 bg-black/40 rounded-md border border-gray-800">
            <div className="w-8 h-8 rounded-full bg-cyan-900 flex items-center justify-center text-white font-bold mr-3">
              M
            </div>
            <div>
              <div className="font-medium">Crossmint User</div>
              <div className="text-xs text-gray-400">info@MindMash.AI</div>
              <div className="text-xs text-gray-400">Cs7Ht...9vQr</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
