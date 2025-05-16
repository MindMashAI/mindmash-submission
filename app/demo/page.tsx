"use client"

import { useState, useEffect, useRef } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAudio } from "@/components/audio-manager"
import NeuralConnectionEffect from "@/components/neural-connection-effect"
import ChatInterface from "@/components/chat-interface"
import ModesPanel from "@/components/modes-panel"
import MashbotMinter from "@/components/mashbot-minter"
import MapPanel from "@/components/map-panel"
import LoadingScreen from "@/components/loading-screen"
import NavigationBar from "@/components/navigation-bar"
import OnboardingOverlay from "@/components/onboarding-overlay"
import DemoScenarios from "@/components/demo-scenarios"
import TokenVisualization from "@/components/token-visualization"
import { Radio, BotIcon, Bell, Maximize, Minimize, Volume2, VolumeX, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import KeyboardShortcutsHandler from "@/components/keyboard-shortcuts-handler"
// Import the NotificationSystem component
import { NotificationSystem } from "@/components/notification-system"
import type { Notification } from "@/components/notification-system"
import MashwavRadioSimple from "@/components/mashwav-radio-simple"
// Remove the WalletBalanceMini import
// import { WalletBalanceMini } from "@/components/wallet-balance-mini"

export default function DemoPage() {
  const [loading, setLoading] = useState(true)
  const [activeMode, setActiveMode] = useState("synthdev")
  const [activeTab, setActiveTab] = useState("modes")
  const [mostActiveAI, setMostActiveAI] = useState("user")
  const [currentEmotion, setCurrentEmotion] = useState("Neutral")
  const [isMuted, setIsMuted] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [showTokens, setShowTokens] = useState(false)
  const [tokenCount, setTokenCount] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const { playSound, toggleMute } = useAudio()
  const chatRef = useRef<HTMLDivElement>(null)
  const [showPerformanceMetrics, setShowPerformanceMetrics] = useState(false)
  // Add state for notifications
  const [notifications, setNotifications] = useState<Notification[]>([])
  // Reference to the main container for scrolling
  const mainContainerRef = useRef<HTMLDivElement>(null)
  // Reference to track token timeout
  const tokenTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  // Track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true)
  // Add after other useState declarations
  const [selectedPrompt, setSelectedPrompt] = useState<string>("")

  const [notificationCount, setNotificationCount] = useState(0)
  const [powerStatus, setPowerStatus] = useState(true)
  const [systemStatus, setSystemStatus] = useState<"online" | "offline" | "booting">("online")
  const [offlineMode, setOfflineMode] = useState(false)

  // Set isMounted to false when component unmounts
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  // Add function to add notifications
  const addNotification = (type: "success" | "warning" | "info", message: string, duration = 5000) => {
    if (!isMountedRef.current) return

    const id = Date.now().toString()
    setNotifications((prev) => [...prev, { id, type, message, duration }])
    setNotificationCount((prev) => prev + 1)

    // Auto-dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        if (isMountedRef.current) {
          dismissNotification(id)
        }
      }, duration)
    }
  }

  // Add function to dismiss notifications
  const dismissNotification = (id: string) => {
    if (!isMountedRef.current) return
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  // Toggle system power
  const togglePower = () => {
    if (!isMountedRef.current) return

    setPowerStatus(!powerStatus)
    playSound("/sounds/power.mp3")

    if (powerStatus) {
      // System is being turned off
      addNotification("warning", "System shutdown initiated. Saving session state...", 3000)
      setTimeout(() => {
        if (isMountedRef.current) {
          setSystemStatus("offline")
          addNotification("info", "System is now in standby mode. Click power to restart.", 5000)
        }
      }, 3000)
    } else {
      // System is being turned on
      setSystemStatus("booting")
      addNotification("info", "System boot sequence initiated...", 3000)
      setTimeout(() => {
        if (isMountedRef.current) {
          setSystemStatus("online")
          addNotification("success", "System online. All functions operational.", 3000)
        }
      }, 3000)
    }
  }

  // Add this function after the togglePower function
  const toggleOfflineMode = () => {
    if (!isMountedRef.current) return

    setOfflineMode(!offlineMode)
    playSound("/sounds/button-click.mp3")

    if (offlineMode) {
      addNotification("success", "Online mode activated. Connecting to AI models...", 3000)
    } else {
      addNotification("warning", "Offline mode activated. Using simulated AI responses.", 3000)
    }
  }

  // Clear all notifications
  const clearAllNotifications = () => {
    if (!isMountedRef.current) return

    setNotifications([])
    setNotificationCount(0)
    playSound("/sounds/button-click.mp3")
  }

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isMountedRef.current) {
        setLoading(false)
        playSound("/sounds/boot.mp3")
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [playSound])

  // Add effect to show welcome notification after loading
  useEffect(() => {
    if (!loading && isMountedRef.current) {
      const timer1 = setTimeout(() => {
        if (isMountedRef.current) {
          addNotification("info", "Welcome to MindMash.AI Demo! Explore the collaborative AI experience.", 8000)
        }
      }, 1000)

      const timer2 = setTimeout(() => {
        if (isMountedRef.current) {
          addNotification("success", "AI models synchronized successfully. Ready for collaboration!", 5000)
        }
      }, 5000)

      const timer3 = setTimeout(() => {
        if (isMountedRef.current) {
          addNotification("warning", "Network latency detected. Running in optimized mode.", 5000)
        }
      }, 12000)

      const timer4 = setTimeout(() => {
        if (isMountedRef.current) {
          addNotification("info", "Keyboard shortcuts: F (fullscreen), M (mute), ? (help)", 10000)
        }
      }, 3000)

      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
        clearTimeout(timer3)
        clearTimeout(timer4)
      }
    }
  }, [loading])

  // Add a useEffect to demonstrate mode changes
  useEffect(() => {
    if (!loading && isMountedRef.current) {
      const timer = setTimeout(() => {
        if (isMountedRef.current) {
          addNotification(
            "info",
            `Active mode: ${
              activeMode === "synthdev"
                ? "SynthDev"
                : activeMode === "echodev"
                  ? "EchoDev"
                  : activeMode === "coredev"
                    ? "CoreDev"
                    : "SocialDev"
            }`,
            5000,
          )
        }
      }, 7000)

      return () => clearTimeout(timer)
    }
  }, [activeMode, loading])

  // Clean up timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (tokenTimeoutRef.current) {
        clearTimeout(tokenTimeoutRef.current)
      }
    }
  }, [])

  // Handle AI activity
  const handleAIActivity = (aiType: string) => {
    if (!isMountedRef.current) return

    setMostActiveAI(aiType)

    // Randomly award tokens when AI is active
    if (Math.random() > 0.7) {
      const newTokens = Math.floor(Math.random() * 3) + 1
      setTokenCount((prev) => prev + newTokens)

      // Make sure to set showTokens to true and keep it true long enough for animation
      setShowTokens(true)

      // Clear any existing timeout to prevent premature hiding
      if (tokenTimeoutRef.current) {
        clearTimeout(tokenTimeoutRef.current)
      }

      // Set a new timeout to hide tokens after animation completes
      tokenTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          setShowTokens(false)
        }
      }, 5000)

      // Show notification about tokens
      addNotification("success", `You earned ${newTokens} Mash.BiT tokens for meaningful AI interaction!`, 4000)
    }

    // Occasionally show AI insight notification
    if (Math.random() > 0.85) {
      const insights = [
        "GPT-4 and Gemini models are showing 87% agreement on approach.",
        "Cross-model analysis reveals a novel hybrid solution not identified by any single AI.",
        "Sentiment analysis detected a shift toward more positive engagement.",
        "Knowledge graph expanded with 3 new connections from this interaction.",
      ]

      addNotification("info", insights[Math.floor(Math.random() * insights.length)], 6000)
    }
  }

  // Handle mode change
  const handleModeChange = (mode: string) => {
    if (!isMountedRef.current) return

    console.log("Mode changed to:", mode)
    setActiveMode(mode)
    playSound("/sounds/tech-select.mp3")

    // Add a notification to confirm the mode change
    const modeName =
      mode === "synthdev" ? "SynthDev" : mode === "echodev" ? "EchoDev" : mode === "coredev" ? "CoreDev" : "SocialDev"

    addNotification("success", `Switched to ${modeName} collaboration mode`, 3000)
  }

  // Handle emotion change
  const handleEmotionChange = (emotion: string) => {
    if (!isMountedRef.current) return

    console.log("Emotion changed to:", emotion)
    setCurrentEmotion(emotion)
    playSound("/sounds/button-click.mp3")
  }

  // Handle AI node click
  const handleAINodeClick = (aiType: string) => {
    if (!isMountedRef.current) return

    setMostActiveAI(aiType)
    playSound("/sounds/feature-select.mp3")
  }

  // Handle mute toggle
  const handleMuteToggle = () => {
    if (!isMountedRef.current) return

    setIsMuted(!isMuted)
    toggleMute()
    playSound("/sounds/button-click.mp3")
  }

  // Handle prompt selection from demo scenarios
  const handlePromptSelect = (prompt: string) => {
    if (!isMountedRef.current) return

    // Set the selected prompt
    setSelectedPrompt(prompt)

    // Show a notification to confirm the prompt was selected
    addNotification("info", "Prompt selected: " + prompt.substring(0, 40) + "...", 3000)

    // Flash the chat interface to draw attention to it
    if (chatRef.current) {
      chatRef.current.classList.add("ring-2", "ring-cyan-500", "ring-opacity-100")
      setTimeout(() => {
        if (chatRef.current && isMountedRef.current) {
          chatRef.current.classList.remove("ring-2", "ring-cyan-500", "ring-opacity-100")
        }
      }, 1000)
    }
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!isMountedRef.current) return

    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`)
      })
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
    playSound("/sounds/button-click.mp3")
  }

  // Toggle help overlay
  const toggleHelp = () => {
    if (!isMountedRef.current) return

    setShowHelp(!showHelp)
    playSound("/sounds/button-click.mp3")
  }

  const handleToggleFullscreen = () => {
    toggleFullscreen()
  }

  const handleToggleMute = () => {
    if (!isMountedRef.current) return

    setIsMuted(!isMuted)
    toggleMute()
  }

  const handleToggleHelp = () => {
    toggleHelp()
  }

  // Function to scroll to a specific section
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div
      ref={mainContainerRef}
      className="w-full bg-black text-white font-mono"
      style={{
        height: "auto",
        minHeight: "100vh",
        overflowY: "auto",
        overflowX: "hidden",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {/* Background with grid and scanlines */}
      <div className="fixed inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
      <div className="fixed inset-0 bg-scanline opacity-5 pointer-events-none"></div>
      <div className="fixed inset-0 pointer-events-none">
        <NeuralConnectionEffect className="opacity-20" />
      </div>

      {/* Onboarding overlay */}
      {showOnboarding && <OnboardingOverlay onClose={() => setShowOnboarding(false)} />}

      {/* Token visualization */}
      <TokenVisualization isActive={showTokens} tokenCount={tokenCount} />

      {/* Main dashboard */}
      <div className="min-h-screen flex flex-col">
        {/* Top notification bar */}
        <div className="bg-black border-b border-fuchsia-900/30 py-1 px-4 text-xs flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-green-400">Welcome to MindMash.AI Demo!</span>
            <span className="text-gray-500 mx-2">|</span>
            <span className="text-cyan-400">Explore the collaborative AI experience</span>
          </div>
          <div className="flex items-center space-x-3">
            {notificationCount > 0 && (
              <button onClick={clearAllNotifications} className="text-gray-400 hover:text-cyan-400 transition-colors">
                Clear all ({notificationCount})
              </button>
            )}
            {notificationCount > 1 && <span className="text-gray-500">+{notificationCount - 1} more</span>}
          </div>
        </div>

        {/* Notification display */}
        {notifications.length > 0 && (
          <div className="fixed top-10 right-4 z-40 max-w-sm">
            <NotificationSystem notifications={notifications} onDismiss={dismissNotification} />
          </div>
        )}

        {/* Header with status indicators */}
        <header className="bg-black border-b border-gray-800 py-2 px-4 sticky top-0 z-30">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <img
                  src="https://jade-late-crow-559.mypinata.cloud/ipfs/bafybeia5skhvck24266qahayvxuhc5k3ez27xnmscrlwfjnwloeal5rdam"
                  alt="MindMash.AI"
                  className="h-8 w-8 mr-2"
                />
                <div>
                  <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                    MindMash.AI
                  </h1>
                  <div className="flex items-center space-x-2 -mt-1">
                    <span className="text-xs text-gray-500 bg-gray-900/50 px-1.5 rounded border border-gray-800">
                      DEMO v1.0
                    </span>
                    <span
                      className={`text-xs ${systemStatus === "online" ? "text-green-400 bg-green-900/20 border-green-900/50" : systemStatus === "offline" ? "text-red-400 bg-red-900/20 border-red-900/50" : "text-amber-400 bg-amber-900/20 border-amber-900/50"} px-1.5 rounded border`}
                    >
                      {systemStatus === "online" ? "ONLINE" : systemStatus === "offline" ? "OFFLINE" : "BOOTING"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Status indicators */}
              <div className="hidden md:flex items-center space-x-3">
                <div className="flex items-center">
                  <div
                    className={`h-2 w-2 rounded-full ${systemStatus === "online" ? "bg-cyan-400" : "bg-gray-600"} mr-1.5`}
                  ></div>
                  <span className={`text-xs ${systemStatus === "online" ? "text-cyan-400" : "text-gray-600"}`}>
                    AI SYNC
                  </span>
                </div>
                <div className="flex items-center">
                  <div
                    className={`h-2 w-2 rounded-full ${systemStatus === "online" ? "bg-purple-400" : "bg-gray-600"} mr-1.5`}
                  ></div>
                  <span className={`text-xs ${systemStatus === "online" ? "text-purple-400" : "text-gray-600"}`}>
                    NEURAL
                  </span>
                </div>
                <div className="flex items-center">
                  <div
                    className={`h-2 w-2 rounded-full ${systemStatus === "online" ? "bg-amber-400" : "bg-gray-600"} mr-1.5`}
                  ></div>
                  <span className={`text-xs ${systemStatus === "online" ? "text-amber-400" : "text-gray-600"}`}>
                    QUANTUM
                  </span>
                </div>
                <div className="flex items-center">
                  <div
                    className={`h-2 w-2 rounded-full ${systemStatus === "online" ? "bg-green-400" : "bg-gray-600"} mr-1.5`}
                  ></div>
                  <span className={`text-xs ${systemStatus === "online" ? "text-green-400" : "text-gray-600"}`}>
                    SECURE
                  </span>
                </div>
              </div>

              {/* Control buttons */}
              <div className="flex items-center space-x-2">
                <button
                  className="relative p-1.5 rounded-full bg-gray-900/50 border border-gray-800 hover:bg-gray-800/50 transition-colors"
                  onClick={clearAllNotifications}
                >
                  <Bell size={16} className="text-gray-400" />
                  {notificationCount > 0 && (
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-cyan-500"></span>
                  )}
                </button>

                <button
                  className="p-1.5 rounded-full bg-gray-900/50 border border-gray-800 hover:bg-gray-800/50 transition-colors"
                  onClick={toggleFullscreen}
                >
                  {isFullscreen ? (
                    <Minimize size={16} className="text-gray-400" />
                  ) : (
                    <Maximize size={16} className="text-gray-400" />
                  )}
                </button>

                <button
                  className="p-1.5 rounded-full bg-gray-900/50 border border-gray-800 hover:bg-gray-800/50 transition-colors"
                  onClick={handleMuteToggle}
                >
                  {isMuted ? (
                    <VolumeX size={16} className="text-gray-400" />
                  ) : (
                    <Volume2 size={16} className="text-gray-400" />
                  )}
                </button>

                <button
                  className="p-1.5 rounded-full bg-gray-900/50 border border-gray-800 hover:bg-gray-800/50 transition-colors"
                  onClick={toggleHelp}
                >
                  <HelpCircle size={16} className="text-gray-400" />
                </button>

                <button
                  className={`p-1.5 rounded-full ${powerStatus ? "bg-green-900/20 border-green-900/50" : "bg-red-900/20 border-red-900/50"} hover:bg-gray-800/50 transition-colors`}
                  onClick={togglePower}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`h-4 w-4 ${powerStatus ? "text-green-400" : "text-red-400"}`}
                  >
                    <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
                    <line x1="12" y1="2" x2="12" y2="12"></line>
                  </svg>
                </button>

                <div className="h-5 border-r border-gray-700 mx-1"></div>

                <button className="flex items-center space-x-1 px-2 py-1 rounded bg-gray-900/50 border border-gray-800 hover:bg-gray-800/50 transition-colors">
                  <span className="text-xs text-cyan-400">{tokenCount}</span>
                  <span className="text-xs text-gray-400">MASH.BiT</span>
                </button>
                {/* Remove the WalletBalanceMini component from here */}
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="flex-grow py-2 md:py-4" id="main-content">
          <div className="container mx-auto p-2 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Middle column - Chat Interface - Adjusted to be wider but not too wide */}
              <div className="col-span-1 md:col-span-6 md:order-2 flex flex-col">
                <div
                  ref={chatRef}
                  className="h-[480px] md:h-[580px] chat-interface transition-all duration-300"
                  style={{ position: "relative", zIndex: 20 }}
                >
                  <ChatInterface
                    onAIActivity={handleAIActivity}
                    currentEmotion={currentEmotion}
                    onEmotionChange={handleEmotionChange}
                    selectedPrompt={selectedPrompt}
                  />
                </div>

                <div className="mt-3">
                  <NavigationBar />
                </div>
              </div>

              {/* Left column - Modes Panel or MashBot Minter or MashWAV Radio - Keep at 3 */}
              <div className="col-span-1 md:col-span-3 md:order-1 flex flex-col">
                <div className="border border-gray-800 bg-black/80 rounded-md p-4 h-[480px] md:h-[625px] flex flex-col overflow-hidden">
                  {activeTab === "modes" ? (
                    <ModesPanel activeMode={activeMode} onModeChange={handleModeChange} />
                  ) : activeTab === "nft" ? (
                    <MashbotMinter />
                  ) : (
                    <MashwavRadioSimple />
                  )}
                </div>
                <div className="mt-3">
                  <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-3 mb-0 bg-black border border-gray-800">
                      <TabsTrigger value="modes" className="data-[state=active]:text-cyan-400 text-xs md:text-sm">
                        Modes
                      </TabsTrigger>
                      <TabsTrigger
                        value="nft"
                        className="data-[state=active]:text-fuchsia-400 nft-tab text-xs md:text-sm"
                      >
                        <BotIcon className="h-3 w-3 mr-1" />
                        Mash.BoT
                      </TabsTrigger>
                      <TabsTrigger
                        value="radio"
                        className="data-[state=active]:text-amber-400 radio-tab text-xs md:text-sm"
                      >
                        <Radio className="h-3 w-3 mr-1" />
                        Mash.WAV
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>

              {/* Right column - Collaboration Map - Keep at 3 */}
              <div className="col-span-1 md:col-span-3 md:order-3 flex flex-col">
                <div className="h-[480px] md:h-[670px] map-panel">
                  <MapPanel activeNode={mostActiveAI} onNodeClick={handleAINodeClick} tokenCount={tokenCount} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto p-2 pb-4 md:pb-8 max-w-7xl mt-2 md:mt-4" id="demo-scenarios">
          <DemoScenarios onSelectPrompt={handlePromptSelect} />
        </div>

        {/* Extra content to ensure scrolling */}
        <div className="container mx-auto p-2 pb-16 md:pb-32 max-w-7xl mt-2 md:mt-4" id="extra-content">
          <div className="border border-gray-800 bg-black/80 rounded-md p-4 md:p-6 text-center">
            <h2 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-2 md:mb-4">
              Experience the Future of AI Collaboration
            </h2>
            <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto mb-4 md:mb-6">
              MindMash.AI represents the next evolution in collaborative intelligence, where multiple AI models work
              together with humans to create solutions greater than the sum of their parts.
            </p>
            <div className="flex flex-wrap justify-center gap-2 md:space-x-4">
              <Button
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-sm"
                onClick={() => scrollToSection("main-content")}
              >
                Back to Top
              </Button>
              <Button
                variant="outline"
                className="border-cyan-500 text-cyan-400 hover:bg-cyan-900/20 text-sm"
                onClick={() => window.open("https://github.com/MindMashAI", "_blank")}
              >
                GitHub Repository
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-black/80 border-t border-gray-800 py-4 mt-auto">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-4">
              <div className="flex items-center">
                <span className="text-gray-400 text-sm">© 2025 MindMash.AI</span>
                <span className="mx-2 text-gray-600">|</span>
                <a
                  href="https://www.colosseum.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center text-sm"
                >
                  <span>Colosseum Hackathon</span>
                </a>
              </div>

              <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4">
                <span className="text-gray-500 mr-1 md:mr-2 text-xs md:text-sm">Powered by:</span>

                <a
                  href="https://solana.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center bg-black/60 px-2 py-1 md:px-3 md:py-1.5 rounded-md border border-cyan-900/50 hover:border-cyan-500/70 transition-all group"
                >
                  <img
                    src="https://jade-late-crow-559.mypinata.cloud/ipfs/bafkreie6sj4qrzz6ppmblvwb6bz2b3vbdej23kmrn5mwoyaj2tqhhs52kq"
                    alt="Solana"
                    className="h-3 md:h-4 w-auto"
                  />
                </a>

                <a
                  href="https://crossmint.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center bg-black/60 px-2 py-1 md:px-3 md:py-1.5 rounded-md border border-fuchsia-900/50 hover:border-fuchsia-500/70 transition-all group"
                >
                  <img
                    src="https://www.crossmint.com/assets/crossmint/logo.svg"
                    alt="Crossmint"
                    className="h-3 md:h-4 w-auto"
                  />
                </a>

                <a
                  href="https://solflare.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center bg-black/60 px-2 py-1 md:px-3 md:py-1.5 rounded-md border border-amber-900/50 hover:border-amber-500/70 transition-all group"
                >
                  <img
                    src="https://jade-late-crow-559.mypinata.cloud/ipfs/bafkreidcu55wibsgxbw4yh2j5bpjv4d2ia6sswt2amuvd7fabugh2tvkcq"
                    alt="Solflare"
                    className="h-3 md:h-4 w-auto"
                  />
                </a>

                <a
                  href="https://supabase.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center bg-black/60 px-2 py-1 md:px-3 md:py-1.5 rounded-md border border-green-900/50 hover:border-green-500/70 transition-all group"
                >
                  <img
                    src="https://jade-late-crow-559.mypinata.cloud/ipfs/bafkreihqfls4w5hhppc3wvtz3pj7gl4k73gecpkabcew5lfzu5enrdiw7i"
                    alt="Supabase"
                    className="h-3 md:h-4 w-auto"
                  />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Keyboard shortcuts handler */}
      <KeyboardShortcutsHandler
        onToggleFullscreen={handleToggleFullscreen}
        onToggleMute={handleToggleMute}
        onToggleHelp={handleToggleHelp}
      />

      {/* Help overlay */}
      {showHelp && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="bg-black/90 border border-cyan-500 rounded-lg p-4 md:p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">
              MindMash.AI Demo Help
            </h3>

            <div className="space-y-4">
              <div>
                <h4 className="text-cyan-400 font-medium mb-2 text-sm md:text-base">Key Features</h4>
                <ul className="space-y-2 text-xs md:text-sm text-gray-300">
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-2">•</span>
                    <span>
                      <strong>AI Collaboration Map:</strong> See how different AI models interact and collaborate in
                      real-time
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-2">•</span>
                    <span>
                      <strong>Collaboration Modes:</strong> Switch between different AI collaboration strategies
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-2">•</span>
                    <span>
                      <strong>Multi-AI Chat:</strong> Chat with multiple AI models simultaneously
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-2">•</span>
                    <span>
                      <strong>Mash.BiT Tokens:</strong> Earn tokens through meaningful interactions
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-2">•</span>
                    <span>
                      <strong>Mash.BoT NFTs:</strong> Mint custom AI assistants to join your collaborations
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-2">•</span>
                    <span>
                      <strong>Mash.WAV Radio:</strong> Listen to music NFTs and mint your own tracks
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-cyan-400 font-medium mb-2 text-sm md:text-base">Keyboard Shortcuts</h4>
                <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
                  <div className="flex items-center">
                    <kbd className="px-1.5 py-0.5 md:px-2 md:py-1 bg-gray-900 rounded border border-gray-700 text-gray-300 mr-2 text-xs">
                      Tab
                    </kbd>
                    <span>Navigate UI elements</span>
                  </div>
                  <div className="flex items-center">
                    <kbd className="px-1.5 py-0.5 md:px-2 md:py-1 bg-gray-900 rounded border border-gray-700 text-gray-300 mr-2 text-xs">
                      F
                    </kbd>
                    <span>Toggle fullscreen</span>
                  </div>
                  <div className="flex items-center">
                    <kbd className="px-1.5 py-0.5 md:px-2 md:py-1 bg-gray-900 rounded border border-gray-700 text-gray-300 mr-2 text-xs">
                      M
                    </kbd>
                    <span>Toggle mute</span>
                  </div>
                  <div className="flex items-center">
                    <kbd className="px-1.5 py-0.5 md:px-2 md:py-1 bg-gray-900 rounded border border-gray-700 text-gray-300 mr-2 text-xs">
                      ?
                    </kbd>
                    <span>Show this help</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-cyan-400 font-medium mb-2 text-sm md:text-base">Demo Scenarios</h4>
                <p className="text-xs md:text-sm text-gray-300">
                  Try the pre-configured demo scenarios to see MindMash.AI in action across different use cases.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-sm"
                onClick={() => setShowHelp(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
