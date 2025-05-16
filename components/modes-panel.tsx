"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useAudio } from "@/components/audio-manager"
import { Check, ChevronUp, ChevronDown, Wallet } from "lucide-react"
import { WalletModal } from "./wallet-modal"

// Collaboration modes with detailed descriptions and capabilities
export const COLLAB_MODES = [
  {
    id: "synthdev",
    name: "SynthDev",
    icon: "🚀",
    description: "The Dream Architect of Neural Futures",
    longDescription:
      "Combines multiple AI models to generate innovative solutions across domains. Specializes in creative synthesis and future-oriented thinking.",
    capabilities: ["Multi-model synthesis", "Creative ideation", "Future forecasting", "Concept visualization"],
    status: "ACTIVE",
    color: "cyan",
  },
  {
    id: "echodev",
    name: "EchoDev",
    icon: "🔄",
    description: "Memory-Layered Logic Core",
    longDescription:
      "Specializes in contextual memory and pattern recognition across conversations. Builds knowledge graphs from interactions for deeper insights.",
    capabilities: ["Contextual memory", "Pattern recognition", "Knowledge graphing", "Historical analysis"],
    status: "NEW",
    color: "purple",
  },
  {
    id: "coredev",
    name: "CoreDev",
    icon: "⚙️",
    description: "The Pulse of Precision Engineering",
    longDescription:
      "Focuses on technical problem-solving with mathematical precision. Excels at code generation, debugging, and system optimization.",
    capabilities: ["Technical problem-solving", "Code generation", "System optimization", "Logical analysis"],
    status: "NEW",
    color: "cyan",
  },
  {
    id: "socialdev",
    name: "SocialDev",
    icon: "🔗",
    description: "The Sentient Signal Booster",
    longDescription:
      "Enhances collaborative intelligence through social dynamics. Facilitates group learning, consensus building, and community engagement.",
    capabilities: ["Group facilitation", "Consensus building", "Community engagement", "Collaborative learning"],
    status: "NEW",
    color: "purple",
  },
]

interface ModesPanelProps {
  activeMode: string
  onModeChange: (mode: string) => void
}

