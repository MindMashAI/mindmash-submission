"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { X, ArrowRight, ArrowLeft, MessageSquare, Zap, Radio, Bot, Layers, Brain, Users, Code } from "lucide-react"
import { useAudio } from "@/components/audio-manager"

interface OnboardingOverlayProps {
  onClose?: () => void
}

export default function OnboardingOverlay({ onClose }: OnboardingOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null)
  const { playSound } = useAudio()
  const highlightedElementRef = useRef<HTMLElement | null>(null)

  const steps = [
    {
      title: "Welcome to MindMash.AI",
      description:
        "Experience the future of collaborative AI. This guided tour will help you discover the key features of our platform.",
      icon: <Zap className="h-6 w-6 text-cyan-400" />,
      target: ".header-logo",
      iconBg: "from-cyan-600 to-purple-600",
    },
    {
      title: "AI Collaboration Modes",
      description:
        "Switch between different collaboration strategies to optimize how AI models work together on your tasks.",
      icon: <Layers className="h-6 w-6 text-cyan-400" />,
      target: ".modes-panel",
      iconBg: "from-cyan-600 to-blue-600",
    },
    {
      title: "Multi-AI Chat Interface",
      description:
        "Chat with multiple AI models simultaneously. Each model brings unique strengths to solve complex problems.",
      icon: <MessageSquare className="h-6 w-6 text-green-400" />,
      target: ".chat-interface",
      skipHighlight: true,
      iconBg: "from-green-600 to-cyan-600",
    },
    {
      title: "Collaboration Map",
      description: "Visualize how different AI models interact and share knowledge in real-time as you work with them.",
      icon: <Brain className="h-6 w-6 text-purple-400" />,
      target: ".map-panel",
      iconBg: "from-purple-600 to-pink-600",
    },
    {
      title: "Mash.BoT NFT Minter",
      description: "Create and mint your own AI assistant NFTs with unique personalities and capabilities.",
      icon: <Bot className="h-6 w-6 text-fuchsia-400" />,
      target: ".nft-tab",
      iconBg: "from-fuchsia-600 to-purple-600",
    },
    {
      title: "Customize Your Mash.BoT",
      description:
        "Select from various personalities, customize appearance, and train your AI assistant with specific knowledge.",
      icon: <Users className="h-6 w-6 text-fuchsia-400" />,
      target: ".nft-tab",
      skipHighlight: true,
      iconBg: "from-fuchsia-600 to-pink-600",
    },
    {
      title: "Mash.WAV Radio",
      description: "Listen to AI-generated music NFTs created by the community and top artists.",
      icon: <Radio className="h-6 w-6 text-amber-400" />,
      target: ".radio-tab",
      iconBg: "from-amber-600 to-orange-600",
    },
    {
      title: "Mint Your Own Music",
      description: "Create and mint your own music NFTs using our AI-powered music generation tools.",
      icon: <Code className="h-6 w-6 text-amber-400" />,
      target: ".radio-tab",
      skipHighlight: true,
      iconBg: "from-orange-600 to-red-600",
    },
    {
      title: "Earn Mash.BiT Tokens",
      description: "Earn tokens through meaningful AI interactions. Use them to mint NFTs or access premium features.",
      icon: <Zap className="h-6 w-6 text-yellow-400" />,
      target: ".token-display",
      iconBg: "from-yellow-600 to-amber-600",
    },
  ]

  // Function to highlight the target element
  const highlightTargetElement = (targetSelector: string, skipHighlight = false) => {
    try {
      // Clean up previous highlight if any
      if (highlightedElementRef.current) {
        highlightedElementRef.current.classList.remove("onboarding-highlight")
        highlightedElementRef.current = null
      }

      if (skipHighlight) return

      const targetElement = document.querySelector(targetSelector) as HTMLElement
      if (targetElement) {
        targetElement.classList.add("onboarding-highlight")
        setHighlightedElement(targetElement)
        highlightedElementRef.current = targetElement

        // Scroll the element into view if needed
        targetElement.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    } catch (error) {
      console.error("Error highlighting element:", error)
    }
  }

  // Set up highlighting for the current step
  useEffect(() => {
    const currentStepData = steps[currentStep]
    if (currentStepData && currentStepData.target) {
      highlightTargetElement(currentStepData.target, currentStepData.skipHighlight)
    }

    // Clean up function
    return () => {
      if (highlightedElementRef.current) {
        highlightedElementRef.current.classList.remove("onboarding-highlight")
      }
    }
  }, [currentStep])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (highlightedElementRef.current) {
        highlightedElementRef.current.classList.remove("onboarding-highlight")
      }
    }
  }, [])

  const handleNext = () => {
    playSound("/sounds/button-click.mp3")
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleClose()
    }
  }

  const handlePrevious = () => {
    playSound("/sounds/button-click.mp3")
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleClose = () => {
    playSound("/sounds/button-click.mp3")
    // Clean up any highlighted elements
    if (highlightedElementRef.current) {
      highlightedElementRef.current.classList.remove("onboarding-highlight")
    }
    if (onClose) onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-filter backdrop-blur-sm">
      <div className="relative max-w-lg w-full mx-4 bg-black/90 border border-cyan-900 rounded-lg shadow-xl overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-gray-800">
          <div
            className="h-full bg-gradient-to-r from-purple-600 to-cyan-600 transition-all duration-300 ease-in-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${steps[currentStep].iconBg} mr-4 shadow-lg`}
              >
                {steps[currentStep].icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                  {steps[currentStep].title}
                </h3>
                <div className="text-xs text-gray-400 mt-1">
                  Step {currentStep + 1} of {steps.length}
                </div>
              </div>
            </div>
            <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-6 text-gray-300 min-h-[80px]">{steps[currentStep].description}</div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`border-gray-700 text-gray-300 ${currentStep === 0 ? "opacity-50" : "hover:bg-gray-800"}`}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={handleNext}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white"
            >
              {currentStep < steps.length - 1 ? (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              ) : (
                "Get Started"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
