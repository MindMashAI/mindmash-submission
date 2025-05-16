"use client"

import { useState, useEffect, useRef } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAudio } from "@/components/audio-manager"
import NeuralConnectionEffect from "@/components/neural-connection-effect"
import ChatInterface from "@/components/chat-interface" // Import the original ChatInterface
import ModesPanel from "@/components/modes-panel"
import MashbotMinter from "@/components/mashbot-minter"
import MapPanel from "@/components/map-panel"
import LoadingScreen from "@/components/loading-screen"
import NavigationBar from "@/components/navigation-bar"
import OnboardingOverlay from "@/components/onboarding-overlay"
import DemoScenarios from "@/components/demo-scenarios"
import TokenVisualization from "@/components/token-visualization"
import {
  Radio,
  BotIcon,
  Bell,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  HelpCircle,
  Menu,
  X,
  ChevronRight,
  Zap,
  Brain,
  Network,
  Layers,
  Command,
  Settings,
  User,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import KeyboardShortcutsHandler from "@/components/keyboard-shortcuts-handler"
import { NotificationSystem } from "@/components/notification-system"
import type { Notification } from "@/components/notification-system"
import MashwavRadioSimple from "@/components/mashwav-radio-simple"
import { cn } from "@/lib/utils"

export default function ModernDemoPage() {
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
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [rightPanelOpen, setRightPanelOpen] = useState(true)
  const { playSound, toggleMute } = useAudio()
  const chatRef = useRef<HTMLDivElement>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const mainContainerRef = useRef<HTMLDivElement>(null)
  const tokenTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isMountedRef = useRef(true)
  const [selectedPrompt, setSelectedPrompt] = useState<string>("")
  const [notificationCount, setNotificationCount] = useState(0)
  const [powerStatus, setPowerStatus] = useState(true)
  const [systemStatus, setSystemStatus] = useState<"online" | "offline" | "booting">("online")
  const [offlineMode, setOfflineMode] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

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

  // Toggle offline mode
  const toggleOfflineMode = () => {
    if (!isMountedRef.current) return

    setOfflineMode(!offlineMode)
    playSound("/sounds/button-click.mp3")

    if (!offlineMode) {
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

      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
      }
    }
  }, [loading])

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
  }

  // Handle mode change
  const handleModeChange = (mode: string) => {
    if (!isMountedRef.current) return

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

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
    playSound("/sounds/button-click.mp3")
  }

  // Toggle right panel
  const toggleRightPanel = () => {
    setRightPanelOpen(!rightPanelOpen)
    playSound("/sounds/button-click.mp3")
  }

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu)
    playSound("/sounds/button-click.mp3")
  }

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div
      ref={mainContainerRef}
      className="w-full bg-black text-white font-sans"
      style={{
        height: "100vh",
        overflowY: "hidden",
        overflowX: "hidden",
      }}
    >
      {/* Subtle background effects */}
      <div className="fixed inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
      <div className="fixed inset-0 bg-scanline opacity-5 pointer-events-none"></div>
      <div className="fixed inset-0 pointer-events-none">
        <NeuralConnectionEffect className="opacity-10" />
      </div>

      {/* Onboarding overlay */}
      {showOnboarding && <OnboardingOverlay onClose={() => setShowOnboarding(false)} />}

      {/* Token visualization */}
      <TokenVisualization isActive={showTokens} tokenCount={tokenCount} />

      {/* Main dashboard */}
      <div className="h-screen flex flex-col">
        {/* Top header bar */}
        <header className="bg-black/90 backdrop-blur-md border-b border-gray-800 py-2 px-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <button
                className="md:hidden p-1.5 rounded-full bg-gray-900/50 border border-gray-800 hover:bg-gray-800/50 transition-colors"
                onClick={toggleMobileMenu}
              >
                {showMobileMenu ? (
                  <X size={18} className="text-gray-400" />
                ) : (
                  <Menu size={18} className="text-gray-400" />
                )}
              </button>

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

              {/* Desktop sidebar toggle */}
              <button
                className="hidden md:flex items-center space-x-1 px-2 py-1 rounded bg-gray-900/50 border border-gray-800 hover:bg-gray-800/50 transition-colors"
                onClick={toggleSidebar}
              >
                <Menu size={14} className="text-gray-400" />
                <span className="text-xs text-gray-400">{sidebarOpen ? "Hide" : "Show"} Panel</span>
              </button>
            </div>

            {/* Status indicators - Desktop only */}
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

              {/* Desktop right panel toggle */}
              <button
                className="hidden md:flex items-center space-x-1 px-2 py-1 rounded bg-gray-900/50 border border-gray-800 hover:bg-gray-800/50 transition-colors"
                onClick={toggleRightPanel}
              >
                <span className="text-xs text-gray-400">{rightPanelOpen ? "Hide" : "Show"} Map</span>
                <ChevronRight
                  size={14}
                  className={`text-gray-400 transition-transform ${rightPanelOpen ? "" : "rotate-180"}`}
                />
              </button>
            </div>
          </div>
        </header>

        {/* Mobile menu */}
        {showMobileMenu && (
          <div className="md:hidden bg-black/95 backdrop-blur-md border-b border-gray-800 p-4 z-40">
            <div className="grid grid-cols-4 gap-2">
              <button className="flex flex-col items-center justify-center p-3 rounded bg-gray-900/50 border border-gray-800 hover:bg-gray-800/50 transition-colors">
                <User size={18} className="text-fuchsia-400 mb-1" />
                <span className="text-xs">Profile</span>
              </button>
              <button className="flex flex-col items-center justify-center p-3 rounded bg-gray-900/50 border border-gray-800 hover:bg-gray-800/50 transition-colors">
                <Brain size={18} className="text-cyan-400 mb-1" />
                <span className="text-xs">AI Models</span>
              </button>
              <button className="flex flex-col items-center justify-center p-3 rounded bg-gray-900/50 border border-gray-800 hover:bg-gray-800/50 transition-colors">
                <Network size={18} className="text-purple-400 mb-1" />
                <span className="text-xs">Network</span>
              </button>
              <button className="flex flex-col items-center justify-center p-3 rounded bg-gray-900/50 border border-gray-800 hover:bg-gray-800/50 transition-colors">
                <Settings size={18} className="text-gray-400 mb-1" />
                <span className="text-xs">Settings</span>
              </button>
            </div>
          </div>
        )}

        {/* Notification display */}
        {notifications.length > 0 && (
          <div className="fixed top-16 right-4 z-40 max-w-sm">
            <NotificationSystem notifications={notifications} onDismiss={dismissNotification} />
          </div>
        )}

        {/* Main content area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left sidebar */}
          <div
            className={cn(
              "bg-black/90 backdrop-blur-md border-r border-gray-800 transition-all duration-300 ease-in-out",
              sidebarOpen ? "w-80" : "w-0 md:w-16",
            )}
          >
            {sidebarOpen ? (
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-gray-800">
                  <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">
                    Collaboration Mode
                  </h2>
                  <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-3 mb-4 bg-black/50 border border-gray-800">
                      <TabsTrigger value="modes" className="data-[state=active]:text-cyan-400 text-xs">
                        <Layers className="h-3.5 w-3.5 mr-1" />
                        Modes
                      </TabsTrigger>
                      <TabsTrigger value="nft" className="data-[state=active]:text-fuchsia-400 nft-tab text-xs">
                        <BotIcon className="h-3.5 w-3.5 mr-1" />
                        Mash.BoT
                      </TabsTrigger>
                      <TabsTrigger value="radio" className="data-[state=active]:text-amber-400 radio-tab text-xs">
                        <Radio className="h-3.5 w-3.5 mr-1" />
                        Mash.WAV
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="flex-1 overflow-hidden">
                  {activeTab === "modes" ? (
                    <ModesPanel activeMode={activeMode} onModeChange={handleModeChange} />
                  ) : activeTab === "nft" ? (
                    <MashbotMinter />
                  ) : (
                    <MashwavRadioSimple />
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center py-4 space-y-6">
                <button
                  className="p-2 rounded-full bg-gray-900/50 border border-gray-800 hover:bg-gray-800/50 transition-colors"
                  onClick={() => {
                    setActiveTab("modes")
                    setSidebarOpen(true)
                  }}
                >
                  <Layers size={20} className="text-cyan-400" />
                </button>
                <button
                  className="p-2 rounded-full bg-gray-900/50 border border-gray-800 hover:bg-gray-800/50 transition-colors"
                  onClick={() => {
                    setActiveTab("nft")
                    setSidebarOpen(true)
                  }}
                >
                  <BotIcon size={20} className="text-fuchsia-400" />
                </button>
                <button
                  className="p-2 rounded-full bg-gray-900/50 border border-gray-800 hover:bg-gray-800/50 transition-colors"
                  onClick={() => {
                    setActiveTab("radio")
                    setSidebarOpen(true)
                  }}
                >
                  <Radio size={20} className="text-amber-400" />
                </button>
              </div>
            )}
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Chat interface */}
            <div ref={chatRef} className="flex-1 chat-interface transition-all duration-300">
              <ChatInterface
                onAIActivity={handleAIActivity}
                currentEmotion={currentEmotion}
                onEmotionChange={handleEmotionChange}
                selectedPrompt={selectedPrompt}
                enableRealResponses={true}
                offlineMode={offlineMode}
              />
            </div>

            {/* Demo scenarios */}
            <div className="border-t border-gray-800 bg-black/90 backdrop-blur-md">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                    Demo Scenarios
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs border-gray-700 text-gray-400 hover:bg-gray-800/50"
                    onClick={() => {
                      const scenariosElement = document.getElementById("scenarios-container")
                      if (scenariosElement) {
                        scenariosElement.classList.toggle("h-0")
                        scenariosElement.classList.toggle("h-auto")
                      }
                    }}
                  >
                    <ChevronRight className="h-4 w-4 mr-1" />
                    Toggle Scenarios
                  </Button>
                </div>
                <div id="scenarios-container" className="h-auto overflow-hidden transition-all duration-300">
                  <DemoScenarios onSelectPrompt={handlePromptSelect} />
                </div>
              </div>
            </div>

            {/* Navigation bar */}
            <div className="border-t border-gray-800 bg-black/90 backdrop-blur-md p-2">
              <NavigationBar />
            </div>
          </div>

          {/* Right panel - Collaboration Map */}
          <div
            className={cn(
              "bg-black/90 backdrop-blur-md border-l border-gray-800 transition-all duration-300 ease-in-out",
              rightPanelOpen ? "w-80" : "w-0 md:w-16",
            )}
          >
            {rightPanelOpen ? (
              <div className="h-full">
                <MapPanel activeNode={mostActiveAI} onNodeClick={handleAINodeClick} tokenCount={tokenCount} />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center py-4 space-y-6">
                <button
                  className="p-2 rounded-full bg-gray-900/50 border border-gray-800 hover:bg-gray-800/50 transition-colors"
                  onClick={() => setRightPanelOpen(true)}
                >
                  <Network size={20} className="text-cyan-400" />
                </button>
                <button
                  className="p-2 rounded-full bg-gray-900/50 border border-gray-800 hover:bg-gray-800/50 transition-colors"
                  onClick={() => setRightPanelOpen(true)}
                >
                  <Brain size={20} className="text-purple-400" />
                </button>
                <button
                  className="p-2 rounded-full bg-gray-900/50 border border-gray-800 hover:bg-gray-800/50 transition-colors"
                  onClick={() => setRightPanelOpen(true)}
                >
                  <Command size={20} className="text-fuchsia-400" />
                </button>
              </div>
            )}
          </div>
        </div>
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
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="bg-black/90 border border-cyan-500 rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                MindMash.AI Demo Help
              </h3>
              <button
                className="p-1.5 rounded-full bg-gray-900/50 border border-gray-800 hover:bg-gray-800/50 transition-colors"
                onClick={() => setShowHelp(false)}
              >
                <X size={16} className="text-gray-400" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-cyan-400 font-medium mb-3 text-base">Key Features</h4>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex items-start">
                    <div className="p-1 rounded-full bg-cyan-900/30 mr-3 mt-0.5">
                      <Network className="h-4 w-4 text-cyan-400" />
                    </div>
                    <span>
                      <strong>AI Collaboration Map:</strong> See how different AI models interact and collaborate in
                      real-time
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="p-1 rounded-full bg-purple-900/30 mr-3 mt-0.5">
                      <Layers className="h-4 w-4 text-purple-400" />
                    </div>
                    <span>
                      <strong>Collaboration Modes:</strong> Switch between different AI collaboration strategies
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="p-1 rounded-full bg-fuchsia-900/30 mr-3 mt-0.5">
                      <MessageSquare className="h-4 w-4 text-fuchsia-400" />
                    </div>
                    <span>
                      <strong>Multi-AI Chat:</strong> Chat with multiple AI models simultaneously
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="p-1 rounded-full bg-green-900/30 mr-3 mt-0.5">
                      <Zap className="h-4 w-4 text-green-400" />
                    </div>
                    <span>
                      <strong>Mash.BiT Tokens:</strong> Earn tokens through meaningful interactions
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-cyan-400 font-medium mb-3 text-base">Keyboard Shortcuts</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center p-2 rounded bg-gray-900/50 border border-gray-800">
                    <kbd className="px-2 py-1 bg-black rounded border border-gray-700 text-gray-300 mr-3 text-xs">
                      F
                    </kbd>
                    <span>Toggle fullscreen</span>
                  </div>
                  <div className="flex items-center p-2 rounded bg-gray-900/50 border border-gray-800">
                    <kbd className="px-2 py-1 bg-black rounded border border-gray-700 text-gray-300 mr-3 text-xs">
                      M
                    </kbd>
                    <span>Toggle mute</span>
                  </div>
                  <div className="flex items-center p-2 rounded bg-gray-900/50 border border-gray-800">
                    <kbd className="px-2 py-1 bg-black rounded border border-gray-700 text-gray-300 mr-3 text-xs">
                      ?
                    </kbd>
                    <span>Show this help</span>
                  </div>
                  <div className="flex items-center p-2 rounded bg-gray-900/50 border border-gray-800">
                    <kbd className="px-2 py-1 bg-black rounded border border-gray-700 text-gray-300 mr-3 text-xs">
                      Esc
                    </kbd>
                    <span>Close dialogs</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                onClick={() => setShowHelp(false)}
              >
                Got it
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