export default function ModesPanel({ activeMode, onModeChange }: ModesPanelProps) {
  const { playSound } = useAudio()
  const [localActiveMode, setLocalActiveMode] = useState(activeMode)
  const [expandedMode, setExpandedMode] = useState<string | null>(null)
  const [solBalance, setSolBalance] = useState<number>(4.21)
  const [mbBalance, setMbBalance] = useState<number>(1250)
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)

  // Ref for the scrollable container
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Sync with parent component's state
  useEffect(() => {
    setLocalActiveMode(activeMode)
  }, [activeMode])

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

  // Update the handleModeSelect function to make it more functional
  const handleModeSelect = (modeId: string) => {
    console.log("Mode selected:", modeId)
    setLocalActiveMode(modeId)
    onModeChange(modeId)
    playSound("/sounds/tech-select.mp3")

    // Add visual feedback
    const element = document.getElementById(`mode-${modeId}`)
    if (element) {
      element.classList.add("ring-2", "ring-cyan-500")
      setTimeout(() => {
        element.classList.remove("ring-2", "ring-cyan-500")
      }, 500)
    }
  }

  // Toggle expanded mode details
  const handleExpandToggle = (e: React.MouseEvent, modeId: string) => {
    e.stopPropagation() // Prevent triggering the parent's onClick
    setExpandedMode(expandedMode === modeId ? null : modeId)
    playSound("/sounds/button-click.mp3")
  }

  // Handle wallet click - now opens the modal
  const handleWalletClick = () => {
    playSound("/sounds/button-click.mp3")
    setIsWalletModalOpen(true)
  }

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-bold text-cyan-400 mb-4 flex-shrink-0">Select Collaboration Mode</h2>

      {/* Wallet Modal */}
      <WalletModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} />

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
          height: "calc(100% - 160px)", // Adjusted to leave space for the bottom section
          overflowY: "auto",
          border: "1px solid rgba(8, 145, 178, 0.3)",
          borderRadius: "0.375rem",
          padding: "16px",
          marginBottom: "16px",
        }}
      >
        <div className="space-y-4">
          {COLLAB_MODES.map((mode) => (
            // Add an ID to each mode item for targeting with the visual feedback
            <div key={mode.id} id={`mode-${mode.id}`} className="mb-2">
              {/* Main clickable card */}
              <div
                role="button"
                tabIndex={0}
                className={`w-full p-3 rounded ${expandedMode === mode.id ? "rounded-b-none" : ""} ${
                  localActiveMode === mode.id
                    ? mode.color === "cyan"
                      ? "border-2 border-cyan-500 bg-cyan-900/20"
                      : "border-2 border-purple-500 bg-purple-900/20"
                    : "border border-gray-700 hover:border-gray-500 hover:bg-gray-900/50"
                } cursor-pointer transition-all duration-200`}
                onClick={() => handleModeSelect(mode.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleModeSelect(mode.id)
                    e.preventDefault()
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="mr-2 text-lg">{mode.icon}</span>
                    <span className={`font-bold ${mode.color === "cyan" ? "text-cyan-400" : "text-fuchsia-400"}`}>
                      {mode.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {mode.status === "NEW" && (
                      <span className="text-xs px-2 py-0.5 rounded bg-purple-900/50 text-fuchsia-400 border border-fuchsia-500/50">
                        NEW
                      </span>
                    )}
                    {mode.status === "ACTIVE" && (
                      <span className="text-xs px-2 py-0.5 rounded bg-cyan-900/50 text-cyan-400 border border-cyan-500/50">
                        ACTIVE
                      </span>
                    )}
                    <button
                      type="button"
                      className="text-gray-400 hover:text-white focus:outline-none p-1"
                      onClick={(e) => handleExpandToggle(e, mode.id)}
                      aria-label={expandedMode === mode.id ? "Collapse" : "Expand"}
                    >
                      {expandedMode === mode.id ? "▲" : "▼"}
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-400 mt-1">"{mode.description}"</div>
              </div>

              {/* Expanded details panel */}
              {expandedMode === mode.id && (
                <div
                  className={`p-3 text-sm border-x border-b rounded-b ${
                    mode.color === "cyan"
                      ? "border-cyan-500/50 bg-cyan-900/10"
                      : "border-purple-500/50 bg-purple-900/10"
                  }`}
                >
                  <p className="mb-2 text-gray-300">{mode.longDescription}</p>
                  <div className="mt-3">
                    <h4
                      className={`text-sm font-semibold ${mode.color === "cyan" ? "text-cyan-400" : "text-fuchsia-400"}`}
                    >
                      Capabilities:
                    </h4>
                    <ul className="mt-1 space-y-1">
                      {mode.capabilities.map((capability, index) => (
                        <li key={index} className="flex items-start">
                          <span className={`mr-2 ${mode.color === "cyan" ? "text-cyan-400" : "text-fuchsia-400"}`}>
                            •
                          </span>
                          <span>{capability}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add extra content to ensure scrolling */}
          <div className="mt-8 pt-8 border-t border-gray-800">
            <h4 className="text-sm font-bold text-cyan-400 mb-2">About Collaboration Modes</h4>
            <p className="text-xs text-gray-400 mb-4">
              Collaboration modes determine how multiple AI models work together to solve problems and generate
              insights. Each mode offers a unique approach to AI collaboration, optimized for different types of tasks
              and workflows.
            </p>
            <p className="text-xs text-gray-400 mb-4">
              By selecting the right collaboration mode for your task, you can significantly improve the quality and
              relevance of AI-generated responses, leading to better outcomes and more efficient workflows.
            </p>
            <p className="text-xs text-gray-400">
              Experiment with different modes to discover which works best for your specific use cases and preferences.
              You can switch between modes at any time to adapt to changing requirements.
            </p>
          </div>

          {/* Add even more content to force scrolling */}
          <div className="mt-8 pt-8 border-t border-gray-800">
            <h4 className="text-sm font-bold text-cyan-400 mb-2">Advanced Collaboration Techniques</h4>
            <p className="text-xs text-gray-400 mb-4">
              Beyond selecting a collaboration mode, there are several techniques you can use to enhance your AI
              collaboration experience:
            </p>
            <ul className="space-y-2 text-xs text-gray-400">
              <li className="flex items-start">
                <div className="bg-cyan-900/30 p-1 rounded-full mr-2 mt-0.5">
                  <Check className="h-3 w-3 text-cyan-400" />
                </div>
                <span>Use clear, specific prompts to guide the AI collaboration process</span>
              </li>
              <li className="flex items-start">
                <div className="bg-cyan-900/30 p-1 rounded-full mr-2 mt-0.5">
                  <Check className="h-3 w-3 text-cyan-400" />
                </div>
                <span>Combine multiple Mash.BoTs with complementary personalities for complex tasks</span>
              </li>
              <li className="flex items-start">
                <div className="bg-cyan-900/30 p-1 rounded-full mr-2 mt-0.5">
                  <Check className="h-3 w-3 text-cyan-400" />
                </div>
                <span>Iterate on AI responses by asking follow-up questions and providing feedback</span>
              </li>
              <li className="flex items-start">
                <div className="bg-cyan-900/30 p-1 rounded-full mr-2 mt-0.5">
                  <Check className="h-3 w-3 text-cyan-400" />
                </div>
                <span>Save and organize particularly useful AI collaborations for future reference</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom section with upgrade button and user info */}
      <div className="mt-auto pt-4 border-t border-gray-800 flex-shrink-0">
        <Button
          className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white"
          onClick={() => playSound("/sounds/button-click.mp3")}
        >
          <span className="mr-2">⭐</span>
          Upgrade Your Plan
        </Button>

        <div className="mt-3">
          <div className="flex flex-col p-2 bg-black/40 rounded-md border border-gray-800">
            {/* Wallet Balance Display - Now opens the modal instead of navigating */}
            <button
              onClick={handleWalletClick}
              className="flex items-center justify-between mb-2 p-2 bg-gray-900/50 rounded border border-cyan-900/30 hover:bg-gray-800 hover:border-cyan-500/50 transition-all cursor-pointer text-left w-full"
            >
              <div className="flex items-center">
                <Wallet className="h-4 w-4 mr-2 text-cyan-400" />
                <span className="text-cyan-400 font-medium">{solBalance.toFixed(2)} SOL</span>
              </div>
              <span className="text-gray-400">|</span>
              <div className="flex items-center">
                <span className="text-cyan-400 font-medium">{mbBalance.toLocaleString()} MB</span>
              </div>
            </button>

            {/* User Info */}
            <div className="flex items-center">
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
    </div>
  )
}
